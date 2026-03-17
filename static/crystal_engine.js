/**
 * Crystal Structure Engine
 * Represents atomic structures with lattice vectors and fractional coordinates.
 * Supports all six lattice systems and conversion between fractional and Cartesian coordinates.
 */
(function (global) {
  'use strict';

  const LATTICE_SYSTEMS = ['cubic', 'tetragonal', 'orthorhombic', 'hexagonal', 'monoclinic', 'triclinic'];

  /**
   * Lattice parameters: a, b, c (Å), alpha, beta, gamma (degrees).
   * Returns 3x3 matrix of column vectors [a1, a2, a3] in Cartesian coordinates.
   */
  function latticeVectorsFromParams(p) {
    const a = p.a || 5;
    const b = p.b ?? a;
    const c = p.c ?? a;
    const deg = Math.PI / 180;
    const alpha = (p.alpha ?? 90) * deg;
    const beta = (p.beta ?? 90) * deg;
    const gamma = (p.gamma ?? 90) * deg;

    const ax = a;
    const ay = 0;
    const az = 0;

    const bx = b * Math.cos(gamma);
    const by = b * Math.sin(gamma);
    const bz = 0;

    const cx = c * Math.cos(beta);
    const cy = c * (Math.cos(alpha) - Math.cos(beta) * Math.cos(gamma)) / Math.sin(gamma);
    const cz = c * Math.sqrt(Math.max(0, 1 - Math.cos(beta) ** 2 - (c !== 0 ? (cy / c) ** 2 : 0)));

    return [
      [ax, ay, az],
      [bx, by, bz],
      [cx, cy, cz]
    ];
  }

  /**
   * Get lattice vectors for a given system (applies constraints: e.g. cubic a=b=c, alpha=beta=gamma=90).
   */
  function getLatticeVectors(params, system) {
    const p = { ...params };
    if (system === 'cubic') {
      p.b = p.b ?? p.a; p.c = p.c ?? p.a;
      p.alpha = p.alpha ?? 90; p.beta = p.beta ?? 90; p.gamma = p.gamma ?? 90;
    } else if (system === 'tetragonal') {
      p.b = p.b ?? p.a;
      p.alpha = p.alpha ?? 90; p.beta = p.beta ?? 90; p.gamma = p.gamma ?? 90;
    } else if (system === 'orthorhombic') {
      p.alpha = p.alpha ?? 90; p.beta = p.beta ?? 90; p.gamma = p.gamma ?? 90;
    } else if (system === 'hexagonal') {
      p.b = p.b ?? p.a; p.gamma = p.gamma ?? 120;
      p.alpha = p.alpha ?? 90; p.beta = p.beta ?? 90;
    } else if (system === 'monoclinic') {
      p.alpha = p.alpha ?? 90; p.gamma = p.gamma ?? 90;
    }
    return latticeVectorsFromParams(p);
  }

  /**
   * Fractional to Cartesian: r_cart = V * r_frac (V = [a1|a2|a3] as columns).
   */
  function fracToCart(frac, vecs) {
    const [x, y, z] = frac;
    return [
      vecs[0][0] * x + vecs[1][0] * y + vecs[2][0] * z,
      vecs[0][1] * x + vecs[1][1] * y + vecs[2][1] * z,
      vecs[0][2] * x + vecs[1][2] * y + vecs[2][2] * z
    ];
  }

  /**
   * Cartesian to fractional: r_frac = V^{-1} * r_cart.
   */
  function cartToFrac(cart, vecs) {
    const det = vecs[0][0] * (vecs[1][1] * vecs[2][2] - vecs[1][2] * vecs[2][1])
      - vecs[0][1] * (vecs[1][0] * vecs[2][2] - vecs[1][2] * vecs[2][0])
      + vecs[0][2] * (vecs[1][0] * vecs[2][1] - vecs[1][1] * vecs[2][0]);
    const inv = [
      [(vecs[1][1] * vecs[2][2] - vecs[1][2] * vecs[2][1]) / det, (vecs[0][2] * vecs[2][1] - vecs[0][1] * vecs[2][2]) / det, (vecs[0][1] * vecs[1][2] - vecs[0][2] * vecs[1][1]) / det],
      [(vecs[1][2] * vecs[2][0] - vecs[1][0] * vecs[2][2]) / det, (vecs[0][0] * vecs[2][2] - vecs[0][2] * vecs[2][0]) / det, (vecs[0][2] * vecs[1][0] - vecs[0][0] * vecs[1][2]) / det],
      [(vecs[1][0] * vecs[2][1] - vecs[1][1] * vecs[2][0]) / det, (vecs[0][1] * vecs[2][0] - vecs[0][0] * vecs[2][1]) / det, (vecs[0][0] * vecs[1][1] - vecs[0][1] * vecs[1][0]) / det]
    ];
    const [cx, cy, cz] = cart;
    return [
      inv[0][0] * cx + inv[0][1] * cy + inv[0][2] * cz,
      inv[1][0] * cx + inv[1][1] * cy + inv[1][2] * cz,
      inv[2][0] * cx + inv[2][1] * cy + inv[2][2] * cz
    ];
  }

  /** Wrap fractional coordinates to [0, 1). */
  function wrapFrac(f) {
    return f.map(x => ((x % 1) + 1) % 1);
  }

  /** Minimum image convention: return displacement vector in Cartesian that minimizes length (for orthorhombic-like). */
  function pbcDisplacement(dr, vecs) {
    const frac = cartToFrac(dr, vecs);
    const w = frac.map(x => Math.round(x));
    return fracToCart([frac[0] - w[0], frac[1] - w[1], frac[2] - w[2]], vecs);
  }

  const PROTOTYPES = {
    fcc: { name: 'FCC', lattice: 'cubic', sg: 'Fm-3m', a: 3.52, sites: [{ x: 0, y: 0, z: 0, role: 'A' }, { x: 0.5, y: 0.5, z: 0, role: 'A' }, { x: 0.5, y: 0, z: 0.5, role: 'A' }, { x: 0, y: 0.5, z: 0.5, role: 'A' }], roles: ['A'] },
    bcc: { name: 'BCC', lattice: 'cubic', sg: 'Im-3m', a: 2.87, sites: [{ x: 0, y: 0, z: 0, role: 'A' }, { x: 0.5, y: 0.5, z: 0.5, role: 'A' }], roles: ['A'] },
    sc: { name: 'Simple cubic', lattice: 'cubic', sg: 'Pm-3m', a: 3, sites: [{ x: 0, y: 0, z: 0, role: 'A' }], roles: ['A'] },
    hcp: { name: 'HCP', lattice: 'hexagonal', sg: 'P6₃/mmc', a: 2.51, c: 4.07, gamma: 120, sites: [{ x: 0, y: 0, z: 0, role: 'A' }, { x: 1 / 3, y: 2 / 3, z: 0.5, role: 'A' }], roles: ['A'] },
    diamond: { name: 'Diamond', lattice: 'cubic', sg: 'Fd-3m', a: 5.43, sites: [{ x: 0, y: 0, z: 0, role: 'A' }, { x: 0.5, y: 0.5, z: 0, role: 'A' }, { x: 0.5, y: 0, z: 0.5, role: 'A' }, { x: 0, y: 0.5, z: 0.5, role: 'A' }, { x: 0.25, y: 0.25, z: 0.25, role: 'A' }, { x: 0.75, y: 0.75, z: 0.25, role: 'A' }, { x: 0.75, y: 0.25, z: 0.75, role: 'A' }, { x: 0.25, y: 0.75, z: 0.75, role: 'A' }], roles: ['A'] },
    nacl: { name: 'NaCl', lattice: 'cubic', sg: 'Fm-3m', a: 5.64, sites: [{ x: 0, y: 0, z: 0, role: 'A' }, { x: 0.5, y: 0.5, z: 0, role: 'A' }, { x: 0.5, y: 0, z: 0.5, role: 'A' }, { x: 0, y: 0.5, z: 0.5, role: 'A' }, { x: 0.5, y: 0, z: 0, role: 'B' }, { x: 0, y: 0.5, z: 0, role: 'B' }, { x: 0, y: 0, z: 0.5, role: 'B' }, { x: 0.5, y: 0.5, z: 0.5, role: 'B' }], roles: ['A', 'B'] },
    zincblende: { name: 'Zinc blende', lattice: 'cubic', sg: 'F-43m', a: 5.41, sites: [{ x: 0, y: 0, z: 0, role: 'A' }, { x: 0.5, y: 0.5, z: 0, role: 'A' }, { x: 0.5, y: 0, z: 0.5, role: 'A' }, { x: 0, y: 0.5, z: 0.5, role: 'A' }, { x: 0.25, y: 0.25, z: 0.25, role: 'B' }, { x: 0.75, y: 0.75, z: 0.25, role: 'B' }, { x: 0.75, y: 0.25, z: 0.75, role: 'B' }, { x: 0.25, y: 0.75, z: 0.75, role: 'B' }], roles: ['A', 'B'] },
    perovskite: { name: 'Perovskite', lattice: 'cubic', sg: 'Pm-3m', a: 3.91, sites: [{ x: 0, y: 0, z: 0, role: 'A' }, { x: 0.5, y: 0.5, z: 0.5, role: 'B' }, { x: 0.5, y: 0.5, z: 0, role: 'O' }, { x: 0.5, y: 0, z: 0.5, role: 'O' }, { x: 0, y: 0.5, z: 0.5, role: 'O' }], roles: ['A', 'B', 'O'] },
    spinel: { name: 'Spinel', lattice: 'cubic', sg: 'Fd-3m', a: 8.08, sites: [{ x: 0, y: 0, z: 0, role: 'A' }, { x: 0.5, y: 0.5, z: 0, role: 'A' }, { x: 0.5, y: 0, z: 0.5, role: 'A' }, { x: 0, y: 0.5, z: 0.5, role: 'A' }, { x: 0.25, y: 0.25, z: 0.25, role: 'B' }, { x: 0.75, y: 0.75, z: 0.25, role: 'B' }, { x: 0.75, y: 0.25, z: 0.75, role: 'B' }, { x: 0.25, y: 0.75, z: 0.75, role: 'B' }, { x: 0.375, y: 0.375, z: 0.375, role: 'X' }, { x: 0.875, y: 0.875, z: 0.375, role: 'X' }, { x: 0.875, y: 0.375, z: 0.875, role: 'X' }, { x: 0.375, y: 0.875, z: 0.875, role: 'X' }, { x: 0.125, y: 0.125, z: 0.125, role: 'X' }, { x: 0.625, y: 0.625, z: 0.125, role: 'X' }, { x: 0.625, y: 0.125, z: 0.625, role: 'X' }, { x: 0.125, y: 0.625, z: 0.625, role: 'X' }], roles: ['A', 'B', 'X'] }
  };

  /**
   * Build structure from prototype or custom sites.
   * sites: [{ x, y, z, role }] fractional.
   * latticeParams: { a, b, c, alpha, beta, gamma } (optional overrides on prototype).
   * supercell: [nx, ny, nz].
   * Returns { atoms: [{ x, y, z, role, id }], vecs, latticeParams } in Cartesian.
   */
  function buildFromSites(sites, latticeParams, system, supercell) {
    const sc = supercell || [1, 1, 1];
    const [nx, ny, nz] = sc;
    const vecs = getLatticeVectors(latticeParams || {}, system);
    const atoms = [];
    const seen = new Set();
    for (let ix = 0; ix < nx; ix++) {
      for (let iy = 0; iy < ny; iy++) {
        for (let iz = 0; iz < nz; iz++) {
          sites.forEach(site => {
            const fx = site.x + ix, fy = site.y + iy, fz = site.z + iz;
            if (fx >= nx - 1e-6 || fy >= ny - 1e-6 || fz >= nz - 1e-6) return;
            const key = `${fx.toFixed(5)},${fy.toFixed(5)},${fz.toFixed(5)},${site.role}`;
            if (seen.has(key)) return;
            seen.add(key);
            const cart = fracToCart([fx, fy, fz], vecs);
            atoms.push({ x: cart[0], y: cart[1], z: cart[2], role: site.role, id: atoms.length });
          });
        }
      }
    }
    const ucV = [vecs[0].map(x => x * nx), vecs[1].map(x => x * ny), vecs[2].map(x => x * nz)];
    const lat = { a: (latticeParams && latticeParams.a) || 5, b: (latticeParams && latticeParams.b) || (latticeParams && latticeParams.a) || 5, c: (latticeParams && latticeParams.c) || (latticeParams && latticeParams.a) || 5, alpha: latticeParams && latticeParams.alpha || 90, beta: latticeParams && latticeParams.beta || 90, gamma: latticeParams && latticeParams.gamma || 90, vecs: ucV };
    return { atoms, vecs: ucV, latticeParams: lat };
  }

  /**
   * Build slab: repeat along hkl, keep layers in range.
   */
  function buildSlab(sites, latticeParams, system, hkl, numLayers) {
    const vecs = getLatticeVectors(latticeParams || {}, system);
    const [h, k, l] = [parseInt(hkl[0], 10) || 1, parseInt(hkl[1], 10) || 0, parseInt(hkl[2], 10) || 0];
    const rng = Math.max(numLayers + 2, 5);
    const atoms = [];
    const seen = new Set();
    for (let ix = -rng; ix <= rng; ix++) {
      for (let iy = -rng; iy <= rng; iy++) {
        for (let iz = -rng; iz <= rng; iz++) {
          sites.forEach(site => {
            const fx = site.x + ix, fy = site.y + iy, fz = site.z + iz;
            const proj = fx * h + fy * k + fz * l;
            if (proj < -0.5 || proj > numLayers + 0.5) return;
            const cart = fracToCart([fx, fy, fz], vecs);
            const key = `${cart[0].toFixed(4)},${cart[1].toFixed(4)},${cart[2].toFixed(4)}`;
            if (seen.has(key)) return;
            seen.add(key);
            atoms.push({ x: cart[0], y: cart[1], z: cart[2], role: site.role, id: atoms.length });
          });
        }
      }
    }
    const a = latticeParams && latticeParams.a || 5;
    const slabVecs = [[3 * a, 0, 0], [0, 3 * a, 0], [0, 0, (numLayers * a) / Math.sqrt(h * h + k * k + l * l)]];
    return { atoms, vecs: slabVecs, latticeParams: { ...latticeParams, vecs: slabVecs } };
  }

  /**
   * Parse CIF text into { atoms: [{ sym, x, y, z }], latticeParams, spaceGroup }.
   */
  function parseCIF(text) {
    const atoms = [];
    const aM = text.match(/_cell_length_a\s+([\d.]+)/);
    const bM = text.match(/_cell_length_b\s+([\d.]+)/);
    const cM = text.match(/_cell_length_c\s+([\d.]+)/);
    const a = aM ? parseFloat(aM[1]) : 5, b = bM ? parseFloat(bM[1]) : a, c = cM ? parseFloat(cM[1]) : a;
    const block = text.match(/_atom_site_fract_x[\s\S]*?(?=loop_|$)/);
    if (!block) return null;
    const rows = block[0].trim().split('\n').filter(l => !/^_/.test(l.trim()) && l.trim() && l.trim().charAt(0) !== '#');
    rows.forEach(row => {
      const p = row.trim().split(/\s+/);
      if (p.length >= 5) {
        const sym = (p[1] || p[0]).replace(/[^A-Za-z]/g, '');
        const x = parseFloat(p[2]), y = parseFloat(p[3]), z = parseFloat(p[4]);
        if (!isNaN(x)) atoms.push({ sym, x: x * a, y: y * b, z: z * c });
      }
    });
    return atoms.length ? { atoms, latticeParams: { a, b, c }, type: 'cif' } : null;
  }

  /**
   * Parse POSCAR/VASP.
   */
  function parsePOSCAR(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 8) return null;
    try {
      const scale = parseFloat(lines[1]);
      const a1 = lines[2].trim().split(/\s+/).map(Number).map(v => v * scale);
      const a2 = lines[3].trim().split(/\s+/).map(Number).map(v => v * scale);
      const a3 = lines[4].trim().split(/\s+/).map(Number).map(v => v * scale);
      const vecs = [a1, a2, a3];
      const syms = lines[5].trim().split(/\s+/);
      const counts = lines[6].trim().split(/\s+/).map(Number);
      let posLine = 7;
      let isDirect = (lines[7] || '').trim().toLowerCase().charAt(0) === 'd';
      if ((lines[7] || '').trim().toLowerCase().charAt(0) === 's') { posLine = 9; isDirect = (lines[9] || '').trim().toLowerCase().charAt(0) === 'd'; }
      const atoms = [];
      let si = 0;
      counts.forEach((cnt, ci) => {
        for (let i = 0; i < cnt; i++) {
          const parts = (lines[posLine + si] || '').trim().split(/\s+/).map(Number);
          si++;
          const x = isDirect ? parts[0] * a1[0] + parts[1] * a2[0] + parts[2] * a3[0] : parts[0];
          const y = isDirect ? parts[0] * a1[1] + parts[1] * a2[1] + parts[2] * a3[1] : parts[1];
          const z = isDirect ? parts[0] * a1[2] + parts[1] * a2[2] + parts[2] * a3[2] : parts[2];
          atoms.push({ sym: syms[ci] || 'X', x, y, z });
        }
      });
      const la = Math.sqrt(a1[0]**2 + a1[1]**2 + a1[2]**2);
      const lb = Math.sqrt(a2[0]**2 + a2[1]**2 + a2[2]**2);
      const lc = Math.sqrt(a3[0]**2 + a3[1]**2 + a3[2]**2);
      return { atoms, vecs, latticeParams: { a: la, b: lb, c: lc }, type: 'poscar' };
    } catch (e) { return null; }
  }

  function parseXYZ(text) {
    const lines = text.trim().split('\n');
    const n = parseInt(lines[0], 10);
    if (!n) return null;
    const atoms = [];
    for (let i = 2; i < 2 + n && i < lines.length; i++) {
      const parts = lines[i].trim().split(/\s+/);
      if (parts.length < 4) continue;
      const sym = parts[0];
      atoms.push({ sym, x: parseFloat(parts[1]), y: parseFloat(parts[2]), z: parseFloat(parts[3]) });
    }
    return atoms.length ? { atoms, type: 'xyz' } : null;
  }

  function parsePDB(text) {
    const atoms = [];
    text.split('\n').forEach(line => {
      if (line.indexOf('ATOM') === 0 || line.indexOf('HETATM') === 0) {
        const sym = (line.slice(76, 78).trim() || line.slice(12, 14).trim()).replace(/[^A-Za-z]/g, '');
        const x = parseFloat(line.slice(30, 38)), y = parseFloat(line.slice(38, 46)), z = parseFloat(line.slice(46, 54));
        if (!isNaN(x)) atoms.push({ sym, x, y, z });
      }
    });
    return atoms.length ? { atoms, type: 'pdb' } : null;
  }

  /**
   * Export structure to CIF / POSCAR / XYZ string.
   */
  function exportCIF(atoms, vecs, latticeParams, name) {
    const lat = latticeParams || {};
    const a = (lat.a || 5).toFixed(6), b = (lat.b || lat.a || 5).toFixed(6), c = (lat.c || lat.a || 5).toFixed(6);
    const al = (lat.alpha || 90).toFixed(4), be = (lat.beta || 90).toFixed(4), ga = (lat.gamma || 90).toFixed(4);
    let s = `data_${(name || 'structure').replace(/\s/g, '_')}\n_cell_length_a ${a}\n_cell_length_b ${b}\n_cell_length_c ${c}\n_cell_angle_alpha ${al}\n_cell_angle_beta ${be}\n_cell_angle_gamma ${ga}\nloop_\n_atom_site_label\n_atom_site_type_symbol\n_atom_site_fract_x\n_atom_site_fract_y\n_atom_site_fract_z\n`;
    const v = vecs || latticeVectorsFromParams(lat);
    const det = v[0][0] * (v[1][1] * v[2][2] - v[1][2] * v[2][1]) - v[0][1] * (v[1][0] * v[2][2] - v[1][2] * v[2][0]) + v[0][2] * (v[1][0] * v[2][1] - v[1][1] * v[2][0]);
    const inv = [
      [(v[1][1] * v[2][2] - v[1][2] * v[2][1]) / det, (v[0][2] * v[2][1] - v[0][1] * v[2][2]) / det, (v[0][1] * v[1][2] - v[0][2] * v[1][1]) / det],
      [(v[1][2] * v[2][0] - v[1][0] * v[2][2]) / det, (v[0][0] * v[2][2] - v[0][2] * v[2][0]) / det, (v[0][2] * v[1][0] - v[0][0] * v[1][2]) / det],
      [(v[1][0] * v[2][1] - v[1][1] * v[2][0]) / det, (v[0][1] * v[2][0] - v[0][0] * v[2][1]) / det, (v[0][0] * v[1][1] - v[0][1] * v[1][0]) / det]
    ];
    const counts = {};
    atoms.forEach((atom, i) => {
      const sym = atom.sym || atom.role || 'X';
      counts[sym] = (counts[sym] || 0) + 1;
      const fx = ((inv[0][0] * atom.x + inv[0][1] * atom.y + inv[0][2] * atom.z) % 1 + 1) % 1;
      const fy = ((inv[1][0] * atom.x + inv[1][1] * atom.y + inv[1][2] * atom.z) % 1 + 1) % 1;
      const fz = ((inv[2][0] * atom.x + inv[2][1] * atom.y + inv[2][2] * atom.z) % 1 + 1) % 1;
      s += `${(sym + counts[sym]).padEnd(8)} ${sym.padEnd(4)} ${fx.toFixed(6)}  ${fy.toFixed(6)}  ${fz.toFixed(6)}\n`;
    });
    return s;
  }

  function exportPOSCAR(atoms, vecs, uniqueSyms, name) {
    const v = vecs || [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    const syms = atoms.map(a => a.sym || a.role || 'X');
    const uniq = uniqueSyms || [...new Set(syms)];
    let s = `${name || 'structure'} ${uniq.join(' ')}\n1.0\n`;
    s += v.map(vec => vec.map(x => x.toFixed(9).padStart(14)).join('') + '\n').join('');
    s += uniq.join('  ') + '\n' + uniq.map(sym => atoms.filter((_, i) => syms[i] === sym).length).join('  ') + '\nCartesian\n';
    uniq.forEach(sym => {
      atoms.forEach((a, i) => { if (syms[i] === sym) s += a.x.toFixed(9).padStart(14) + a.y.toFixed(9).padStart(14) + a.z.toFixed(9).padStart(14) + '\n'; });
    });
    return s;
  }

  function exportXYZ(atoms, name) {
    const syms = atoms.map(a => a.sym || a.role || 'X');
    let s = atoms.length + '\n' + (name || 'structure') + '\n';
    atoms.forEach((a, i) => { s += (syms[i]).padEnd(4) + ' ' + a.x.toFixed(6).padStart(12) + ' ' + a.y.toFixed(6).padStart(12) + ' ' + a.z.toFixed(6).padStart(12) + '\n'; });
    return s;
  }

  const CrystalEngine = {
    LATTICE_SYSTEMS,
    getLatticeVectors,
    latticeVectorsFromParams,
    fracToCart,
    cartToFrac,
    wrapFrac,
    pbcDisplacement,
    PROTOTYPES,
    buildFromSites,
    buildSlab,
    parseCIF,
    parsePOSCAR,
    parseXYZ,
    parsePDB,
    exportCIF,
    exportPOSCAR,
    exportXYZ
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = CrystalEngine;
  else global.CrystalEngine = CrystalEngine;
})(typeof self !== 'undefined' ? self : this);
