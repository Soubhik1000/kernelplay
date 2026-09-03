import { Renderer } from "./Renderer.js";
import { AABB } from "../core/physics/Collision.js";

export class CanvasRenderer extends Renderer {
    init(game) {
        super.init(game);

        this.ctx = game.canvas.canvas.getContext("2d");
        this.camera = game.camera;
        this.debugPhysics = game.config.debugPhysics;
        // console.log(game.config);


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

        // const camera = this.camera;
        // 🔥 GET CAMERA
        const camera = scene.getPrimaryCamera();
        if (!camera) {
            // console.warn("No camera found in scene");
            return;
        }

        const cameraBounds = camera.viewBounds;

        ctx.save();
        // ctx.translate(-camera.x, -camera.y);

        // 🔥 APPLY CAMERA TRANSFORM
        ctx.translate(-cameraBounds.x, -cameraBounds.y);
        ctx.scale(camera.zoom, camera.zoom);

        // 🔥 CHANGED: Use spatial grid query instead of looping all renderers
        const visibleRenderers = scene._getVisibleRenderers(cameraBounds);

        // 🔥 SORT BY Z-INDEX
        // visibleRenderers.sort((a, b) => a.zIndex - b.zIndex);

        // 🔥 Check entity.zIndex first, fallback to component.zIndex
        if (visibleRenderers.length > 1) {
            visibleRenderers.sort((a, b) => {
                const aZ = a.entity.zIndex ?? a.zIndex ?? 0;
                const bZ = b.entity.zIndex ?? b.zIndex ?? 0;
                return aZ - bZ;
            });
        }


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

        // 🔥 ADD THIS: Debug draw colliders
        if (this.debugPhysics) {
            this.drawColliders(ctx, scene);
        }

        ctx.restore(); // 🔥 Don't forget this!
    }

    // render(scene) {
    //     const { width, height } = scene.game.config;
    //     const ctx = this.ctx;

    //     ctx.clearRect(0, 0, width, height);

    //     const camera = scene.getPrimaryCamera();
    //     if (!camera) return;

    //     const cameraBounds = camera.viewBounds;

    //     ctx.save();

    //     // 🔥 Camera transform
    //     ctx.translate(-cameraBounds.x, -cameraBounds.y);
    //     ctx.scale(camera.zoom, camera.zoom);

    //     // 🔥 Get visible renderers (spatial optimized)
    //     const visibleRenderers = scene._getVisibleRenderers(cameraBounds);

    //     // 🔥 Z-SORT (VERY IMPORTANT)
    //     if (visibleRenderers.length > 1) {
    //         visibleRenderers.sort((a, b) => {
    //             const aZ = a.entity?.zIndex ?? a.zIndex ?? 0;
    //             const bZ = b.entity?.zIndex ?? b.zIndex ?? 0;
    //             return aZ - bZ;
    //         });
    //     }

    //     // 🔥 SPLIT PIPELINES
    //     const groups = new Map();   // batchable (color)
    //     const nonBatch = [];        // sprites, text, etc.

    //     for (const r of visibleRenderers) {

    //         // 🔥 Detect batchable
    //         const isBatchable = r.color !== undefined && r.batchable !== false;

    //         if (!isBatchable) {
    //             nonBatch.push(r);
    //             continue;
    //         }

    //         // 🔥 Group by color
    //         if (!groups.has(r.color)) {
    //             groups.set(r.color, []);
    //         }

    //         groups.get(r.color).push(r);
    //     }

    //     // 🔵 PASS 1: Batched shapes
    //     for (const [color, batch] of groups) {
    //         ctx.fillStyle = color;

    //         for (const r of batch) {
    //             r.render(ctx);
    //         }
    //     }

    //     // 🟢 PASS 2: Non-batched (sprites, etc.)
    //     for (const r of nonBatch) {
    //         r.render(ctx);
    //     }

    //     // 🔥 Debug
    //     if (this.debugPhysics) {
    //         this.drawColliders(ctx, scene);
    //     }

    //     ctx.restore();
    // }

    // 🔥 ADD THIS METHOD

    // drawColliders(ctx, scene) {
    //     ctx.strokeStyle = "#00FF00"; // Green for normal colliders
    //     ctx.lineWidth = 2;

    //     for (const collider of scene._colliders) {
    //         const bounds = collider.bounds;

    //         // Draw rectangle
    //         ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);

    //         // Draw trigger colliders in different color
    //         if (collider.isTrigger) {
    //             ctx.strokeStyle = "#FFFF00"; // Yellow for triggers
    //             ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    //             ctx.strokeStyle = "#00FF00";
    //         }
    //     }
    // }

    drawColliders(ctx, scene) {
  for (const collider of scene._colliders) {
    const bounds    = collider.bounds;
    const cx        = bounds.x + bounds.width  / 2;
    const cy        = bounds.y + bounds.height / 2;
    const angle     = collider.transform?.rotation ?? 0;
    const isTrigger = collider.isTrigger;

    ctx.save();

    // ── Collider rectangle ────────────────────────────────────────
    ctx.strokeStyle = isTrigger ? "#FFD600" : "#00E676";
    ctx.lineWidth   = isTrigger ? 1.5 : 2;
    if (isTrigger) ctx.setLineDash([5, 4]);
    else           ctx.setLineDash([]);
    ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    ctx.setLineDash([]);

    // ── Center dot — cyan ─────────────────────────────────────────
    ctx.fillStyle = "#00E5FF";
    ctx.beginPath();
    ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // ── Anchor point — red crosshair ──────────────────────────────
    const anchor  = collider.anchor ?? { x: 0.5, y: 0.5 };
    const ax      = bounds.x + bounds.width  * anchor.x;
    const ay      = bounds.y + bounds.height * anchor.y;
    const cross   = 6;

    ctx.strokeStyle = "#FF1744";
    ctx.lineWidth   = 1.5;
    ctx.beginPath();
    ctx.moveTo(ax - cross, ay); ctx.lineTo(ax + cross, ay);
    ctx.moveTo(ax, ay - cross); ctx.lineTo(ax, ay + cross);
    ctx.stroke();

    ctx.strokeStyle = "#FF1744";
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.arc(ax, ay, 4, 0, Math.PI * 2);
    ctx.stroke();

    // ── Direction arrow — orange, longer ─────────────────────────
    const shorter  = Math.min(bounds.width, bounds.height);
    const arrowLen = shorter * 0.55 + 18; // longer than before
    const headSize = 8;

    const tipX   = cx + Math.sin(angle)  * arrowLen;
    const tipY   = cy - Math.cos(angle)  * arrowLen;

    // Arrowhead points
    const lx = tipX - Math.cos(angle) * headSize - Math.sin(angle) * headSize;
    const ly = tipY - Math.sin(angle) * headSize + Math.cos(angle) * headSize;
    const rx = tipX + Math.cos(angle) * headSize - Math.sin(angle) * headSize;
    const ry = tipY + Math.sin(angle) * headSize + Math.cos(angle) * headSize;

    // Shaft — dashed orange
    ctx.strokeStyle = "#FF6D00";
    ctx.lineWidth   = 2;
    ctx.setLineDash([6, 3]);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Solid arrowhead — brighter orange
    ctx.strokeStyle = "#FFAB40";
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY); ctx.lineTo(lx, ly);
    ctx.moveTo(tipX, tipY); ctx.lineTo(rx, ry);
    ctx.stroke();

    // Tip dot
    ctx.fillStyle = "#FFAB40";
    ctx.beginPath();
    ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
}
