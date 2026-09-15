export class SpriteDrawer2D {
    // Offscreen tint cache — one canvas per tint color
    static #tintCache = new Map();

    static draw(ctx, rd) {
        if (!rd.texture) return;

        ctx.save();

        ctx.globalAlpha = rd.alpha;
        ctx.translate(rd.x, rd.y);
        if (rd.rot !== 0) ctx.rotate(rd.rot);
        ctx.scale(
            rd.scaleX * (rd.flipX ? -1 : 1),
            rd.scaleY * (rd.flipY ? -1 : 1)
        );

        const ox = -rd.width  * rd.anchorX;
        const oy = -rd.height * rd.anchorY;

        if (rd.tint) {
            // Draw tinted via offscreen canvas
            const tinted = SpriteDrawer2D.#getTinted(rd);
            ctx.drawImage(tinted, ox, oy, rd.width, rd.height);
        } else {
            // Direct draw — fast path
            ctx.drawImage(
                rd.texture,
                rd.frameX, rd.frameY,
                rd.frameW, rd.frameH,
                ox, oy,
                rd.width, rd.height
            );
        }

        ctx.restore();
    }

    // ── Tint via offscreen canvas ─────────────────────────────────────────
    static #getTinted(rd) {
        const key = `${rd.texture.src}_${rd.tint}_${rd.frameX}_${rd.frameY}_${rd.frameW}_${rd.frameH}`;

        if (SpriteDrawer2D.#tintCache.has(key)) {
            return SpriteDrawer2D.#tintCache.get(key);
        }

        const offscreen = document.createElement("canvas");
        offscreen.width  = rd.frameW;
        offscreen.height = rd.frameH;
        const octx = offscreen.getContext("2d");

        // Draw original frame
        octx.drawImage(
            rd.texture,
            rd.frameX, rd.frameY,
            rd.frameW, rd.frameH,
            0, 0,
            rd.frameW, rd.frameH
        );

        // Overlay tint color using source-atop
        octx.globalCompositeOperation = "source-atop";
        octx.fillStyle = rd.tint;
        octx.globalAlpha = 0.5;
        octx.fillRect(0, 0, rd.frameW, rd.frameH);

        SpriteDrawer2D.#tintCache.set(key, offscreen);
        return offscreen;
    }

    // Call when a sprite's tint changes to invalidate cache
    static invalidateTint(texture, tint, frameX, frameY, frameW, frameH) {
        const key = `${texture.src}_${tint}_${frameX}_${frameY}_${frameW}_${frameH}`;
        SpriteDrawer2D.#tintCache.delete(key);
    }
}