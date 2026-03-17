/**
 * UI Controls
 * Wires lattice editing, structure generation, symmetry, search, analysis,
 * and visualization into a single interface.
 */
(function (global) {
  'use strict';

  const CrystalEngine = global.CrystalEngine;
  const SymmetryEngine = global.SymmetryEngine;
  const StructureGenerator = global.StructureGenerator;
  const EvolutionaryOptimizer = global.EvolutionaryOptimizer;
  const AnalysisTools = global.AnalysisTools;
  const VisualizationEngine = global.VisualizationEngine;
  const PlottingDashboard = global.PlottingDashboard;

  function getLatticeParamsFromForm(formId) {
    const get = (id) => {
      const el = document.getElementById(id);
      const v = el && el.value ? parseFloat(el.value) : NaN;
      return isNaN(v) ? null : v;
    };
    return {
      a: get('lat-a'), b: get('lat-b'), c: get('lat-c'),
      alpha: get('lat-al'), beta: get('lat-be'), gamma: get('lat-ga')
    };
  }

  function setLatticeParamsToForm(params) {
    ['lat-a', 'lat-b', 'lat-c', 'lat-al', 'lat-be', 'lat-ga'].forEach((id, i) => {
      const key = ['a', 'b', 'c', 'alpha', 'beta', 'gamma'][i];
      const el = document.getElementById(id);
      if (el && params[key] != null) el.value = params[key];
    });
  }

  function getElementColorsMap() {
    if (global.EL_MAP) {
      const m = {};
      Object.entries(global.EL_MAP).forEach(([sym, e]) => { m[sym] = e.c || '#888888'; });
      return m;
    }
    return {};
  }

  function hexToThree(hex) {
    if (typeof hex === 'number') return hex;
    const h = hex.replace('#', '');
    return parseInt(h.length === 6 ? h : h.slice(0, 6), 16);
  }

  /**
   * Initialize the full platform: viewer container, dashboard container, and bind events.
   */
  function initPlatform(options) {
    const viewerContainer = options.viewerContainer || document.getElementById('viewer-container');
    const dashboardContainer = options.dashboardContainer || document.getElementById('dashboard-plots');
    if (!viewerContainer) return null;

    let viewer = null;
    let dashboard = null;
    let currentAtoms = [];
    let currentBonds = [];
    let currentVecs = null;
    let optimizationHistory = [];

    if (typeof THREE !== 'undefined' && VisualizationEngine) {
      viewer = VisualizationEngine.createViewer(viewerContainer, { elementColors: getElementColorsMap() });
    }

    if (dashboardContainer && typeof Plotly !== 'undefined' && PlottingDashboard) {
      dashboard = PlottingDashboard.createDashboard(dashboardContainer);
    }

    function updateView() {
      if (viewer && currentAtoms.length) {
        const colors = getElementColorsMap();
        const colorMap = {};
        Object.entries(colors).forEach(([k, v]) => { colorMap[k] = hexToThree(v); });
        viewer.setStructure(currentAtoms, currentBonds, currentVecs, colorMap);
      }
    }

    function updateAnalysis() {
      if (!currentAtoms.length || !currentVecs || !AnalysisTools) return;
      const bonds = AnalysisTools.computeBonds(currentAtoms, currentVecs, 3.5);
      currentBonds = bonds;
      const cn = AnalysisTools.coordinationNumbers(currentAtoms, currentVecs, bonds);
      if (dashboard) {
        dashboard.updateBondDistribution(bonds);
        dashboard.updateCoordination(cn);
        const { r, g } = AnalysisTools.radialDistributionFunction(currentAtoms, currentVecs, 8, 0.1);
        dashboard.updateRDF(r, g);
        const peaks = AnalysisTools.xrdPattern(currentAtoms, currentVecs, 1.5406, 80);
        dashboard.updateXRD(peaks);
      }
      updateView();
    }

    function loadStructure(result) {
      if (!result || !result.atoms) return;
      currentAtoms = result.atoms.map((a, i) => ({ ...a, id: i, sym: a.sym || a.role }));
      currentVecs = result.vecs || result.ucV || [[5, 0, 0], [0, 5, 0], [0, 0, 5]];
      updateAnalysis();
    }

    const api = {
      loadStructure,
      setAtoms(vecs, atoms) {
        currentVecs = vecs;
        currentAtoms = atoms.map((a, i) => ({ ...a, id: i, sym: a.sym || a.role }));
        updateAnalysis();
      },
      getAtoms: () => currentAtoms,
      getBonds: () => currentBonds,
      getVecs: () => currentVecs,
      getViewer: () => viewer,
      getDashboard: () => dashboard,
      runOptimization(opts, onProgress, onDone) {
        if (!EvolutionaryOptimizer || !opts.initialSites || !opts.vecs) return;
        optimizationHistory = [];
        EvolutionaryOptimizer.runOptimization(opts, (msg) => {
          optimizationHistory.push({ generation: msg.generation, bestEnergy: msg.bestEnergy });
          if (dashboard) dashboard.updateEnergy(optimizationHistory);
          if (msg.bestSites && CrystalEngine) {
            const atoms = msg.bestSites.map((s, i) => {
              const c = CrystalEngine.fracToCart([s.x, s.y, s.z], opts.vecs);
              return { x: c[0], y: c[1], z: c[2], role: s.role, id: i };
            });
            api.setAtoms(opts.vecs, atoms);
          }
          if (onProgress) onProgress(msg);
        }, (msg) => {
          if (msg.bestAtoms) api.setAtoms(opts.vecs, msg.bestAtoms);
          if (dashboard) dashboard.updateEnergy(msg.history || optimizationHistory);
          if (onDone) onDone(msg);
        });
      },
      stopOptimization() {
        if (EvolutionaryOptimizer) EvolutionaryOptimizer.stopOptimization();
      },
      generateRandom(opts) {
        if (!StructureGenerator) return null;
        const result = StructureGenerator.generateRandomStructure(opts);
        loadStructure(result);
        return result;
      },
      buildFromPrototype(prototypeId, supercell, latticeOverride) {
        if (!CrystalEngine) return null;
        const proto = CrystalEngine.PROTOTYPES[prototypeId];
        if (!proto) return null;
        const lat = latticeOverride || { a: proto.a, b: proto.b || proto.a, c: proto.c || proto.a, alpha: 90, beta: 90, gamma: proto.gamma || 90 };
        const result = CrystalEngine.buildFromSites(proto.sites, lat, proto.lattice, supercell || [1, 1, 1]);
        result.atoms.forEach((a, i) => { a.role = a.role || proto.roles[0]; a.sym = a.role; });
        loadStructure(result);
        return result;
      },
      resize() {
        if (viewerContainer && viewer) {
          viewer.setSize(viewerContainer.clientWidth, viewerContainer.clientHeight);
        }
      }
    };

    if (global.addEventListener) global.addEventListener('resize', () => api.resize());
    return api;
  }

  const UIControls = {
    initPlatform,
    getLatticeParamsFromForm,
    setLatticeParamsToForm,
    getElementColorsMap
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = UIControls;
  else global.UIControls = UIControls;
})(typeof self !== 'undefined' ? self : this);
