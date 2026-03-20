/**
 * state.js — CrystalForge single source of truth
 *
 * ALL application state lives here. No module may hold its own
 * mutable copy of structure data. Mutations are made by calling
 * the named setters so that the change can be observed.
 *
 * Data flow:
 *   events.js  →  app.js  →  state.js  →  renderer.js / ui.js
 */

'use strict';

// ─── Element database ────────────────────────────────────────────────────────
export const EL = {
  H:  { Z:1,  name:'Hydrogen',   mass:1.008,   color:'#ffffff', r:0.25, eps:0.00074, sig:2.40, eneg:2.20 },
  He: { Z:2,  name:'Helium',     mass:4.003,   color:'#d9ffff', r:0.28, eps:0.00022, sig:2.58, eneg:0    },
  Li: { Z:3,  name:'Lithium',    mass:6.941,   color:'#cc80ff', r:0.50, eps:0.00265, sig:2.73, eneg:0.98 },
  Be: { Z:4,  name:'Beryllium',  mass:9.012,   color:'#c2ff00', r:0.45, eps:0.006,    sig:2.44, eneg:1.57 },
  B:  { Z:5,  name:'Boron',      mass:10.81,   color:'#ffb5b5', r:0.38, eps:0.012,    sig:2.08, eneg:2.04 },
  C:  { Z:6,  name:'Carbon',     mass:12.011,  color:'#909090', r:0.38, eps:0.00347, sig:3.47, eneg:2.55 },
  N:  { Z:7,  name:'Nitrogen',   mass:14.007,  color:'#3050f8', r:0.36, eps:0.00664, sig:3.26, eneg:3.04 },
  O:  { Z:8,  name:'Oxygen',     mass:15.999,  color:'#ff2020', r:0.34, eps:0.00657, sig:3.12, eneg:3.44 },
  F:  { Z:9,  name:'Fluorine',   mass:18.998,  color:'#90e050', r:0.32, eps:0.0044,  sig:2.94, eneg:3.98 },
  Ne: { Z:10, name:'Neon',       mass:20.18,   color:'#b3e0ff', r:0.34, eps:0.00296, sig:2.74, eneg:0    },
  Na: { Z:11, name:'Sodium',     mass:22.99,   color:'#ab5cf2', r:0.55, eps:0.005,    sig:2.50, eneg:0.93 },
  Mg: { Z:12, name:'Magnesium',  mass:24.305,  color:'#8aff00', r:0.50, eps:0.00773, sig:2.74, eneg:1.31 },
  Al: { Z:13, name:'Aluminium',  mass:26.982,  color:'#bfa6a6', r:0.50, eps:0.0222,  sig:2.55, eneg:1.61 },
  Si: { Z:14, name:'Silicon',    mass:28.086,  color:'#f0c060', r:0.48, eps:0.020,    sig:2.10, eneg:1.90 },
  P:  { Z:15, name:'Phosphorus', mass:30.974,  color:'#ff8000', r:0.46, eps:0.015,    sig:3.69, eneg:2.19 },
  S:  { Z:16, name:'Sulfur',     mass:32.06,   color:'#ffff30', r:0.44, eps:0.0109,   sig:3.59, eneg:2.58 },
  Cl: { Z:17, name:'Chlorine',   mass:35.45,   color:'#1ff01f', r:0.44, eps:0.0105,   sig:3.52, eneg:3.16 },
  Ar: { Z:18, name:'Argon',      mass:39.948,  color:'#80d4ff', r:0.45, eps:0.01032,  sig:3.405,eneg:0    },
  K:  { Z:19, name:'Potassium',  mass:39.098,  color:'#8f40d4', r:0.62, eps:0.0036,   sig:3.40, eneg:0.82 },
  Ca: { Z:20, name:'Calcium',    mass:40.078,  color:'#3dff00', r:0.58, eps:0.010,    sig:2.97, eneg:1.00 },
  Ti: { Z:22, name:'Titanium',   mass:47.867,  color:'#bfc2c7', r:0.52, eps:0.028,    sig:2.83, eneg:1.54 },
  Cr: { Z:24, name:'Chromium',   mass:51.996,  color:'#8a99c7', r:0.49, eps:0.040,    sig:2.77, eneg:1.66 },
  Mn: { Z:25, name:'Manganese',  mass:54.938,  color:'#9c7ac7', r:0.49, eps:0.040,    sig:2.74, eneg:1.55 },
  Fe: { Z:26, name:'Iron',       mass:55.845,  color:'#e06633', r:0.50, eps:0.050,    sig:2.48, eneg:1.83 },
  Co: { Z:27, name:'Cobalt',     mass:58.933,  color:'#f090a0', r:0.48, eps:0.055,    sig:2.52, eneg:1.88 },
  Ni: { Z:28, name:'Nickel',     mass:58.693,  color:'#50d050', r:0.48, eps:0.051,    sig:2.48, eneg:1.91 },
  Cu: { Z:29, name:'Copper',     mass:63.546,  color:'#c88033', r:0.48, eps:0.040,    sig:2.34, eneg:1.90 },
  Zn: { Z:30, name:'Zinc',       mass:65.38,   color:'#7d80b0', r:0.48, eps:0.035,    sig:2.46, eneg:1.65 },
  Ga: { Z:31, name:'Gallium',    mass:69.723,  color:'#c28f8f', r:0.48, eps:0.040,    sig:2.74, eneg:1.81 },
  Ge: { Z:32, name:'Germanium',  mass:72.63,   color:'#668f8f', r:0.47, eps:0.038,    sig:2.79, eneg:2.01 },
  Se: { Z:34, name:'Selenium',   mass:78.971,  color:'#ffa100', r:0.45, eps:0.018,    sig:3.73, eneg:2.55 },
  Br: { Z:35, name:'Bromine',    mass:79.904,  color:'#a62929', r:0.46, eps:0.020,    sig:3.73, eneg:2.96 },
  Kr: { Z:36, name:'Krypton',    mass:83.798,  color:'#5cb8d1', r:0.50, eps:0.014,    sig:3.60, eneg:3.00 },
  Sr: { Z:38, name:'Strontium',  mass:87.62,   color:'#00ff00', r:0.60, eps:0.011,    sig:3.24, eneg:0.95 },
  Y:  { Z:39, name:'Yttrium',    mass:88.906,  color:'#94ffff', r:0.56, eps:0.023,    sig:3.07, eneg:1.22 },
  Zr: { Z:40, name:'Zirconium',  mass:91.224,  color:'#94e0e0', r:0.54, eps:0.030,    sig:2.78, eneg:1.33 },
  Mo: { Z:42, name:'Molybdenum', mass:95.95,   color:'#54b5b5', r:0.51, eps:0.048,    sig:2.74, eneg:2.16 },
  Ag: { Z:47, name:'Silver',     mass:107.868, color:'#c0c0c0', r:0.52, eps:0.034,    sig:2.65, eneg:1.93 },
  Sn: { Z:50, name:'Tin',        mass:118.71,  color:'#668080', r:0.53, eps:0.029,    sig:2.94, eneg:1.96 },
  Ba: { Z:56, name:'Barium',     mass:137.327, color:'#00c900', r:0.63, eps:0.016,    sig:3.59, eneg:0.89 },
  La: { Z:57, name:'Lanthanum',  mass:138.905, color:'#70d4ff', r:0.60, eps:0.025,    sig:3.58, eneg:1.10 },
  Hf: { Z:72, name:'Hafnium',    mass:178.49,  color:'#4dc2ff', r:0.52, eps:0.040,    sig:2.80, eneg:1.30 },
  W:  { Z:74, name:'Tungsten',   mass:183.84,  color:'#2194d6', r:0.49, eps:0.060,    sig:2.72, eneg:2.36 },
  Pt: { Z:78, name:'Platinum',   mass:195.084, color:'#d0d0e0', r:0.49, eps:0.047,    sig:2.54, eneg:2.28 },
  Au: { Z:79, name:'Gold',       mass:196.967, color:'#ffd123', r:0.50, eps:0.0369,   sig:2.63, eneg:2.54 },
  Pb: { Z:82, name:'Lead',       mass:207.2,   color:'#575961', r:0.54, eps:0.026,    sig:3.09, eneg:2.33 },
  Bi: { Z:83, name:'Bismuth',    mass:208.98,  color:'#9e4fb5', r:0.54, eps:0.023,    sig:3.26, eneg:2.02 },
  U:  { Z:92, name:'Uranium',    mass:238.029, color:'#008fff', r:0.55, eps:0.060,    sig:3.24, eneg:1.38 },
};

