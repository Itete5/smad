/* global THREE */

export class CrystalRenderer {
  constructor({ state, elements }) {
    this.state = state;
    this.canvas = elements.canvas;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b0f14);

    this.atomMeshes = [];
    this.bondMeshes = [];
  }

  init() {
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(6, 6, 6);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // Controls (OrbitControls.js is loaded globally by the HTML template)
    this.controls = null;
    if (THREE.OrbitControls) {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
    }

    // Lighting
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(5, 5, 5);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
    light2.position.set(-5, -5, -5);

    const ambient = new THREE.AmbientLight(0xffffff, 0.3);

    this.scene.add(light1, light2, ambient);

    window.addEventListener('resize', () => this._resize());
    this.initPicking();
  }

  // ---------- COLORS ----------
  getElementColor(el) {
    const colors = {
      C: 0x444444,
      O: 0xff0000,
      H: 0xffffff,
      Cu: 0xb87333,
      Fe: 0xffa500,
      A: 0x3399ff,
    };
    return colors[el] || 0xaaaaaa;
  }

  // ---------- RENDER ----------
  renderStructure() {
    this._clearScene();

    this._drawAtoms();
    this._drawBonds();
    this._drawUnitCell();
  }

  _drawAtoms() {
    this.atomMeshes = [];

    this.state.atoms.forEach((atom) => {
      const geom = new THREE.SphereGeometry(0.25, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        color: this.getElementColor(atom.element),
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(atom.x, atom.y, atom.z);

      mesh.userData = atom;

      this.scene.add(mesh);
      this.atomMeshes.push(mesh);
    });
  }

  _drawBonds() {
    const cutoff = 2.2;
    this.bondMeshes = [];

    for (let i = 0; i < this.state.atoms.length; i++) {
      for (let j = i + 1; j < this.state.atoms.length; j++) {
        const a = this.state.atoms[i];
        const b = this.state.atoms[j];

        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;

        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < cutoff) {
          const bond = this._createBond(a, b);
          this.scene.add(bond);
          this.bondMeshes.push(bond);
        }
      }
    }
  }

  _createBond(a, b) {
    const start = new THREE.Vector3(a.x, a.y, a.z);
    const end = new THREE.Vector3(b.x, b.y, b.z);

    const dir = new THREE.Vector3().subVectors(end, start);
    const length = dir.length();

    const geom = new THREE.CylinderGeometry(0.05, 0.05, length, 16);
    const mat = new THREE.MeshStandardMaterial({ color: 0xcccccc });

    const bond = new THREE.Mesh(geom, mat);

    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    bond.position.copy(mid);

    bond.lookAt(end);
    bond.rotateX(Math.PI / 2);

    return bond;
  }

  _drawUnitCell() {
    const a = this.state.lattice.a || 4;

    const geom = new THREE.BoxGeometry(a, a, a);
    const edges = new THREE.EdgesGeometry(geom);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));

    line.position.set(a / 2, a / 2, a / 2);

    this.scene.add(line);
  }

  _clearScene() {
    // Keep lights, remove all other objects.
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      const obj = this.scene.children[i];
      if (!obj.isLight) this.scene.remove(obj);
    }
    this.atomMeshes = [];
    this.bondMeshes = [];
  }

  // ---------- LOOP ----------
  animate() {
    const loop = () => {
      requestAnimationFrame(loop);

      if (this.controls) this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }

  _resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  initPicking() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    window.addEventListener('click', (event) => {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      const intersects = this.raycaster.intersectObjects(this.atomMeshes);

      if (intersects.length > 0) {
        const atom = intersects[0].object.userData;
        alert(`Atom: ${atom.element}\n(${atom.x.toFixed(2)}, ${atom.y.toFixed(2)}, ${atom.z.toFixed(2)})`);
      }
    });
  }
}

