/**
 * UIRaycast
 *
 * Separate input system — only hit-tests UI elements.
 * Attaches its own pointer listeners to the UI canvas.
 * Consumes events that hit interactive elements so they
 * don't reach the game input system.
 *
 * Added to game.ui.raycast automatically by UICanvas.
 */
export class UIRaycast {
    constructor(canvas, uiCanvas) {
        this._canvas   = canvas;   // the UI <canvas> element
        this._uiCanvas = uiCanvas; // UICanvas instance (holds element list)

        this._activeElement  = null;   // element currently being pressed
        this._hoveredElement = null;   // element under cursor

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
     * Find the topmost interactive element at screen position (px, py).
     * Returns element or null.
     */
    hitTest(px, py) {
        const elements = this._uiCanvas._elements;

        // walk back-to-front (highest zIndex on top)
        for (let i = elements.length - 1; i >= 0; i--) {
            const el = elements[i];
            if (!el.active || !el.visible || !el.interactive) continue;
            if (el.containsPoint(px, py)) return el;
        }

        return null;
    }

    /**
     * Check if any interactive UI element is at this position.
     * Use this in your game input system to skip raycasts when UI is hit.
     */
    isUIAt(px, py) {
        return this.hitTest(px, py) !== null;
    }

    // ─────────────────────────────────────────────────────────────
    //  POINTER EVENTS
    // ─────────────────────────────────────────────────────────────

    _getPos(e) {
        const rect = this._canvas.getBoundingClientRect();
        const scaleX = this._canvas.width  / rect.width;
        const scaleY = this._canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top)  * scaleY,
        };
    }

    _onDown(e) {
        const { x, y } = this._getPos(e);
        const el = this.hitTest(x, y);

        if (el) {
            this._activeElement = el;
            el._onPointerDown(x, y);
            e.stopPropagation();   // consume — don't let game see this click
            e.preventDefault();
        }
    }

    _onUp(e) {
        const { x, y } = this._getPos(e);

        if (this._activeElement) {
            this._activeElement._onPointerUp(x, y);

            // blur any input field that isn't the active element
            const elements = this._uiCanvas._elements;
            for (const el of elements) {
                if (el !== this._activeElement && el._blur) el._blur();
            }

            this._activeElement = null;
            e.stopPropagation();
            e.preventDefault();
        }

        const el = this.hitTest(x, y);
        if (el) e.stopPropagation();
    }

    _onMove(e) {
        const { x, y } = this._getPos(e);

        // drag — notify active element
        if (this._activeElement) {
            this._activeElement._onPointerMove(x, y);
            e.stopPropagation();
            return;
        }

        // hover
        const el = this.hitTest(x, y);

        if (el !== this._hoveredElement) {
            this._hoveredElement?._onPointerExit();
            this._hoveredElement = el;
            el?._onPointerEnter();
        }

        if (el) {
            el._onPointerMove(x, y);
            // update cursor style
            this._canvas.style.cursor = "pointer";
            e.stopPropagation();
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