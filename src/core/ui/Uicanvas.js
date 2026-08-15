import { UITheme } from "./Uitheme.js";
import { UIRaycast } from "./Uiraycast.js";
import { UILayer } from "./Uilayer.js";

/**
 * UICanvas
 *
 * Creates a separate <canvas> on top of the game canvas.
 * Manages UI layers — global defaults always available,
 * per-scene layers added on top and cleared on scene switch.
 *
 * Default global layers (always available):
 *   "World"   order: 0   — world space UI (name tags, damage numbers)
 *   "HUD"     order: 10  — health bars, score, ammo
 *   "Menu"    order: 20  — pause menu, settings panels
 *   "Overlay" order: 30  — fades, popups, tooltips
 */
export class UICanvas {
    constructor(game) {
        this._game = game;
        this._layers = new Map();   // name → UILayer, sorted by order

        // create overlay <canvas> — don't mount yet, init() does that
        this._canvas = document.createElement("canvas");
        this._canvas.width = game.config.width;
        this._canvas.height = game.config.height;
        this._canvas.style.cssText = [
            "position: absolute",
            "top: 0",
            "left: 0",
            "pointer-events: none",
            "z-index: 10",
        ].join(";");

        this._ctx = this._canvas.getContext("2d");
        this.theme = new UITheme();
        this.raycast = null;   // created in init() after renderer is ready

        // register built-in global layers
        this._addLayer("World", 0, true, { screenSpace: false });
        this._addLayer("HUD", 10, true);
        this._addLayer("Menu", 20, true);
        this._addLayer("Overlay", 30, true);
    }

    // ─────────────────────────────────────────────────────────────
    //  INIT — call after renderer is fully initialized
    // ─────────────────────────────────────────────────────────────

    async init() {
        const container = this._game.canvas.container;
        container.appendChild(this._canvas);

        const gameCanvas = this._game.canvas.canvas;
        this.raycast = new UIRaycast(gameCanvas, this);
    }

    // ─────────────────────────────────────────────────────────────
    //  LAYER MANAGEMENT
    // ─────────────────────────────────────────────────────────────

    /**
     * Add a new named layer.
     * If a layer with this name already exists, returns the existing one.
     *
     * @param {string}  name
     * @param {number}  order   — draw order, lower = behind
     * @param {boolean} global  — true = survives scene switches
     * @returns {UILayer}
     */
    addLayer(name, order = 0, global = false, defaults = {}) {
        if (this._layers.has(name)) return this._layers.get(name);
        return this._addLayer(name, order, global, defaults);
    }

    _addLayer(name, order, global = false, defaults = {}) {
        const layer = new UILayer(name, order, defaults);
        layer._global = global;
        this._layers.set(name, layer);
        this._sortLayers();
        return layer;
    }

    /** Get a layer by name. Returns null if not found. */
    getLayer(name) {
        return this._layers.get(name) ?? null;
    }

    /** Remove a custom layer and all its elements. Cannot remove global layers. */
    removeLayer(name) {
        const layer = this._layers.get(name);
        if (!layer || layer._global) return;
        layer.clear();
        this._layers.delete(name);
    }

    _sortLayers() {
        this._layers = new Map(
            [...this._layers.entries()].sort((a, b) => a[1].order - b[1].order)
        );
    }

    // ─────────────────────────────────────────────────────────────
    //  LAYER VISIBILITY / LOCK
    // ─────────────────────────────────────────────────────────────

    showLayer(name) { this._layers.get(name)?.show(); }
    hideLayer(name) { this._layers.get(name)?.hide(); }
    lockLayer(name) { this._layers.get(name)?.lock(); }
    unlockLayer(name) { this._layers.get(name)?.unlock(); }
    toggleLayer(name) { this._layers.get(name)?.toggle(); }

    isLayerVisible(name) { return this._layers.get(name)?.visible ?? false; }
    isLayerLocked(name) { return this._layers.get(name)?.locked ?? false; }

    // ─────────────────────────────────────────────────────────────
    //  ELEMENT MANAGEMENT
    // ─────────────────────────────────────────────────────────────

    /**
     * Add a UI element to a layer.
     *
     * @param {UIElement} element
     * @param {string}    layerName  — defaults to "HUD"
     * @returns {UIElement}
     */
    add(element, layerName = "HUD") {
        let layer = this._layers.get(layerName);

        if (!layer) {
            console.warn(`UICanvas: layer "${layerName}" not found — creating it.`);
            layer = this.addLayer(layerName, 0);
        }

        element._canvas = this._canvas;
        element._theme = this.theme;
        element.init();

        layer._add(element);
        return element;
    }

    /**
     * Remove a UI element from its layer.
     * @param {UIElement} element
     */
    remove(element) {
        // use stored layer reference first
        if (element._layer) {
            element._layer._remove(element);
            return;
        }

        // fallback — search all layers
        for (const layer of this._layers.values()) {
            if (layer._elements.includes(element)) {
                layer._remove(element);
                return;
            }
        }
    }

    /**
     * Clear UI elements.
     *
     * clear()              — clears ALL layers (called on scene switch)
     * clear("HUD")         — clears only the HUD layer
     */
    clear(layerName = null) {
        if (layerName) {
            this._layers.get(layerName)?.clear();
            return;
        }

        // clear all layers
        for (const layer of this._layers.values()) layer.clear();

        // remove non-global layers entirely
        for (const [name, layer] of this._layers.entries()) {
            if (!layer._global) this._layers.delete(name);
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  QUERY
    // ─────────────────────────────────────────────────────────────

    /** Find element by name across all layers. */
    find(name) {
        for (const layer of this._layers.values()) {
            const el = layer._elements.find(e => e.name === name);
            if (el) return el;
        }
        return null;
    }

    /** Find all elements with a given name across all layers. */
    findAll(name) {
        const results = [];
        for (const layer of this._layers.values()) {
            results.push(...layer._elements.filter(e => e.name === name));
        }
        return results;
    }

    /** Find element by id across all layers. */
    findById(id) {
        for (const layer of this._layers.values()) {
            const el = layer._elements.find(e => e.id === id);
            if (el) return el;
        }
        return null;
    }

    /** Get all elements in a specific layer. */
    getElements(layerName) {
        return this._layers.get(layerName)?._elements ?? [];
    }

    // ─────────────────────────────────────────────────────────────
    //  RAYCAST — called by UIRaycast internally
    // ─────────────────────────────────────────────────────────────

    /**
     * Returns topmost interactive element at (px, py).
     * Walks layers in reverse order — highest order (Overlay) checked first.
     * Skips hidden and locked layers automatically.
     */
    hitTestAll(px, py) {
        const layers = [...this._layers.values()].reverse();
        for (const layer of layers) {
            const hit = layer.hitTest(px, py);
            if (hit) return hit;
        }
        return null;
    }

    // ─────────────────────────────────────────────────────────────
    //  UPDATE + RENDER — called by game loop
    // ─────────────────────────────────────────────────────────────

    update(dt) {
        for (const layer of this._layers.values()) {
            layer.update(dt);
        }
    }

    render() {
        const ctx = this._ctx;
        const w = this._canvas.width;
        const h = this._canvas.height;

        ctx.clearRect(0, 0, w, h);

        // layers already sorted by order — World first, Overlay last
        for (const layer of this._layers.values()) {
            layer.render(ctx, w, h, this._game);
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  CLEANUP
    // ─────────────────────────────────────────────────────────────

    destroy() {
        this.raycast?.destroy();
        for (const layer of this._layers.values()) layer.clear();
        this._canvas.remove();
    }
}