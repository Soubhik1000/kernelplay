import { UITheme } from "./UITheme.js";
import { UIRaycast } from "./UIRaycast.js";

/**
 * UICanvas
 *
 * Creates a separate <canvas> on top of the game canvas.
 * Owns all UI elements, the render pipeline, and the raycast system.
 *
 * Attached to game.ui — set up automatically when you call:
 *   new MyGame({ ui: true, ... })
 *
 * Or manually:
 *   game.ui = new UICanvas(game);
 *   game.ui.init();
 */
export class UICanvas {
    constructor(game) {
        this._game = game;
        this._elements = [];    // flat sorted list

        // create overlay <canvas>
        this._canvas = document.createElement("canvas");
        this._canvas.width = game.config.width;
        this._canvas.height = game.config.height;
        this._canvas.style.cssText = [
            "position: absolute",
            "top: 0",
            "left: 0",
            "pointer-events: none",   // UI canvas captures pointer events
            "z-index: 10",
        ].join(";");

        // mount on top of game canvas
        const gameCanvas = game.canvas.canvas ?? game.canvas;
        // gameCanvas.parentElement.style.position = "relative";
        // gameCanvas.parentElement.appendChild(this._canvas);
        const container = game.canvas.container;
        container.appendChild(this._canvas);

        this._ctx = this._canvas.getContext("2d");
        this.theme = new UITheme();
        // this.raycast = new UIRaycast(this._canvas, this);
        this.raycast = new UIRaycast(gameCanvas, this);
    }

    // ─────────────────────────────────────────────────────────────
    //  ELEMENT MANAGEMENT
    // ─────────────────────────────────────────────────────────────

    /**
     * Add a UI element to the canvas.
     * Elements are drawn in zIndex order (lower first).
     *
     * @param {UIElement} element
     * @returns {UIElement}  the same element — for chaining
     */
    add(element) {
        element._canvas = this._canvas;
        element._theme = this.theme;
        element.init();

        this._elements.push(element);
        this._sortElements();

        return element;
    }

    /**
     * Remove a UI element.
     * @param {UIElement} element
     */
    remove(element) {
        element.destroy?.();
        this._elements = this._elements.filter(e => e !== element);
    }

    /** Remove all elements. */
    clear() {
        for (const el of this._elements) el.destroy?.();
        this._elements = [];
    }

    _sortElements() {
        this._elements.sort((a, b) => a.zIndex - b.zIndex);
    }

    // ─────────────────────────────────────────────────────────────
    //  UPDATE + RENDER  — called by game loop
    // ─────────────────────────────────────────────────────────────

    update(dt) {
        for (const el of this._elements) {
            if (el.active) el.update(dt);
        }
    }

    render() {
        const ctx = this._ctx;
        const w = this._canvas.width;
        const h = this._canvas.height;

        ctx.clearRect(0, 0, w, h);

        for (const el of this._elements) {
            if (!el.active || !el.visible) continue;

            if (el.screenSpace) {
                // screen space — resolve anchor, draw at fixed screen position
                el.resolvePosition(w, h);
            } else {
                // world space — convert world position to screen position
                const camera = this._game.scene?.getPrimaryCamera?.();
                if (camera) {
                    const sp = camera.worldToScreen(el.offset.x, el.offset.y);
                    el._x = sp.x;
                    el._y = sp.y;
                }
            }

            ctx.save();
            el.draw(ctx);
            ctx.restore();
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  CONVENIENCE — query elements by name
    // ─────────────────────────────────────────────────────────────

    find(name) {
        return this._elements.find(e => e.name === name) ?? null;
    }

    findAll(name) {
        return this._elements.filter(e => e.name === name);
    }

    findById(id) {
        return this._elements.find(e => e.id === id) ?? null;
    }

    // ─────────────────────────────────────────────────────────────
    //  CLEANUP
    // ─────────────────────────────────────────────────────────────

    destroy() {
        this.raycast.destroy();
        this.clear();
        this._canvas.remove();
    }
}