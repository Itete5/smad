/**
 * Structural Analysis Tools
 * Coordination numbers, bond length/angle distributions, RDF,
 * structure factors / XRD, Voronoi analysis, motif detection.
 */
(function (global) {
  'use strict';

  if (typeof CrystalEngine === 'undefined') throw new Error('CrystalEngine required');

  const { cartToFrac } = CrystalEngine;

  function pbcDist(cart1, cart2, vecs) {
    let dx = cart2[0] - cart1[0], dy = cart2[1] - cart1[1], dz = cart2[2] - cart1[2];
    let minD2 = dx * dx + dy * dy + dz * dz;
    for (let i = -1; i <= 1; i++)
      for (let j = -1; j <= 1; j++)
        for (let k = -1; k <= 1; k++) {
          const rx = dx + i * vecs[0][0] + j * vecs[1][0] + k * vecs[2][0];
          const ry = dy + i * vecs[0][1] + j * vecs[1][1] + k * vecs[2][1];
          const rz = dz + i * vecs[0][2] + j * vecs[1][2] + k * vecs[2][2];
          const d2 = rx * rx + ry * ry + rz * rz;
          if (d2 < minD2) minD2 = d2;
        }
    return Math.sqrt(minD2);
  }

  /**
   * Compute bonds from atoms (Cartesian) and cutoff. vecs = lattice vectors.
   */
  function computeBonds(atoms, vecs, cutoff) {
    const bonds = [];
    const rc = cutoff != null ? cutoff : 3.0;
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const d = pbcDist([atoms[i].x, atoms[i].y, atoms[i].z], [atoms[j].x, atoms[j].y, atoms[j].z], vecs);
        if (d < rc) bonds.push({ a: i, b: j, len: d });
      }
    }
    return bonds;
  }

  /**
   * Coordination numbers from bonds (or from distance cutoff if bonds not provided).
   */
  function coordinationNumbers(atoms, vecs, bondsOrCutoff) {
    const cn = atoms.map(() => 0);
    let bonds = bondsOrCutoff;
    if (typeof bondsOrCutoff === 'number' || !Array.isArray(bondsOrCutoff))
      bonds = computeBonds(atoms, vecs, bondsOrCutoff);
    bonds.forEach(b => { cn[b.a]++; cn[b.b]++; });
    return cn;
  }

  /**
   * Bond length distribution: { bins: [r0, r1, ...], counts: [...] }.
   */
  function bondLengthDistribution(bonds, binWidth) {
    const bw = binWidth || 0.05;
    const min = Math.min(...bonds.map(b => b.len));
    const max = Math.max(...bonds.map(b => b.len));
    const nbins = Math.max(1, Math.ceil((max - min) / bw));
    const bins = Array.from({ length: nbins }, (_, i) => min + (i + 0.5) * bw);
    const counts = new Array(nbins).fill(0);
    bonds.forEach(b => {
      const idx = Math.min(nbins - 1, Math.floor((b.len - min) / bw));
      if (idx >= 0) counts[idx]++;
    });
    return { bins, counts, min, max };
  }

  /**
   * Bond angle distribution (angles at each atom between pairs of bonds).
   */
  function bondAngleDistribution(atoms, bonds) {
    const angles = [];
    const byAtom = atoms.map(() => []);
    bonds.forEach(b => { byAtom[b.a].push(b.b); byAtom[b.b].push(b.a); });
    byAtom.forEach((neigh, i) => {
      const r0 = [atoms[i].x, atoms[i].y, atoms[i].z];
      for (let a = 0; a < neigh.length; a++) {
        for (let b = a + 1; b < neigh.length; b++) {
          const ra = [atoms[neigh[a]].x, atoms[neigh[a]].y, atoms[neigh[a]].z];
          const rb = [atoms[neigh[b]].x, atoms[neigh[b]].y, atoms[neigh[b]].z];
          const va = [ra[0] - r0[0], ra[1] - r0[1], ra[2] - r0[2]];
          const vb = [rb[0] - r0[0], rb[1] - r0[1], rb[2] - r0[2]];
          const da = Math.sqrt(va[0] * va[0] + va[1] * va[1] + va[2] * va[2]);
          const db = Math.sqrt(vb[0] * vb[0] + vb[1] * vb[1] + vb[2] * vb[2]);
          if (da < 1e-6 || db < 1e-6) continue;
          const cos = (va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]) / (da * db);
          angles.push(Math.acos(Math.max(-1, Math.min(1, cos))) * (180 / Math.PI));
        }
      }
    });
    return angles;
  }

  /**
   * Radial distribution function g(r). atoms, vecs, rMax, dr.
   */
  function radialDistributionFunction(atoms, vecs, rMax, dr) {
    const step = dr || 0.1;
    const nr = Math.floor((rMax || 10) / step);
    const hist = new Array(nr).fill(0);
    const rho = atoms.length / (vecs[0][0] * (vecs[1][1] * vecs[2][2] - vecs[1][2] * vecs[2][1]) - vecs[0][1] * (vecs[1][0] * vecs[2][2] - vecs[1][2] * vecs[2][0]) + vecs[0][2] * (vecs[1][0] * vecs[2][1] - vecs[1][1] * vecs[2][0]));
    let norm = 0;
    for (let i = 0; i < atoms.length; i++) {
      for (let j = i + 1; j < atoms.length; j++) {
        const d = pbcDist([atoms[i].x, atoms[i].y, atoms[i].z], [atoms[j].x, atoms[j].y, atoms[j].z], vecs);
        const idx = Math.floor(d / step);
        if (idx >= 0 && idx < nr) { hist[idx] += 2; norm += 2; }
      }
    }
    const bins = Array.from({ length: nr }, (_, i) => (i + 0.5) * step);
    const vol = (4 / 3) * Math.PI * (Math.pow((nr + 0.5) * step, 3) - Math.pow(0.5 * step, 3));
    const g = hist.map((h, i) => (vol > 0 && rho > 0) ? h / (norm * 4 * Math.PI * Math.pow((i + 0.5) * step, 2) * step * rho) : 0);
    return { r: bins, g };
  }

  /**
   * Simplified structure factor |F(hkl)|^2 and XRD intensity (no Debye-Waller, constant form factor).
   */
  function structureFactor(atoms, vecs, h, k, l) {
    let re = 0, im = 0;
    atoms.forEach(a => {
      const frac = cartToFrac([a.x, a.y, a.z], vecs);
      const arg = 2 * Math.PI * (h * frac[0] + k * frac[1] + l * frac[2]);
      re += Math.cos(arg);
      im += Math.sin(arg);
    });
    return re * re + im * im;
  }

  /**
   * Simulated XRD pattern: 2 theta (deg) vs intensity for lambda (Å).
   */
  function xrdPattern(atoms, vecs, lambda, twoThetaMax) {
    lambda = lambda || 1.5406;
    twoThetaMax = twoThetaMax || 80;
    const vecsInv = (function () {
      const v = vecs;
      const det = v[0][0] * (v[1][1] * v[2][2] - v[1][2] * v[2][1]) - v[0][1] * (v[1][0] * v[2][2] - v[1][2] * v[2][0]) + v[0][2] * (v[1][0] * v[2][1] - v[1][1] * v[2][0]);
      return [
        [(v[1][1] * v[2][2] - v[1][2] * v[2][1]) / det, (v[0][2] * v[2][1] - v[0][1] * v[2][2]) / det, (v[0][1] * v[1][2] - v[0][2] * v[1][1]) / det],
        [(v[1][2] * v[2][0] - v[1][0] * v[2][2]) / det, (v[0][0] * v[2][2] - v[0][2] * v[2][0]) / det, (v[0][2] * v[1][0] - v[0][0] * v[1][2]) / det],
        [(v[1][0] * v[2][1] - v[1][1] * v[2][0]) / det, (v[0][1] * v[2][0] - v[0][0] * v[2][1]) / det, (v[0][0] * v[1][1] - v[0][1] * v[1][0]) / det]
      ];
    })();
    const dMax = lambda / (2 * Math.sin((twoThetaMax * Math.PI) / 360));
    const peaks = [];
    const maxH = Math.ceil(5 / (vecs[0][0] || 1));
    for (let h = -maxH; h <= maxH; h++)
      for (let k = -maxH; k <= maxH; k++)
        for (let l = -maxH; l <= maxH; l++) {
          if (h === 0 && k === 0 && l === 0) continue;
          const r = [h * vecsInv[0][0] + k * vecsInv[0][1] + l * vecsInv[0][2], h * vecsInv[1][0] + k * vecsInv[1][1] + l * vecsInv[1][2], h * vecsInv[2][0] + k * vecsInv[2][1] + l * vecsInv[2][2]];
          const d = 1 / Math.sqrt(r[0] * r[0] + r[1] * r[1] + r[2] * r[2]);
          if (d > dMax) continue;
          const twoTheta = 2 * (180 / Math.PI) * Math.asin(lambda / (2 * d));
          const I = structureFactor(atoms, vecs, h, k, l);
          peaks.push({ h, k, l, d, twoTheta, intensity: I });
        }
    peaks.sort((a, b) => a.twoTheta - b.twoTheta);
    return peaks;
  }

  /**
   * Voronoi coordination: for each atom, count faces (neighbors) and optional volume.
   * Simplified: use nearest neighbors within cutoff as Voronoi neighbors.
   */
  function voronoiCoordination(atoms, vecs, cutoff) {
    const bonds = computeBonds(atoms, vecs, cutoff || 3.5);
    const cn = coordinationNumbers(atoms, vecs, bonds);
    return cn;
  }

  /**
   * Identify atoms with unusual coordination (e.g. CN different from mode).
   */
  function unusualCoordination(atoms, vecs, bondsOrCutoff) {
    const cn = coordinationNumbers(atoms, vecs, bondsOrCutoff);
    const hist = {};
    cn.forEach(c => { hist[c] = (hist[c] || 0) + 1; });
    const mode = parseInt(Object.entries(hist).sort((a, b) => b[1] - a[1])[0][0], 10);
    return atoms.map((a, i) => ({ ...a, id: i, cn: cn[i], unusual: cn[i] !== mode })).filter(x => x.unusual);
  }

  const AnalysisTools = {
    computeBonds,
    coordinationNumbers,
    bondLengthDistribution,
    bondAngleDistribution,
    radialDistributionFunction,
    structureFactor,
    xrdPattern,
    voronoiCoordination,
    unusualCoordination,
    pbcDist
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = AnalysisTools;
  else global.AnalysisTools = AnalysisTools;
})(typeof self !== 'undefined' ? self : this);
