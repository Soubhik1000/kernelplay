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

    // console.log(game);

    // stop Pixi internal loop
    // this.app.ticker.stop();
    
    game.canvas.canvas.replaceWith(this.app.canvas);
    game.canvas.canvas = this.app.canvas;
    this.stage = this.app.stage;

    console.log(this.stage);

    const box = new PIXI.Graphics()
        // 2. Define geometry: rect(x, y, width, height)
        .rect(0, 0, 150, 100)
        // 3. Set fill color
        .fill(0xff0000)
        // 4. Add an optional border (stroke)
        .stroke({ width: 4, color: 0xffffff });

      // Position the box
      box.x = this.app.screen.width / 2 - 75;
      box.y = this.app.screen.height / 2 - 50;

      this.stage.addChild(box);
    //   console.log(this.stage);
      

    // game.canvas.canvas = this.app.canvas;
    // document.body.appendChild(this.app.canvas);
  }

  render(scene) {
    for (const entity of scene.entities) {
      const t = entity.getComponent("transform");
      const renderer = entity.getComponent("renderer");

      if (!t || !renderer) continue;

      // console.log(renderer.object.position);
      

      renderer.object.position.set(
        t.position.x,
        t.position.y
      );
      // renderer.object.position.set(
      //   0,
      //   0
      // );

      renderer.object.rotation = t.rotation;

      renderer.object.scale.set(
        t.scale.x,
        t.scale.y
      );
    }
    
    // 🔥 THIS IS THE MISSING LINE
    // this.app.renderer.render(this.stage);
  }

  destroy() {
    this.app.destroy(true);
  }
}
