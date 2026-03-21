export class CrystalEvents {
  constructor({ app }) {
    this.app = app;
  }

  bind() {
    this.app.el.buildBtn.addEventListener('click', () => {
      this.app._buildStructure();
    });

    document.getElementById('resetCamBtn')?.addEventListener('click', () => {
      this.app.renderer.camera.position.set(6, 6, 6);
    });

    document.getElementById('autoRotBtn')?.addEventListener('click', () => {
      this.app.renderer.scene.rotation.y += 0.5;
    });
  }
}

