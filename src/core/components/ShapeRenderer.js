import { Component } from "../Component.js";

export class ShapeRenderer extends Component {
    constructor(props = {}) {
        super();

        const {
            shape = "rect",     // "rect" | "roundedrect" | "circle" | "ellipse" | "triangle" | "polygon" | "line"
            width = 50,
            height = 50,
            radius = 25,         // circle radius or roundedrect corner radius
            radiusX = 40,         // ellipse x radius
            radiusY = 20,         // ellipse y radius
            points = [],         // polygon/line [ {x,y}, ... ]
            color = "#ff0000",
            alpha = 1.0,
            zIndex = 0,
            filled = true,
            strokeColor = "#ffffff",
            strokeWidth = 0,          // 0 = no stroke
            anchor = { x: 0.5, y: 0.5 },
        } = props;

        this.shape = shape;
        this.width = width;
        this.height = height;
        this.radius = radius;
        this.radiusX = radiusX;
        this.radiusY = radiusY;
        this.points = points;
        this.color = color;
        this.alpha = alpha;
        this.zIndex = zIndex;
        this.filled = filled;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
        this.anchor = anchor;

        this.flipX = false;
        this.flipY = false;

        this._dirty = true;
        this._cachedBounds = { x: 0, y: 0, width: 0, height: 0 };
    }

    init() {
        this.transform = this.entity.getComponent("transform");
    }

    // ── Bounds — used by frustum culling ─────────────────────────────────

    getBounds() {
        const t = this.transform;
        if (!t) return this._cachedBounds;

        if (t._dirty || this._dirty) {
            const w = this.width * t.scale.x;
            const h = this.height * t.scale.y;

            this._cachedBounds.x = t.position.x - w * this.anchor.x;
            this._cachedBounds.y = t.position.y - h * this.anchor.y;
            this._cachedBounds.width = w;
            this._cachedBounds.height = h;
            this._dirty = false;
        }

        return this._cachedBounds;
    }

    // ── Render ────────────────────────────────────────────────────────────

    render(ctx) {
        if (!this.transform) return;

        const t = this.transform;
        const pos = t.position;
        const scale = t.scale;
        const rotation = t.rotation.z;

        ctx.save();

        ctx.translate(pos.x, pos.y);
        ctx.rotate(rotation);
        ctx.scale(
            scale.x * (this.flipX ? -1 : 1),
            scale.y * (this.flipY ? -1 : 1)
        );

        ctx.globalAlpha = this.alpha;

        const ox = -this.width * this.anchor.x;
        const oy = -this.height * this.anchor.y;

        switch (this.shape) {

            case "rect":
                this._drawRect(ctx, ox, oy);
                break;

            case "roundedrect":
                this._drawRoundedRect(ctx, ox, oy);
                break;

            case "circle":
                this._drawCircle(ctx);
                break;

            case "ellipse":
                this._drawEllipse(ctx);
                break;

            case "triangle":
                this._drawTriangle(ctx);
                break;

            case "polygon":
                this._drawPolygon(ctx, this.points);
                break;

            case "line":
                this._drawLine(ctx);
                break;

            default:
                console.warn(`ShapeRenderer: unknown shape "${this.shape}"`);
        }

        ctx.restore();
    }

    // ── Shape drawers ─────────────────────────────────────────────────────

    _drawRect(ctx, ox, oy) {
        ctx.beginPath();
        ctx.rect(ox, oy, this.width, this.height);
        this._applyFillStroke(ctx);
    }

    _drawRoundedRect(ctx, ox, oy) {
        const r = Math.min(this.radius, this.width / 2, this.height / 2);
        ctx.beginPath();
        ctx.moveTo(ox + r, oy);
        ctx.lineTo(ox + this.width - r, oy);
        ctx.arcTo(ox + this.width, oy, ox + this.width, oy + r, r);
        ctx.lineTo(ox + this.width, oy + this.height - r);
        ctx.arcTo(ox + this.width, oy + this.height, ox + this.width - r, oy + this.height, r);
        ctx.lineTo(ox + r, oy + this.height);
        ctx.arcTo(ox, oy + this.height, ox, oy + this.height - r, r);
        ctx.lineTo(ox, oy + r);
        ctx.arcTo(ox, oy, ox + r, oy, r);
        ctx.closePath();
        this._applyFillStroke(ctx);
    }

    _drawCircle(ctx) {
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        this._applyFillStroke(ctx);
    }

    _drawEllipse(ctx) {
        ctx.beginPath();
        ctx.ellipse(0, 0, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
        this._applyFillStroke(ctx);
    }

    _drawTriangle(ctx) {
        const pts = [
            { x: 0, y: -this.height / 2 },
            { x: this.width / 2, y: this.height / 2 },
            { x: -this.width / 2, y: this.height / 2 },
        ];
        this._drawPolygon(ctx, pts);
    }

    _drawPolygon(ctx, pts) {
        if (pts.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) {
            ctx.lineTo(pts[i].x, pts[i].y);
        }
        ctx.closePath();
        this._applyFillStroke(ctx);
    }

    _drawLine(ctx) {
        if (this.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);
        for (let i = 1; i < this.points.length; i++) {
            ctx.lineTo(this.points[i].x, this.points[i].y);
        }
        // Lines always stroke, never fill
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.strokeWidth || 2;
        ctx.stroke();
    }

    // ── Fill / stroke helper ──────────────────────────────────────────────

    _applyFillStroke(ctx) {
        if (this.filled) {
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        if (this.strokeWidth > 0) {
            ctx.strokeStyle = this.strokeColor;
            ctx.lineWidth = this.strokeWidth;
            ctx.stroke();
        }
    }

    // ── Public API ────────────────────────────────────────────────────────

    setColor(color) {
        this.color = color;
        this._dirty = true;
    }

    setSize(width, height) {
        this.width = width;
        this.height = height ?? width;
        this._dirty = true;
    }

    setRadius(radius) {
        this.radius = radius;
        this._dirty = true;
    }

    setAlpha(alpha) {
        this.alpha = alpha;
    }

    setStroke(color, width) {
        this.strokeColor = color;
        this.strokeWidth = width;
    }

    setFilled(filled) {
        this.filled = filled;
    }

    setShape(shape) {
        this.shape = shape;
        this._dirty = true;
    }

    setPoints(points) {
        this.points = points;
        this._dirty = true;
    }

    // ── Serialization ─────────────────────────────────────────────────────

    toJSON() {
        return {
            type: "ShapeRenderer",
            shape: this.shape,
            width: this.width,
            height: this.height,
            radius: this.radius,
            radiusX: this.radiusX,
            radiusY: this.radiusY,
            points: this.points,
            color: this.color,
            alpha: this.alpha,
            zIndex: this.zIndex,
            filled: this.filled,
            strokeColor: this.strokeColor,
            strokeWidth: this.strokeWidth,
            anchor: this.anchor,
        };
    }

    static fromJSON(data) {
        return new ShapeRenderer(data);
    }
}