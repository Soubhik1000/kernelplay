import { Renderer } from "./Renderer.js";
import { AABB } from "../core/physics/Collision.js";

export class CanvasRenderer extends Renderer {
    init(game) {
        super.init(game);

        this.ctx = game.canvas.canvas.getContext("2d");
        this.camera = game.camera;

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

    // render(scene) {
    //     const { width, height } = scene.game.config;
    //     const ctx = this.ctx;

    //     ctx.clearRect(0, 0, width, height);

    //     const renderers = scene._renderers;

    //     // 🔥 Group by color
    //     const groups = new Map();

    //     for (const r of renderers) {
    //         if (!r.entity.active) continue;

    //         if (!groups.has(r.color)) {
    //             groups.set(r.color, []);
    //         }

    //         groups.get(r.color).push(r);
    //     }

    //     // 🔥 Draw grouped
    //     for (const [color, batch] of groups) {

    //         ctx.fillStyle = color;

    //         for (const r of batch) {
    //             r.render(ctx);
    //         }
    //     }
    // }

    // render(scene) {
    //     const { width, height } = scene.game.config;
    //     const ctx = this.ctx;

    //     ctx.clearRect(0, 0, width, height);

    //     const camera = this.camera;
    //     const cameraBounds = camera.viewBounds;

    //     ctx.save();
    //     ctx.translate(-camera.x, -camera.y);

    //     const renderers = scene._renderers;

    //     const groups = new Map();

    //     for (const r of renderers) {
    //         if (!r.entity.active) continue;

    //         // 🔥 FRUSTUM CULLING
    //         if (!AABB(r.getBounds(), cameraBounds)) {
    //             continue;
    //         }

    //         if (!groups.has(r.color)) {
    //             groups.set(r.color, []);
    //         }

    //         groups.get(r.color).push(r);
    //     }

    //     for (const [color, batch] of groups) {
    //         ctx.fillStyle = color;

    //         for (const r of batch) {
    //             r.render(ctx);
    //         }
    //     }
    // }

    render(scene) {
        const { width, height } = scene.game.config;
        const ctx = this.ctx;

        ctx.clearRect(0, 0, width, height);

        const camera = this.camera;
        const cameraBounds = camera.viewBounds;

        ctx.save();
        ctx.translate(-camera.x, -camera.y);

        // 🔥 CHANGED: Use spatial grid query instead of looping all renderers
        const visibleRenderers = scene._getVisibleRenderers(cameraBounds);

        // 🔥 SORT BY Z-INDEX
        // visibleRenderers.sort((a, b) => a.zIndex - b.zIndex);

        // 🔥 Check entity.zIndex first, fallback to component.zIndex
        visibleRenderers.sort((a, b) => {
            const aZ = a.entity.zIndex ?? a.zIndex ?? 0;
            const bZ = b.entity.zIndex ?? b.zIndex ?? 0;
            return aZ - bZ;
        });


        const groups = new Map();

        // 🔥 Now only loop through visible objects (maybe 50-200 instead of 20,000!)
        for (const r of visibleRenderers) {
            if (!groups.has(r.color)) {
                groups.set(r.color, []);
            }

            groups.get(r.color).push(r);
        }

        for (const [color, batch] of groups) {
            ctx.fillStyle = color;

            for (const r of batch) {
                r.render(ctx);
            }
        }

        ctx.restore(); // 🔥 Don't forget this!
    }
}
