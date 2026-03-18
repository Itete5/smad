/**
 * MD Visualization Module (Three.js WebGL)
 * Instanced sphere geometry for atoms, color by element / coordination / velocity / potential / defect,
 * optional bonds, simulation box, real-time rotation/zoom/selection.
 */
(function (global) {
  'use strict';

  const THREE = global.THREE;
  if (!THREE) {
    console.warn('MDVisualization: Three.js not loaded');
    return;
  }

  const ELEMENT_COLORS = {
    Ar: 0x80d4ff, Ne: 0xb3e0ff, Kr: 0x5cb8d1, Cu: 0xc88033, Fe: 0xe06633,
    Na: 0xab5cf2, Cl: 0x1ff01f, Si: 0xf0b342, Zn: 0x7d80b0, S: 0xffb347,
    C: 0x555555, O: 0xff4444, A: 0x80d4ff, B: 0xf58fff
  };

  function velocityToColor(vmag, vmin, vmax) {
    const t = vmax > vmin ? Math.max(0, Math.min(1, (vmag - vmin) / (vmax - vmin))) : 0;
    const r = Math.round(79 + t * 176);
    const g = Math.round(143 + t * 112);
    const b = 255;
    return (r << 16) | (g << 8) | b;
  }

  function valueToColor(v, vmin, vmax, r0, g0, b0, r1, g1, b1) {
    const t = vmax > vmin ? Math.max(0, Math.min(1, (v - vmin) / (vmax - vmin))) : 0;
    const r = Math.round(r0 + t * (r1 - r0));
    const g = Math.round(g0 + t * (g1 - g0));
    const b = Math.round(b0 + t * (b1 - b0));
    return (r << 16) | (g << 8) | b;
  }

  function createViewer(container, options) {
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1117);
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 10000);
    camera.position.set(80, 80, 80);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(2, global.devicePixelRatio || 1));
    container.appendChild(renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 0.9);
    light.position.set(50, 50, 50);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x4466aa, 0.4));

    const controls = {
      rotX: 0.35, rotY: 0.45, zoom: 1,
      dragging: false, lastX: 0, lastY: 0,
      onMouseDown(e) { controls.dragging = true; controls.lastX = e.clientX; controls.lastY = e.clientY; },
      onMouseMove(e) {
        if (!controls.dragging) return;
        controls.rotY += (e.clientX - controls.lastX) * 0.01;
        controls.rotX += (e.clientY - controls.lastY) * 0.01;
        controls.lastX = e.clientX; controls.lastY = e.clientY;
      },
      onMouseUp() { controls.dragging = false; },
      onWheel(e) {
        e.preventDefault();
        controls.zoom *= e.deltaY > 0 ? 1.1 : 1 / 1.1;
        controls.zoom = Math.max(0.1, Math.min(10, controls.zoom));
      }
    };
    renderer.domElement.addEventListener('mousedown', controls.onMouseDown);
    renderer.domElement.addEventListener('wheel', controls.onWheel, { passive: false });
    if (container && container !== renderer.domElement) {
      container.style.cursor = 'grab';
      container.addEventListener('mousedown', controls.onMouseDown);
      container.addEventListener('wheel', controls.onWheel, { passive: false });
    }
    global.addEventListener('mousemove', controls.onMouseMove);
    global.addEventListener('mouseup', controls.onMouseUp);

    const state = {
      scene, camera, renderer, controls,
      atomMeshes: [],
      bondLines: null,
      boxLines: null,
      colorBy: options?.colorBy || 'element',
      atomScale: options?.atomScale ?? 1,
      showBox: options?.showBox !== false,
      showBonds: options?.showBonds || false,
      bondCutoff: options?.bondCutoff ?? 1.2,
      elementColors: options?.elementColors || ELEMENT_COLORS,
      center: new THREE.Vector3(0, 0, 0)
    };

    function render() {
      const dist = 150 * state.controls.zoom;
      const cx = state.center.x, cy = state.center.y, cz = state.center.z;
      const cosY = Math.cos(state.controls.rotY), sinY = Math.sin(state.controls.rotY);
      const cosX = Math.cos(state.controls.rotX), sinX = Math.sin(state.controls.rotX);
      state.camera.position.set(
        cx + dist * (cosY * Math.cos(state.controls.rotX)),
        cy + dist * sinX,
        cz + dist * (sinY * Math.cos(state.controls.rotX))
      );
      state.camera.lookAt(cx, cy, cz);
      state.renderer.render(state.scene, state.camera);
    }

    function setStructure(atoms, box, options) {
      options = options || {};
      const colorBy = options.colorBy ?? state.colorBy;
      const atomScale = options.atomScale ?? state.atomScale;
      const showBox = options.showBox !== undefined ? options.showBox : state.showBox;
      const showBonds = options.showBonds !== undefined ? options.showBonds : state.showBonds;
      const bondCutoff = options.bondCutoff ?? state.bondCutoff;

      state.atomMeshes.forEach(m => {
        state.scene.remove(m);
        if (m.geometry) m.geometry.dispose();
        if (m.material) m.material.dispose();
      });
      state.atomMeshes = [];
      if (state.bondLines) {
        state.scene.remove(state.bondLines);
        state.bondLines.geometry.dispose();
        state.bondLines.material.dispose();
        state.bondLines = null;
      }
      if (state.boxLines) {
        state.scene.remove(state.boxLines);
        state.boxLines.geometry.dispose();
        state.boxLines.material.dispose();
        state.boxLines = null;
      }

      if (!atoms || !atoms.length) {
        render();
        return;
      }

      const half = box ? [box[0] / 2, box[1] / 2, box[2] / 2] : [0, 0, 0];
      let vmin = 0, vmax = 1;
      if (colorBy === 'velocity') {
        atoms.forEach(a => {
          const v = Math.sqrt(a.vx * a.vx + a.vy * a.vy + a.vz * a.vz);
          vmax = Math.max(vmax, v);
        });
      }
      if (colorBy === 'coordination' && atoms[0].cn != null) {
        atoms.forEach(a => { vmax = Math.max(vmax, a.cn || 0); });
      }
      if (colorBy === 'potential' && atoms[0].epot != null) {
        atoms.forEach(a => { vmax = Math.max(vmax, a.epot || 0); vmin = Math.min(vmin, a.epot || 0); });
      }

      const radius = 0.4 * atomScale;
      const byElement = {};
      atoms.forEach((a, i) => {
        const sym = a.element || 'A';
        if (!byElement[sym]) byElement[sym] = [];
        byElement[sym].push({ ...a, id: i });
      });

      Object.entries(byElement).forEach(([sym, list]) => {
        const geometry = new THREE.SphereGeometry(radius, 12, 10);
        const material = new THREE.MeshPhongMaterial({
          color: state.elementColors[sym] || 0x88aacc,
          shininess: 30,
          specular: 0x222222
        });
        const mesh = new THREE.InstancedMesh(geometry, material, list.length);
        const matrix = new THREE.Matrix4();
        const color = new THREE.Color();
        list.forEach((a, i) => {
          let col = state.elementColors[sym] || 0x88aacc;
          if (colorBy === 'velocity') {
            const v = Math.sqrt(a.vx * a.vx + a.vy * a.vy + a.vz * a.vz);
            col = velocityToColor(v, 0, vmax);
          } else if (colorBy === 'coordination' && a.cn != null) {
            col = valueToColor(a.cn, 0, vmax, 100, 100, 255, 255, 100, 100);
          } else if (colorBy === 'potential' && a.epot != null) {
            col = valueToColor(a.epot, vmin, vmax, 255, 100, 100, 100, 100, 255);
          } else if (colorBy === 'defect' && a.defect != null) {
            col = a.defect > 0.1 ? 0xff4444 : 0x88aacc;
          }
          color.setHex(col);
          matrix.setPosition(a.x - half[0], a.y - half[1], a.z - half[2]);
          mesh.setMatrixAt(i, matrix);
          if (mesh.instanceColor) mesh.setColorAt(i, color);
        });
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        if (mesh.instanceColor) {
          mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
        }
        state.scene.add(mesh);
        state.atomMeshes.push(mesh);
      });

      if (showBonds && atoms.length < 8000) {
        const bondList = [];
        const sig = atoms[0].sig || 1;
        const cut = bondCutoff * sig * 1.5;
        for (let i = 0; i < atoms.length; i++) {
          for (let j = i + 1; j < atoms.length; j++) {
            const dx = atoms[j].x - atoms[i].x, dy = atoms[j].y - atoms[i].y, dz = atoms[j].z - atoms[i].z;
            const bx = box ? box[0] : 1e10, by = box ? box[1] : 1e10, bz = box ? box[2] : 1e10;
            const dx2 = dx - Math.round(dx / bx) * bx;
            const dy2 = dy - Math.round(dy / by) * by;
            const dz2 = dz - Math.round(dz / bz) * bz;
            const r = Math.sqrt(dx2 * dx2 + dy2 * dy2 + dz2 * dz2);
            if (r <= cut && r > 0.1) bondList.push([atoms[i], atoms[j], dx2, dy2, dz2]);
          }
        }
        if (bondList.length < 50000) {
          const points = [];
          bondList.forEach(([a, b, dx, dy, dz]) => {
            points.push(a.x - half[0], a.y - half[1], a.z - half[2]);
            points.push(a.x - half[0] + dx, a.y - half[1] + dy, a.z - half[2] + dz);
          });
          const geom = new THREE.BufferGeometry();
          geom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
          geom.setIndex(Array.from({ length: bondList.length * 2 }, (_, i) => i));
          const lineMat = new THREE.LineBasicMaterial({ color: 0x6688aa });
          state.bondLines = new THREE.LineSegments(geom, lineMat);
          state.scene.add(state.bondLines);
        }
      }

      if (showBox && box) {
        const [hx, hy, hz] = half;
        const pts = [
          -hx, -hy, -hz, hx, -hy, -hz,   hx, -hy, -hz, hx, hy, -hz,   hx, hy, -hz, -hx, hy, -hz,   -hx, hy, -hz, -hx, -hy, -hz,
          -hx, -hy, hz, hx, -hy, hz,   hx, -hy, hz, hx, hy, hz,   hx, hy, hz, -hx, hy, hz,   -hx, hy, hz, -hx, -hy, hz,
          -hx, -hy, -hz, -hx, -hy, hz,   hx, -hy, -hz, hx, -hy, hz,   hx, hy, -hz, hx, hy, hz,   -hx, hy, -hz, -hx, hy, hz
        ];
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        state.boxLines = new THREE.LineSegments(geom, new THREE.LineBasicMaterial({ color: 0x4f8fff }));
        state.scene.add(state.boxLines);
      }

      let cx = 0, cy = 0, cz = 0;
      atoms.forEach(a => { cx += a.x; cy += a.y; cz += a.z; });
      state.center.set(cx / atoms.length - half[0], cy / atoms.length - half[1], cz / atoms.length - half[2]);
      render();
    }

    function setSize(w, h) {
      state.renderer.setSize(w, h);
      state.camera.aspect = w / h;
      state.camera.updateProjectionMatrix();
      render();
    }

    function resetView() {
      state.controls.rotX = 0.35;
      state.controls.rotY = 0.45;
      state.controls.zoom = 1;
      render();
    }

    const api = {
      setStructure,
      render,
      setSize,
      resetView,
      getScene: () => state.scene,
      getCamera: () => state.camera,
      getRenderer: () => state.renderer
    };

    return api;
  }

  const MDVisualization = {
    createViewer,
    ELEMENT_COLORS,
    velocityToColor,
    valueToColor
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = MDVisualization;
  else global.MDVisualization = MDVisualization;
})(typeof self !== 'undefined' ? self : this);
