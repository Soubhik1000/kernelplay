export class ShapeDrawer2D {
    static draw(ctx, rd) {
        ctx.save();
        ctx.globalAlpha = rd.alpha;
        ctx.translate(rd.x, rd.y);
        if (rd.rot   !== 0) ctx.rotate(rd.rot);
        if (rd.scaleX !== 1 || rd.scaleY !== 1 || rd.flipX || rd.flipY) {
            ctx.scale(
                rd.scaleX * (rd.flipX ? -1 : 1),
                rd.scaleY * (rd.flipY ? -1 : 1)
            );
        }

        const ox = -rd.width  * rd.anchorX;
        const oy = -rd.height * rd.anchorY;

        switch (rd.type) {
            case "rect":        ShapeDrawer2D.#rect(ctx, rd, ox, oy);   break;
            case "roundedrect": ShapeDrawer2D.#rounded(ctx, rd, ox, oy); break;
            case "circle":      ShapeDrawer2D.#circle(ctx, rd);          break;
            case "ellipse":     ShapeDrawer2D.#ellipse(ctx, rd);         break;
            case "triangle":    ShapeDrawer2D.#triangle(ctx, rd);        break;
            case "polygon":     ShapeDrawer2D.#polygon(ctx, rd);         break;
            case "line":        ShapeDrawer2D.#line(ctx, rd);            break;
        }

        ctx.restore();
    }

    static #rect(ctx, rd, ox, oy) {
        ctx.beginPath();
        ctx.rect(ox, oy, rd.width, rd.height);
        ShapeDrawer2D.#fillStroke(ctx, rd);
    }

    static #rounded(ctx, rd, ox, oy) {
        const r = Math.min(rd.radius, rd.width / 2, rd.height / 2);
        ctx.beginPath();
        ctx.roundRect(ox, oy, rd.width, rd.height, r);
        ShapeDrawer2D.#fillStroke(ctx, rd);
    }

    static #circle(ctx, rd) {
        ctx.beginPath();
        ctx.arc(0, 0, rd.radius, 0, Math.PI * 2);
        ShapeDrawer2D.#fillStroke(ctx, rd);
    }

    static #ellipse(ctx, rd) {
        ctx.beginPath();
        ctx.ellipse(0, 0, rd.radiusX, rd.radiusY, 0, 0, Math.PI * 2);
        ShapeDrawer2D.#fillStroke(ctx, rd);
    }

    static #triangle(ctx, rd) {
        ShapeDrawer2D.#polygon(ctx, {
            ...rd,
            points: [
                { x: 0,             y: -rd.height / 2 },
                { x:  rd.width / 2, y:  rd.height / 2 },
                { x: -rd.width / 2, y:  rd.height / 2 },
            ]
        });
    }

    static #polygon(ctx, rd) {
        if (rd.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(rd.points[0].x, rd.points[0].y);
        for (let i = 1; i < rd.points.length; i++) {
            ctx.lineTo(rd.points[i].x, rd.points[i].y);
        }
        ctx.closePath();
        ShapeDrawer2D.#fillStroke(ctx, rd);
    }

    static #line(ctx, rd) {
        if (rd.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(rd.points[0].x, rd.points[0].y);
        for (let i = 1; i < rd.points.length; i++) {
            ctx.lineTo(rd.points[i].x, rd.points[i].y);
        }
        ctx.strokeStyle = rd.color;
        ctx.lineWidth   = rd.strokeWidth || 2;
        ctx.stroke();
    }

    static #fillStroke(ctx, rd) {
        if (rd.filled) {
            ctx.fillStyle = rd.color;
            ctx.fill();
        }
        if (rd.strokeWidth > 0) {
            ctx.strokeStyle = rd.strokeColor;
            ctx.lineWidth   = rd.strokeWidth;
            ctx.stroke();
        }
    }
}