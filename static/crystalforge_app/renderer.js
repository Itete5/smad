/* global THREE */

// Three.js renderer for CrystalForge.
// Keeps rendering logic isolated and exposes:
// - renderAtoms()
// - updateScene()
export class CrystalRenderer {
  constructor({ state, elements, onLog = () => {} }) {
    this.state = state;
    this.el = elements;
    this.onLog = onLog;

    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;

    this.axesHelper = null;
    this.cellMesh = null;

    this.instancedByEl = new Map();
    this._dummy = new THREE.Object3D();

    this.bondMesh = null;
    this.polyMesh = null;

    this._needsRebuild = true;
    this._atomsHash = '';
  }

  initThree() {
    const wrap = this.el.threeWrap;
    const canvas = this.el.threeCanvas;

    const W = wrap.clientWidth || 800;
    const H = wrap.clientHeight || 500;

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(this._isDark() ? 0x010306 : 0x0d1117, 1);
    this.renderer.setSize(W, H);

    this.camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 2000);
    this.camera.position.set(0, 0, 60);

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.AmbientLight(0x304060, 0.7));

    const d1 = new THREE.DirectionalLight(0xffffff, 0.8);
    d1.position.set(2, 3, 4);
    this.scene.add(d1);

    const d2 = new THREE.DirectionalLight(0x00aaff, 0.35);
    d2.position.set(-3, -2, -2);
    this.scene.add(d2);

    const d3 = new THREE.DirectionalLight(0xffaa00, 0.2);
    d3.position.set(1, -3, 2);
    this.scene.add(d3);

    // OrbitControls is loaded via non-module script (OrbitControls.js).
    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, canvas);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.enablePan = false;
      this.controls.autoRotate = !!this.state.settings.autoRot;
      this.controls.autoRotateSpeed = 1.5;
    }

    this.axesHelper = new THREE.AxesHelper(6);
    this.axesHelper.position.set(0, 0, 0);
    this.scene.add(this.axesHelper);

    this.updateScene();

    // Resize
    window.addEventListener('resize', () => this._resize());
    this._resize();
  }

  _isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  _resize() {
    if (!this.renderer || !this.camera) return;
    const wrap = this.el.threeWrap;
    const W = wrap.clientWidth || 800;
    const H = wrap.clientHeight || 500;
    this.renderer.setSize(W, H);
    this.camera.aspect = W / H;
    this.camera.updateProjectionMatrix();
  }

  // ---------- Math helpers (use state matrices) ----------
  degToRad(d) {
    return (d * Math.PI) / 180;
  }

  fracToCart(dx, dy, dz) {
    // Multiply by orthogonalization matrix stored in state._M.
    const M = this.state._M;
    if (!M) return [0, 0, 0];
    return [
      M[0][0] * dx + M[0][1] * dy + M[0][2] * dz,
      M[1][0] * dx + M[1][1] * dy + M[1][2] * dz,
      M[2][0] * dx + M[2][1] * dy + M[2][2] * dz,
    ];
  }

  _fitToStructure() {
    const { a = 1, b = 1, c = 1 } = this.state.lattice || {};
    const safe = Math.max(a, b, c, 2.5);
    const dist = Math.max(safe * 2.6, 10);

    // Axes length scales with unit cell size.
    const axesLen = safe * 0.55;
    const scale = axesLen / 6;
    this.axesHelper.scale.setScalar(scale);

    this.camera.position.set(0, 0, dist / (this.state.settings.zoom ?? 1));
    if (this.controls) {
      this.controls.target.set(0, 0, 0);
      this.controls.update();
    }
  }

  _atomicRadius(el) {
    // Minimal subset; extend later from full periodic table dataset.
    const e = CrystalRenderer.EL[el];
    return (e?.r ?? 0.5) * 3.2; // tuned to be visually large enough
  }

  _atomicColor(el) {
    const e = CrystalRenderer.EL[el];
    const c = e?.color ?? '#aaaaaa';
    return new THREE.Color(c);
  }

  // ---------- Public API ----------
  renderAtoms() {
    // Rebuild when atom list changes shape (elements/count).
    const atoms = this.state.atoms || [];
    const hash = atoms.length + '|' + atoms.map((a) => a.el).join(',');

    if (!atoms.length) {
      // Fully clear instanced meshes when structure is empty.
      for (const [, obj] of this.instancedByEl.entries()) {
        this.scene.remove(obj.mesh);
        obj.mesh.geometry.dispose();
        obj.mesh.material.dispose();
      }
      this.instancedByEl.clear();
      this._atomsHash = '';
      this._needsRebuild = false;
      // Bonds/poly are handled in updateScene().
      return;
    }

    if (hash !== this._atomsHash) {
      this._atomsHash = hash;
      this._needsRebuild = true;
    }

    if (this._needsRebuild) {
      this._rebuildInstancedMeshes();
      this._needsRebuild = false;
    } else {
      // Update matrices without recreating geometries.
      this._updateInstancedMatrices();
    }
  }

  updateScene() {
    if (!this.scene) return;
    this._fitToStructure();

    // Axes visibility
    if (this.axesHelper) this.axesHelper.visible = !!this.state.settings.showAxes;

    // Cell lines
    if (this.cellMesh) {
      this.cellMesh.visible = !!this.state.settings.showCell;
    } else {
      this._buildCellMesh();
    }

    // Toggle auto-rotation in controls
    if (this.controls) {
      this.controls.autoRotate = !!this.state.settings.autoRot;
    }

    // Bonds/poly updates are potentially expensive; update only when enabled.
    if (this.state.settings.showBonds) this.updateBonds();
    if (this.state.settings.showPoly) this.updatePoly();
    if (!this.state.settings.showBonds && this.bondMesh) {
      this.scene.remove(this.bondMesh);
      this.bondMesh.geometry.dispose();
      if (this.bondMesh.material) this.bondMesh.material.dispose();
      this.bondMesh = null;
    }
    if (!this.state.settings.showPoly && this.polyMesh) {
      this.scene.remove(this.polyMesh);
      this.polyMesh.geometry.dispose();
      if (this.polyMesh.material) this.polyMesh.material.dispose();
      this.polyMesh = null;
    }
  }

  resetCamera() {
    this._fitToStructure();
  }

  setTheme() {
    if (!this.renderer) return;
    this.renderer.setClearColor(this._isDark() ? 0x010306 : 0x0d1117, 1);
  }

  captureScene() {
    if (!this.renderer) return;
    this.renderer.render(this.scene, this.camera);
    const link = document.createElement('a');
    link.download = 'crystalforge_structure.png';
    link.href = this.renderer.domElement.toDataURL('image/png');
    link.click();
  }

  toggleCell(visible) {
    this.state.settings.showCell = !!visible;
    if (this.cellMesh) this.cellMesh.visible = this.state.settings.showCell;
  }

  toggleAxes(visible) {
    this.state.settings.showAxes = !!visible;
    if (this.axesHelper) this.axesHelper.visible = this.state.settings.showAxes;
  }

  toggleBonds(visible) {
    this.state.settings.showBonds = !!visible;
    if (this.state.settings.showBonds) this.updateBonds();
    else if (this.bondMesh) {
      this.scene.remove(this.bondMesh);
      this.bondMesh.geometry.dispose();
      if (this.bondMesh.material) this.bondMesh.material.dispose();
      this.bondMesh = null;
    }
  }

  togglePoly(visible) {
    this.state.settings.showPoly = !!visible;
    if (this.state.settings.showPoly) this.updatePoly();
    else if (this.polyMesh) {
      this.scene.remove(this.polyMesh);
      this.polyMesh.geometry.dispose();
      if (this.polyMesh.material) this.polyMesh.material.dispose();
      this.polyMesh = null;
    }
  }

  setAtomScale(scale) {
    this.state.settings.atomScale = scale;
    this._needsRebuild = true;
    this.renderAtoms();
  }

  setBondCutoff(cutoff) {
    this.state.settings.bondCutoff = cutoff;
    if (this.state.settings.showBonds) this.updateBonds();
    if (this.state.settings.showPoly) this.updatePoly();
  }

  // ---------- Internal rendering ----------
  _rebuildInstancedMeshes() {
    // Remove old instanced meshes
    for (const [, obj] of this.instancedByEl.entries()) {
      this.scene.remove(obj.mesh);
      obj.mesh.geometry.dispose();
      obj.mesh.material.dispose();
    }
    this.instancedByEl.clear();

    const atoms = this.state.atoms;
    const byEl = new Map();
    atoms.forEach((a, idx) => {
      const el = a.el || 'X';
      if (!byEl.has(el)) byEl.set(el, []);
      byEl.get(el).push(idx);
    });

    const atomScale = this.state.settings.atomScale ?? 0.4;
    const cx = this.state.lattice.a / 2;
    const cy = this.state.lattice.b / 2;
    const cz = this.state.lattice.c / 2;

    for (const [el, idxs] of byEl.entries()) {
      const r = this._atomicRadius(el) * atomScale;
      const geo = new THREE.SphereGeometry(r, 14, 10);
      const mat = new THREE.MeshPhongMaterial({
        color: this._atomicColor(el),
        shininess: 80,
        specular: new THREE.Color(0.3, 0.3, 0.3),
      });

      const mesh = new THREE.InstancedMesh(geo, mat, idxs.length);
      mesh.userData = { el, idxs };
      this.scene.add(mesh);
      this.instancedByEl.set(el, { mesh, idxs });
    }

    this._updateInstancedMatrices();
    this._buildCellMesh();
  }

  _updateInstancedMatrices() {
    const atoms = this.state.atoms;
    const cx = this.state.lattice.a / 2;
    const cy = this.state.lattice.b / 2;
    const cz = this.state.lattice.c / 2;

    for (const [, { mesh, idxs }] of this.instancedByEl.entries()) {
      idxs.forEach((atomIdx, localIdx) => {
        const a = atoms[atomIdx];
        const x = (a.x ?? 0);
        const y = (a.y ?? 0);
        const z = (a.z ?? 0);
        const [fx, fy, fz] = this.fracToCart(x, y, z);
        this._dummy.position.set(fx - cx, fy - cy, fz - cz);
        this._dummy.updateMatrix();
        mesh.setMatrixAt(localIdx, this._dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
    }
  }

  _buildCellMesh() {
    if (!this.state._M) return;
    if (this.cellMesh) {
      this.scene.remove(this.cellMesh);
      this.cellMesh.geometry.dispose();
      if (this.cellMesh.material) this.cellMesh.material.dispose();
      this.cellMesh = null;
    }

    const { a, b, c } = this.state.lattice;
    const cx = a / 2;
    const cy = b / 2;
    const cz = c / 2;

    const v = (fx, fy, fz) => {
      const [x, y, z] = this.fracToCart(fx, fy, fz);
      return new THREE.Vector3(x - cx, y - cy, z - cz);
    };

    const pts = [
      v(0, 0, 0),
      v(1, 0, 0),
      v(1, 1, 0),
      v(0, 1, 0),
      v(0, 0, 1),
      v(1, 0, 1),
      v(1, 1, 1),
      v(0, 1, 1),
    ];
    const edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],
      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ];

    const positions = [];
    edges.forEach(([i, j]) => {
      positions.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
    });

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    this.cellMesh = new THREE.LineSegments(
      geo,
      new THREE.LineBasicMaterial({ color: 0x00d4c8, opacity: 0.35, transparent: true })
    );
    this.cellMesh.visible = !!this.state.settings.showCell;
    this.scene.add(this.cellMesh);
  }

  _minImageDist2Frac(a, b) {
    // Minimum image in fractional space then convert delta to Cartesian via state._M.
    let dx = (a.x ?? 0) - (b.x ?? 0);
    let dy = (a.y ?? 0) - (b.y ?? 0);
    let dz = (a.z ?? 0) - (b.z ?? 0);
    dx -= Math.round(dx);
    dy -= Math.round(dy);
    dz -= Math.round(dz);

    const [cx, cy, cz] = this.fracToCart(dx, dy, dz);
    return cx * cx + cy * cy + cz * cz;
  }

  updateBonds() {
    if (!this.state.settings.showBonds) return;
    if (this.bondMesh) {
      this.scene.remove(this.bondMesh);
      this.bondMesh.geometry.dispose();
      if (this.bondMesh.material) this.bondMesh.material.dispose();
      this.bondMesh = null;
    }

    const atoms = this.state.atoms;
    const n = Math.min(atoms.length, 320); // throttle complexity
    if (n < 2) return;

    const cutoff = this.state.settings.bondCutoff ?? 3.2;
    const cutoff2 = cutoff * cutoff;
    const rmin2 = 0.36; // ~0.6Å

    const cx = this.state.lattice.a / 2;
    const cy = this.state.lattice.b / 2;
    const cz = this.state.lattice.c / 2;

    const positions = [];
    const colors = [];
    let bondCount = 0;
    const maxBonds = 9000;

    for (let i = 0; i < n - 1; i++) {
      for (let j = i + 1; j < n; j++) {
        const d2 = this._minImageDist2Frac(atoms[i], atoms[j]);
        if (d2 < rmin2 || d2 > cutoff2) continue;

        // Add segment endpoints
        const ai = atoms[i];
        const aj = atoms[j];
        positions.push(ai.cx - cx, ai.cy - cy, ai.cz - cz);
        positions.push(aj.cx - cx, aj.cy - cy, aj.cz - cz);

        // Bond accent color
        colors.push(0.1, 0.6, 0.9, 0.1, 0.6, 0.9);
        bondCount++;
        if (bondCount >= maxBonds) break;
      }
      if (bondCount >= maxBonds) break;
    }

    if (!positions.length) return;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.65 });
    this.bondMesh = new THREE.LineSegments(geo, mat);
    this.scene.add(this.bondMesh);
  }

  updatePoly() {
    if (!this.state.settings.showPoly) return;
    if (this.polyMesh) {
      this.scene.remove(this.polyMesh);
      this.polyMesh.geometry.dispose();
      if (this.polyMesh.material) this.polyMesh.material.dispose();
      this.polyMesh = null;
    }

    const atoms = this.state.atoms;
    if (atoms.length < 2) return;

    const cutoff = this.state.settings.bondCutoff ?? 3.2;
    const cutoff2 = cutoff * cutoff;
    const rmin2 = 0.36;

    const central = atoms[0];
    const cx0 = this.state.lattice.a / 2;
    const cy0 = this.state.lattice.b / 2;
    const cz0 = this.state.lattice.c / 2;

    const positions = [];
    const colors = [];

    for (let j = 1; j < atoms.length; j++) {
      const d2 = this._minImageDist2Frac(central, atoms[j]);
      if (d2 < rmin2 || d2 > cutoff2) continue;

      const aj = atoms[j];
      positions.push(central.cx - cx0, central.cy - cy0, central.cz - cz0);
      positions.push(aj.cx - cx0, aj.cy - cy0, aj.cz - cz0);
      colors.push(0.42, 0.23, 0.82, 0.42, 0.23, 0.82);
    }

    if (!positions.length) return;

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const mat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.55 });
    this.polyMesh = new THREE.LineSegments(geo, mat);
    this.scene.add(this.polyMesh);
  }

  // Render loop
  startLoop() {
    const loop = () => {
      requestAnimationFrame(loop);
      if (this.controls) this.controls.update();
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };
    loop();
  }
}

CrystalRenderer.EL = {
  H: { color: '#ffffff', r: 0.25 },
  C: { color: '#909090', r: 0.38 },
  N: { color: '#3050f8', r: 0.36 },
  O: { color: '#ff2020', r: 0.34 },
  Na: { color: '#ab5cf2', r: 0.55 },
  Mg: { color: '#8aff00', r: 0.50 },
  Al: { color: '#bfa6a6', r: 0.50 },
  Si: { color: '#f0c060', r: 0.48 },
  S: { color: '#ffff30', r: 0.44 },
  Cl: { color: '#1ff01f', r: 0.44 },
  Ti: { color: '#bfc2c7', r: 0.52 },
  Fe: { color: '#e06633', r: 0.50 },
  Cu: { color: '#c88033', r: 0.48 },
  Zn: { color: '#7d80b0', r: 0.48 },
  Ba: { color: '#00c900', r: 0.63 },
  Ar: { color: '#80d4ff', r: 0.45 },
  K: { color: '#8f40d4', r: 0.62 },
  V: { color: '#7d80b0', r: 0.5 },
  // Fallback handled by renderer.
};

