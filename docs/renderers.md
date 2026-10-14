# 🖥️ Renderers

[← Back to README](../README.md) · [All docs](./README.md)

---

Swap the backend with one line — your ECS, physics, and scripts stay identical.

| | 🎨 **Canvas 2D** | ⚡ **Pixi.js 2D** | 🌐 **Three.js 3D** |
|---|---|---|---|
| Install | None | `@kernelplay/pixi-renderer` | `@kernelplay/three-renderer` |
| Rendering | CPU | GPU (WebGL) | GPU (WebGL) |
| Best for | Prototypes, logic-heavy | Sprite games, VFX | 3D, isometric |
| Object ceiling | ~10,000 | 20,000+ | Scene-dependent |
| | Default renderer. Best for simple 2D games. Zero setup required. | Full GPU-accelerated 2D. Handles thousands of sprites smoothly with Pixi.js integration. | Full 3D rendering with Three.js integration. |

## Canvas 2D (Default)

No renderer configuration is needed. Canvas 2D is used automatically if you don't pass a renderer option.

```js
// Default Canvas 2D — just run the game
new MyGame({ width: 800, height: 600, fps: 60 }).start();
```

## Pixi.js 2D Renderer

### Install with npm

```bash
npm install @kernelplay/pixi-renderer pixi.js kernelplay-js
```

### CDN / Import Map

```html
<script type="importmap">
{
  "imports": {
    "pixi.js": "https://cdn.jsdelivr.net/npm/pixi.js@8.0.0/dist/pixi.min.mjs",
    "kernelplay-js": "https://cdn.jsdelivr.net/npm/kernelplay-js/dist/kernelplay.es.js",
    "@kernelplay/pixi-renderer": "https://cdn.jsdelivr.net/npm/@kernelplay/pixi-renderer/dist/pixi-renderer.es.js"
  }
}
</script>
```

### WebGL 2D Renderer

```js
import { WebGL2DRenderer } from "@kernelplay/pixi-renderer";

new MyGame({
  renderer: new WebGL2DRenderer(),
  width: 800,
  height: 600,
  fps: 60,
  backgroundColor: "#eeeeee"
}).start();
```

## Three.js 3D Renderer

### Install with npm

```bash
npm install @kernelplay/three-renderer three kernelplay-js
```

### CDN / Import Map

```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/",
    "kernelplay-js": "https://cdn.jsdelivr.net/npm/kernelplay-js/dist/kernelplay.es.js",
    "@kernelplay/three-renderer": "https://cdn.jsdelivr.net/npm/@kernelplay/three-renderer/dist/three-renderer.es.js"
  }
}
</script>
```

### Usage

```js
import { ThreeRenderer } from "@kernelplay/three-renderer";
import * as THREE from "three";

new MyGame({
  renderer: new ThreeRenderer(),
  width: 800,
  height: 600,
  fps: 60
}).start();

// Use 3D components with the Three renderer
entity.addComponent("transform", new TransformComponent({
  position: { x: 0, y: 0, z: -5 }
}));
```

> **⚠️ Three.js and Pixi.js peer dependencies**
>
> When using `ThreeRenderer`, install `three` separately. For Pixi.js rendering, install `pixi.js` separately as well.