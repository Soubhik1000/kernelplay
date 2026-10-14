# KernelPlayJS

A **2D/3D JavaScript game engine** that feels like Unity — but lives in your browser.
Built on an Entity–Component architecture, fast, flexible, and surprisingly fun to use.

> **v0.5.1-beta** · MIT License · Built by Soubhik Mukherjee

---

<div align="left">
  <img height="400" src="https://soubhik-rjs.github.io/kernelplay-js-demo/demoplay.gif" />
</div>
<div align="left">
  <img height="400" src="https://soubhik2.github.io/HomeLand.github.oi/Images/PerformanceM.png" />
</div>

---

## 📑 Table of Contents

- [🔴 Live Demo](#-live-demo)
- [⚡ Why KernelPlayJS?](#-why-kernelplayjs)
- [📦 Installation](#-installation)
- [🚀 Quick Start](#-quick-start)
- [📚 Documentation](#-documentation)
- [🤝 Contributing](#-contributing)
- [🔗 Links](#-links)

---

## 🔴 Live Demo
👉 https://soubhik-rjs.github.io/kernelplay-js-demo/examples/parkour-boy/

🏁 **[Benchmark Demo](https://soubhik-rjs.github.io/kernelplay-js-demo/examples/BenchmarkCanvas2D/)** · 📚 **[Full Documentation](https://soubhik-rjs.github.io/kernelplay-js-demo/docs/)**

---

## ⚡ Why KernelPlayJS?

Most browser game engines either hold your hand too much or leave you drowning in boilerplate. KernelPlayJS hits the sweet spot — it handles the hard stuff so you can focus on making your game fun.

- **Entity–Component–Script** architecture — just like Unity
- **3 renderer backends** — Canvas 2D, Pixi.js, Three.js — swap with one line
- **10,000+ objects at 60 FPS** on a 7th gen i3
- **Full animation state machine** — triggers, transitions, crossfades
- **Zero config** object pooling, spatial grid, frustum culling

---
## 📦 Installation

```bash
npm install kernelplay-js
```

Or use a CDN:

```html
<script type="importmap">
{
  "imports": {
    "kernelplay-js": "https://cdn.jsdelivr.net/npm/kernelplay-js/dist/kernelplay.es.js"
  }
}
</script>
```

### Optional Renderer Plugins

```bash
npm install @kernelplay/pixi-renderer   # GPU-accelerated 2D sprites & effects
npm install @kernelplay/three-renderer   # Full 3D — lights, meshes, shadows
```
#### Optional Renderer Plugins Documentation
**[@kernelplay/pixi-renderer](https://www.npmjs.com/package/@kernelplay/pixi-renderer)** <br>
**[@kernelplay/three-renderer](https://www.npmjs.com/package/@kernelplay/three-renderer)**

---
## 🚀 Quick Start
### Procedural Approach
```js
import { Game, Scene, Entity, TransformComponent, BoxRenderComponent, CameraComponent, ScriptComponent, Keyboard, KeyCode} from "kernelplay-js";

// function base
const game = new Game({width: 800, height: 600, fps: 60});

const camera = new Entity("MainCamera");

camera.addComponent("transform", new TransformComponent({ position: { x: 400, y: 300, z: 0 } }));
camera.addComponent("camera", new CameraComponent({width: game.config.width, height: game.config.height, isPrimary: true}));

const myScript = {
  onStart() {
    console.log(this);
    this.transform = this.entity.getComponent("transform");
    this.speed = 200;
  },
  update(dt) {
    if(Keyboard.isPressed(KeyCode.W) || Keyboard.isPressed(KeyCode.ArrowUp)){
      this.transform.position.y -= this.speed*dt;
    }
    if(Keyboard.isPressed(KeyCode.S) || Keyboard.isPressed(KeyCode.ArrowDown)){
      this.transform.position.y += this.speed*dt;
    }
    if(Keyboard.isPressed(KeyCode.A) || Keyboard.isPressed(KeyCode.ArrowLeft)){
      this.transform.position.x -= this.speed*dt;
    }
    if(Keyboard.isPressed(KeyCode.D) || Keyboard.isPressed(KeyCode.ArrowRight)){
      this.transform.position.x += this.speed*dt;
    }
  }
}

const box = new Entity();
box.addComponent("transform", new TransformComponent({ position: { x: 300, y: 200 } }));
box.addComponent("renderer", new BoxRenderComponent({ color: "red" }));
box.addComponent("script", new ScriptComponent(myScript));

const MyScene = new Scene("Main");
MyScene.addEntity(camera);
MyScene.addEntity(box);

game.sceneManager.addScene(MyScene);
game.sceneManager.startScene("Main");
game.start();
```

### Instantiated Approach
```js
import { Game, Scene, Entity, TransformComponent, BoxRenderComponent, CameraComponent, ScriptComponent, Keyboard, KeyCode} from "kernelplay-js";

class MyScene extends Scene {
  init() {
    const camera = new Entity("MainCamera");
    camera.addComponent("transform", new TransformComponent({ position: { x: 400, y: 300, z: 0 } }));
    camera.addComponent("camera", new CameraComponent({width: this.game.config.width, height: this.game.config.height, isPrimary: true}));

    const box = new Entity();
    box.addComponent("transform", new TransformComponent({ position: { x: 300, y: 200 } }));
    box.addComponent("renderer", new BoxRenderComponent({ color: "red" }));
    box.addComponent("script", new MyScript({speed: 200}));

    this.addEntity(camera);
    this.addEntity(box);
  }
}

class MyScript extends ScriptComponent{
  onStart() {
    this.transform = this.entity.getComponent("transform");
  }

  update(dt) {
    if (Keyboard.isPressed(KeyCode.W) || Keyboard.isPressed(KeyCode.ArrowUp)) {
      this.transform.position.y -= this.speed * dt;
    }
    if (Keyboard.isPressed(KeyCode.S) || Keyboard.isPressed(KeyCode.ArrowDown)) {
      this.transform.position.y += this.speed * dt;
    }
    if (Keyboard.isPressed(KeyCode.A) || Keyboard.isPressed(KeyCode.ArrowLeft)) {
      this.transform.position.x -= this.speed * dt;
    }
    if (Keyboard.isPressed(KeyCode.D) || Keyboard.isPressed(KeyCode.ArrowRight)) {
      this.transform.position.x += this.speed * dt;
    }
  }
}

class MyGame extends Game {
  init() {
    this.sceneManager.addScene(new MyScene("Main"));
    this.sceneManager.startScene("Main");
  }
}

new MyGame({ width: 800, height: 600, fps: 60 }).start();
```

---

## 📚 Documentation

| Guide | What's inside |
|---|---|
| [🎮 Core Concepts](https://github.com/Soubhik1000/kernelplay/blob/main/docs/core-concepts.md) | Entities, components, scripts and the script lifecycle. |
| [🎮 Input System *(New in v0.5.0)*](https://github.com/Soubhik1000/kernelplay/blob/main/docs/input.md) | Unified Keyboard, Gamepad and Touch input. |
| [🖼️ UI System *(New in v0.4.0)*](https://github.com/Soubhik1000/kernelplay/blob/main/docs/ui.md) | Retained-mode UI: panels, text, buttons, bars, layers and world-space labels. |
| [🎵 AudioSource *(New in v0.3.1)*](https://github.com/Soubhik1000/kernelplay/blob/main/docs/audio.md) | Spatial SFX, loops, background music and the AudioListener. |
| [🎞️ Animation System *(New in v0.3.0)*](https://github.com/Soubhik1000/kernelplay/blob/main/docs/animation.md) | AnimationClip, AnimatorController state machine and AnimatorComponent. |
| [🎥 Camera System *(New in v0.2.3)*](https://github.com/Soubhik1000/kernelplay/blob/main/docs/camera.md) | Camera entity, smooth follow, bounds, shake and coordinate conversion. |
| [Physics System](https://github.com/Soubhik1000/kernelplay/blob/main/docs/physics.md) | Built-in 2D physics with collision detection, rigidbodies, and gravity. |
| [🔫 Object Pooling](https://github.com/Soubhik1000/kernelplay/blob/main/docs/object-pooling.md) | Zero-config entity recycling for bullets and other short-lived objects. |
| [🖥️ Renderers](https://github.com/Soubhik1000/kernelplay/blob/main/docs/renderers.md) | Canvas 2D, Pixi.js and Three.js backends. |
| [⚡ Performance](https://github.com/Soubhik1000/kernelplay/blob/main/docs/performance.md) | Benchmarks and the techniques that keep the engine fast. |
| [Game Configuration](https://github.com/Soubhik1000/kernelplay/blob/main/docs/config.md) | Container selector, frame rate and calculation rate settings. |
| [🛠️ Helpers & Utilities](https://github.com/Soubhik1000/kernelplay/blob/main/docs/helpers.md) | Shorthand API, math, timers, prop injection and debug mode. |
| [🗺️ Roadmap](https://github.com/Soubhik1000/kernelplay/blob/main/docs/roadmap.md) | Version history and planned features. |

---

## 🤝 Contributing

Contributions welcome — especially: audio system, particle effects, documentation, bug fixes, renderer plugins.

See [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

---

## 🔗 Links

- **GitHub:** https://github.com/Soubhik1000/kernelplay
- **NPM:** https://www.npmjs.com/package/kernelplay-js
- **Docs:** https://soubhik-rjs.github.io/kernelplay-js-demo/docs/
- **Discord** https://discord.gg/bHfe96EnNR

---

Built with ❤️ by **Soubhik Mukherjee** · *KernelPlayJS — Production speed, Unity feel*
