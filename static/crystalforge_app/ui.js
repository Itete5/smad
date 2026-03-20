// UI rendering & DOM updates.
// Keeps DOM manipulation centralized.
export class CrystalUI {
  constructor({ state, elements }) {
    this.state = state;
    this.el = elements;
    this.selectedAtomId = null;
  }

  setLoading(text) {
    const loading = document.getElementById('loading');
    const t = document.getElementById('l-txt');
    if (t) t.textContent = text;
    if (loading) loading.style.opacity = '1';
  }

  updateStats() {
    const s = this.state;
    const N = s.atoms.length;
    const sg = s.spaceGroup || { num: 1, symbol: 'P1', crystal: 'Triclinic', system: 'triclinic' };
    const V = this._calcVolume();

    const elems = [...new Set(s.atoms.map((a) => a.el))];
    const formula = elems.map((e) => e + s.atoms.filter((a2) => a2.el === e).length).join('');

    const setText = (id, val) => {
      const node = document.getElementById(id);
      if (node) node.textContent = val;
    };

    // HUD
    setText('hudSG', sg.symbol || '—');
    setText('hudN', String(N));
    setText('hudV', isFinite(V) ? `${V.toFixed(2)} Å³` : '—');
    setText('hudA', s.lattice.a.toFixed(3) + ' Å');
    setText('hudB', s.lattice.b.toFixed(3) + ' Å');
    setText('hudC', s.lattice.c.toFixed(3) + ' Å');

    // Bottom stats
    setText('statSG', (sg.symbol || '—') + ' (#' + (sg.num || 1) + ')');
    setText('statFormula', formula || '—');
    setText('statV', isFinite(V) ? V.toFixed(2) : '—');

    // Navbar
    setText('navSG', (sg.symbol || 'P1') + ' (#' + (sg.num || 1) + ')');
    setText('navNAtoms', N + ' atoms');

    // Right panel
    setText('rpN', String(N));
    setText('rpSpec', elems.join(', ') || '—');
    setText('rpSym', sg.symbol || '—');
    setText('rpSys', sg.crystal || '—');
  }

  _calcVolume() {
    // Scientific formula: unit cell volume from lattice parameters.
    const { a, b, c, alpha, beta, gamma } = this.state.lattice;
    const deg2rad = (d) => (d * Math.PI) / 180;
    const cosAl = Math.cos(deg2rad(alpha));
    const cosBe = Math.cos(deg2rad(beta));
    const cosGa = Math.cos(deg2rad(gamma));
    const V = a * b * c * Math.sqrt(Math.max(0, 1 - cosAl * cosAl - cosBe * cosBe - cosGa * cosGa + 2 * cosAl * cosBe * cosGa));
    return V;
  }

  updateLatticeInfo() {
    const s = this.state;
    const V = this._calcVolume();
    const sys = s.spaceGroup?.system || this._crystalSystemFromSG(s.spaceGroup?.num || 1);
    const map = {
      cubic: 'Cubic',
      tetragonal: 'Tetragonal',
      orthorhombic: 'Orthorhombic',
      hexagonal: 'Hexagonal',
      trigonal: 'Trigonal',
      monoclinic: 'Monoclinic',
      triclinic: 'Triclinic',
    };
    const sysLabel = map[sys] || 'Unknown';
    const el = document.getElementById('latticeInfo');
    if (el) el.textContent = `${sysLabel} · V = ${V.toFixed(2)} Å³`;
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

  setAtomTab(tab) {
    const fracPane = document.getElementById('atom-frac');
    const cartPane = document.getElementById('atom-cart');
    const btns = Array.from(document.querySelectorAll('.tbar .tab'));
    if (fracPane) fracPane.classList.toggle('active', tab === 'frac');
    if (cartPane) cartPane.classList.toggle('active', tab === 'cart');
    btns.forEach((b) => b.classList.toggle('active', b.dataset.atomTab === tab));
  }

  setMainTab(tabName) {
    const panes = Array.from(document.querySelectorAll('.main-tab-content'));
    panes.forEach((p) => {
      p.style.display = 'none';
    });

    const tabEl = document.getElementById('tab-' + tabName);
    if (tabEl) tabEl.style.display = 'block';

    const btns = Array.from(document.querySelectorAll('.ntab'));
    btns.forEach((b) => {
      b.classList.toggle('active', b.dataset.mainTab === tabName);
    });
  }

  setPlotTab(plotName) {
    const map = {
      energy: 'pEnergy',
      rdf: 'pRDF',
      xrd: 'pXRD',
      bonds: 'pBonds',
      coord: 'pCoord',
      adf: 'pADF',
    };
    const panes = Array.from(document.querySelectorAll('.ppane'));
    panes.forEach((p) => p.classList.remove('active'));

    const pane = document.getElementById(map[plotName]);
    if (pane) pane.classList.add('active');

    const btns = Array.from(document.querySelectorAll('.ptabs-bar .ptab'));
    btns.forEach((b) => b.classList.toggle('active', b.dataset.plot === plotName));
  }

  renderAtomList() {
    const list = document.getElementById('atomList');
    if (!list) return;

    const atoms = this.state.atoms.slice(0, 200);
    const makeRow = (a, idx) => {
      const elData = this._getEl(a.el);
      return `
        <div class="atom-row" data-atom-id="${idx}" role="button" tabindex="0">
          <div class="atom-swatch" style="background:${elData.color}"></div>
          <div class="atom-sym">${a.el}</div>
          <div class="atom-info">(${a.x.toFixed(3)}, ${a.y.toFixed(3)}, ${a.z.toFixed(3)}) · CN:${a.coord ?? '—'}</div>
        </div>`;
    };

    list.innerHTML =
      atoms.map((a, i) => makeRow(a, i)).join('') +
      (this.state.atoms.length > 200
        ? `<div class="atom-row"><div class="atom-info" style="color:var(--text3)">… ${this.state.atoms.length - 200} more atoms</div></div>`
        : '');
  }

  _getEl(el) {
    return CrystalUI.EL[el] || { color: '#aaaaaa', r: 0.4 };
  }

  log(msg, type = '') {
    const con = document.getElementById('con');
    if (!con) return;

    const s = document.createElement('span');
    if (type) s.className = type;
    s.textContent = '> ' + msg;
    con.appendChild(document.createTextNode('\n'));
    con.appendChild(s);
    con.scrollTop = con.scrollHeight;
  }

  clearLog() {
    const con = document.getElementById('con');
    if (con) con.textContent = '> Log cleared.';
  }
}

CrystalUI.EL = {
  H: { color: '#ffffff' },
  C: { color: '#909090' },
  N: { color: '#3050f8' },
  O: { color: '#ff2020' },
  Na: { color: '#ab5cf2' },
  Mg: { color: '#8aff00' },
  Al: { color: '#bfa6a6' },
  Si: { color: '#f0c060' },
  S: { color: '#ffff30' },
  Cl: { color: '#1ff01f' },
  Ar: { color: '#80d4ff' },
  K: { color: '#8f40d4' },
  Ca: { color: '#3dff00' },
  Ti: { color: '#bfc2c7' },
  Fe: { color: '#e06633' },
  Cu: { color: '#c88033' },
  Zn: { color: '#7d80b0' },
  Ba: { color: '#00c900' },
};

