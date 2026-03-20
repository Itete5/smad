export class CrystalEvents {
  constructor({ app }) {
    this.app = app;
    this.state = app.state;
    this.ui = app.ui;
    this.renderer = app.renderer;
  }

  bind() {
    const doc = document;

    // Theme
    const themeBtn = doc.getElementById('themeBtn');
    themeBtn?.addEventListener('click', () => this.app.toggleTheme());

    // Main tabs
    Array.from(doc.querySelectorAll('.ntab')).forEach((btn) => {
      btn.addEventListener('click', () => this.ui.setMainTab(btn.dataset.mainTab));
    });

    // Prototype selection
    const protoSelect = doc.getElementById('protoSelect');
    protoSelect?.addEventListener('change', (e) => this.app.applyPrototype(e.target.value, { commit: false }));

    // Lattice parameter inputs
    ['lpA', 'lpB', 'lpC', 'lpAlpha', 'lpBeta', 'lpGamma'].forEach((id) => {
      doc.getElementById(id)?.addEventListener('input', () => this.app.updateLattice({ commit: false }));
    });
    // Debounced commit after editing ends
    ['lpA', 'lpB', 'lpC', 'lpAlpha', 'lpBeta', 'lpGamma'].forEach((id) => {
      let t = null;
      doc.getElementById(id)?.addEventListener('change', () => {
        clearTimeout(t);
        t = setTimeout(() => this.app.updateLattice({ commit: true }), 0);
      });
      doc.getElementById(id)?.addEventListener('blur', () => {
        clearTimeout(t);
        t = setTimeout(() => this.app.updateLattice({ commit: true }), 0);
      });
    });

    // Element assignment
    doc.getElementById('elA')?.addEventListener('input', () => this.app.updateElementA({ commit: true }));
    doc.getElementById('elB')?.addEventListener('input', () => this.app.rebuildFromProto({ commit: true }));
    doc.getElementById('elC')?.addEventListener('input', () => this.app.rebuildFromProto({ commit: true }));

    // Build
    doc.getElementById('buildBtn')?.addEventListener('click', () => this.app.buildStructure());

    // Quick-load buttons
    Array.from(doc.querySelectorAll('[data-quickload]')).forEach((btn) => {
      btn.addEventListener('click', () => this.app.quickLoad(btn.dataset.quickload));
    });

    // Open Database tab
    doc.getElementById('openDatabaseTabBtn')?.addEventListener('click', () => this.ui.setMainTab('database'));

    // Atom tab
    Array.from(doc.querySelectorAll('.tbar .tab')).forEach((btn) => {
      btn.addEventListener('click', () => this.ui.setAtomTab(btn.dataset.atomTab));
    });

    // Manual atoms
    doc.getElementById('addManualAtomsBtn')?.addEventListener('click', () => this.app.addManualAtoms());
    doc.getElementById('clearAtomsBtn')?.addEventListener('click', () => this.app.clearAtoms());

    // Viewer controls
    doc.getElementById('resetCamBtn')?.addEventListener('click', () => this.app.renderer.resetCamera());
    doc.getElementById('cellBtn')?.addEventListener('click', () => this.app.toggleCell());
    doc.getElementById('axesBtn')?.addEventListener('click', () => this.app.toggleAxes());
    doc.getElementById('bondsBtn')?.addEventListener('click', () => this.app.toggleBonds());
    doc.getElementById('polyBtn')?.addEventListener('click', () => this.app.togglePoly());
    doc.getElementById('autoRotBtn')?.addEventListener('click', () => this.app.toggleAutoRot());
    doc.getElementById('snapBtn')?.addEventListener('click', () => this.app.renderer.captureScene());

    // Sliders
    doc.getElementById('atomScale')?.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      doc.getElementById('atomScaleV').textContent = v.toFixed(2);
      this.app.setAtomScale(v);
    });
    doc.getElementById('bondCutoff')?.addEventListener('input', (e) => {
      const v = parseFloat(e.target.value);
      doc.getElementById('bondCutoffV').textContent = v.toFixed(1);
      this.app.setBondCutoff(v);
    });

    // Plot tabs
    Array.from(doc.querySelectorAll('.ptabs-bar .ptab')).forEach((btn) => {
      btn.addEventListener('click', () => this.ui.setPlotTab(btn.dataset.plot));
    });

    // Log
    doc.getElementById('clearLogBtn')?.addEventListener('click', () => this.ui.clearLog());

    // Undo/redo shortcuts
    window.addEventListener('keydown', (e) => {
      const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
      const meta = isMac ? e.metaKey : e.ctrlKey;
      if (!meta) return;

      if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        this.app.undo();
      } else if ((e.key.toLowerCase() === 'z' && e.shiftKey) || e.key.toLowerCase() === 'y') {
        e.preventDefault();
        this.app.redo();
      }
    });

    // Atom list selection via event delegation
    const atomList = doc.getElementById('atomList');
    atomList?.addEventListener('click', (e) => {
      const row = e.target.closest('.atom-row');
      if (!row) return;
      const id = parseInt(row.dataset.atomId, 10);
      if (!Number.isFinite(id)) return;
      this.app.selectAtom(id);
    });
  }
}

