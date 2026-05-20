/**
 * UIElement — base class for all UI elements.
 *
 * Anchor system:
 *   anchor: "topLeft" | "topCenter" | "topRight"
 *           "middleLeft" | "center" | "middleRight"
 *           "bottomLeft" | "bottomCenter" | "bottomRight"
 *
 *   offset: { x, y }  — pixels from the anchor point
 *
 * Space:
 *   screenSpace: true  — fixed to screen (default, ignores camera)
 *   screenSpace: false — world space (moves with camera)
 */
export class UIElement {
    constructor({
        anchor      = "topLeft",
        offset      = { x: 0, y: 0 },
        width       = 100,
        height      = 40,
        visible     = true,
        interactive = false,   // true = UIRaycast will hit-test this element
        screenSpace = true,
        style       = {},
        zIndex      = 0,
        name        = "UIElement",
    } = {}) {
        this.anchor      = anchor;
        this.offset      = { ...offset };
        this.width       = width;
        this.height      = height;
        this.visible     = visible;
        this.interactive = interactive;
        this.screenSpace = screenSpace;
        this.style       = style;         // per-element style overrides
        this.zIndex      = zIndex;
        this.name        = name;

        this._canvas     = null;          // set by UICanvas on register
        this._theme      = null;          // set by UICanvas on register
        this._x          = 0;            // resolved screen x (updated each frame)
        this._y          = 0;            // resolved screen y
        this.active      = true;

        // event callbacks
        this.onClick     = null;
        this.onHover     = null;
        this.onHoverExit = null;

        this._hovered    = false;
    }

    // ─────────────────────────────────────────────────────────────
    //  POSITION
    // ─────────────────────────────────────────────────────────────

    /**
     * Resolve final screen position from anchor + offset.
     * Called every frame by UIRenderer before draw().
     */
    resolvePosition(screenW, screenH) {
        const ox = this.offset.x;
        const oy = this.offset.y;
        const hw = this.width  * 0.5;
        const hh = this.height * 0.5;

        switch (this.anchor) {
            case "topLeft":          this._x = ox + hw;            this._y = oy + hh;            break;
            case "topCenter":        this._x = screenW * 0.5 + ox; this._y = oy + hh;            break;
            case "topRight":         this._x = screenW - ox - hw;  this._y = oy + hh;            break;
            case "middleLeft":       this._x = ox + hw;            this._y = screenH * 0.5 + oy; break;
            case "center":           this._x = screenW * 0.5 + ox; this._y = screenH * 0.5 + oy; break;
            case "middleRight":      this._x = screenW - ox - hw;  this._y = screenH * 0.5 + oy; break;
            case "bottomLeft":       this._x = ox + hw;            this._y = screenH - oy - hh;  break;
            case "bottomCenter":     this._x = screenW * 0.5 + ox; this._y = screenH - oy - hh;  break;
            case "bottomRight":      this._x = screenW - ox - hw;  this._y = screenH - oy - hh;  break;
            default:                 this._x = ox;                 this._y = oy;
        }
    }

    /** Bounding rect in screen space — used by UIRaycast. */
    getBounds() {
        return {
            x:      this._x - this.width  * 0.5,
            y:      this._y - this.height * 0.5,
            width:  this.width,
            height: this.height,
        };
    }

    /** Returns true if screen point (px, py) is inside this element. */
    containsPoint(px, py) {
        const b = this.getBounds();
        return px >= b.x && px <= b.x + b.width &&
               py >= b.y && py <= b.y + b.height;
    }

    // ─────────────────────────────────────────────────────────────
    //  STYLE HELPER
    // ─────────────────────────────────────────────────────────────

    _s(key) {
        return this._theme.resolve(key, this.style);
    }

    // ─────────────────────────────────────────────────────────────
    //  DRAW HELPERS  (shared across elements)
    // ─────────────────────────────────────────────────────────────

    _drawRoundedRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.arcTo(x + w, y,     x + w, y + r,     r);
        ctx.lineTo(x + w, y + h - r);
        ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
        ctx.lineTo(x + r, y + h);
        ctx.arcTo(x,     y + h, x,       y + h - r, r);
        ctx.lineTo(x,    y + r);
        ctx.arcTo(x,     y,     x + r,   y,         r);
        ctx.closePath();
    }

    // ─────────────────────────────────────────────────────────────
    //  LIFECYCLE — override in subclasses
    // ─────────────────────────────────────────────────────────────

    /** Called once after _canvas and _theme are set. */
    init() {}

    /** Called every frame by UIRenderer. Override to draw. */
    draw(ctx) {}

    /** Called every frame. Override for animated elements. */
    update(dt) {}

    // ─────────────────────────────────────────────────────────────
    //  INPUT — called by UIRaycast
    // ─────────────────────────────────────────────────────────────

    _onPointerDown(x, y) {}
    _onPointerUp(x, y)   {}
    _onPointerMove(x, y) {}
    _onPointerEnter()    { this._hovered = true;  this.onHover?.(); }
    _onPointerExit()     { this._hovered = false; this.onHoverExit?.(); }
}