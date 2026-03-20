/* global Plotly, THREE */

import { state } from './state.js';
import { CrystalRenderer } from './renderer.js';
import { CrystalUI } from './ui.js';
import { CrystalEvents } from './events.js';

// CrystalForgeApp orchestrates:
// - state updates
// - crystal structure construction
// - renderer lifecycle
// - UI updates
// - event bindings
export class CrystalForgeApp {
  constructor() {
    this.el = this._collectElements();
    this.ui = new CrystalUI({ state, elements: this.el });
    this.renderer = new CrystalRenderer({ state, elements: this.el, onLog: (m) => this.ui.log(m) });

    // Minimal internal DB (extend with full periodic table later)
    this.PROTOTYPES = {
      sc: { a: 3.0, b: 3.0, c: 3.0, alpha: 90, beta: 90, gamma: 90, sg: 221, sgSym: 'Pm-3m', crystal: 'Cubic', bElements: 0, atoms: [{ el: 'A', x: 0, y: 0, z: 0 }] },
      fcc: { a: 4.046, sg: 225, sgSym: 'Fm-3m', crystal: 'Cubic', bElements: 0, atoms: [{ el: 'A', x: 0, y: 0, z: 0 }] },
      bcc: { a: 2.87, sg: 229, sgSym: 'Im-3m', crystal: 'Cubic', bElements: 0, atoms: [{ el: 'A', x: 0, y: 0, z: 0 }] },
      diamond: { a: 5.43, sg: 227, sgSym: 'Fd-3m', crystal: 'Cubic', bElements: 0, atoms: [{ el: 'A', x: 0, y: 0, z: 0 }, { el: 'A', x: 0.25, y: 0.25, z: 0.25 }] },
      hcp: { a: 3.21, c: 5.21, sg: 194, sgSym: 'P6_3/mmc', crystal: 'Hexagonal', bElements: 0, atoms: [{ el: 'A', x: 1 / 3, y: 2 / 3, z: 0.25 }, { el: 'A', x: 2 / 3, y: 1 / 3, z: 0.75 }] },

      nacl: { a: 5.64, sg: 225, sgSym: 'Fm-3m', crystal: 'Cubic', bElements: 1, atoms: [{ el: 'A', x: 0, y: 0, z: 0 }, { el: 'B', x: 0.5, y: 0.5, z: 0.5 }] },
      zincblende: { a: 5.43, sg: 216, sgSym: 'F-43m', crystal: 'Cubic', bElements: 1, atoms: [{ el: 'A', x: 0, y: 0, z: 0 }, { el: 'B', x: 0.25, y: 0.25, z: 0.25 }] },
      perovskite: { a: 3.905, sg: 221, sgSym: 'Pm-3m', crystal: 'Cubic', bElements: 2, atoms: [{ el: 'A', x: 0.5, y: 0.5, z: 0.5 }, { el: 'B', x: 0, y: 0, z: 0 }, { el: 'C', x: 0.5, y: 0, z: 0 }, { el: 'C', x: 0, y: 0.5, z: 0 }, { el: 'C', x: 0, y: 0, z: 0.5 }] },
      spinel: { a: 8.09, sg: 227, sgSym: 'Fd-3m', crystal: 'Cubic', bElements: 2, atoms: [{ el: 'A', x: 0, y: 0, z: 0 }, { el: 'A', x: 0.25, y: 0.25, z: 0.25 }, { el: 'B', x: 0.625, y: 0.625, z: 0.625 }, { el: 'B', x: 0.875, y: 0.875, z: 0.875 }, { el: 'C', x: 0.25, y: 0.25, z: 0.5 }, { el: 'C', x: 0, y: 0.5, z: 0.25 }] },

      // Used by quick-load buttons.
      rutile: { a: 4.59, b: 4.59, c: 2.96, sg: 136, sgSym: 'P4_2/mnm', crystal: 'Tetragonal', bElements: 1, atoms: [{ el: 'A', x: 0, y: 0, z: 0 }, { el: 'A', x: 0.5, y: 0.5, z: 0.5 }, { el: 'B', x: 0.3, y: 0.3, z: 0 }, { el: 'B', x: 0.7, y: 0.7, z: 0 }, { el: 'B', x: 0.2, y: 0.8, z: 0.5 }, { el: 'B', x: 0.8, y: 0.2, z: 0.5 }] },
      graphite: { a: 2.464, b: 2.464, c: 6.71, gamma: 120, sg: 194, sgSym: 'P6_3/mmc', crystal: 'Hexagonal', bElements: 0, atoms: [{ el: 'A', x: 0, y: 0, z: 0.25 }, { el: 'A', x: 1 / 3, y: 2 / 3, z: 0.25 }, { el: 'A', x: 0, y: 0, z: 0.75 }, { el: 'A', x: 2 / 3, y: 1 / 3, z: 0.75 }] },

      custom: { a: 5.0, sg: 1, sgSym: 'P1', crystal: 'Triclinic', bElements: 0, atoms: [] },
      // Allow selection to include BCC-like variants even if not in UI dropdown.
    };

    this.DB_PRESETS = {
      mp_Al: { proto: 'fcc', elA: 'Al', a: 4.046, note: 'Al FCC' },
      mp_Fe: { proto: 'bcc', elA: 'Fe', a: 2.87, note: 'Fe BCC' },
      mp_Si: { proto: 'diamond', elA: 'Si', a: 5.43, note: 'Si Diamond' },
      mp_NaCl: { proto: 'nacl', elA: 'Na', elB: 'Cl', a: 5.64, note: 'NaCl' },
      mp_TiO2: { proto: 'rutile', elA: 'Ti', elB: 'O', a: 4.59, c: 2.96, note: 'TiO₂ Rutile' },
      mp_BaTiO3: { proto: 'perovskite', elA: 'Ba', elB: 'Ti', elC: 'O', a: 3.99, note: 'BaTiO₃' },
      mp_MgAl2O4: { proto: 'spinel', elA: 'Mg', elB: 'Al', elC: 'O', a: 8.09, note: 'Spinel MgAl₂O₄' },
      mp_graphite: { proto: 'graphite', elA: 'C', a: 2.464, c: 6.71, note: 'Graphite' },
    };

    // Current active tab/selection state
    this._pendingLatticeCommit = false;

    this._initThemeFromStorage();
    this._initLoading();

    this._initThreeAndPlots();
    this._initialStructure();

    // Start renderer loop
    this.renderer.startLoop();
    this.ui.log('CrystalForge ready', 'info');

    // Bind events after first render
    const events = new CrystalEvents({ app: this });
    events.bind();
  }

