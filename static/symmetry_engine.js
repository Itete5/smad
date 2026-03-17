/**
 * Symmetry Engine
 * Space groups, symmetry operations (rotation, mirror, inversion, glide, screw),
 * asymmetric unit expansion, and symmetry element visualization data.
 */
(function (global) {
  'use strict';

  if (typeof CrystalEngine === 'undefined') throw new Error('CrystalEngine required');

  const { fracToCart, cartToFrac, wrapFrac } = CrystalEngine;

  /**
   * Apply 3x3 rotation + translation (in fractional) to a fractional point.
   * op: { R: 3x3, t: [tx, ty, tz] } -> r' = (R * r + t) mod 1
   */
  function applySymOp(frac, op) {
    const [x, y, z] = frac;
    const R = op.R, t = op.t || [0, 0, 0];
    const x2 = R[0][0] * x + R[0][1] * y + R[0][2] * z + t[0];
    const y2 = R[1][0] * x + R[1][1] * y + R[1][2] * z + t[1];
    const z2 = R[2][0] * x + R[2][1] * y + R[2][2] * z + t[2];
    return wrapFrac([x2, y2, z2]);
  }

  /**
   * Rotation matrix (right-handed) around axis [0,0,1] by angle (radians).
   */
  function rotZ(angle) {
    const c = Math.cos(angle), s = Math.sin(angle);
    return [[c, -s, 0], [s, c, 0], [0, 0, 1]];
  }
  function rotY(angle) {
    const c = Math.cos(angle), s = Math.sin(angle);
    return [[c, 0, s], [0, 1, 0], [-s, 0, c]];
  }
  function rotX(angle) {
    const c = Math.cos(angle), s = Math.sin(angle);
    return [[1, 0, 0], [0, c, -s], [0, s, c]];
  }
  /** Mirror perpendicular to z (x,y,z) -> (x,y,-z) in fractional depends on basis. */
  function mirrorZ() {
    return [[1, 0, 0], [0, 1, 0], [0, 0, -1]];
  }
  function mirrorX() {
    return [[-1, 0, 0], [0, 1, 0], [0, 0, 1]];
  }
  function mirrorY() {
    return [[1, 0, 0], [0, -1, 0], [0, 0, 1]];
  }
  function inversion() {
    return [[-1, 0, 0], [0, -1, 0], [0, 0, -1]];
  }

  /**
   * Space group generators (subset). Each SG has a list of operations { R, t }.
   * t in fractional units (e.g. 0.5 for half translation).
   */
  const SPACE_GROUP_OPS = {
    'P1': [{ R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0, 0, 0] }],
    'P-1': [{ R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0, 0, 0] }, { R: inversion(), t: [0, 0, 0] }],
    'P21/c': [
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0, 0, 0] },
      { R: inversion(), t: [0, 0, 0] },
      { R: [[-1, 0, 0], [0, 1, 0], [0, 0, -1]], t: [0, 0.5, 0.5] },
      { R: [[1, 0, 0], [0, -1, 0], [0, 0, 1]], t: [0.5, 0, 0.5] }
    ],
    'P21': [
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0, 0, 0] },
      { R: [[-1, 0, 0], [0, 1, 0], [0, 0, -1]], t: [0.5, 0, 0] }
    ],
    'P212121': [
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0, 0, 0] },
      { R: [[-1, 0, 0], [0, -1, 0], [0, 0, 1]], t: [0.5, 0, 0.5] },
      { R: [[1, 0, 0], [0, -1, 0], [0, 0, -1]], t: [0.5, 0.5, 0] },
      { R: [[-1, 0, 0], [0, 1, 0], [0, 0, -1]], t: [0, 0.5, 0.5] }
    ],
    'Fm-3m': [
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0, 0, 0] },
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0, 0.5, 0.5] },
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0.5, 0, 0.5] },
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0.5, 0.5, 0] },
      { R: [[0, 1, 0], [1, 0, 0], [0, 0, 1]], t: [0, 0, 0] },
      { R: [[0, 0, 1], [1, 0, 0], [0, 1, 0]], t: [0, 0, 0] },
      { R: [[1, 0, 0], [0, 0, 1], [0, 1, 0]], t: [0, 0, 0] },
      { R: inversion(), t: [0, 0, 0] }
    ],
    'Im-3m': [
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0, 0, 0] },
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0.5, 0.5, 0.5] },
      { R: [[0, 1, 0], [1, 0, 0], [0, 0, 1]], t: [0, 0, 0] },
      { R: [[0, 0, 1], [1, 0, 0], [0, 1, 0]], t: [0, 0, 0] },
      { R: [[1, 0, 0], [0, 0, 1], [0, 1, 0]], t: [0, 0, 0] },
      { R: inversion(), t: [0, 0, 0] }
    ],
    'Pm-3m': [
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0, 0, 0] },
      { R: [[0, 1, 0], [1, 0, 0], [0, 0, 1]], t: [0, 0, 0] },
      { R: [[0, 0, 1], [1, 0, 0], [0, 1, 0]], t: [0, 0, 0] },
      { R: [[1, 0, 0], [0, 0, 1], [0, 1, 0]], t: [0, 0, 0] },
      { R: inversion(), t: [0, 0, 0] }
    ],
    'P6₃/mmc': [
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0, 0, 0] },
      { R: rotZ(Math.PI / 3), t: [0, 0, 0.5] },
      { R: mirrorZ(), t: [0, 0, 0.5] },
      { R: inversion(), t: [0, 0, 0] }
    ],
    'Fd-3m': [
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0, 0, 0] },
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0, 0.5, 0.5] },
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0.5, 0, 0.5] },
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0.5, 0.5, 0] },
      { R: [[0, 1, 0], [1, 0, 0], [0, 0, 1]], t: [0.25, 0.25, 0.25] },
      { R: [[0, 0, 1], [1, 0, 0], [0, 1, 0]], t: [0.25, 0.25, 0.25] },
      { R: [[1, 0, 0], [0, 0, 1], [0, 1, 0]], t: [0.25, 0.25, 0.25] },
      { R: inversion(), t: [0, 0, 0] }
    ],
    'F-43m': [
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0, 0, 0] },
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0, 0.5, 0.5] },
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0.5, 0, 0.5] },
      { R: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], t: [0.5, 0.5, 0] },
      { R: [[0, 1, 0], [1, 0, 0], [0, 0, 1]], t: [0.25, 0.25, 0.25] },
      { R: [[0, 0, 1], [1, 0, 0], [0, 1, 0]], t: [0.25, 0.25, 0.25] },
      { R: [[1, 0, 0], [0, 0, 1], [0, 1, 0]], t: [0.25, 0.25, 0.25] }
    ]
  };

  /**
   * Expand asymmetric unit sites by space group to get full unit cell (fractional, in [0,1)).
   * asuSites: [{ x, y, z, role }] in fractional.
   * spaceGroup: e.g. 'P1', 'P21/c', 'Fm-3m'.
   * Returns unique sites (deduplicated by rounded fractional coords).
   */
  function expandAsymmetricUnit(asuSites, spaceGroup, vecs) {
    const ops = SPACE_GROUP_OPS[spaceGroup] || SPACE_GROUP_OPS['P1'];
    const all = [];
    const key = (f) => `${(f[0]).toFixed(5)},${(f[1]).toFixed(5)},${(f[2]).toFixed(5)}`;
    const seen = new Set();
    asuSites.forEach(site => {
      ops.forEach(op => {
        const f = applySymOp([site.x, site.y, site.z], op);
        const k = key(f);
        if (seen.has(k)) return;
        seen.add(k);
        all.push({ x: f[0], y: f[1], z: f[2], role: site.role });
      });
    });
    return all;
  }

  /**
   * Classify symmetry operation for visualization: 'rotation' | 'mirror' | 'inversion' | 'translation'.
   */
  function getSymmetryElementType(op) {
    const R = op.R;
    const det = R[0][0] * (R[1][1] * R[2][2] - R[1][2] * R[2][1]) - R[0][1] * (R[1][0] * R[2][2] - R[1][2] * R[2][0]) + R[0][2] * (R[1][0] * R[2][1] - R[1][1] * R[2][0]);
    const trace = R[0][0] + R[1][1] + R[2][2];
    if (Math.abs(det + 1) < 1e-5 && Math.abs(trace + 3) < 1e-5) return 'inversion';
    if (Math.abs(det - 1) < 1e-5) {
      if (Math.abs(trace - 3) < 1e-5) return 'identity';
      return 'rotation';
    }
    if (Math.abs(det + 1) < 1e-5) return 'mirror';
    return 'rotation';
  }

  /**
   * Get rotation axis (eigenvector for eigenvalue 1) or mirror normal (eigenvector for -1).
   * Simplified: returns [0,0,1] for 2/3/4/6 around z, etc.
   */
  function getSymmetryAxis(op) {
    const t = getSymmetryElementType(op);
    const R = op.R;
    if (t === 'rotation') {
      const trace = R[0][0] + R[1][1] + R[2][2];
      const angle = Math.acos(Math.max(-1, Math.min(1, (trace - 1) / 2)));
      if (angle < 0.01) return { axis: [1, 0, 0], angle: 0 };
      const nx = R[1][2] - R[2][1], ny = R[2][0] - R[0][2], nz = R[0][1] - R[1][0];
      const n = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      return { axis: [nx / n, ny / n, nz / n], angle };
    }
    if (t === 'mirror') {
      const nx = R[0][0] - 1; const ny = R[1][1] - 1; const nz = R[2][2] + 1;
      const n = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      return { axis: [nx / n, ny / n, nz / n], mirror: true };
    }
    if (t === 'inversion') return { axis: [0, 0, 0], inversion: true };
    return { axis: [0, 0, 0] };
  }

  /**
   * Simple space group detection: check if structure is consistent with a given SG (e.g. compare multiplicity).
   * Returns list of possible SGs or empty. Not full spglib-style.
   */
  function suggestSpaceGroup(sites, vecs, tolerance) {
    const n = sites.length;
    const suggestions = [];
    Object.keys(SPACE_GROUP_OPS).forEach(sg => {
      const expanded = expandAsymmetricUnit(sites, sg, vecs);
      if (Math.abs(expanded.length - n) < (n * (tolerance || 0.1))) suggestions.push(sg);
    });
    return suggestions;
  }

  const SymmetryEngine = {
    applySymOp,
    SPACE_GROUP_OPS,
    expandAsymmetricUnit,
    getSymmetryElementType,
    getSymmetryAxis,
    suggestSpaceGroup,
    rotZ, rotY, rotX, mirrorZ, mirrorX, mirrorY, inversion
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = SymmetryEngine;
  else global.SymmetryEngine = SymmetryEngine;
})(typeof self !== 'undefined' ? self : this);
