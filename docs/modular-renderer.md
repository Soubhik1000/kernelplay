# KernelPlayJS — Modular Renderer *(New in v0.6.0)*

[← Back to README](../README.md) · [All docs](./README.md)

## Table of Contents

- [Modular Renderer](#modular-renderer)
  - [How It Works](#how-it-works)
  - [RenderData](#renderdata)
  - [Render Components](#render-components)
  - [Drawers](#drawers)
  - [Batching and Z-Order](#batching-and-z-order)
  - [Pixi Compatibility](#pixi-compatibility)
  - [Writing a Custom Renderer Component](#writing-a-custom-renderer-component)
  - [Renderer API Reference](#renderer-api-reference)

## Modular Renderer

Render components no longer draw themselves directly. They describe what should be drawn, and a drawer for the active backend does the drawing. The same component can then work with Canvas2D, Pixi, or future backends.

### How It Works

```
Component              RenderData              Drawer
(what to draw)   →   (plain snapshot)   →   (how to draw it)
BoxRenderComponent                          BoxDrawer
ShapeRenderer         type, x, y, rot,      ShapeDrawer2D
SpriteComponent       width, color, ...     SpriteDrawer2D
```

Each frame, `CanvasRenderer`:

1. Gets visible renderers from the spatial grid (frustum culling).
2. Sorts them by `zIndex`.
3. Calls `getRenderData()` on each, then dispatches to the drawer matching `rd.type`.
4. Falls back to the component's own `render(ctx)` if it has no `getRenderData()`.

---

### RenderData

`RenderData` is a plain object that holds everything a drawer needs:

```js
import { RenderData } from "../rendering/RenderData.js";
```

| Group | Fields |
|---|---|
| Identity | `type`, `visible`, `zIndex`, `alpha`, `color` |
| Transform | `x`, `y`, `z`, `rot`, `scaleX`, `scaleY`, `scaleZ`, `flipX`, `flipY` |
| Geometry | `width`, `height`, `depth`, `radius`, `radiusX`, `radiusY`, `anchorX`, `anchorY`, `points` |
| Material | `filled`, `strokeColor`, `strokeWidth` |
| Texture | `texture`, `src`, `frameX`, `frameY`, `frameW`, `frameH`, `tint` |

Each component creates one `RenderData` in `init()` and reuses it every frame, so nothing is allocated per frame.

---

### Render Components

| Component | `rd.type` | Batchable | Purpose |
|---|---|---|---|
| `BoxRenderComponent` | `"box"` | Yes | Fast solid box for testing and prototyping |
| `ShapeRenderer` | `"rect"`, `"roundedrect"`, `"circle"`, `"ellipse"`, `"triangle"`, `"polygon"`, `"line"` | No | Full-featured shapes with stroke, alpha, anchor |
| `SpriteComponent` | `"sprite"` | No | Images and spritesheet frames with tint |

`BoxRenderComponent` is intentionally simple. Use `ShapeRenderer` for production shapes.

---

### Drawers

Drawers are static classes that read `RenderData` and draw with the backend.

```
rendering/
  RenderData.js
  drawers/
    BoxDrawer.js
    canvas2d/
      ShapeDrawer2D.js
      SpriteDrawer2D.js
```

Dispatch inside `CanvasRenderer`:

```js
switch (rd.type) {
    case "box":    BoxDrawer.draw(ctx, rd);      break;
    case "sprite": SpriteDrawer2D.draw(ctx, rd); break;
    default:       ShapeDrawer2D.draw(ctx, rd);  break; // rect, circle, polygon...
}
```

Sprite tinting uses a cached offscreen canvas per sprite, tint, and frame. Call `setTint()` on the sprite to change a tint so the old cache entry is invalidated.

---

### Batching and Z-Order

The renderer draws everything in one pass, in z-order. It only switches `fillStyle` when the color actually changes between neighbouring batchable items:

```js
let currentColor = null;

for (const r of visibleRenderers) {
    if (typeof r.getRenderData === "function") {
        const rd = r.getRenderData();
        if (!rd) { currentColor = null; r.render(ctx); continue; }

        if (r.batchable !== false) {
            if (rd.color !== currentColor) {
                ctx.fillStyle = rd.color;
                currentColor = rd.color;
            }
        } else {
            currentColor = null;
        }
        // dispatch to drawer by rd.type
    } else {
        currentColor = null;
        r.render(ctx); // legacy component
    }
}
```

An earlier design drew all batched items first and all non-batched items second. That broke z-order between the two groups, so the renderer now keeps a single sorted list. Correct z-order takes priority over perfect color grouping.

Z-index is read from `entity.zIndex` first, then `component.zIndex`.

---

### Pixi Compatibility

The two backends read different things from a component:

| Backend | Reads |
|---|---|
| `CanvasRenderer` | `getRenderData()` |
| `PixiRenderer` | `renderer.object` (a PIXI display object) |

Canvas2D components set `this.object = null` and Pixi components expose `this.object`. A component can have either or both:

| Component | `object` | `getRenderData()` | Works with |
|---|---|---|---|
| `BoxRenderComponent` | `null` | Yes | Canvas2D |
| `ShapeRenderer` | `null` | Yes | Canvas2D |
| `SpriteComponent` | `null` | Yes | Canvas2D |
| `PixiBoxRenderComponent` | PIXI.Graphics | Yes | Both |
| `PixiShapeRenderer` | PIXI.Graphics | Yes | Both |
| `PixiSpriteComponent` | PIXI.Sprite | Yes | Both |

---

### Writing a Custom Renderer Component

```js
import { Component } from "../Component.js";
import { RenderData } from "../rendering/RenderData.js";

export class MyRenderer extends Component {
    constructor({ color = "#fff", zIndex = 0 } = {}) {
        super();
        this.color = color;
        this.zIndex = zIndex;
        this.batchable = false;
        this._dirty = true;
    }

    init() {
        this.transform = this.entity.getComponent("transform");
        this._rd = new RenderData();      // allocate once
        this._rd.type = "my-type";
        this._cachedBounds = { x: 0, y: 0, width: 0, height: 0 };
    }

    getBounds() { /* update and return this._cachedBounds */ }

    getRenderData() {
        const t = this.transform;
        if (!t) return null;
        this._rd.x = t.position.x;
        this._rd.y = t.position.y;
        this._rd.rot = t.rotation.z;
        this._rd.color = this.color;
        this._rd.zIndex = this.zIndex;
        return this._rd;                  // same object every frame
    }
}
```

Then add a drawer and a `case` in the renderer dispatch for the new `type`.

Components that don't implement `getRenderData()` keep working through their own `render(ctx)`, so migration can happen one component at a time.

---

### Renderer API Reference

| Member | Description |
|---|---|
| `component.getRenderData()` | Returns a cached `RenderData`, or `null` to fall back to `render(ctx)` |
| `component.getBounds()` | Cached world bounds for culling |
| `component.batchable` | `true` lets color batching apply. `false` resets the batch |
| `component.render(ctx)` | Legacy direct-draw path |
| `component.object` | PIXI display object for the Pixi backend |
| `SpriteComponent.setTint(tint)` | Change tint and invalidate cached tinted frame |
