/**
 * MD Simulation Engine
 * Velocity Verlet, PBC, Verlet neighbor list + cell list, multiple potentials,
 * NVE / NVT (Langevin, Nose-Hoover) / NPT (Berendsen barostat).
 * Trajectory: positions, velocities, forces, energy per timestep.
 */
(function (global) {
  'use strict';

  const KB = 8.617333262e-5;
  const AMU_TO_KG = 1.66053906660e-27;
  const ANG_TO_M = 1e-10;
  const FS_TO_S = 1e-15;
  const EV_TO_J = 1.602176634e-19;
  const BAR_TO_PA = 1e5;

  function velocityToEv(ekin_amu_ang2_fs2) {
    const conv = AMU_TO_KG * (ANG_TO_M / FS_TO_S) * (ANG_TO_M / FS_TO_S) / EV_TO_J * 1e-3;
    return ekin_amu_ang2_fs2 * conv;
  }

  function temperatureFromEkin(ekin_ev, n) {
    if (n < 2) return 0;
    return (2 * ekin_ev) / (3 * n * KB);
  }

  function pbcWrap(x, L) {
    return x - Math.round(x / L) * L;
  }

  function pbcDelta(dx, dy, dz, box) {
    return [
      dx - Math.round(dx / box[0]) * box[0],
      dy - Math.round(dy / box[1]) * box[1],
      dz - Math.round(dz / box[2]) * box[2]
    ];
  }

  function buildCellList(atoms, box, rCut) {
    const skin = 0.3;
    const rMax = rCut + skin;
    const nx = Math.max(1, Math.floor(box[0] / rMax));
    const ny = Math.max(1, Math.floor(box[1] / rMax));
    const nz = Math.max(1, Math.floor(box[2] / rMax));
    const cells = {};
    const key = (ix, iy, iz) => `${(ix + nx) % nx},${(iy + ny) % ny},${(iz + nz) % nz}`;
    atoms.forEach((a, i) => {
      const ix = Math.floor((a.x / box[0] - Math.floor(a.x / box[0])) * nx) || 0;
      const iy = Math.floor((a.y / box[1] - Math.floor(a.y / box[1])) * ny) || 0;
      const iz = Math.floor((a.z / box[2] - Math.floor(a.z / box[2])) * nz) || 0;
      const k = key(ix, iy, iz);
      if (!cells[k]) cells[k] = [];
      cells[k].push(i);
    });
    return { cells, nx, ny, nz, key };
  }

  function buildNeighborList(atoms, box, rCut, cellList) {
    const list = [];
    const skin = 0.3;
    const rMax = rCut + skin;
    const rMax2 = rMax * rMax;
    const { cells, nx, ny, nz, key } = cellList || buildCellList(atoms, box, rCut);
    for (let ix = 0; ix < nx; ix++) {
      for (let iy = 0; iy < ny; iy++) {
        for (let iz = 0; iz < nz; iz++) {
          const k0 = key(ix, iy, iz);
          const cell0 = cells[k0] || [];
          for (let di = -1; di <= 1; di++) {
            for (let dj = -1; dj <= 1; dj++) {
              for (let dk = -1; dk <= 1; dk++) {
                const k1 = key(ix + di, iy + dj, iz + dk);
                const cell1 = cells[k1] || [];
                cell0.forEach(i => {
                  cell1.forEach(j => {
                    if (i >= j) return;
                    let dx = atoms[j].x - atoms[i].x, dy = atoms[j].y - atoms[i].y, dz = atoms[j].z - atoms[i].z;
                    [dx, dy, dz] = pbcDelta(dx, dy, dz, box);
                    const d2 = dx * dx + dy * dy + dz * dz;
                    if (d2 <= rMax2) list.push({ i, j, dx, dy, dz, r: Math.sqrt(d2) });
                  });
                });
              }
            }
          }
        }
      }
    }
    return list;
  }

  function lennardJones(r, sig, eps) {
    if (r < 1e-8) return { f: 1e10, u: 1e10 };
    const sr = sig / r;
    const sr6 = sr * sr * sr * sr * sr * sr;
    const sr12 = sr6 * sr6;
    const u = 4 * eps * (sr12 - sr6);
    const f = 24 * eps * (2 * sr12 - sr6) / (r * r);
    return { f, u };
  }

  function morse(r, D, a, r0) {
    if (r < 1e-8) return { f: 1e10, u: 1e10 };
    const ex = Math.exp(-a * (r - r0));
    const u = D * (ex * ex - 2 * ex);
    const f = 2 * D * a * (ex * ex - ex) / r;
    return { f, u };
  }

  function buckingham(r, A, rho, C) {
    if (r < 1e-8) return { f: 1e10, u: 1e10 };
    const u = A * Math.exp(-r / rho) - C / (r * r * r * r * r * r);
    const f = (A / rho * Math.exp(-r / rho) - 6 * C / (r * r * r * r * r * r * r)) / r;
    return { f, u };
  }

  function pairForce(r, potential, params) {
    if (potential === 'morse') return morse(r, params.D || 1, params.a || 2, params.r0 || 1);
    if (potential === 'buckingham') return buckingham(r, params.A || 1000, params.rho || 0.3, params.C || 100);
    return lennardJones(r, params.sig || 1, params.eps || 1);
  }

  function computeForces(atoms, box, neighborList, potential, potentialParams) {
    const cutoff = (potentialParams && potentialParams.cutoff) || 2.5;
    atoms.forEach(a => { a.fx = 0; a.fy = 0; a.fz = 0; });
    let epot = 0;
    const pairs = neighborList || buildNeighborList(atoms, box, cutoff * (atoms[0] && atoms[0].sig ? atoms[0].sig : 1));
    pairs.forEach(({ i, j, dx, dy, dz, r }) => {
      if (r < 1e-8) return;
      const sig = (atoms[i].sig + atoms[j].sig) * 0.5;
      const eps = Math.sqrt((atoms[i].eps || 1) * (atoms[j].eps || 1));
      let params = { sig, eps, ...potentialParams };
      if (potential === 'morse') params = { D: eps, a: 2, r0: sig, ...params };
      if (potential === 'buckingham') params = { A: 1000 * eps, rho: sig * 0.3, C: 100 * eps, ...params };
      const { f, u } = pairForce(r, potential || 'lj', params);
      const fx = f * dx, fy = f * dy, fz = f * dz;
      atoms[i].fx -= fx; atoms[i].fy -= fy; atoms[i].fz -= fz;
      atoms[j].fx += fx; atoms[j].fy += fy; atoms[j].fz += fz;
      epot += u;
    });
    return epot;
  }

  function applyPBC(atoms, box) {
    const half = [box[0] / 2, box[1] / 2, box[2] / 2];
    atoms.forEach(a => {
      a.x = pbcWrap(a.x, box[0]);
      a.y = pbcWrap(a.y, box[1]);
      a.z = pbcWrap(a.z, box[2]);
      if (a.x > half[0]) a.x -= box[0]; if (a.x < -half[0]) a.x += box[0];
      if (a.y > half[1]) a.y -= box[1]; if (a.y < -half[1]) a.y += box[1];
      if (a.z > half[2]) a.z -= box[2]; if (a.z < -half[2]) a.z += box[2];
    });
  }

  function velocityVerletStep(atoms, box, dt_fs, neighborList, potential, potentialParams) {
    const dt = dt_fs * 1e-3;
    atoms.forEach(a => {
      a._fx = a.fx || 0; a._fy = a.fy || 0; a._fz = a.fz || 0;
      a.x += a.vx * dt + 0.5 * a._fx / a.mass * dt * dt;
      a.y += a.vy * dt + 0.5 * a._fy / a.mass * dt * dt;
      a.z += a.vz * dt + 0.5 * a._fz / a.mass * dt * dt;
    });
    applyPBC(atoms, box);
    const epot = computeForces(atoms, box, neighborList, potential, potentialParams);
    atoms.forEach(a => {
      a.vx += 0.5 * (a._fx + a.fx) / a.mass * dt;
      a.vy += 0.5 * (a._fy + a.fy) / a.mass * dt;
      a.vz += 0.5 * (a._fz + a.fz) / a.mass * dt;
    });
    return epot;
  }

  function computeEkin(atoms) {
    let e = 0;
    atoms.forEach(a => e += 0.5 * a.mass * (a.vx * a.vx + a.vy * a.vy + a.vz * a.vz));
    return velocityToEv(e);
  }

  function applyLangevin(atoms, T_target, gamma, dt_fs) {
    const dt = dt_fs * 1e-3;
    const c1 = Math.exp(-gamma * dt);
    const c2 = Math.sqrt(1 - c1 * c1);
    const sigma = Math.sqrt(KB * T_target * (1 - c1 * c1) / (1e-3 * AMU_TO_KG / EV_TO_J));
    atoms.forEach(a => {
      const s = sigma / Math.sqrt(a.mass);
      a.vx = c1 * a.vx + c2 * s * (Math.random() - 0.5) * 4;
      a.vy = c1 * a.vy + c2 * s * (Math.random() - 0.5) * 4;
      a.vz = c1 * a.vz + c2 * s * (Math.random() - 0.5) * 4;
    });
  }

  function applyNoseHoover(atoms, T_target, Q, dt_fs, state) {
    const n = atoms.length;
    if (n < 2) return;
    const ekin = computeEkin(atoms);
    const T = temperatureFromEkin(ekin, n);
    const dt = dt_fs * 1e-3;
    state.zeta = (state.zeta || 0) + dt * (2 * ekin - 3 * n * KB * T_target) / Q;
    const scale = 1 - state.zeta * dt * 0.5;
    atoms.forEach(a => {
      a.vx *= scale; a.vy *= scale; a.vz *= scale;
    });
  }

  function applyBerendsenBarostat(atoms, box, P_target, tau_P, dt_fs, state) {
    const n = atoms.length;
    if (n < 2) return;
    const dt = dt_fs * 1e-3;
    const P = (state && state.P != null) ? state.P : 0;
    const compress = 1e-9;
    const mu = Math.pow(1 + dt / (tau_P * 1e-3) * (P - P_target) * BAR_TO_PA * compress, 1 / 3);
    box[0] *= mu; box[1] *= mu; box[2] *= mu;
    atoms.forEach(a => {
      a.x *= mu; a.y *= mu; a.z *= mu;
    });
  }

  function virialPressure(atoms, box, neighborList, potential, potentialParams) {
    let virial = 0;
    const cutoff = (potentialParams && potentialParams.cutoff) || 2.5;
    const pairs = neighborList || buildNeighborList(atoms, box, cutoff * (atoms[0] && atoms[0].sig ? atoms[0].sig : 1));
    pairs.forEach(({ i, j, dx, dy, dz, r }) => {
      if (r < 1e-8) return;
      const sig = (atoms[i].sig + atoms[j].sig) * 0.5;
      const eps = Math.sqrt((atoms[i].eps || 1) * (atoms[j].eps || 1));
      let params = { sig, eps, ...potentialParams };
      if (potential === 'morse') params = { D: eps, a: 2, r0: sig, ...params };
      if (potential === 'buckingham') params = { A: 1000 * eps, rho: sig * 0.3, C: 100 * eps, ...params };
      const { f } = pairForce(r, potential || 'lj', params);
      virial += f * r * r;
    });
    const V = box[0] * box[1] * box[2];
    const ekin = computeEkin(atoms);
    const n = atoms.length;
    const T = temperatureFromEkin(ekin, n);
    const P_ideal = n * KB * T / (V * 1e-30) * 1e-5;
    const P_virial = (1 / (3 * V * 1e-30)) * virial * (ANG_TO_M * ANG_TO_M) * (AMU_TO_KG * 1e-3 / (FS_TO_S * FS_TO_S)) / EV_TO_J * 1e-5;
    return P_ideal + P_virial;
  }

  function createSimulation(config) {
    let atoms = config.atoms || [];
    let box = config.box || [40, 40, 40];
    let step = 0;
    let time = 0;
    let running = false;
    let paused = false;
    const trajectory = [];
    const history = { time: [], ekin: [], epot: [], etot: [], T: [], P: [] };
    let neighborList = null;
    let lastRebuildStep = -1;
    const skin = 0.3;
    const potential = config.potential || 'lj';
    const potentialParams = config.potentialParams || {};
    const cutoff = (potentialParams.cutoff || 2.5) * (atoms[0] && atoms[0].sig ? atoms[0].sig : 1);
    const ensemble = config.ensemble || 'NVE';
    const thermostat = config.thermostat || 'langevin';
    const T_target = config.T_target != null ? config.T_target : 300;
    const tau_T = config.tau_T != null ? config.tau_T : 0.1;
    const P_target = config.P_target != null ? config.P_target : 1;
    const tau_P = config.tau_P != null ? config.tau_P : 1;
    const state = { zeta: 0, P: 0 };

    function rebuildNeighborList() {
      const cellList = buildCellList(atoms, box, cutoff);
      neighborList = buildNeighborList(atoms, box, cutoff, cellList);
    }

    function stepOnce(dt_fs) {
      if (atoms.length === 0) return { epot: 0, ekin: 0 };
      if (step - lastRebuildStep > 10) {
        rebuildNeighborList();
        lastRebuildStep = step;
      }
      const epot = velocityVerletStep(atoms, box, dt_fs, neighborList, potential, potentialParams);
      if (ensemble === 'NVT') {
        if (thermostat === 'langevin') applyLangevin(atoms, T_target, 1 / (tau_T * 1e-3), dt_fs);
        else if (thermostat === 'nose-hoover') applyNoseHoover(atoms, T_target, 100, dt_fs, state);
      }
      if (ensemble === 'NPT') {
        state.P = virialPressure(atoms, box, neighborList, potential, potentialParams);
        applyBerendsenBarostat(atoms, box, P_target, tau_P, dt_fs, state);
      }
      const ekin = computeEkin(atoms);
      step++;
      time += dt_fs * 1e-3;
      return { epot, ekin, step, time };
    }

    function sample() {
      const ekin = computeEkin(atoms);
      const T = temperatureFromEkin(ekin, atoms.length);
      const P = atoms.length > 0 ? virialPressure(atoms, box, neighborList, potential, potentialParams) : 0;
      const epot = atoms.length > 0 ? computeForces(atoms, box, neighborList, potential, potentialParams) : 0;
      history.time.push(time);
      history.ekin.push(ekin);
      history.epot.push(epot);
      history.etot.push(ekin + epot);
      history.T.push(T);
      history.P.push(P);
      trajectory.push({
        positions: atoms.map(a => ({ x: a.x, y: a.y, z: a.z })),
        velocities: atoms.map(a => ({ vx: a.vx, vy: a.vy, vz: a.vz })),
        forces: atoms.map(a => ({ fx: a.fx, fy: a.fy, fz: a.fz })),
        epot, ekin, step, time, T, P, box: box.slice()
      });
    }

    return {
      getAtoms: () => atoms,
      setAtoms: (a) => { atoms = a; neighborList = null; lastRebuildStep = -1; },
      getBox: () => box.slice(),
      setBox: (b) => { box[0] = b[0]; box[1] = b[1]; box[2] = b[2]; neighborList = null; },
      getStep: () => step,
      getTime: () => time,
      setStep: (s) => { step = s; },
      setTime: (t) => { time = t; },
      getRunning: () => running,
      setRunning: (r) => { running = r; },
      getPaused: () => paused,
      setPaused: (p) => { paused = p; },
      getTrajectory: () => trajectory,
      getHistory: () => history,
      stepOnce,
      sample,
      rebuildNeighborList,
      computeForces: () => computeForces(atoms, box, neighborList, potential, potentialParams),
      computeEkin: () => computeEkin(atoms),
      getTemperature: () => temperatureFromEkin(computeEkin(atoms), atoms.length),
      getPressure: () => atoms.length > 0 ? virialPressure(atoms, box, neighborList, potential, potentialParams) : 0,
      reset: () => {
        step = 0; time = 0; trajectory.length = 0;
        history.time.length = 0; history.ekin.length = 0; history.epot.length = 0;
        history.etot.length = 0; history.T.length = 0; history.P.length = 0;
        neighborList = null; lastRebuildStep = -1; state.zeta = 0;
      }
    };
  }

  const MDSimulationEngine = {
    createSimulation,
    buildCellList,
    buildNeighborList,
    computeForces,
    velocityVerletStep,
    applyPBC,
    computeEkin,
    temperatureFromEkin,
    virialPressure,
    lennardJones,
    morse,
    buckingham,
    KB,
    AMU_TO_KG,
    ANG_TO_M,
    FS_TO_S,
    EV_TO_J,
    BAR_TO_PA,
    velocityToEv
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = MDSimulationEngine;
  else global.MDSimulationEngine = MDSimulationEngine;
})(typeof self !== 'undefined' ? self : this);
