import { Component } from "../Component.js";
import { RenderData } from "../../graphics/RenderData.js";

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
        this._rd = new RenderData();
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

    getRenderData() {
        const t = this.transform;
        if (!t) return null;

        if (t._dirty || this._dirty) {
            this._rd.type = this.shape;   // "rect" | "circle" | "polygon" etc
            this._rd.x = t.position.x;
            this._rd.y = t.position.y;
            this._rd.z = t.position.z ?? 0;
            this._rd.rot = t.rotation.z;
            this._rd.scaleX = t.scale.x;
            this._rd.scaleY = t.scale.y;
            this._rd.flipX = this.flipX;
            this._rd.flipY = this.flipY;
            this._rd.width = this.width;
            this._rd.height = this.height;
            this._rd.radius = this.radius;
            this._rd.radiusX = this.radiusX;
            this._rd.radiusY = this.radiusY;
            this._rd.anchorX = this.anchor.x;
            this._rd.anchorY = this.anchor.y;
            this._rd.points = this.points;
            this._rd.color = this.color;
            this._rd.alpha = this.alpha;
            this._rd.zIndex = this.zIndex;
            this._rd.filled = this.filled;
            this._rd.strokeColor = this.strokeColor;
            this._rd.strokeWidth = this.strokeWidth;

            t.clearDirty();
            this._dirty = false;
        }

        return this._rd;
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