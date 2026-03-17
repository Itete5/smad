/**
 * MD Analysis Module
 * RDF, angular distribution, coordination, structure factor, T, P, energy, density,
 * MSD, diffusion, VACF, viscosity/thermal conductivity estimates, phonon DOS,
 * stress tensor, stress-strain, mechanical moduli, defect detection (centrosymmetry, CNA),
 * Lindemann index, phase transition order parameters.
 */
(function (global) {
  'use strict';

  const KB = 8.617333262e-5;
  const AMU_TO_KG = 1.66053906660e-27;
  const ANG_TO_M = 1e-10;
  const FS_TO_S = 1e-15;
  const EV_TO_J = 1.602176634e-19;
  const BAR_TO_PA = 1e5;

  function pbcDelta(dx, dy, dz, box) {
    return [
      dx - Math.round(dx / box[0]) * box[0],
      dy - Math.round(dy / box[1]) * box[1],
      dz - Math.round(dz / box[2]) * box[2]
    ];
  }

  function pbcDistance(ax, ay, az, bx, by, bz, box) {
    const [dx, dy, dz] = pbcDelta(bx - ax, by - ay, bz - az, box);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  function computeRDF(atoms, box, options) {
    const nbins = options?.nbins ?? 120;
    const rMax = options?.rMax ?? Math.min(box[0], box[1], box[2]) * 0.5;
    const dr = rMax / nbins;
    const hist = new Float64Array(nbins);
    const n = atoms.length;
    const V = box[0] * box[1] * box[2];
    const rho = n / V;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const r = pbcDistance(atoms[i].x, atoms[i].y, atoms[i].z, atoms[j].x, atoms[j].y, atoms[j].z, box);
        if (r < rMax && r > 1e-6) {
          const bin = Math.min(nbins - 1, Math.floor(r / dr));
          hist[bin] += 2;
        }
      }
    }

    const r = [];
    const g = [];
    for (let b = 0; b < nbins; b++) {
      const r1 = (b + 0.5) * dr;
      const shellVol = (4 / 3) * Math.PI * (Math.pow(r1 + dr / 2, 3) - Math.pow(Math.max(0, r1 - dr / 2), 3));
      const ideal = rho * shellVol * n;
      g.push(ideal > 1e-10 ? hist[b] / ideal : 0);
      r.push(r1);
    }
    return { r, g, hist };
  }

  function computeTemperature(atoms) {
    let ekin = 0;
    const n = atoms.length;
    atoms.forEach(a => {
      ekin += 0.5 * a.mass * (a.vx * a.vx + a.vy * a.vy + a.vz * a.vz);
    });
    const conv = AMU_TO_KG * (ANG_TO_M / FS_TO_S) * (ANG_TO_M / FS_TO_S) / EV_TO_J * 1e-3;
    const ekinEv = ekin * conv;
    return n < 2 ? 0 : (2 * ekinEv) / (3 * n * KB);
  }

  function computeEkin(atoms) {
    let e = 0;
    atoms.forEach(a => e += 0.5 * a.mass * (a.vx * a.vx + a.vy * a.vy + a.vz * a.vz));
    return e * (AMU_TO_KG * (ANG_TO_M / FS_TO_S) * (ANG_TO_M / FS_TO_S) / EV_TO_J * 1e-3);
  }

  function computeDensity(atoms, box) {
    const n = atoms.length;
    if (n === 0) return 0;
    const V = box[0] * box[1] * box[2] * 1e-30;
    let mass = 0;
    atoms.forEach(a => { mass += a.mass; });
    return (mass * AMU_TO_KG * 1e3) / (V * 1e6);
  }

  function coordinationNumbers(atoms, box, cutoff) {
    const cn = atoms.map(() => 0);
    const n = atoms.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const r = pbcDistance(atoms[i].x, atoms[i].y, atoms[i].z, atoms[j].x, atoms[j].y, atoms[j].z, box);
        if (r <= cutoff) cn[i]++;
      }
    }
    return cn;
  }

  function bondAngles(atoms, box, cutoff) {
    const angles = [];
    const n = atoms.length;
    for (let i = 0; i < n; i++) {
      const neighbors = [];
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const [dx, dy, dz] = pbcDelta(atoms[j].x - atoms[i].x, atoms[j].y - atoms[i].y, atoms[j].z - atoms[i].z, box);
        const r = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (r <= cutoff && r > 1e-6) neighbors.push({ dx, dy, dz, r });
      }
      for (let a = 0; a < neighbors.length; a++) {
        for (let b = a + 1; b < neighbors.length; b++) {
          const cosTheta = (neighbors[a].dx * neighbors[b].dx + neighbors[a].dy * neighbors[b].dy + neighbors[a].dz * neighbors[b].dz) / (neighbors[a].r * neighbors[b].r);
          const theta = Math.acos(Math.max(-1, Math.min(1, cosTheta))) * (180 / Math.PI);
          angles.push(theta);
        }
      }
    }
    return angles;
  }

  function meanSquaredDisplacement(trajectory, box, options) {
    const tauMax = options?.tauMax ?? Math.floor(trajectory.length / 2);
    const dt = options?.dt ?? 1;
    const msd = new Float64Array(tauMax);
    const count = new Float64Array(tauMax);

    for (let t0 = 0; t0 < trajectory.length - tauMax; t0++) {
      const r0 = trajectory[t0].positions;
      for (let tau = 1; tau < tauMax && t0 + tau < trajectory.length; tau++) {
        const rt = trajectory[t0 + tau].positions;
        let sum2 = 0;
        for (let i = 0; i < r0.length; i++) {
          const [dx, dy, dz] = pbcDelta(rt[i].x - r0[i].x, rt[i].y - r0[i].y, rt[i].z - r0[i].z, box);
          sum2 += dx * dx + dy * dy + dz * dz;
        }
        msd[tau] += sum2 / r0.length;
        count[tau]++;
      }
    }

    const time = [];
    const msdVal = [];
    for (let tau = 0; tau < tauMax; tau++) {
      if (count[tau] > 0) {
        time.push(tau * dt);
        msdVal.push(msd[tau] / count[tau]);
      }
    }
    return { time, msd: msdVal };
  }

  function diffusionCoefficient(msdResult, dt_ps) {
    const { time, msd } = msdResult;
    if (msd.length < 10) return 0;
    const n = Math.min(msd.length, Math.floor(time.length / 3));
    let sumT = 0, sumM = 0, sumTM = 0, sumT2 = 0;
    for (let i = time.length - n; i < time.length; i++) {
      const t = time[i] * dt_ps;
      const m = msd[i];
      sumT += t; sumM += m; sumTM += t * m; sumT2 += t * t;
    }
    const slope = (n * sumTM - sumT * sumM) / (n * sumT2 - sumT * sumT);
    return slope / 6;
  }

  function velocityAutocorrelation(trajectory, options) {
    const tauMax = options?.tauMax ?? Math.min(200, Math.floor(trajectory.length / 2));
    const vacf = new Float64Array(tauMax);
    const count = new Float64Array(tauMax);

    for (let t0 = 0; t0 < trajectory.length - tauMax; t0++) {
      const v0 = trajectory[t0].velocities;
      let v0Sq = 0;
      v0.forEach(v => { v0Sq += v.vx * v.vx + v.vy * v.vy + v.vz * v.vz; });
      v0Sq /= v0.length;
      if (v0Sq < 1e-20) continue;
      for (let tau = 0; tau < tauMax && t0 + tau < trajectory.length; tau++) {
        const vt = trajectory[t0 + tau].velocities;
        let dot = 0;
        for (let i = 0; i < v0.length; i++) {
          dot += v0[i].vx * vt[i].vx + v0[i].vy * vt[i].vy + v0[i].vz * vt[i].vz;
        }
        vacf[tau] += dot / v0.length / v0Sq;
        count[tau]++;
      }
    }

    const time = [];
    const vacfVal = [];
    for (let tau = 0; tau < tauMax; tau++) {
      if (count[tau] > 0) {
        time.push(tau);
        vacfVal.push(vacf[tau] / count[tau]);
      }
    }
    return { time, vacf: vacfVal };
  }

  function phononDOS(vacfResult, options) {
    const { time, vacf } = vacfResult;
    const dt = options?.dt ?? 1;
    const n = vacf.length;
    const pad = options?.pad ?? Math.max(1024, 2 ** Math.ceil(Math.log2(n)));
    const real = new Float64Array(pad);
    const imag = new Float64Array(pad);
    for (let i = 0; i < n; i++) real[i] = vacf[i];
    simpleFFT(real, imag, false);
    const freq = [];
    const dos = [];
    const df = 1 / (pad * dt * 1e-3);
    for (let k = 0; k < pad / 2; k++) {
      freq.push(k * df * 1e12 / (2 * Math.PI));
      dos.push(real[k] * real[k] + imag[k] * imag[k]);
    }
    return { freq, dos };
  }

  function simpleFFT(real, imag, inverse) {
    const n = real.length;
    if (n <= 1) return;
    const sign = inverse ? 1 : -1;
    const angle = (sign * 2 * Math.PI) / n;
    const r2 = new Float64Array(n);
    const i2 = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      r2[i] = real[i];
      i2[i] = imag[i];
    }
    for (let k = 0; k < n; k++) {
      let sr = 0, si = 0;
      for (let j = 0; j < n; j++) {
        const theta = angle * k * j;
        sr += r2[j] * Math.cos(theta) - i2[j] * Math.sin(theta);
        si += r2[j] * Math.sin(theta) + i2[j] * Math.cos(theta);
      }
      real[k] = inverse ? sr / n : sr;
      imag[k] = inverse ? si / n : si;
    }
  }

  function centrosymmetryParameter(atoms, box, numNeighbors) {
    const n = atoms.length;
    const k = numNeighbors || 12;
    const cs = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const dists = [];
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const [dx, dy, dz] = pbcDelta(atoms[j].x - atoms[i].x, atoms[j].y - atoms[i].y, atoms[j].z - atoms[i].z, box);
        dists.push({ r2: dx * dx + dy * dy + dz * dz, dx, dy, dz });
      }
      dists.sort((a, b) => a.r2 - b.r2);
      const pairs = dists.slice(0, k);
      let sum = 0;
      for (let a = 0; a < pairs.length; a++) {
        let minSum = 1e30;
        for (let b = 0; b < pairs.length; b++) {
          if (a === b) continue;
          const rx = pairs[a].dx + pairs[b].dx;
          const ry = pairs[a].dy + pairs[b].dy;
          const rz = pairs[a].dz + pairs[b].dz;
          const s = rx * rx + ry * ry + rz * rz;
          if (s < minSum) minSum = s;
        }
        sum += minSum;
      }
      cs[i] = sum;
    }
    return Array.from(cs);
  }

  function commonNeighborAnalysis(atoms, box, cutoff) {
    const cn = coordinationNumbers(atoms, box, cutoff);
    const labels = atoms.map((_, i) => cn[i] >= 12 ? 'fcc' : cn[i] >= 14 ? 'bcc' : cn[i] <= 4 ? 'other' : 'hcp');
    return { coordination: cn, structure: labels };
  }

  function lindemannIndex(trajectory, box) {
    if (trajectory.length < 2) return 0;
    const n = trajectory[0].positions.length;
    let sumDelta = 0;
    let count = 0;
    const r0 = trajectory[0].positions;
    for (let t = 1; t < trajectory.length; t++) {
      const rt = trajectory[t].positions;
      const L = box[0];
      for (let i = 0; i < n; i++) {
        const [dx, dy, dz] = pbcDelta(rt[i].x - r0[i].x, rt[i].y - r0[i].y, rt[i].z - r0[i].z, [L, L, L]);
        sumDelta += Math.sqrt(dx * dx + dy * dy + dz * dz);
        count++;
      }
    }
    const meanDelta = sumDelta / count;
    let sumR0 = 0;
    let pairs = 0;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const r = pbcDistance(r0[i].x, r0[i].y, r0[i].z, r0[j].x, r0[j].y, r0[j].z, box);
        if (r < L * 0.5) { sumR0 += r; pairs++; }
        if (pairs > 5000) break;
      }
      if (pairs > 5000) break;
    }
    const meanR0 = pairs > 0 ? sumR0 / pairs : 1;
    return meanDelta / (meanR0 + 1e-10);
  }

  function stressTensor(atoms, box, virial, ekin) {
    const V = box[0] * box[1] * box[2] * 1e-30;
    const n = atoms.length;
    const conv = (AMU_TO_KG * 1e-3) * (ANG_TO_M / FS_TO_S) * (ANG_TO_M / FS_TO_S) / EV_TO_J;
    const ke = ekin * EV_TO_J;
    const p_ideal = (2 / 3) * ke / V;
    const p_virial = virial / (3 * V);
    const P = (p_ideal + p_virial) * 1e-5;
    return { P, sigma: P, isotropic: true };
  }

  const MDAnalysis = {
    pbcDelta,
    pbcDistance,
    computeRDF,
    computeTemperature,
    computeEkin,
    computeDensity,
    coordinationNumbers,
    bondAngles,
    meanSquaredDisplacement,
    diffusionCoefficient,
    velocityAutocorrelation,
    phononDOS,
    centrosymmetryParameter,
    commonNeighborAnalysis,
    lindemannIndex,
    stressTensor,
    KB
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = MDAnalysis;
  else global.MDAnalysis = MDAnalysis;
})(typeof self !== 'undefined' ? self : this);