// ─── Prototype definitions ────────────────────────────────────────────────────
// atoms: fractional coords + element slot ('A'|'B'|'C')
// FCC/BCC expansions are applied in app.js::expandProtoAtoms()
export const PROTOTYPES = {
  sc:        { a:3.0,  sg:221, sgSym:'Pm-3m',    crystal:'Cubic',      gamma:90,  bElements:0,
               atoms:[{el:'A',x:0,y:0,z:0}] },
  fcc:       { a:4.046,sg:225, sgSym:'Fm-3m',    crystal:'Cubic',      gamma:90,  bElements:0,
               atoms:[{el:'A',x:0,y:0,z:0}] },
  bcc:       { a:2.87, sg:229, sgSym:'Im-3m',    crystal:'Cubic',      gamma:90,  bElements:0,
               atoms:[{el:'A',x:0,y:0,z:0}] },
  diamond:   { a:5.43, sg:227, sgSym:'Fd-3m',    crystal:'Cubic',      gamma:90,  bElements:0,
               atoms:[{el:'A',x:0,y:0,z:0},{el:'A',x:.25,y:.25,z:.25}] },
  hcp:       { a:3.21, c:5.21,sg:194, sgSym:'P6_3/mmc',crystal:'Hexagonal',gamma:120,bElements:0,
               atoms:[{el:'A',x:1/3,y:2/3,z:.25},{el:'A',x:2/3,y:1/3,z:.75}] },
  nacl:      { a:5.64, sg:225, sgSym:'Fm-3m',    crystal:'Cubic',      gamma:90,  bElements:1,
               atoms:[{el:'A',x:0,y:0,z:0},{el:'B',x:.5,y:.5,z:.5}] },
  zincblende:{ a:5.43, sg:216, sgSym:'F-43m',    crystal:'Cubic',      gamma:90,  bElements:1,
               atoms:[{el:'A',x:0,y:0,z:0},{el:'B',x:.25,y:.25,z:.25}] },
  perovskite:{ a:3.905,sg:221, sgSym:'Pm-3m',    crystal:'Cubic',      gamma:90,  bElements:2,
               atoms:[{el:'A',x:.5,y:.5,z:.5},{el:'B',x:0,y:0,z:0},
                      {el:'C',x:.5,y:0,z:0},{el:'C',x:0,y:.5,z:0},{el:'C',x:0,y:0,z:.5}] },
  spinel:    { a:8.09, sg:227, sgSym:'Fd-3m',    crystal:'Cubic',      gamma:90,  bElements:2,
               atoms:[{el:'A',x:0,y:0,z:0},{el:'A',x:.25,y:.25,z:.25},
                      {el:'B',x:.625,y:.625,z:.625},{el:'B',x:.875,y:.875,z:.875},
                      {el:'C',x:.25,y:.25,z:.5},{el:'C',x:0,y:.5,z:.25}] },
  graphite:  { a:2.464,c:6.71,sg:194, sgSym:'P6_3/mmc',crystal:'Hexagonal',gamma:120,bElements:0,
               atoms:[{el:'A',x:0,y:0,z:.25},{el:'A',x:1/3,y:2/3,z:.25},
                      {el:'A',x:0,y:0,z:.75},{el:'A',x:2/3,y:1/3,z:.75}] },
  custom:    { a:5.0,  sg:1,   sgSym:'P1',       crystal:'Triclinic',  gamma:90,  bElements:0,
               atoms:[] },
};

