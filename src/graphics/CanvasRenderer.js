import { Renderer } from "./Renderer.js";

export class CanvasRenderer extends Renderer {
    init(game) {
        super.init(game);

        this.ctx = game.canvas.canvas.getContext("2d");

        // Fill background on init
        this.ctx.fillStyle = game.config.backgroundColor;
        this.ctx.fillRect(0, 0, game.config.width, game.config.height);
    }

    // render(scene) {
    //     const { width, height } = scene.game.config;
    //     // const ctx = scene.game.ctx;
    //     const ctx = this.ctx;

    //     ctx.clearRect(0, 0, width, height);

    //     for (const entity of scene.entities) {
    //         entity.render(ctx);
    //     }
    // }

    render(scene) {
        const { width, height } = scene.game.config;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, width, height);

        const renderers = scene._renderers;

        // 🔥 Group by color
        const groups = new Map();

        for (const r of renderers) {
            if (!r.entity.active) continue;

            if (!groups.has(r.color)) {
                groups.set(r.color, []);
            }

            groups.get(r.color).push(r);
        }

        // 🔥 Draw grouped
        for (const [color, batch] of groups) {

            ctx.fillStyle = color;

            for (const r of batch) {
                r.render(ctx);
            }
        }
    }
}
