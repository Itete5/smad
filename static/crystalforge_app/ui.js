export class CrystalUI {
  constructor({ state, elements }) {
    this.state = state;
    this.el = elements;
  }

  update() {
    this.el.hudN.textContent = this.state.atoms.length;

    this.el.atomList.innerHTML = this.state.atoms
      .map((a) => `${a.element}: (${a.x.toFixed(2)}, ${a.y.toFixed(2)}, ${a.z.toFixed(2)})`)
      .join('<br>');
  }
}

