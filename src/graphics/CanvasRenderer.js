import { Renderer } from "./Renderer.js";

export class CanvasRenderer extends Renderer {
    init(game) {
        super.init(game);

        this.ctx = game.canvas.canvas.getContext("2d");

        // Fill background on init
        this.ctx.fillStyle = game.config.backgroundColor;
        this.ctx.fillRect(0, 0, game.config.width, game.config.height);
    }

    render(scene) {
        const { width, height } = scene.game.config;
        // const ctx = scene.game.ctx;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, width, height);

        for (const entity of scene.entities) {
            entity.render(ctx);
        }
    }
}