  _collectElements() {
    return {
      threeWrap: document.getElementById('threeWrap'),
      threeCanvas: document.getElementById('threeCanvas'),
    };
  }

  _initLoading() {
    // Lightweight loading animation compatibility with existing HTML.
    const loading = document.getElementById('loading');
    const ltxt = document.getElementById('l-txt');
    const prog = document.getElementById('l-prog');
    if (!loading) return;
    let step = 0;
    const steps = [
      'Initialising crystal engine...',
      'Loading renderer...',
      'Building default structure...',
      'Ready!',
    ];
    const tick = () => {
      if (step >= steps.length) {
        loading.classList.add('gone');
        return;
      }
      if (ltxt) ltxt.textContent = steps[step];
      if (prog) prog.style.width = ((step + 1) / steps.length) * 100 + '%';
      step++;
      setTimeout(tick, 140);
    };
    tick();
  }

  _initThreeAndPlots() {
    this.renderer.initThree();
    this._initPlots();
  }

  _initPlots() {
    // Plotly charts are placeholders here, but we keep proper pane switching.
    if (!window.Plotly) return;

    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const base = this._getPlotlyLayout(dark);

    const L = (xl, yl) => ({
      ...base,
      xaxis: { ...base.xaxis, title: { text: xl, font: { size: 9 } } },
      yaxis: { ...base.yaxis, title: { text: yl, font: { size: 9 } } },
    });

    const PC = { responsive: true, displayModeBar: false };
    Plotly.newPlot(
      'pEnergy',
      [
        {
          x: [],
          y: [],
          name: 'Best',
          mode: 'lines+markers',
          line: { color: '#1a6fba', width: 2 },
          marker: { size: 4, color: '#1a6fba' },
        },
      ],
      L('Generation', 'Energy (eV/atom)'),
      PC
    );

    Plotly.newPlot('pRDF', [{ x: [], y: [], name: 'g(r)', mode: 'lines', line: { color: '#1a6fba', width: 2 } }], L('r (Å)', 'g(r)'), PC);
    Plotly.newPlot('pXRD', [{ x: [], y: [], name: 'I', mode: 'lines', line: { color: '#c47b00', width: 1.5 } }], L('2θ (°)', 'Intensity (%)'), PC);
    Plotly.newPlot('pBonds', [{ x: [], y: [], name: 'Bond lengths', type: 'histogram' }], L('Bond length (Å)', 'Count'), PC);
    Plotly.newPlot('pCoord', [{ x: [], y: [], name: 'CN', type: 'bar' }], L('Coordination #', 'Count'), PC);
    Plotly.newPlot(
      'pADF',
      [{ x: [], y: [], name: 'P(θ)', mode: 'lines', line: { color: '#6a3daa', width: 2 } }],
      L('Angle (°)', 'P(θ)'),
      PC
    );
  }

