import { Renderer } from "./Renderer.js";
import { AABB } from "../core/physics/Collision.js";
import { BoxDrawer } from "./drawers/BoxDrawer.js";

export class CanvasRenderer extends Renderer {
    init(game) {
        super.init(game);

        this.ctx = game.canvas.canvas.getContext("2d");
        this.camera = game.camera;
        this.debugPhysics = game.config.debugPhysics;  // rigidbodies
        this.debugBounds = game.config.debugBounds;   // renderer bounds + colliders
        this.debugCameras = game.config.debugCameras;  // cameras
        // console.log(game.config);


        // Fill background on init
        this.ctx.fillStyle = game.config.backgroundColor;
        this.ctx.fillRect(0, 0, game.config.width, game.config.height);
    }

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

        // const groups = new Map();
        // const nonBatch = [];

        let currentColor = null;

        for (const r of visibleRenderers) {
            if (typeof r.getRenderData === "function" && r.batchable !== false) {
                const data = r.getRenderData();

                // Only switch fillStyle when color changes
                if (data.color !== currentColor) {
                    ctx.fillStyle = data.color;
                    currentColor = data.color;
                }

                if (data.type === "box") BoxDrawer.draw(ctx, data);

            } else {
                // Non-batchable — just render directly
                currentColor = null; // reset so next batchable sets fillStyle correctly
                r.render(ctx);
            }
        }

        if (this.debugPhysics) this.drawRigidbodies(ctx, scene);
        if (this.debugBounds) this.drawRendererBounds(ctx, scene);
        if (this.debugBounds) this.drawColliders(ctx, scene);
        if (this.debugCameras) this.drawCameras(ctx, scene);

