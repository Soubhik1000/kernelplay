import { Renderer } from "./Renderer.js";
import * as PIXI from "pixi.js";

export class WebGL2DRenderer extends Renderer {
  async init(game) {
    super.init(game);

    this.type = "pixi";

    this.app = new PIXI.Application();

    // 🔥 IMPORTANT: init first
    await this.app.init({
      width: game.config.width,
      height: game.config.height,
      background: game.config.backgroundColor,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true
    });
    
    game.canvas.canvas.replaceWith(this.app.canvas);
    game.canvas.canvas = this.app.canvas;
    this.stage = this.app.stage;
  }

  render(scene) {
    for (const entity of scene.entities) {
      const t = entity.getComponent("transform");
      const renderer = entity.getComponent("renderer");
      
      
      if (!t || !renderer) continue;
      
      renderer.object.position.set(
        t.position.x,
        t.position.y
      );

      renderer.object.rotation = t.rotation.z;

      renderer.object.scale.set(
        t.scale.x,
        t.scale.y
      );
    }
  }

  destroy() {
    this.app.destroy(true);
  }
}
