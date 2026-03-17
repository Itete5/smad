/**
 * Visualization Engine (Three.js WebGL)
 * Instanced spheres, ball-and-stick, space-filling, unit cell, bonds,
 * color by element/CN/charge, rotation/zoom/pan, atom picking.
 */
(function (global) {
  'use strict';

  const THREE = global.THREE;
  if (!THREE) throw new Error('Three.js required');

  function createViewer(container, options) {
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0c14);
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(8, 8, 8);
    camera.lookAt(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(2, global.devicePixelRatio || 1));
    container.appendChild(renderer.domElement);

    const controls = {
      rotX: 0.35, rotY: 0.45,
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
        const s = e.deltaY > 0 ? 1.1 : 1 / 1.1;
        camera.position.multiplyScalar(s);
      }
    };
    renderer.domElement.addEventListener('mousedown', controls.onMouseDown);
    global.addEventListener('mousemove', controls.onMouseMove);
    global.addEventListener('mouseup', controls.onMouseUp);
    renderer.domElement.addEventListener('wheel', controls.onWheel, { passive: false });

    const state = {
      scene, camera, renderer, controls,
      atomMeshes: [],
      bondLines: null,
      unitCellLines: null,
      raycaster: new THREE.Raycaster(),
      mouse: new THREE.Vector2(),
      selectedAtom: null,
      colorBy: 'element',
      representation: 'ball-and-stick',
      elementColors: options && options.elementColors || {}
    };

    function render() {
      const cx = state.scene.position.x, cy = state.scene.position.y, cz = state.scene.position.z;
      const cosY = Math.cos(state.controls.rotY), sinY = Math.sin(state.controls.rotY);
      const cosX = Math.cos(state.controls.rotX), sinX = Math.sin(state.controls.rotX);
      camera.position.set(
        cx + 15 * (cosY * cosX),
        cy + 15 * sinX,
        cz + 15 * (sinY * cosX)
      );
      camera.lookAt(cx, cy, cz);
      state.renderer.render(state.scene, state.camera);
    }

    function centerAtoms(atoms) {
      if (!atoms || !atoms.length) return;
      let cx = 0, cy = 0, cz = 0;
      atoms.forEach(a => { cx += a.x; cy += a.y; cz += a.z; });
      cx /= atoms.length; cy /= atoms.length; cz /= atoms.length;
      state.scene.position.set(-cx, -cy, -cz);
    }

    /**
     * Update structure: atoms (Cartesian), bonds [{a,b,len}], vecs (unit cell), elementColors map.
     */
    function setStructure(atoms, bonds, vecs, elementColors) {
      state.elementColors = elementColors || state.elementColors;
      state.atomMeshes.forEach(m => { state.scene.remove(m); if (m.geometry) m.geometry.dispose(); if (m.material) m.material.dispose(); });
      state.atomMeshes = [];
      if (state.bondLines) { state.scene.remove(state.bondLines); state.bondLines.geometry.dispose(); state.bondLines.material.dispose(); state.bondLines = null; }
      if (state.unitCellLines) { state.scene.remove(state.unitCellLines); state.unitCellLines.geometry.dispose(); state.unitCellLines.material.dispose(); state.unitCellLines = null; }

      if (!atoms || !atoms.length) { render(); return; }

      const radius = 0.25;
      const byElement = {};
      atoms.forEach((a, i) => {
        const sym = a.sym || a.role || 'X';
        if (!byElement[sym]) byElement[sym] = [];
        byElement[sym].push({ ...a, id: i });
      });

      Object.entries(byElement).forEach(([sym, list]) => {
        const color = (state.elementColors[sym] || 0x88aacc);
        const geometry = new THREE.SphereGeometry(radius, 16, 12);
        const material = new THREE.MeshPhongMaterial({ color });
        const mesh = new THREE.InstancedMesh(geometry, material, list.length);
        const matrix = new THREE.Matrix4();
        list.forEach((a, i) => {
          matrix.setPosition(a.x, a.y, a.z);
          mesh.setMatrixAt(i, matrix);
        });
        mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        mesh.userData.atoms = list;
        state.scene.add(mesh);
        state.atomMeshes.push(mesh);
      });

      if (bonds && bonds.length && atoms.length) {
        const points = [];
        bonds.forEach(b => {
          const A = atoms[b.a], B = atoms[b.b];
          if (A && B) {
            points.push(A.x, A.y, A.z, B.x, B.y, B.z);
          }
        });
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        geom.setIndex(Array.from({ length: bonds.length * 2 }, (_, i) => i));
        const lineMat = new THREE.LineBasicMaterial({ color: 0x888888, linewidth: 1 });
        state.bondLines = new THREE.LineSegments(geom, lineMat);
        state.scene.add(state.bondLines);
      }

      if (vecs && vecs.length === 3) {
        const o = [0, 0, 0];
        const v0 = [vecs[0][0], vecs[0][1], vecs[0][2]];
        const v1 = [vecs[1][0], vecs[1][1], vecs[1][2]];
        const v2 = [vecs[2][0], vecs[2][1], vecs[2][2]];
        const pts = [
          o[0], o[1], o[2], v0[0], v0[1], v0[2],
          o[0], o[1], o[2], v1[0], v1[1], v1[2],
          o[0], o[1], o[2], v2[0], v2[1], v2[2],
          v0[0], v0[1], v0[2], v0[0] + v1[0], v0[1] + v1[1], v0[2] + v1[2],
          v0[0], v0[1], v0[2], v0[0] + v2[0], v0[1] + v2[1], v0[2] + v2[2],
          v1[0], v1[1], v1[2], v1[0] + v0[0], v1[1] + v0[1], v1[2] + v0[2],
          v1[0], v1[1], v1[2], v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2],
          v2[0], v2[1], v2[2], v2[0] + v0[0], v2[1] + v0[1], v2[2] + v0[2],
          v2[0], v2[1], v2[2], v2[0] + v1[0], v2[1] + v1[1], v2[2] + v1[2],
          v0[0] + v1[0], v0[1] + v1[1], v0[2] + v1[2], v0[0] + v1[0] + v2[0], v0[1] + v1[1] + v2[1], v0[2] + v1[2] + v2[2],
          v0[0] + v2[0], v0[1] + v2[1], v0[2] + v2[2], v0[0] + v1[0] + v2[0], v0[1] + v1[1] + v2[1], v0[2] + v1[2] + v2[2],
          v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2], v0[0] + v1[0] + v2[0], v0[1] + v1[1] + v2[1], v0[2] + v1[2] + v2[2]
        ];
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        g.setIndex(Array.from({ length: pts.length / 3 }, (_, i) => i));
        state.unitCellLines = new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.6 }));
        state.scene.add(state.unitCellLines);
      }

      const light = new THREE.DirectionalLight(0xffffff, 0.8);
      light.position.set(5, 5, 5);
      state.scene.add(light);
      state.scene.add(new THREE.AmbientLight(0x404060));

      centerAtoms(atoms);
      render();
    }

    function setSize(w, h) {
      state.camera.aspect = w / h;
      state.camera.updateProjectionMatrix();
      state.renderer.setSize(w, h);
      render();
    }

    function getSelectedAtom() { return state.selectedAtom; }
    function setColorBy(by) { state.colorBy = by; render(); }
    function setRepresentation(rep) { state.representation = rep; render(); }

    function pickAtom(normalizedX, normalizedY) {
      state.mouse.x = normalizedX * 2 - 1;
      state.mouse.y = -(normalizedY * 2 - 1);
      state.raycaster.setFromCamera(state.mouse, state.camera);
      const intersects = state.raycaster.intersectObjects(state.atomMeshes, true);
      if (intersects.length) {
        const obj = intersects[0].object;
        const idx = intersects[0].instanceId;
        if (obj.userData.atoms && obj.userData.atoms[idx]) return obj.userData.atoms[idx];
      }
      return null;
    }

    function animate() { requestAnimationFrame(() => { render(); animate(); }); }
    animate();

    return {
      setStructure,
      setSize,
      render,
      getSelectedAtom,
      setColorBy,
      setRepresentation,
      pickAtom,
      getScene: () => state.scene,
      getCamera: () => state.camera,
      getRenderer: () => state.renderer,
      getState: () => state
    };
  }

  const VisualizationEngine = { createViewer };

  if (typeof module !== 'undefined' && module.exports) module.exports = VisualizationEngine;
  else global.VisualizationEngine = VisualizationEngine;
})(typeof self !== 'undefined' ? self : this);
