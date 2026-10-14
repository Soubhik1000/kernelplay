# 🖥️ Renderers

[← Back to README](../README.md) · [All docs](./README.md)

---

Swap the backend with one line — your ECS, physics, and scripts stay identical.

| | Canvas 2D | Pixi.js 2D | Three.js 3D |
|---|---|---|---|
| Install | None | `@kernelplay/pixi-renderer` | `@kernelplay/three-renderer` |
| Rendering | CPU | GPU (WebGL) | GPU (WebGL) |
| Best for | Prototypes, logic-heavy | Sprite games, VFX | 3D, isometric |
| Object ceiling | ~10,000 | 20,000+ | Scene-dependent |

```js
// Canvas 2D — default, zero dependencies
new MyGame({ width: 800, height: 600, fps: 60 }).start();

// Pixi.js — GPU-accelerated sprites
import { PixiRenderer } from "@kernelplay/pixi-renderer";
new MyGame({ renderer: new PixiRenderer(), width: 800, height: 600 }).start();

// Three.js — full 3D
import { ThreeRenderer } from "@kernelplay/three-renderer";
new MyGame({ renderer: new ThreeRenderer(), width: 800, height: 600 }).start();
```