// ─── DB quick-load map ──────────────────────────────────────────────────────
export const DB_PRESETS = {
  mp_Al:      { proto:'fcc',        elA:'Al',                         note:'Al FCC'    },
  mp_Fe:      { proto:'bcc',        elA:'Fe',                         note:'Fe BCC'    },
  mp_Si:      { proto:'diamond',    elA:'Si',                         note:'Si diamond'},
  mp_NaCl:    { proto:'nacl',       elA:'Na', elB:'Cl',               note:'NaCl'      },
  mp_TiO2:    { proto:'custom',     elA:'Ti', elB:'O',  a:4.59,c:2.96,note:'TiO₂ rutile (custom)'},
  mp_BaTiO3:  { proto:'perovskite', elA:'Ba', elB:'Ti', elC:'O', a:3.99, note:'BaTiO₃'},
  mp_MgAl2O4: { proto:'spinel',     elA:'Mg', elB:'Al', elC:'O',      note:'Spinel'   },
  mp_graphite: { proto:'graphite',  elA:'C',                          note:'Graphite' },
};

// ─── Application state ─────────────────────────────────────────────────────
export const state = {
  // Crystal geometry
  lattice: {
    a: 4.046, b: 4.046, c: 4.046,
    alpha: 90, beta: 90, gamma: 90,
  },

  // Atoms: { el, x,y,z (frac), cx,cy,cz (cart), id:number, coord?:number }
  atoms: [],

  // Derived matrices (rebuilt by app on every lattice change)
  M:    null,   // 3×3 orthogonalisation matrix
  Minv: null,   // inverse

  // Space group info
  spaceGroup: { num: 225, symbol: 'Fm-3m', crystal: 'Cubic', system: 'cubic' },

  // Active prototype key
  activeProto: 'fcc',

  // Element assignment for multi-species prototypes
  elements: { A: 'Al', B: 'O', C: 'O' },

  // Per-run analysis results (populated by app.analyse())
  analysis: {
    rdf:        null,
    xrd:        null,
    adf:        null,
    bonds:      [],
    coordCounts:{},
  },

  // Evolutionary CSP state
  optimizer: {
    running:      false,
    generation:   0,
    population:   [],
    bestEnergy:   Infinity,
    energyHistory: [],
  },

  // Visualization settings
  settings: {
    atomScale:   0.4,
    bondCutoff:  3.2,
    colorScheme: 'element',
    showCell:    true,
    showBonds:   false,
    showPoly:    false,
    showAxes:    true,
    autoRot:     true,
    spaceFill:   false,
  },

  // UI state (no logic)
  ui: {
    activeMainTab: 'build',
    activePlot:    'energy',
    theme:         'light',
    selectedAtomId: null,
  },

  // History snapshots for undo/redo
  history: [],
  future: [],
};