        ctx.restore();
    }

    drawColliders(ctx, scene) {
        for (const collider of scene._colliders) {
            const bounds = collider.bounds;
            const cx = bounds.x + bounds.width / 2;
            const cy = bounds.y + bounds.height / 2;
            const angle = collider.transform?.rotation.z ?? 0;
            const isTrigger = collider.isTrigger;

            ctx.save();

            // ── Collider rectangle ────────────────────────────────────────
            ctx.strokeStyle = isTrigger ? "#FFD600" : "#00E676";
            ctx.lineWidth = isTrigger ? 1.5 : 2;
            if (isTrigger) ctx.setLineDash([5, 4]);
            else ctx.setLineDash([]);
            ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
            ctx.setLineDash([]);

            // ── Center dot — cyan ─────────────────────────────────────────
            ctx.fillStyle = "#00E5FF";
            ctx.beginPath();
            ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
            ctx.fill();

            // ── Anchor point — red crosshair ──────────────────────────────
            const anchor = collider.anchor ?? { x: 0.5, y: 0.5 };
            const ax = bounds.x + bounds.width * anchor.x;
            const ay = bounds.y + bounds.height * anchor.y;
            const cross = 6;

            ctx.strokeStyle = "#FF1744";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(ax - cross, ay); ctx.lineTo(ax + cross, ay);
            ctx.moveTo(ax, ay - cross); ctx.lineTo(ax, ay + cross);
            ctx.stroke();

            ctx.strokeStyle = "#FF1744";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(ax, ay, 4, 0, Math.PI * 2);
            ctx.stroke();

            // ── Direction arrow — orange, longer ─────────────────────────
            const shorter = Math.min(bounds.width, bounds.height);
            const arrowLen = shorter * 0.55 + 18; // longer than before
            const headSize = 8;

            const tipX = cx + Math.sin(angle) * arrowLen;
            const tipY = cy - Math.cos(angle) * arrowLen;

            // Arrowhead points
            const lx = tipX - Math.cos(angle) * headSize - Math.sin(angle) * headSize;
            const ly = tipY - Math.sin(angle) * headSize + Math.cos(angle) * headSize;
            const rx = tipX + Math.cos(angle) * headSize - Math.sin(angle) * headSize;
            const ry = tipY + Math.sin(angle) * headSize + Math.cos(angle) * headSize;

            // Shaft — dashed orange
            ctx.strokeStyle = "#FF6D00";
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 3]);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(tipX, tipY);
            ctx.stroke();
            ctx.setLineDash([]);

            // Solid arrowhead — brighter orange
            ctx.strokeStyle = "#FFAB40";
            ctx.lineWidth = 2;
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

    drawRigidbodies(ctx, scene) {
        // for (const rb of scene._rigidbody2D) {
        for (const rb of scene._rigidbodies) {
            const t = rb.entity?.getComponent("transform");
            if (!t) continue;

            const cx = t.position.x;
            const cy = t.position.y;
            const vx = rb.velocity?.x ?? 0;
            const vy = rb.velocity?.y ?? 0;
            const speed = Math.sqrt(vx * vx + vy * vy);

            ctx.save();

            // ── Velocity vector arrow ─────────────────────────────────
            if (speed > 0.5) {
                const scale = 0.1;
                const tipX = cx + vx * scale;
                const tipY = cy + vy * scale;
                const angle = Math.atan2(vy, vx);
                const headSz = 14;

                // Shaft
                ctx.strokeStyle = "#E040FB";
                ctx.lineWidth = 2.5;
                ctx.setLineDash([4, 3]);
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(tipX, tipY);
                ctx.stroke();
                ctx.setLineDash([]);

                // Arrowhead
                ctx.strokeStyle = "#EA80FC";
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.moveTo(tipX, tipY);
                ctx.lineTo(tipX - Math.cos(angle - 0.4) * headSz, tipY - Math.sin(angle - 0.4) * headSz);
                ctx.moveTo(tipX, tipY);
                ctx.lineTo(tipX - Math.cos(angle + 0.4) * headSz, tipY - Math.sin(angle + 0.4) * headSz);
                ctx.stroke();

                // Tip dot
                ctx.fillStyle = "#EA80FC";
                ctx.beginPath();
                ctx.arc(tipX, tipY, 2.5, 0, Math.PI * 2);
                ctx.fill();
            }

            // ── Center dot — sleep aware ───────────────────────────────
            ctx.fillStyle = speed < 0.5 ? "#5a3f6b" : "#E040FB";
            ctx.beginPath();
            ctx.arc(cx, cy, 4, 0, Math.PI * 2);
            ctx.fill();

            // ── isGrounded indicator — below entity ────────────────────
            ctx.fillStyle = rb.isGrounded ? "#00E676" : "#FF1744";
            ctx.beginPath();
            ctx.arc(cx, cy + 14, 3, 0, Math.PI * 2);
            ctx.fill();

            // Grounded label
            ctx.fillStyle = rb.isGrounded ? "#00E676" : "#FF1744";
            ctx.font = "15px JetBrains Mono, monospace";
            ctx.fillText(rb.isGrounded ? "G" : "A", cx + 30, cy + 18); // G = grounded, A = airborne

            // ── Speed label ────────────────────────────────────────────
            if (speed > 0.5) {
                ctx.fillStyle = "#CE93D8";
                ctx.font = "15px JetBrains Mono, monospace";
                ctx.fillText(`${speed.toFixed(0)}px/s`, cx - 25, cy - 30);
            }

            // ── Mass label ─────────────────────────────────────────────
            ctx.fillStyle = "#9C27B0";
            ctx.font = "15px JetBrains Mono, monospace";
            ctx.fillText(`m:${rb.mass ?? 1}`, cx - 55, cy + 20);

            ctx.restore();
        }
    }

    drawRendererBounds(ctx, scene) {
        const hasCollider = new Set(scene._colliders.map(c => c.entity));

        for (const r of scene._renderers) {
            if (hasCollider.has(r.entity)) continue;
            if (!r._cachedBounds) continue;
            // console.log('hi');


            const b = r._cachedBounds;
            const t = r.entity?.getComponent("transform");
            const angle = t?.rotation?.z ?? 0;
            const cx = b.x + b.width / 2;
            const cy = b.y + b.height / 2;

            ctx.save();

            // Bounds rect — light blue dashed
            ctx.strokeStyle = "#29B6F6";
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 5]);
            ctx.strokeRect(b.x, b.y, b.width, b.height);
            ctx.setLineDash([]);

            // Center dot
            ctx.fillStyle = "#29B6F6";
            ctx.beginPath();
            ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Direction arrow — same style as collider arrow
            const arrowLen = Math.min(b.width, b.height) * 0.55 + 18;
            const headSize = 8;

            const tipX = cx + Math.sin(angle) * arrowLen;
            const tipY = cy - Math.cos(angle) * arrowLen;

            const lx = tipX - Math.cos(angle) * headSize - Math.sin(angle) * headSize;
            const ly = tipY - Math.sin(angle) * headSize + Math.cos(angle) * headSize;
            const rx = tipX + Math.cos(angle) * headSize - Math.sin(angle) * headSize;
            const ry = tipY + Math.sin(angle) * headSize + Math.cos(angle) * headSize;

            // Shaft — dashed blue
            ctx.strokeStyle = "#29B6F6";
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 3]);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(tipX, tipY);
            ctx.stroke();
            ctx.setLineDash([]);

            // Arrowhead — lighter blue
            ctx.strokeStyle = "#81D4FA";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(tipX, tipY); ctx.lineTo(lx, ly);
            ctx.moveTo(tipX, tipY); ctx.lineTo(rx, ry);
            ctx.stroke();

            // Tip dot
            ctx.fillStyle = "#81D4FA";
            ctx.beginPath();
            ctx.arc(tipX, tipY, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
        }
    }

    drawCameras(ctx, scene) {
        for (const cam of scene._cameras) {
            const vb = cam.viewBounds;
            if (!vb) continue;

            const isPrimary = cam === scene.getPrimaryCamera();

            ctx.save();

            // View frustum rect
            ctx.strokeStyle = isPrimary ? "#FF6E40" : "#FFAB91"; // orange / light orange
            ctx.lineWidth = isPrimary ? 2 : 1;
            ctx.setLineDash([8, 5]);
            ctx.strokeRect(vb.x, vb.y, vb.width, vb.height);
            ctx.setLineDash([]);

            // Center crosshair
            const cx = vb.x + vb.width / 2;
            const cy = vb.y + vb.height / 2;
            const sz = 10;

            ctx.strokeStyle = isPrimary ? "#FF6E40" : "#FFAB91";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx - sz, cy); ctx.lineTo(cx + sz, cy);
            ctx.moveTo(cx, cy - sz); ctx.lineTo(cx, cy + sz);
            ctx.stroke();

            // Center dot
            ctx.fillStyle = isPrimary ? "#FF6E40" : "#FFAB91";
            ctx.beginPath();
            ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
            ctx.fill();

            // Label
            ctx.fillStyle = isPrimary ? "#FF6E40" : "#FFAB91";
            ctx.font = "9px JetBrains Mono, monospace";
            ctx.fillText(isPrimary ? "CAM [primary]" : "CAM", vb.x + 6, vb.y + 14);

            ctx.restore();
        }
    }
}
