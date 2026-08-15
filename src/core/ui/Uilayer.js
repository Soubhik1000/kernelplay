/**
 * UILayer
 *
 * A named group of UI elements rendered and hit-tested together.
 * Layers draw in order — lower order = behind, higher order = on top.
 *
 * visible: false  → layer is not drawn and not interactive
 * locked:  true   → layer is drawn but not interactive
 * global:  true   → survives scene switches (not cleared on startScene)
 */
export class UILayer {
    constructor(name, order = 0, defaults = {}) {
        this.name = name;
        this.order = order;
        this.visible = true;
        this.locked = false;
        this._global = false;
        this._defaults = defaults;
        this._elements = [];
    }

    // ─────────────────────────────────────────────────────────────
    //  VISIBILITY / LOCK
    // ─────────────────────────────────────────────────────────────

    show() { this.visible = true; }
    hide() { this.visible = false; }
    lock() { this.locked = true; }
    unlock() { this.locked = false; }
    toggle() { this.visible = !this.visible; }

    // ─────────────────────────────────────────────────────────────
    //  ELEMENT MANAGEMENT
    // ─────────────────────────────────────────────────────────────

    _add(element) {
        // apply layer defaults — only if element didn't explicitly set them
        for (const [key, value] of Object.entries(this._defaults)) {
            // if (element[key] === undefined) element[key] = value;
            element[key] = value;
        }
        element._layer = this;
        this._elements.push(element);
        this._sort();
        return element;
    }

    _remove(element) {
        element.destroy?.();
        this._elements = this._elements.filter(e => e !== element);
    }

    clear() {
        for (const el of this._elements) el.destroy?.();
        this._elements = [];
    }

    _sort() {
        this._elements.sort((a, b) => a.zIndex - b.zIndex);
    }

    // ─────────────────────────────────────────────────────────────
    //  UPDATE
    // ─────────────────────────────────────────────────────────────

    update(dt) {
        if (!this.visible) return;
        for (const el of this._elements) {
            if (el.active) el.update(dt);
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  RENDER
    // ─────────────────────────────────────────────────────────────

    render(ctx, screenW, screenH, game) {
        if (!this.visible) return;

        for (const el of this._elements) {
            if (!el.active || !el.visible) continue;

            if (el.screenSpace) {
                el.resolvePosition(screenW, screenH);
            } else {
                // world space — convert via primary camera
                const camera = game.sceneManager?.currentScene?.getPrimaryCamera?.();
                if (!camera) continue;
                const sp = camera.worldToScreen(el.offset.x, el.offset.y);
                el._x = sp.x;
                el._y = sp.y;
            }

            ctx.save();
            el.draw(ctx);
            ctx.restore();
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  RAYCAST
    // ─────────────────────────────────────────────────────────────

    /**
     * Returns topmost interactive element at (px, py).
     * Returns null if layer is hidden or locked.
     */
    hitTest(px, py) {
        if (!this.visible || this.locked) return null;

        for (let i = this._elements.length - 1; i >= 0; i--) {
            const el = this._elements[i];
            if (!el.active || !el.visible || !el.interactive) continue;
            if (el.containsPoint(px, py)) return el;
        }

        return null;
    }
}