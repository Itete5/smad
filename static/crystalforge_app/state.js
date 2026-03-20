// Global single source of truth for CrystalForge.
// All UI and engine code should read/write from this object.
export const state = {
  lattice: {
    a: 4.046,
    b: 4.046,
    c: 4.046,
    alpha: 90,
    beta: 90,
    gamma: 90,
  },
  atoms: [], // { el, x,y,z (frac), id } with derived cart coords cached by renderer as needed
  species: [],
  spaceGroup: { num: 225, symbol: 'Fm-3m', crystal: 'Cubic', system: 'cubic' },
  history: [], // Past snapshots (undo)
  future: [], // Future snapshots (redo)

  settings: {
    atomScale: 0.4,
    bondCutoff: 3.2,
    showCell: true,
    showAxes: true,
    showBonds: false,
    showPoly: false,
    autoRot: true,
    theme: 'light',
  },

  // Derived internal values. Not part of "scientific state", but required for geometry.
  _M: null, // orthogonalization matrix
  _Minv: null, // inverse matrix
};

