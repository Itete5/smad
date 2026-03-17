/**
 * Structure Generator
 * Random crystal structure generation constrained by composition, lattice system,
 * minimum atomic distance, and optional space group.
 */
(function (global) {
  'use strict';

  if (typeof CrystalEngine === 'undefined') throw new Error('CrystalEngine required');

  const { getLatticeVectors, fracToCart, wrapFrac, buildFromSites } = CrystalEngine;

  /**
   * composition: [{ sym, count }] or { sym: count }.
   * latticeParams: { a, b, c, alpha, beta, gamma }.
   * latticeSystem: 'cubic' | 'tetragonal' | 'orthorhombic' | 'hexagonal' | 'monoclinic' | 'triclinic'.
   * minDistance: minimum atom-atom distance in Å.
   * spaceGroup: optional; if provided, generate asymmetric unit then expand (else random in [0,1)).
   * maxAttempts: per-atom placement attempts.
   */
  function generateRandomStructure(options) {
    const composition = options.composition || [{ sym: 'C', count: 1 }];
    const latParams = options.latticeParams || { a: 5, b: 5, c: 5, alpha: 90, beta: 90, gamma: 90 };
    const system = options.latticeSystem || 'cubic';
    const minDist = options.minDistance != null ? options.minDistance : 1.5;
    const spaceGroup = options.spaceGroup || null;
    const maxAttempts = options.maxAttempts || 500;

    const vecs = getLatticeVectors(latParams, system);
    let list = [];
    if (Array.isArray(composition)) {
      composition.forEach(({ sym, count }) => { for (let i = 0; i < (count || 1); i++) list.push(sym); });
    } else {
      Object.entries(composition).forEach(([sym, count]) => { for (let i = 0; i < count; i++) list.push(sym); });
    }
    shuffle(list);

    const N = list.length;
    const sites = [];
    const cartPositions = [];

    function distCart(c1, c2) {
      let dx = c1[0] - c2[0], dy = c1[1] - c2[1], dz = c1[2] - c2[2];
      const L = 2;
      for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) {
        const dxp = dx + i * vecs[0][0] + j * vecs[1][0] + k * vecs[2][0];
        const dyp = dy + i * vecs[0][1] + j * vecs[1][1] + k * vecs[2][1];
        const dzp = dz + i * vecs[0][2] + j * vecs[1][2] + k * vecs[2][2];
        const d = Math.sqrt(dxp * dxp + dyp * dyp + dzp * dzp);
        if (d < minDist) return d;
      }
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    for (let n = 0; n < N; n++) {
      const sym = list[n];
      let placed = false;
      for (let attempt = 0; attempt < maxAttempts && !placed; attempt++) {
        const frac = [Math.random(), Math.random(), Math.random()];
        const cart = fracToCart(frac, vecs);
        let ok = true;
        for (let i = 0; i < cartPositions.length; i++) {
          const d = distCart(cart, cartPositions[i]);
          if (d < minDist) { ok = false; break; }
        }
        if (ok) {
          sites.push({ x: frac[0], y: frac[1], z: frac[2], role: sym });
          cartPositions.push(cart.slice());
          placed = true;
        }
      }
      if (!placed) {
        sites.push({ x: Math.random(), y: Math.random(), z: Math.random(), role: sym });
        cartPositions.push(fracToCart([sites[sites.length - 1].x, sites[sites.length - 1].y, sites[sites.length - 1].z], vecs));
      }
    }

    if (spaceGroup && typeof SymmetryEngine !== 'undefined') {
      const expanded = SymmetryEngine.expandAsymmetricUnit(sites, spaceGroup, vecs);
      const expandedCart = expanded.map(s => fracToCart([s.x, s.y, s.z], vecs));
      const atoms = expandedCart.map((c, i) => ({ x: c[0], y: c[1], z: c[2], role: expanded[i].role, id: i }));
      return { atoms, vecs, latticeParams: latParams, sites: expanded };
    }

    const atoms = cartPositions.map((c, i) => ({ x: c[0], y: c[1], z: c[2], role: list[i], id: i }));
    return { atoms, vecs, latticeParams: latParams, sites };
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  const StructureGenerator = {
    generateRandomStructure
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = StructureGenerator;
  else global.StructureGenerator = StructureGenerator;
})(typeof self !== 'undefined' ? self : this);