  _getPlotlyLayout(dark) {
    return {
      paper_bgcolor: 'transparent',
      plot_bgcolor: dark ? 'rgba(1,3,6,0.5)' : 'rgba(245,246,248,0.8)',
      font: { color: dark ? '#8b949e' : '#52596e', size: 9.5, family: 'IBM Plex Mono' },
      margin: { t: 20, r: 12, b: 34, l: 48 },
      xaxis: { gridcolor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)', zeroline: false, linecolor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
      yaxis: { gridcolor: dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)', zeroline: false, linecolor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
      legend: { bgcolor: 'transparent', font: { size: 9 } },
    };
  }

  _initThemeFromStorage() {
    const saved = localStorage.getItem('cf-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
    // Update theme button label
    const icon = document.getElementById('themeIcon');
    const label = document.getElementById('themeLabel');
    if (icon && label) {
      if (saved === 'dark') {
        icon.textContent = '☀️';
        label.textContent = 'Light';
      } else {
        icon.textContent = '🌙';
        label.textContent = 'Dark';
      }
    }
  }

  _initialStructure() {
    // Build initial structure from currently selected prototype.
    const proto = document.getElementById('protoSelect')?.value || 'fcc';
    this.applyPrototype(proto, { commit: false });
    this.ui.updateLatticeInfo();
    this.ui.updateStats();
    this.ui.renderAtomList();
  }

  // ---------- Undo/redo ----------
  _snapshot() {
    return JSON.parse(JSON.stringify({
      lattice: this.state.lattice,
      atoms: this.state.atoms,
      spaceGroup: this.state.spaceGroup,
      settings: this.state.settings,
    }));
  }

  _restore(snap) {
    this.state.lattice = snap.lattice;
    this.state.atoms = snap.atoms;
    this.state.spaceGroup = snap.spaceGroup;
    this.state.settings = snap.settings;
    this._updateMatricesAndCart();
  }

  commit(label = 'edit') {
    this.state.history.push({ label, snap: this._snapshot() });
    this.state.future = [];
  }

  undo() {
    if (!this.state.history.length) return;
    const current = this._snapshot();
    const last = this.state.history.pop();
    this.state.future.push({ label: 'redo', snap: current });
    this._restore(last.snap);
    this.renderer.renderAtoms();
    this.renderer.updateScene();
    this.ui.updateLatticeInfo();
    this.ui.updateStats();
    this.ui.renderAtomList();
  }

  redo() {
    if (!this.state.future.length) return;
    const current = this._snapshot();
    const next = this.state.future.pop();
    this.state.history.push({ label: 'undo', snap: current });
    this._restore(next.snap);
    this.renderer.renderAtoms();
    this.renderer.updateScene();
    this.ui.updateLatticeInfo();
    this.ui.updateStats();
    this.ui.renderAtomList();
  }

  // ---------- Crystal / lattice ----------
  degToRad(d) {
    return (d * Math.PI) / 180;
  }

  buildOrthoMatrix(a, b, c, al, be, ga) {
    const cosAl = Math.cos(this.degToRad(al));
    const cosBe = Math.cos(this.degToRad(be));
    const cosGa = Math.cos(this.degToRad(ga));
    const sinGa = Math.sin(this.degToRad(ga));
    const V = Math.sqrt(Math.max(0, 1 - cosAl * cosAl - cosBe * cosBe - cosGa * cosGa + 2 * cosAl * cosBe * cosGa));
    return [
      [a, b * cosGa, c * cosBe],
      [0, b * sinGa, (c * (cosAl - cosBe * cosGa)) / sinGa],
      [0, 0, (c * V) / sinGa],
    ];
  }

  mat3Inv(m) {
    const [[a, b, c], [d, e, f], [g, h, i]] = m;
    const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
    if (Math.abs(det) < 1e-12) return null;
    return [
      [(e * i - f * h) / det, (c * h - b * i) / det, (b * f - c * e) / det],
      [(f * g - d * i) / det, (a * i - c * g) / det, (c * d - a * f) / det],
      [(d * h - e * g) / det, (b * g - a * h) / det, (a * e - b * d) / det],
    ];
  }

  updateMatrices() {
    const { a, b, c, alpha, beta, gamma } = this.state.lattice;
    this.state._M = this.buildOrthoMatrix(a, b, c, alpha, beta, gamma);
    this.state._Minv = this.mat3Inv(this.state._M);
  }

  fracToCart(fx, fy, fz) {
    const M = this.state._M;
    if (!M) return [0, 0, 0];
    return [
      M[0][0] * fx + M[0][1] * fy + M[0][2] * fz,
      M[1][0] * fx + M[1][1] * fy + M[1][2] * fz,
      M[2][0] * fx + M[2][1] * fy + M[2][2] * fz,
    ];
  }

  cartToFrac(cx, cy, cz) {
    const Minv = this.state._Minv;
    if (!Minv) return [0, 0, 0];
    return [
      Minv[0][0] * cx + Minv[0][1] * cy + Minv[0][2] * cz,
      Minv[1][0] * cx + Minv[1][1] * cy + Minv[1][2] * cz,
      Minv[2][0] * cx + Minv[2][1] * cy + Minv[2][2] * cz,
    ];
  }

  wrapFrac(f) {
    return ((f % 1) + 1) % 1;
  }

  _updateMatricesAndCart() {
    this.updateMatrices();
    // Cache Cartesian coordinates for bonds/poly and potential future exporters.
    this.state.atoms.forEach((a) => {
      const [x, y, z] = this.fracToCart(a.x, a.y, a.z);
      a.cx = x;
      a.cy = y;
      a.cz = z;
    });
  }

  // ---------- Structure construction ----------
  applyPrototype(name, { commit } = { commit: true }) {
    const proto = this.PROTOTYPES[name];
    if (!proto) {
      this.ui.log(`Unknown prototype: ${name}`, 'err');
      return;
    }

    // Read element assignments from UI.
    const elA = document.getElementById('elA')?.value.trim() || 'Al';
    const elB = document.getElementById('elB')?.value.trim() || 'O';
    const elC = document.getElementById('elC')?.value.trim() || 'O';

    // Update lattice from prototype.
    this.state.lattice.a = proto.a ?? 4.0;
    this.state.lattice.b = proto.b ?? proto.a ?? 4.0;
    this.state.lattice.c = proto.c ?? proto.a ?? 4.0;
    this.state.lattice.alpha = proto.alpha ?? 90;
    this.state.lattice.beta = proto.beta ?? 90;
    this.state.lattice.gamma = proto.gamma ?? ((name === 'hcp' || name === 'graphite') ? 120 : 90);

    // Sync lattice input values
    this._syncLatticeInputs();

    // Show/hide B/C element rows
    this._syncElementRows(proto.bElements || 0);

    // Expand basis to a simple "conventional-like" set (still a prototype tool).
    this.state.atoms = this._expandProtoAtoms(proto, name, elA, elB, elC).map((a, id) => ({ ...a, id }));

    this.state.spaceGroup = {
      num: proto.sg ?? 1,
      symbol: proto.sgSym ?? 'P1',
      crystal: proto.crystal ?? 'Triclinic',
      system: this._crystalSystemFromSG(proto.sg ?? 1),
    };

    const sgInput = document.getElementById('sgInput');
    if (sgInput) sgInput.value = `${proto.sgSym ?? 'P1'} (#${proto.sg ?? 1})`;

    this._updateMatricesAndCart();
    this.renderer.renderAtoms();
    this.renderer.updateScene();
    this.ui.updateLatticeInfo();
    this.ui.updateStats();
    this.ui.renderAtomList();

    if (commit) this.commit(`applyPrototype:${name}`);
  }

  _syncLatticeInputs() {
    const { a, b, c, alpha, beta, gamma } = this.state.lattice;
    const lpA = document.getElementById('lpA');
    const lpB = document.getElementById('lpB');
    const lpC = document.getElementById('lpC');
    const lpAlpha = document.getElementById('lpAlpha');
    const lpBeta = document.getElementById('lpBeta');
    const lpGamma = document.getElementById('lpGamma');
    if (lpA) lpA.value = a.toFixed(3);
    if (lpB) lpB.value = b.toFixed(3);
    if (lpC) lpC.value = c.toFixed(3);
    if (lpAlpha) lpAlpha.value = alpha.toFixed(1);
    if (lpBeta) lpBeta.value = beta.toFixed(1);
    if (lpGamma) lpGamma.value = gamma.toFixed(1);
  }

  _syncElementRows(bElements) {
    const elBRow = document.getElementById('elBRow');
    const elCRow = document.getElementById('elCRow');
    if (elBRow) elBRow.style.display = bElements >= 1 ? 'flex' : 'none';
    if (elCRow) elCRow.style.display = bElements >= 2 ? 'flex' : 'none';
  }

  _crystalSystemFromSG(n) {
    if (n >= 1 && n <= 2) return 'triclinic';
    if (n >= 3 && n <= 15) return 'monoclinic';
    if (n >= 16 && n <= 74) return 'orthorhombic';
    if (n >= 75 && n <= 142) return 'tetragonal';
    if (n >= 143 && n <= 167) return 'trigonal';
    if (n >= 168 && n <= 194) return 'hexagonal';
    if (n >= 195 && n <= 230) return 'cubic';
    return 'triclinic';
  }

  _expandProtoAtoms(p, name, elA, elB, elC) {
    const atoms = [];
    const elMap = { A: elA, B: elB, C: elC };

    const fccTrans = [
      [0, 0, 0],
      [0.5, 0.5, 0],
      [0.5, 0, 0.5],
      [0, 0.5, 0.5],
    ];
    const bccTrans = [
      [0, 0, 0],
      [0.5, 0.5, 0.5],
    ];

    let translations = [[0, 0, 0]];
    if (['fcc', 'nacl', 'zincblende', 'diamond', 'spinel'].includes(name)) translations = fccTrans;
    else if (['bcc'].includes(name)) translations = bccTrans;

    (p.atoms || []).forEach((base) => {
      const el = elMap[base.el] || base.el;
      translations.forEach((t) => {
        const x = this.wrapFrac((base.x ?? 0) + t[0]);
        const y = this.wrapFrac((base.y ?? 0) + t[1]);
        const z = this.wrapFrac((base.z ?? 0) + t[2]);

        if (!atoms.find((a) => Math.abs(a.x - x) < 0.001 && Math.abs(a.y - y) < 0.001 && Math.abs(a.z - z) < 0.001)) {
          atoms.push({ el, x, y, z });
        }
      });
    });
    return atoms;
  }

  buildStructure() {
    const name = document.getElementById('protoSelect')?.value || 'fcc';
    this.applyPrototype(name, { commit: true });
  }

  rebuildFromProto({ commit } = { commit: true }) {
    const name = document.getElementById('protoSelect')?.value || 'fcc';
    this.applyPrototype(name, { commit });
  }

  updateElementA({ commit } = { commit: true }) {
    // Prototype rebuild: element A changes lattice basis species.
    this.rebuildFromProto({ commit });
  }

  updateLattice({ commit } = { commit: true }) {
    const a = parseFloat(document.getElementById('lpA')?.value);
    const b = parseFloat(document.getElementById('lpB')?.value);
    const c = parseFloat(document.getElementById('lpC')?.value);
    const alpha = parseFloat(document.getElementById('lpAlpha')?.value);
    const beta = parseFloat(document.getElementById('lpBeta')?.value);
    const gamma = parseFloat(document.getElementById('lpGamma')?.value);

    if (![a, b, c, alpha, beta, gamma].every((v) => Number.isFinite(v))) return;

    this.state.lattice = { ...this.state.lattice, a, b, c, alpha, beta, gamma };
    this._updateMatricesAndCart();
    this.renderer.renderAtoms();
    this.renderer.updateScene();
    this.ui.updateLatticeInfo();
    this.ui.updateStats();
    this.ui.renderAtomList();

    if (commit) this.commit('updateLattice');
  }

  clearAtoms() {
    this.state.atoms = [];
    this._updateMatricesAndCart();
    this.renderer.renderAtoms();
    this.renderer.updateScene();
    this.ui.updateStats();
    this.ui.renderAtomList();
    this.commit('clearAtoms');
  }

  addManualAtoms() {
    const isFrac = document.getElementById('atom-frac')?.classList.contains('active');
    const txt = isFrac
      ? document.getElementById('fracCoords')?.value || ''
      : document.getElementById('cartCoords')?.value || '';
    const lines = txt.trim().split('\n').map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return;

    const toFracOrKeep = (el, a, b, c) => {
      if (isFrac) return { el, x: this.wrapFrac(a), y: this.wrapFrac(b), z: this.wrapFrac(c) };
      const [fx, fy, fz] = this.cartToFrac(a, b, c);
      return { el, x: this.wrapFrac(fx), y: this.wrapFrac(fy), z: this.wrapFrac(fz) };
    };

    const newAtoms = [];
    for (const line of lines) {
      const parts = line.split(/\s+/);
      if (parts.length < 4) continue;
      const el = parts[0];
      const a = parseFloat(parts[1]);
      const b = parseFloat(parts[2]);
      const c = parseFloat(parts[3]);
      if (!el || [a, b, c].some((v) => !Number.isFinite(v))) continue;
      newAtoms.push(toFracOrKeep(el, a, b, c));
    }
    if (!newAtoms.length) return;

    // Append (IDs are array indices).
    const next = this.state.atoms.concat(newAtoms.map((a) => ({ ...a })));
    this.state.atoms = next.map((a, id) => ({ ...a, id }));
    this._updateMatricesAndCart();
    this.renderer.renderAtoms();
    this.renderer.updateScene();
    this.ui.updateStats();
    this.ui.renderAtomList();
    this.commit('addManualAtoms');
  }

  quickLoad(name) {
    const p = this.DB_PRESETS[name];
    if (!p) return;

    // Ensure select value aligns with prototype name.
    const protoSelect = document.getElementById('protoSelect');
    if (protoSelect) protoSelect.value = p.proto;

    const elA = document.getElementById('elA');
    const elB = document.getElementById('elB');
    const elC = document.getElementById('elC');
    const lpA = document.getElementById('lpA');
    const lpC = document.getElementById('lpC');

    if (elA && p.elA) elA.value = p.elA;
    if (elB && p.elB) elB.value = p.elB;
    if (elC && p.elC) elC.value = p.elC;
    if (lpA && p.a) lpA.value = Number(p.a).toFixed(3);
    if (lpC && p.c) lpC.value = Number(p.c).toFixed(3);

    this.applyPrototype(p.proto, { commit: true });
    this.ui.log(`Quick load: ${p.note || name}`, 'info');
  }

  // ---------- Settings bindings ----------
  setAtomScale(scale) {
    this.state.settings.atomScale = scale;
    this.renderer.setAtomScale(scale);
  }

  setBondCutoff(cutoff) {
    this.state.settings.bondCutoff = cutoff;
    this.renderer.setBondCutoff(cutoff);
  }

  toggleCell() {
    this.state.settings.showCell = !this.state.settings.showCell;
    this.renderer.toggleCell(this.state.settings.showCell);
    document.getElementById('cellBtn')?.classList.toggle('on', this.state.settings.showCell);
  }

  toggleAxes() {
    this.state.settings.showAxes = !this.state.settings.showAxes;
    this.renderer.toggleAxes(this.state.settings.showAxes);
    document.getElementById('axesBtn')?.classList.toggle('on', this.state.settings.showAxes);
  }

  toggleBonds() {
    this.state.settings.showBonds = !this.state.settings.showBonds;
    this.renderer.toggleBonds(this.state.settings.showBonds);
    document.getElementById('bondsBtn')?.classList.toggle('on', this.state.settings.showBonds);
  }

  togglePoly() {
    this.state.settings.showPoly = !this.state.settings.showPoly;
    this.renderer.togglePoly(this.state.settings.showPoly);
    document.getElementById('polyBtn')?.classList.toggle('on', this.state.settings.showPoly);
  }

  toggleAutoRot() {
    this.state.settings.autoRot = !this.state.settings.autoRot;
    if (this.renderer.controls) {
      this.renderer.controls.autoRotate = this.state.settings.autoRot;
    }
    document.getElementById('autoRotBtn')?.classList.toggle('on', this.state.settings.autoRot);
  }

  toggleTheme() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = dark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('cf-theme', next);

    const icon = document.getElementById('themeIcon');
    const label = document.getElementById('themeLabel');
    if (icon && label) {
      if (next === 'dark') {
        icon.textContent = '☀️';
        label.textContent = 'Light';
      } else {
        icon.textContent = '🌙';
        label.textContent = 'Dark';
      }
    }

    this.renderer.setTheme();

    // Re-theme Plotly quickly.
    const layout = this._getPlotlyLayout(next === 'dark');
    ['pEnergy', 'pRDF', 'pXRD', 'pBonds', 'pCoord', 'pADF'].forEach((id) => {
      try {
        Plotly.relayout(id, { plot_bgcolor: layout.plot_bgcolor, paper_bgcolor: layout.paper_bgcolor, 'font.color': layout.font.color });
      } catch (_) {}
    });
  }

  selectAtom(_idx) {
    // Placeholder for future selection + picking highlight.
    // Keeps list selection event wired for later.
  }
}

// Entry point
window.addEventListener('DOMContentLoaded', () => {
  new CrystalForgeApp();
});

