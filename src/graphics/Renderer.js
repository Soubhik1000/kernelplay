export class Renderer {
  constructor() {
    this.game = null;
  }

  /** Called once */
  init(game) {
    this.game = game;
  }

  /** Called every frame */
  render(scene) {}

  /** Optional */
  resize(width, height) {}

  /** Cleanup */
  destroy() {}
}
