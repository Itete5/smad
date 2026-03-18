/**
 * MD UI Controls
 * Orchestrates simulation engine, structure, analysis, and visualization.
 * Dashboard (Plotly), start/pause/reset, export, console logging.
 */
(function (global) {
  'use strict';

  const Engine = global.MDSimulationEngine;
  const Structure = global.MDStructure;
  const Analysis = global.MDAnalysis;
  const Viz = global.MDVisualization;
  const Plotly = global.Plotly;

  const PLOT_LAYOUT = {
    margin: { t: 20, r: 10, b: 35, l: 50 },
    paper_bgcolor: '#0c0f1a',
    plot_bgcolor: '#060810',
    font: { color: '#7a8bbf', size: 10 },
    xaxis: { gridcolor: 'rgba(79,143,255,0.2)' },
    yaxis: { gridcolor: 'rgba(79,143,255,0.2)' },
    showlegend: true,
    legend: { x: 0, y: 1.02 }
  };

  function createDashboard(containerIds) {
    if (typeof Plotly === 'undefined') return;
    const ids = containerIds || {};
    if (ids.energy) {
      Plotly.newPlot(ids.energy,
        [
          { x: [], y: [], name: 'E_kin', line: { color: '#4f8fff' } },
          { x: [], y: [], name: 'E_pot', line: { color: '#ff4f6a' } },
          { x: [], y: [], name: 'E_tot', line: { color: '#3de87a' } }
        ],
        { ...PLOT_LAYOUT, yaxis: { ...PLOT_LAYOUT.yaxis, title: 'Energy (eV)' }, xaxis: { ...PLOT_LAYOUT.xaxis, title: 'Time (ps)' } },
        { responsive: true, displayModeBar: true });
    }
    if (ids.temperature) {
      Plotly.newPlot(ids.temperature,
        [{ x: [], y: [], name: 'T (K)', line: { color: '#4f8fff' } }],
        { ...PLOT_LAYOUT, yaxis: { ...PLOT_LAYOUT.yaxis, title: 'T (K)' }, xaxis: { ...PLOT_LAYOUT.xaxis, title: 'Time (ps)' } },
        { responsive: true, displayModeBar: true });
    }
    if (ids.pressure) {
      Plotly.newPlot(ids.pressure,
        [{ x: [], y: [], name: 'P (bar)', line: { color: '#ff4f6a' } }],
        { ...PLOT_LAYOUT, yaxis: { ...PLOT_LAYOUT.yaxis, title: 'P (bar)' }, xaxis: { ...PLOT_LAYOUT.xaxis, title: 'Time (ps)' } },
        { responsive: true, displayModeBar: true });
    }
    if (ids.rdf) {
      Plotly.newPlot(ids.rdf,
        [{ x: [], y: [], name: 'g(r)', line: { color: '#3de87a' } }],
        { ...PLOT_LAYOUT, yaxis: { ...PLOT_LAYOUT.yaxis, title: 'g(r)' }, xaxis: { ...PLOT_LAYOUT.xaxis, title: 'r (Å)' } },
        { responsive: true, displayModeBar: true });
    }
    if (ids.msd) {
      Plotly.newPlot(ids.msd,
        [{ x: [], y: [], name: 'MSD', line: { color: '#4f8fff' } }],
        { ...PLOT_LAYOUT, yaxis: { ...PLOT_LAYOUT.yaxis, title: 'MSD (Å²)' }, xaxis: { ...PLOT_LAYOUT.xaxis, title: 'Time (ps)' } },
        { responsive: true, displayModeBar: true });
    }
    if (ids.vacf) {
      Plotly.newPlot(ids.vacf,
        [{ x: [], y: [], name: 'VACF', line: { color: '#ffb347' } }],
        { ...PLOT_LAYOUT, yaxis: { ...PLOT_LAYOUT.yaxis, title: 'VACF' }, xaxis: { ...PLOT_LAYOUT.xaxis, title: 'τ (steps)' } },
        { responsive: true, displayModeBar: true });
    }
    if (ids.stress) {
      Plotly.newPlot(ids.stress,
        [{ x: [], y: [], name: 'P (bar)', line: { color: '#4f8fff' } }],
        { ...PLOT_LAYOUT, yaxis: { ...PLOT_LAYOUT.yaxis, title: 'P (bar)' }, xaxis: { ...PLOT_LAYOUT.xaxis, title: 'Time (ps)' } },
        { responsive: true, displayModeBar: true });
    }
  }

  function updatePlot(containerId, x, y, name) {
    if (typeof Plotly === 'undefined' || !containerId) return;
    const el = document.getElementById(containerId);
    if (!el) return;
    Plotly.react(el, [{ x: x, y: y, name: name || 'data', line: { color: '#4f8fff' } }, ...(Array.isArray(y) ? [] : [])], PLOT_LAYOUT);
  }

  function updateMultiPlot(containerId, series) {
    if (typeof Plotly === 'undefined' || !containerId) return;
    const el = document.getElementById(containerId);
    if (!el) return;
    const data = series.map((s, i) => ({
      x: s.x || [],
      y: s.y || [],
      name: s.name || 'series' + i,
      line: s.line || { color: ['#4f8fff', '#ff4f6a', '#3de87a'][i % 3] }
    }));
    Plotly.react(el, data, PLOT_LAYOUT);
  }

  function initPlatform(options) {
    const container = options?.viewerContainer || document.getElementById('viewer-container');
    const plotIds = options?.plotIds || {
      energy: 'plotEnergy',
      temperature: 'plotTemperature',
      pressure: 'plotPressure',
      rdf: 'plotRDF',
      msd: 'plotMSD',
      vacf: 'plotVACF',
      stress: 'plotStress'
    };

    let sim = null;
    let viewer = null;
    let animationId = null;
    let importedStructure = null;

    function log(msg) {
      const el = document.getElementById('console');
      if (el) {
        el.textContent += '\n' + msg;
        el.scrollTop = el.scrollHeight;
      }
    }

    function removeMomentum(atoms) {
      let vx = 0, vy = 0, vz = 0, m = 0;
      atoms.forEach(a => { vx += a.vx * a.mass; vy += a.vy * a.mass; vz += a.vz * a.mass; m += a.mass; });
      if (m <= 0) return;
      vx /= m; vy /= m; vz /= m;
      atoms.forEach(a => { a.vx -= vx; a.vy -= vy; a.vz -= vz; });
    }

    function rescaleVelocities(atoms, T_target) {
      const T = Analysis.computeTemperature(atoms);
      if (T <= 0) return;
      const scale = Math.sqrt(T_target / T);
      atoms.forEach(a => { a.vx *= scale; a.vy *= scale; a.vz *= scale; });
    }

    function getConfigFromUI() {
      const ensemble = document.getElementById('ensemble')?.value || 'NVT';
      const thermo = document.getElementById('thermoType')?.value || 'langevin';
      const dt = parseFloat(document.getElementById('timestep')?.value) || 2;
      const cutoff = parseFloat(document.getElementById('ffCutoff')?.value) || 2.5;
      const potential = document.getElementById('ffType')?.value || 'lj';
      return {
        potential: potential === 'wca' ? 'lj' : potential,
        potentialParams: { cutoff },
        ensemble,
        thermostat: thermo === 'nh' ? 'nose-hoover' : 'langevin',
        T_target: parseFloat(document.getElementById('initTemp')?.value) || 300,
        tau_T: parseFloat(document.getElementById('thermoTau')?.value) || 0.1,
        P_target: parseFloat(document.getElementById('targetPressure')?.value) || 1,
        tau_P: parseFloat(document.getElementById('baroTau')?.value) || 1
      };
    }

    function initializeSystem() {
      const presetId = document.getElementById('exampleSelect')?.value || 'lj_fluid';
      let n = parseInt(document.getElementById('presetN')?.value, 10) || 512;
      const boxSize = parseFloat(document.getElementById('boxSize')?.value) || 40;
      const overrideN = parseInt(document.getElementById('nParticles')?.value, 10);
      if (overrideN > 0) n = overrideN;
      const initTemp = parseFloat(document.getElementById('initTemp')?.value) || 300;

      const presetLattice = {
        lj_fluid: 'sc', lj_solid: 'fcc', argon: 'fcc', neon: 'fcc', kr_solid: 'fcc',
        copper: 'fcc', iron: 'bcc', nacl: 'nacl', silicon: 'diamond'
      };
      const latticeType = presetLattice[presetId] || 'fcc';

      let atoms = [];
      let box = [boxSize, boxSize, boxSize];

      if (importedStructure && importedStructure.atoms && importedStructure.atoms.length) {
        const scNx = parseInt(document.getElementById('scNx')?.value, 10) || 1;
        const scNy = parseInt(document.getElementById('scNy')?.value, 10) || 1;
        const scNz = parseInt(document.getElementById('scNz')?.value, 10) || 1;
        const ibox = importedStructure.box || [boxSize, boxSize, boxSize];
        const rep = Structure.replicateSupercell(importedStructure.atoms, ibox, scNx, scNy, scNz);
        atoms = rep.atoms;
        box = rep.box;
      } else {
        const built = Structure.buildLattice(latticeType, boxSize, n);
        atoms = built.atoms;
        box = built.box;
      }

      removeMomentum(atoms);
      rescaleVelocities(atoms, initTemp);

      const config = getConfigFromUI();
      config.atoms = atoms;
      config.box = box;

      if (sim) sim.reset();
      sim = Engine.createSimulation(config);
      Engine.computeForces(sim.getAtoms(), sim.getBox(), null, config.potential, config.potentialParams);

      updateView();
      createDashboard(plotIds);
      log('Initialized ' + atoms.length + ' atoms, box ' + box.map(b => b.toFixed(1)).join('×') + ' Å');
    }

    function updateView() {
      if (!sim || !viewer) return;
      const atoms = sim.getAtoms();
      const box = sim.getBox();
      if (!atoms.length) return;

      const colorBy = document.getElementById('colorBy')?.value || 'element';
      const atomScale = parseFloat(document.getElementById('atomScale')?.value) || 1;
      const showBox = document.getElementById('showBox')?.checked !== false;
      const showBonds = document.getElementById('showBonds')?.checked || false;

      let atomsWithMeta = atoms;
      if (colorBy === 'coordination' && typeof Analysis.coordinationNumbers === 'function') {
        const cutoff = (atoms[0].sig || 1) * 1.5;
        const cn = Analysis.coordinationNumbers(atoms, box, cutoff);
        atomsWithMeta = atoms.map((a, i) => ({ ...a, cn: cn[i] }));
      }

      viewer.setStructure(atomsWithMeta, box, {
        colorBy,
        atomScale,
        showBox,
        showBonds,
        bondCutoff: (atoms[0].sig || 1) * 1.2
      });
    }

    function updatePlots() {
      if (!sim) return;
      const history = sim.getHistory();
      const t = history.time;
      if (!t || !t.length) return;

      const cap = 1000;
      const tt = t.slice(-cap);
      updateMultiPlot(plotIds.energy, [
        { x: tt, y: history.ekin.slice(-cap), name: 'E_kin' },
        { x: tt, y: history.epot.slice(-cap), name: 'E_pot' },
        { x: tt, y: history.etot.slice(-cap), name: 'E_tot' }
      ]);
      updatePlot(plotIds.temperature, tt, history.T.slice(-cap), 'T (K)');
      updatePlot(plotIds.pressure, tt, history.P.slice(-cap), 'P (bar)');

      if (history.P && history.P.length) {
        updatePlot(plotIds.stress, tt, history.P.slice(-cap), 'P (bar)');
      }

      const traj = sim.getTrajectory();
      if (traj && traj.length > 10 && document.getElementById('calcMSD')?.checked) {
        const msdRes = Analysis.meanSquaredDisplacement(traj, sim.getBox(), { tauMax: Math.min(100, Math.floor(traj.length / 2)), dt: parseFloat(document.getElementById('timestep')?.value) * 1e-3 });
        updatePlot(plotIds.msd, msdRes.time, msdRes.msd, 'MSD');
      }
      if (traj && traj.length > 20 && document.getElementById('calcVACF')?.checked) {
        const vacfRes = Analysis.velocityAutocorrelation(traj, { tauMax: Math.min(150, Math.floor(traj.length / 2)) });
        updatePlot(plotIds.vacf, vacfRes.time, vacfRes.vacf, 'VACF');
      }
      if (document.getElementById('calcRDF')?.checked && sim.getAtoms().length) {
        const rdfRes = Analysis.computeRDF(sim.getAtoms(), sim.getBox(), { nbins: parseInt(document.getElementById('rdfBins')?.value, 10) || 120, rMax: parseFloat(document.getElementById('rdfMax')?.value) || 12 });
        updatePlot(plotIds.rdf, rdfRes.r, rdfRes.g, 'g(r)');
      }
    }

    function updateStats() {
      if (!sim) return;
      const atoms = sim.getAtoms();
      const step = sim.getStep();
      const time = sim.getTime();
      const history = sim.getHistory();
      const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };

      if (!atoms.length) {
        set('sT', '0.0'); set('sEk', '0.000'); set('sEp', '0.000'); set('sEt', '0.000');
        set('sPr', '–'); set('sDen', '–'); set('sTime', '0.000'); set('sN', '0');
        set('stepCounter', '0'); set('simTimeLabel', '0.000');
        set('hudT', '0.0 K'); set('hudP', '–'); set('hudRho', '–'); set('hudE', '0.000 eV'); set('hudStep', '0'); set('hudTime', '0.000');
        return;
      }

      const ekin = sim.computeEkin();
      const T = sim.getTemperature();
      const epot = history.epot.length ? history.epot[history.epot.length - 1] : 0;
      const P = sim.getPressure();
      const rho = Analysis.computeDensity(atoms, sim.getBox());

      set('sT', T.toFixed(1));
      set('sEk', ekin.toFixed(4));
      set('sEp', epot.toFixed(4));
      set('sEt', (ekin + epot).toFixed(4));
      set('sPr', (P != null ? P.toFixed(2) : '–'));
      set('sDen', rho ? rho.toFixed(3) : '–');
      set('sTime', time.toFixed(3));
      set('sN', String(atoms.length));
      set('stepCounter', String(step));
      set('simTimeLabel', time.toFixed(3));
      set('hudT', T.toFixed(1) + ' K');
      set('hudP', (P != null ? P.toFixed(1) : '–') + ' bar');
      set('hudRho', rho ? rho.toFixed(3) + ' g/cc' : '–');
      set('hudE', (ekin + epot).toFixed(4) + ' eV');
      set('hudStep', String(step));
      set('hudTime', time.toFixed(3) + ' ps');

      const totalSteps = parseInt(document.getElementById('totalSteps')?.value, 10) || 20000;
      const prog = document.getElementById('simProgress');
      if (prog) prog.style.width = (100 * step / totalSteps) + '%';

      updatePropertiesAvg();
    }

    function updatePropertiesAvg() {
      const set = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
      if (!sim) return;
      const history = sim.getHistory();
      const atoms = sim.getAtoms();
      const n = history.time && history.time.length;
      if (!n) {
        set('propAvgT', '–'); set('propCv', '–'); set('propAvgP', '–'); set('propD', '–'); set('propRDF1', '–'); set('propCN', '–');
        return;
      }
      const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
      const avgT = avg(history.T);
      const avgP = history.P && history.P.length ? avg(history.P) : null;
      set('propAvgT', avgT.toFixed(1));
      set('propAvgP', avgP != null ? avgP.toFixed(2) : '–');
      const etot = history.etot;
      const varE = etot.length > 1 ? etot.reduce((s, e) => s + (e - avg(etot)) ** 2, 0) / etot.length : 0;
      const T = avgT;
      const cv = T > 0 && varE > 0 ? (varE / (T * T)) / (atoms.length * 8.617333e-5 * 8.617333e-5) : null;
      set('propCv', cv != null && isFinite(cv) ? cv.toFixed(3) : '–');
      const traj = sim.getTrajectory();
      if (traj && traj.length > 20 && typeof Analysis.diffusionCoefficient === 'function') {
        const msdRes = Analysis.meanSquaredDisplacement(traj, sim.getBox(), { tauMax: Math.min(80, Math.floor(traj.length / 2)), dt: parseFloat(document.getElementById('timestep')?.value) * 1e-3 });
        const D = Analysis.diffusionCoefficient(msdRes, parseFloat(document.getElementById('timestep')?.value) * 1e-3);
        set('propD', D != null && isFinite(D) ? D.toFixed(4) : '–');
      } else {
        set('propD', '–');
      }
      if (atoms.length && typeof Analysis.computeRDF === 'function') {
        const rdfRes = Analysis.computeRDF(atoms, sim.getBox(), { nbins: 80, rMax: 10 });
        const g = rdfRes.g;
        const r = rdfRes.r;
        let firstPeak = 0;
        for (let i = 1; i < g.length - 1; i++) if (g[i] > g[i - 1] && g[i] > g[i + 1] && r[i] > 1) { firstPeak = g[i]; break; }
        set('propRDF1', firstPeak > 0 ? firstPeak.toFixed(2) : (g[0] ? g[0].toFixed(2) : '–'));
      } else {
        set('propRDF1', '–');
      }
      if (atoms.length && typeof Analysis.coordinationNumbers === 'function') {
        const cutoff = (atoms[0].sig || 1) * 1.5;
        const cn = Analysis.coordinationNumbers(atoms, sim.getBox(), cutoff);
        const meanCN = cn.reduce((a, b) => a + b, 0) / cn.length;
        set('propCN', meanCN.toFixed(2));
      } else {
        set('propCN', '–');
      }
    }

    function simLoop() {
      if (!sim || !sim.getRunning() || sim.getPaused() || !sim.getAtoms().length) return;

      const dt = parseFloat(document.getElementById('timestep')?.value) || 2;
      const totalSteps = parseInt(document.getElementById('totalSteps')?.value, 10) || 20000;
      const outEvery = parseInt(document.getElementById('outEvery')?.value, 10) || 20;

      sim.stepOnce(dt);
      if (sim.getStep() % outEvery === 0) {
        sim.sample();
        updateStats();
        updatePlots();
      }
      updateView();

      if (sim.getStep() < totalSteps) {
        animationId = requestAnimationFrame(simLoop);
      } else {
        sim.setRunning(false);
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        const badge = document.getElementById('statusBadge');
        if (badge) { badge.className = 'badge-status idle'; badge.textContent = 'idle'; }
        log('Simulation finished at step ' + sim.getStep());
      }
    }

    function startSim() {
      if (!sim || sim.getAtoms().length === 0) { log('Initialize system first.'); return; }
      if (sim.getRunning()) return;
      sim.setRunning(true);
      sim.setPaused(false);
      document.getElementById('startBtn').disabled = true;
      document.getElementById('pauseBtn').disabled = false;
      const badge = document.getElementById('statusBadge');
      if (badge) { badge.className = 'badge-status running'; badge.textContent = 'running'; }
      simLoop();
    }

    function pauseSim() {
      if (!sim) return;
      sim.setPaused(!sim.getPaused());
      const badge = document.getElementById('statusBadge');
      if (badge) {
        badge.className = 'badge-status ' + (sim.getPaused() ? 'paused' : 'running');
        badge.textContent = sim.getPaused() ? 'paused' : 'running';
      }
      if (!sim.getPaused()) simLoop();
    }

    function resetSim() {
      if (sim) {
        sim.setRunning(false);
        sim.setPaused(false);
        sim.reset();
      }
      document.getElementById('startBtn').disabled = false;
      document.getElementById('pauseBtn').disabled = true;
      const badge = document.getElementById('statusBadge');
      if (badge) { badge.className = 'badge-status idle'; badge.textContent = 'idle'; }
      updateStats();
      updateView();
      updatePropertiesAvg();
      createDashboard(plotIds);
      log('Simulation reset.');
    }

    function setImported(data) {
      importedStructure = data;
    }

    function loadFromStructureTab() {
      try {
        const raw = global.localStorage && global.localStorage.getItem('smad-structure-for-md');
        if (!raw) { log('No structure saved from Structures tab. Build a structure on the Structures page first.'); return; }
        const data = JSON.parse(raw);
        const atoms = data.atoms;
        const vecs = data.vecs || [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
        if (!atoms || !atoms.length) { log('Saved structure has no atoms.'); return; }
        const box = [
          Math.sqrt(vecs[0][0] ** 2 + vecs[0][1] ** 2 + vecs[0][2] ** 2),
          Math.sqrt(vecs[1][0] ** 2 + vecs[1][1] ** 2 + vecs[1][2] ** 2),
          Math.sqrt(vecs[2][0] ** 2 + vecs[2][1] ** 2 + vecs[2][2] ** 2)
        ];
        const mdAtoms = atoms.map(a => {
          const el = a.role || a.element || a.sym || 'A';
          const info = Structure.getElement ? Structure.getElement(el) : { mass: 40, sig: 1, eps: 1 };
          return {
            x: a.x, y: a.y, z: a.z,
            vx: 0, vy: 0, vz: 0,
            element: el,
            mass: info.mass,
            sig: info.sig,
            eps: info.eps
          };
        });
        importedStructure = { atoms: mdAtoms, box };
        const card = document.getElementById('structureTabPreview');
        if (card) { card.textContent = 'Loaded ' + mdAtoms.length + ' atoms from Structures tab. Click Initialize to use.'; card.style.display = 'block'; }
        log('Loaded structure from Structures tab (' + mdAtoms.length + ' atoms). Click Initialize to use.');
      } catch (e) {
        log('Load from Structures tab failed: ' + (e.message || e));
      }
    }

    function exportXYZ() {
      if (!sim || !sim.getAtoms().length) { log('No atoms to export.'); return; }
      const atoms = sim.getAtoms();
      let s = atoms.length + '\nSMAD MD export\n';
      atoms.forEach(a => s += (a.element || 'X') + ' ' + a.x + ' ' + a.y + ' ' + a.z + '\n');
      const a = document.createElement('a');
      a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(s);
      a.download = 'md_export.xyz';
      a.click();
      log('Exported XYZ.');
    }

    function exportCSV() {
      if (!sim) return;
      const h = sim.getHistory();
      if (!h.time.length) { log('No data to export.'); return; }
      let s = 'time_ps,E_kin_eV,E_pot_eV,E_tot_eV,T_K,P_bar\n';
      for (let i = 0; i < h.time.length; i++) {
        s += h.time[i] + ',' + (h.ekin[i] || 0) + ',' + (h.epot[i] || 0) + ',' + (h.etot[i] || 0) + ',' + (h.T[i] || 0) + ',' + (h.P[i] || 0) + '\n';
      }
      const a = document.createElement('a');
      a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(s);
      a.download = 'md_data.csv';
      a.click();
      log('Exported CSV.');
    }

    if (container && typeof Viz !== 'undefined' && Viz.createViewer) {
      viewer = Viz.createViewer(container, { colorBy: 'element', atomScale: 1, showBox: true });
    }

    const api = {
      initializeSystem,
      updateView,
      updatePlots,
      updateStats,
      updatePropertiesAvg,
      startSim,
      pauseSim,
      resetSim,
      setImported,
      loadFromStructureTab,
      exportXYZ,
      exportCSV,
      getSim: () => sim,
      getViewer: () => viewer,
      log
    };

    if (global.window) {
      global.window.smadMDPlatform = () => api;
    }
    return api;
  }

  const MDUIControls = {
    initPlatform,
    createDashboard,
    updatePlot,
    updateMultiPlot
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = MDUIControls;
  else global.MDUIControls = MDUIControls;
})(typeof self !== 'undefined' ? self : this);
