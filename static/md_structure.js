/**
 * MD Structure Module
 * Lattice construction (SC, FCC, BCC, HCP, diamond, NaCl, zincblende),
 * supercell replication, and structure file loading (CIF, POSCAR, XYZ, PDB).
 */
(function (global) {
  'use strict';

  const ELEMENTS = {
    Ar: { mass: 39.948, color: '#80d4ff', r: 1.9, eps: 0.0103, sig: 3.40 },
    Ne: { mass: 20.18, color: '#b3e0ff', r: 1.5, eps: 0.0031, sig: 2.79 },
    Kr: { mass: 83.8, color: '#5cb8d1', r: 2.0, eps: 0.0175, sig: 3.65 },
    Cu: { mass: 63.546, color: '#c88033', r: 1.3, eps: 0.40, sig: 2.30 },
    Fe: { mass: 55.845, color: '#e06633', r: 1.3, eps: 0.25, sig: 2.30 },
    Na: { mass: 22.99, color: '#ab5cf2', r: 1.5, eps: 0.01, sig: 2.80 },
    Cl: { mass: 35.45, color: '#1ff01f', r: 1.7, eps: 0.01, sig: 3.30 },
    Si: { mass: 28.085, color: '#f0b342', r: 1.2, eps: 0.20, sig: 2.35 },
    Zn: { mass: 65.38, color: '#7d80b0', r: 1.4, eps: 0.05, sig: 2.46 },
    S: { mass: 32.065, color: '#ffb347', r: 1.8, eps: 0.01, sig: 3.40 },
    C: { mass: 12.011, color: '#555555', r: 0.77, eps: 0.01, sig: 3.40 },
    O: { mass: 15.999, color: '#ff4444', r: 0.66, eps: 0.01, sig: 2.90 },
    A: { mass: 40.0, color: '#80d4ff', r: 1.9, eps: 0.0103, sig: 3.40 },
    B: { mass: 10.0, color: '#f58fff', r: 1.3, eps: 0.005, sig: 2.5 }
  };

  function getElement(sym) {
    const s = (sym || 'A').toString().replace(/[^A-Za-z]/g, '');
    return ELEMENTS[s] || ELEMENTS[s.charAt(0) + s.slice(1).toLowerCase()] || ELEMENTS.A;
  }

  function toMDAtom(x, y, z, element, vx, vy, vz) {
    const info = getElement(element);
    return {
      x: x, y: y, z: z,
      vx: vx != null ? vx : 0, vy: vy != null ? vy : 0, vz: vz != null ? vz : 0,
      element: element || 'A',
      mass: info.mass,
      sig: info.sig,
      eps: info.eps
    };
  }

  function buildLattice(type, boxSize, targetN) {
    const L = Array.isArray(boxSize) ? boxSize[0] : boxSize;
    const box = [L, L, L];
    const atoms = [];
    const half = L / 2;

    if (type === 'sc' || type === 'simple_cubic') {
      const n = Math.max(1, Math.round(Math.pow(targetN || 512, 1 / 3)));
      const step = L / n;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          for (let k = 0; k < n; k++) {
            atoms.push(toMDAtom(
              (i + 0.5) * step - half + (Math.random() - 0.5) * 0.02,
              (j + 0.5) * step - half + (Math.random() - 0.5) * 0.02,
              (k + 0.5) * step - half + (Math.random() - 0.5) * 0.02,
              'A'
            ));
          }
        }
      }
      return { atoms, box };
    }

    if (type === 'fcc') {
      const n = Math.max(1, Math.round(Math.pow((targetN || 512) / 4, 1 / 3)));
      const a = L / n;
      const basis = [[0, 0, 0], [0.5, 0.5, 0], [0.5, 0, 0.5], [0, 0.5, 0.5]];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          for (let k = 0; k < n; k++) {
            basis.forEach(([bx, by, bz]) => {
              atoms.push(toMDAtom(
                (i + bx) * a - half + (Math.random() - 0.5) * 0.02,
                (j + by) * a - half + (Math.random() - 0.5) * 0.02,
                (k + bz) * a - half + (Math.random() - 0.5) * 0.02,
                'A'
              ));
            });
          }
        }
      }
      return { atoms, box };
    }

    if (type === 'bcc') {
      const n = Math.max(1, Math.round(Math.pow((targetN || 512) / 2, 1 / 3)));
      const a = L / n;
      const basis = [[0, 0, 0], [0.5, 0.5, 0.5]];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          for (let k = 0; k < n; k++) {
            basis.forEach(([bx, by, bz]) => {
              atoms.push(toMDAtom(
                (i + bx) * a - half + (Math.random() - 0.5) * 0.02,
                (j + by) * a - half + (Math.random() - 0.5) * 0.02,
                (k + bz) * a - half + (Math.random() - 0.5) * 0.02,
                'A'
              ));
            });
          }
        }
      }
      return { atoms, box };
    }

    if (type === 'hcp') {
      const a = L / Math.max(1, Math.round(Math.pow((targetN || 256) / 2, 1 / 3)));
      const c = a * Math.sqrt(8 / 3);
      const nz = Math.max(1, Math.floor(L / c));
      const nx = Math.max(1, Math.floor(L / a));
      const ny = Math.max(1, Math.floor(L / (a * Math.sqrt(3))));
      const basis0 = [[0, 0, 0], [1 / 2, Math.sqrt(3) / 2, 0]];
      const basis1 = [[1 / 2, 1 / (2 * Math.sqrt(3)), 0.5], [0, 1 / Math.sqrt(3), 0.5]];
      for (let iz = 0; iz < nz; iz++) {
        for (let iy = 0; iy < ny; iy++) {
          for (let ix = 0; ix < nx; ix++) {
            const bases = iz % 2 === 0 ? basis0 : basis1;
            bases.forEach(([bx, by, bz]) => {
              const x = (ix + bx) * a - half;
              const y = (iy + by) * a * Math.sqrt(3) - half;
              const z = (iz + bz) * c - half;
              if (Math.abs(x) < half && Math.abs(y) < half && Math.abs(z) < half) {
                atoms.push(toMDAtom(x, y, z, 'A'));
              }
            });
          }
        }
      }
      return { atoms, box };
    }

    if (type === 'diamond') {
      const n = Math.max(1, Math.round(Math.pow((targetN || 512) / 8, 1 / 3)));
      const a = L / n;
      const basis = [
        [0, 0, 0], [0.5, 0.5, 0], [0.5, 0, 0.5], [0, 0.5, 0.5],
        [0.25, 0.25, 0.25], [0.75, 0.75, 0.25], [0.75, 0.25, 0.75], [0.25, 0.75, 0.75]
      ];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          for (let k = 0; k < n; k++) {
            basis.forEach(([bx, by, bz]) => {
              atoms.push(toMDAtom(
                (i + bx) * a - half, (j + by) * a - half, (k + bz) * a - half,
                'Si'
              ));
            });
          }
        }
      }
      return { atoms, box };
    }

    if (type === 'nacl') {
      const n = Math.max(1, Math.round(Math.pow((targetN || 512) / 8, 1 / 3)));
      const a = L / n;
      const na = [[0, 0, 0], [0.5, 0.5, 0], [0.5, 0, 0.5], [0, 0.5, 0.5]];
      const cl = [[0.5, 0, 0], [0, 0.5, 0], [0, 0, 0.5], [0.5, 0.5, 0.5]];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          for (let k = 0; k < n; k++) {
            na.forEach(([bx, by, bz]) => {
              atoms.push(toMDAtom(
                (i + bx) * a - half, (j + by) * a - half, (k + bz) * a - half,
                'Na'
              ));
            });
            cl.forEach(([bx, by, bz]) => {
              atoms.push(toMDAtom(
                (i + bx) * a - half, (j + by) * a - half, (k + bz) * a - half,
                'Cl'
              ));
            });
          }
        }
      }
      return { atoms, box };
    }

    if (type === 'zincblende') {
      const n = Math.max(1, Math.round(Math.pow((targetN || 512) / 8, 1 / 3)));
      const a = L / n;
      const zn = [[0, 0, 0], [0.5, 0.5, 0], [0.5, 0, 0.5], [0, 0.5, 0.5]];
      const s = [[0.25, 0.25, 0.25], [0.75, 0.75, 0.25], [0.75, 0.25, 0.75], [0.25, 0.75, 0.75]];
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          for (let k = 0; k < n; k++) {
            zn.forEach(([bx, by, bz]) => {
              atoms.push(toMDAtom(
                (i + bx) * a - half, (j + by) * a - half, (k + bz) * a - half,
                'Zn'
              ));
            });
            s.forEach(([bx, by, bz]) => {
              atoms.push(toMDAtom(
                (i + bx) * a - half, (j + by) * a - half, (k + bz) * a - half,
                'S'
              ));
            });
          }
        }
      }
      return { atoms, box };
    }

    return buildLattice('sc', box, targetN);
  }

  function replicateSupercell(atoms, box, nx, ny, nz) {
    if (!atoms || !atoms.length) return { atoms: [], box: [box[0] * nx, box[1] * ny, box[2] * nz] };
    const out = [];
    for (let ix = 0; ix < nx; ix++) {
      for (let iy = 0; iy < ny; iy++) {
        for (let iz = 0; iz < nz; iz++) {
          atoms.forEach(a => {
            out.push(toMDAtom(
              a.x + ix * box[0], a.y + iy * box[1], a.z + iz * box[2],
              a.element, a.vx, a.vy, a.vz
            ));
          });
        }
      }
    }
    return {
      atoms: out,
      box: [box[0] * nx, box[1] * ny, box[2] * nz]
    };
  }

  function parseXYZ(text) {
    const lines = text.trim().split('\n').filter(l => l.trim());
    const n = parseInt(lines[0], 10);
    if (isNaN(n) || lines.length < n + 2) return null;
    const atoms = [];
    for (let i = 0; i < n; i++) {
      const parts = lines[i + 2].trim().split(/\s+/);
      if (parts.length >= 4) {
        const el = parts[0];
        atoms.push(toMDAtom(
          parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]),
          el,
          parts.length >= 7 ? parseFloat(parts[4]) : 0,
          parts.length >= 7 ? parseFloat(parts[5]) : 0,
          parts.length >= 7 ? parseFloat(parts[6]) : 0
        ));
      }
    }
    return atoms.length ? atoms : null;
  }

  function parsePDB(text) {
    const atoms = [];
    text.split('\n').forEach(line => {
      if (line.startsWith('ATOM') || line.startsWith('HETATM')) {
        const el = (line.substring(76, 78) || line.substring(12, 16)).trim().replace(/\d/g, '') || 'X';
        const x = parseFloat(line.substring(30, 38));
        const y = parseFloat(line.substring(38, 46));
        const z = parseFloat(line.substring(46, 54));
        if (!isNaN(x)) atoms.push(toMDAtom(x, y, z, el));
      }
    });
    return atoms.length ? atoms : null;
  }

  function parsePOSCAR(text) {
    const lines = text.trim().split('\n').map(l => l.trim()).filter(l => l);
    if (lines.length < 8) return null;
    const scale = parseFloat(lines[1]);
    const a = lines[2].split(/\s+/).filter(Boolean).map(Number).map(x => x * scale);
    const b = lines[3].split(/\s+/).filter(Boolean).map(Number).map(x => x * scale);
    const c = lines[4].split(/\s+/).filter(Boolean).map(Number).map(x => x * scale);
    let types = lines[5].split(/\s+/).filter(Boolean);
    let counts = lines[6].split(/\s+/).filter(Boolean).map(Number);
    let idx = 7;
    let direct = true;
    if (counts.some(isNaN)) {
      types = lines[6].split(/\s+/).filter(Boolean);
      counts = lines[7].split(/\s+/).filter(Boolean).map(Number);
      idx = 8;
    }
    const coordLine = (lines[idx] || '').toLowerCase();
    if (coordLine === 'direct' || coordLine === 'cartesian') {
      direct = coordLine === 'direct';
      idx++;
    }
    const elList = types;
    const countList = counts;
    const atoms = [];
    for (let t = 0; t < elList.length; t++) {
      const n = countList[t] || 1;
      for (let i = 0; i < n; i++) {
        const parts = (lines[idx] || '').trim().split(/\s+/);
        idx++;
        const x = parseFloat(parts[0]), y = parseFloat(parts[1]), z = parseFloat(parts[2]);
        let cartX, cartY, cartZ;
        if (direct) {
          cartX = a[0] * x + b[0] * y + c[0] * z;
          cartY = a[1] * x + b[1] * y + c[1] * z;
          cartZ = a[2] * x + b[2] * y + c[2] * z;
        } else {
          cartX = x; cartY = y; cartZ = z;
        }
        atoms.push(toMDAtom(cartX, cartY, cartZ, elList[t]));
      }
    }
    const box = [
      Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]),
      Math.sqrt(b[0] * b[0] + b[1] * b[1] + b[2] * b[2]),
      Math.sqrt(c[0] * c[0] + c[1] * c[1] + c[2] * c[2])
    ];
    return atoms.length ? { atoms, box } : null;
  }

  function parseCIF(text) {
    const aM = text.match(/_cell_length_a\s+([\d.]+)/);
    const bM = text.match(/_cell_length_b\s+([\d.]+)/);
    const cM = text.match(/_cell_length_c\s+([\d.]+)/);
    const a = aM ? parseFloat(aM[1]) : 5;
    const b = bM ? parseFloat(bM[1]) : a;
    const c = cM ? parseFloat(cM[1]) : a;
    const block = text.match(/_atom_site_fract_x[\s\S]*?(?=loop_|$)/);
    if (!block) return null;
    const rows = block[0].trim().split('\n').filter(l => !/^_/.test(l.trim()) && l.trim());
    const atoms = [];
    rows.forEach(row => {
      const p = row.trim().split(/\s+/);
      if (p.length >= 5) {
        const sym = (p[1] || p[0]).replace(/[^A-Za-z]/g, '') || 'X';
        const fx = parseFloat(p[2]), fy = parseFloat(p[3]), fz = parseFloat(p[4]);
        if (!isNaN(fx)) {
          atoms.push(toMDAtom(fx * a, fy * b, fz * c, sym));
        }
      }
    });
    return atoms.length ? { atoms, box: [a, b, c] } : null;
  }

  function detectFormat(text) {
    const t = text.trim();
    if (/^\d+\s*\n/.test(t) && t.split('\n').length > 2) return 'xyz';
    if (/^ATOM\s+|^HETATM\s+/.test(t)) return 'pdb';
    if (/^[A-Za-z ]+\s*\n\s*[\d.]+\s*\n/.test(t)) return 'poscar';
    if (/^data_|_cell\.|_atom_site/.test(t)) return 'cif';
    if (/^\s*#\s*LAMMPS|^\s*\d+\s+atoms/.test(t)) return 'lammps';
    return null;
  }

  function parseStructure(text) {
    const fmt = detectFormat(text);
    if (fmt === 'xyz') {
      const atoms = parseXYZ(text);
      return atoms ? { atoms, box: null } : null;
    }
    if (fmt === 'pdb') {
      const atoms = parsePDB(text);
      return atoms ? { atoms, box: null } : null;
    }
    if (fmt === 'poscar') return parsePOSCAR(text);
    if (fmt === 'cif') return parseCIF(text);
    if (fmt === 'lammps') return { atoms: parseXYZ(text), box: null };
    return null;
  }

  const MDStructure = {
    ELEMENTS,
    getElement,
    toMDAtom,
    buildLattice,
    replicateSupercell,
    parseXYZ,
    parsePDB,
    parsePOSCAR,
    parseCIF,
    detectFormat,
    parseStructure
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = MDStructure;
  else global.MDStructure = MDStructure;
})(typeof self !== 'undefined' ? self : this);
