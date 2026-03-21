/* global Plotly */
import { state } from './state.js';
import { CrystalRenderer } from './renderer.js';
import { CrystalUI } from './ui.js';
import { CrystalEvents } from './events.js';

export class CrystalForgeApp {
  constructor() {
    this.state = state;

    this.el = this._collectElements();

    this.ui = new CrystalUI({ state: this.state, elements: this.el });
    this.renderer = new CrystalRenderer({ state: this.state, elements: this.el });

    this._init();

    new CrystalEvents({ app: this }).bind();
  }

  _collectElements() {
    return {
      canvas: document.getElementById('threeCanvas'),
      buildBtn: document.getElementById('buildBtn'),
      protoSelect: document.getElementById('protoSelect'),
      atomScale: document.getElementById('atomScale'),
      bondCutoff: document.getElementById('bondCutoff'),
      atomList: document.getElementById('atomList'),
      hudN: document.getElementById('hudN'),
    };
  }

  _init() {
    this.renderer.init();
    this._buildStructure();
    this.renderer.animate();
  }

  _buildStructure() {
    const proto = this.el.protoSelect.value;

    const a = 4.0;

    let atoms = [];

    if (proto === 'fcc') {
      atoms = [
        [0, 0, 0],
        [0.5, 0.5, 0],
        [0.5, 0, 0.5],
        [0, 0.5, 0.5],
      ];
    }

    if (proto === 'bcc') {
      atoms = [
        [0, 0, 0],
        [0.5, 0.5, 0.5],
      ];
    }

    if (proto === 'sc') {
      atoms = [[0, 0, 0]];
    }

    this.state.atoms = atoms.map((p) => ({
      element: 'A',
      x: p[0] * a,
      y: p[1] * a,
      z: p[2] * a,
    }));

    this.state.lattice = { a };

    this.renderer.renderStructure();
    this.ui.update();
  }
}

// BOOTSTRAP
window.addEventListener('DOMContentLoaded', () => {
  new CrystalForgeApp();
});

