# KernelPlayJS

⚠️ **Alpha Release**

KernelPlayJS is a lightweight **2D JavaScript game engine** inspired by Unity's **Entity–Component architecture**. It is designed for learning, experimentation, and building small-to-medium 2D games using HTML5 Canvas.

> This project is currently in **alpha**. APIs may change.

---

## ✨ Features (Alpha)

* Game loop with configurable FPS
* Scene & SceneManager system
* Entity–Component architecture (ECS-lite)
* Script components (Unity-like behaviour)
* Keyboard & Mouse input
* AABB collision detection
* Trigger vs solid colliders
* Raycasting / mouse picking
* Tags & Layers (bitmask-based)
* Single-canvas rendering

---

## 📦 Installation

```bash
npm install kernelplay-js --save
```

---

## 🚀 Quick Start

```js
import { Game, Scene, Entity } from "kernelplay-js";
import { PositionComponent, BoxRenderComponent } from "kernelplay-js";

class MyScene extends Scene {
  init() {
    const box = new Entity();
    // add components here
    box.addComponent("position", new PositionComponent(300, 200));
    box.addComponent("renderer", new BoxRenderComponent(40, 40, "red"));

    this.addEntity(box);
  }
}

class MyGame extends Game {
  init() {
    const scene = new MyScene("Main");
    this.sceneManager.addScene(scene);
    this.sceneManager.startScene("Main");
  }
}

new MyGame({ width: 800, height: 600, fps: 60 }).start();
```

---

## 🧱 Core Concepts

### Scene

* Owns entities
* Handles update, render, collision, raycast

### Entity

* GameObject equivalent
* Holds components
* Has `tag` and `layer`

### Component

* Behaviour attached to entity
* Includes ScriptComponent, Collider, Renderer, etc.

### ScriptComponent

* Custom logic (similar to Unity's MonoBehaviour)

---

## 🖱 Input

```js
Keyboard.isPressed("ArrowRight");
Mouse.wasPressed(0); // Left click
```

---

## 🎯 Raycast Example

```js
const hit = this.entity.scene.raycast(Mouse.x, Mouse.y, {
  layerMask: Layers.Enemy
});
```

---

## 🏷 Tags & Layers

```js
entity.tag = "Player";
entity.layer = Layers.Player;
```

---

## Links
- GitHub: https://github.com/username/repo
- npm: https://www.npmjs.com/package/your-package

## 🧪 Status

* Version: `0.1.0-alpha`
* Stability: Experimental
* Target: Learning & prototyping

---

## 🗺 Roadmap

* Script lifecycle (`onStart`, `onDestroy`)
* Prefab system
* Camera & world coordinates
* Physics layer collision matrix
* UI system
* Audio & animation

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome.

---

## 📄 License

MIT License

---

Built with ❤️ by **Soubhik Mukherjee**
