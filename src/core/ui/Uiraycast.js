/**
 * UIRaycast
 *
 * Separate input system — only hit-tests UI elements.
 * Attaches pointer listeners to the game canvas.
 * Consumes events that hit interactive elements so they
 * don't reach the game input system.
 *
 * Respects layer visibility and lock state:
 *   hidden layer → not interactive
 *   locked layer → visible but not interactive
 */
export class UIRaycast {
    constructor(canvas, uiCanvas) {
        this._canvas     = canvas;
        this._uiCanvas   = uiCanvas;
        this._gameWidth  = uiCanvas._canvas.width;
        this._gameHeight = uiCanvas._canvas.height;

        this._activeElement  = null;
        this._hoveredElement = null;

        this._bound = {
            down:  this._onDown.bind(this),
            up:    this._onUp.bind(this),
            move:  this._onMove.bind(this),
            leave: this._onLeave.bind(this),
        };

        this._canvas.addEventListener("pointerdown",  this._bound.down);
        this._canvas.addEventListener("pointerup",    this._bound.up);
        this._canvas.addEventListener("pointermove",  this._bound.move);
        this._canvas.addEventListener("pointerleave", this._bound.leave);
    }

    // ─────────────────────────────────────────────────────────────
    //  HIT TEST
    // ─────────────────────────────────────────────────────────────

    /**
     * Find topmost interactive element at screen position (px, py).
     * Delegates to UICanvas.hitTestAll which walks layers highest-first.
     */
    hitTest(px, py) {
        return this._uiCanvas.hitTestAll(px, py);
    }

    /**
     * Check if any interactive UI element is at this position.
     * Use in game input to skip raycasts when UI is hit.
     */
    isUIAt(px, py) {
        return this.hitTest(px, py) !== null;
    }

    // ─────────────────────────────────────────────────────────────
    //  COORDINATE CONVERSION
    // ─────────────────────────────────────────────────────────────

    _getPos(e) {
        const rect   = this._canvas.getBoundingClientRect();

        // use game resolution / bounding rect size
        // handles Pixi devicePixelRatio scaling correctly
        const scaleX = this._gameWidth  / rect.width;
        const scaleY = this._gameHeight / rect.height;

        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top)  * scaleY,
        };
    }

    // ─────────────────────────────────────────────────────────────
    //  POINTER EVENTS
    // ─────────────────────────────────────────────────────────────

    _onDown(e) {
        const { x, y } = this._getPos(e);
        const el = this.hitTest(x, y);

        if (el) {
            this._activeElement = el;
            el._onPointerDown(x, y);

            // blur any focused input field that isn't this element
            for (const layer of this._uiCanvas._layers.values()) {
                for (const other of layer._elements) {
                    if (other !== el && other._blur) other._blur();
                }
            }

            e.stopPropagation();
            e.preventDefault();
        }
    }

    _onUp(e) {
        const { x, y } = this._getPos(e);

        if (this._activeElement) {
            this._activeElement._onPointerUp(x, y);
            this._activeElement = null;
            e.stopPropagation();
            e.preventDefault();
            return;
        }

        // consume up event if still over a UI element
        if (this.hitTest(x, y)) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    _onMove(e) {
        const { x, y } = this._getPos(e);

        // dragging — notify active element, don't block game
        if (this._activeElement) {
            this._activeElement._onPointerMove(x, y);
            return;
        }

        // hover detection
        const el = this.hitTest(x, y);

        if (el !== this._hoveredElement) {
            this._hoveredElement?._onPointerExit();
            this._hoveredElement = el;
            el?._onPointerEnter();
        }

        if (el) {
            el._onPointerMove(x, y);
            this._canvas.style.cursor = "pointer";
        } else {
            this._canvas.style.cursor = "default";
        }
    }

    _onLeave() {
        this._hoveredElement?._onPointerExit();
        this._hoveredElement = null;
        this._canvas.style.cursor = "default";
    }

    // ─────────────────────────────────────────────────────────────
    //  CLEANUP
    // ─────────────────────────────────────────────────────────────

    destroy() {
        this._canvas.removeEventListener("pointerdown",  this._bound.down);
        this._canvas.removeEventListener("pointerup",    this._bound.up);
        this._canvas.removeEventListener("pointermove",  this._bound.move);
        this._canvas.removeEventListener("pointerleave", this._bound.leave);
    }
}