// ─── Validators ─────────────────────────────────────────────────────────────

/**
 * Returns true if `sym` is a recognised element symbol.
 * @param {string} sym
 * @returns {boolean}
 */
export function isValidElement(sym) {
  if (!sym || typeof sym !== 'string') return false;
  const s = sym.trim().charAt(0).toUpperCase() + sym.trim().slice(1).toLowerCase();
  return Object.prototype.hasOwnProperty.call(EL, s);
}

/**
 * Normalise an element string → 'Al', 'O', etc.
 * Returns null if invalid.
 * @param {string} raw
 * @returns {string|null}
 */
export function normaliseElement(raw) {
  if (!raw) return null;
  const s = raw.trim().charAt(0).toUpperCase() + raw.trim().slice(1).toLowerCase();
  return EL[s] ? s : null;
}

/**
 * Clamp a value between lo and hi.
 * @param {number} v
 * @param {number} lo
 * @param {number} hi
 * @returns {number}
 */
export function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, Number(v)));
}

/**
 * Validate and clamp all lattice parameter inputs.
 * Returns a normalised lattice object, never throws.
 * @param {object} raw — { a, b, c, alpha, beta, gamma }
 * @returns {object}
 */
export function validateLattice(raw) {
  return {
    a:     clamp(parseFloat(raw.a)     || 4.0, 0.5, 500),
    b:     clamp(parseFloat(raw.b)     || 4.0, 0.5, 500),
    c:     clamp(parseFloat(raw.c)     || 4.0, 0.5, 500),
    alpha: clamp(parseFloat(raw.alpha) || 90,  10,  170),
    beta:  clamp(parseFloat(raw.beta)  || 90,  10,  170),
    gamma: clamp(parseFloat(raw.gamma) || 90,  10,  170),
  };
}

// ─── Mutation helpers ─────────────────────────────────────────────────────
// Centralised setters keep future observability hooks easy to add.

/** Replace the full atom list and reset analysis. */
export function setAtoms(atoms) {
  state.atoms = atoms;
  state.analysis = { rdf:null, xrd:null, adf:null, bonds:[], coordCounts:{} };
}

/** Merge new lattice values (validated). */
export function setLattice(raw) {
  Object.assign(state.lattice, validateLattice(raw));
}

/** Update a single settings key with clamping for numerics. */
export function setSetting(key, value) {
  const limits = { atomScale:[0.05,3.0], bondCutoff:[0.5,15.0] };
  if (limits[key]) {
    state.settings[key] = clamp(value, limits[key][0], limits[key][1]);
  } else {
    state.settings[key] = value;
  }
}

/** Update a UI state key. */
export function setUI(key, value) {
  state.ui[key] = value;
}

/** Set the active element for slot 'A', 'B', or 'C'. Validates symbol. */
export function setElement(slot, raw) {
  const sym = normaliseElement(raw);
  if (!sym) throw new Error(`Unknown element: "${raw}"`);
  state.elements[slot] = sym;
}

