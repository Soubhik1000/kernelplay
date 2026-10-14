# 🎮 Core Concepts

[← Back to README](../README.md) · [All docs](./README.md)

---

> **🎮 Game** — The main entry point. Manages the game loop, scenes, and rendering. Configure FPS, canvas size, and renderer type.

> **🎭 Scene** — Contains entities and manages updates, rendering, collisions, and raycasting. Think of it as a level or game state.

> **📦 Entity** — A game object that holds components. Entities have tags and layers for organization and collision filtering.

> **🔧 Component** — Behaviors attached to entities. Includes transform, renderer, collider, rigidbody, and custom script components.

## The Entity-Component Pattern

KernelPlay.js uses an Entity-Component architecture (ECS-inspired). Instead of deep inheritance trees, you compose behavior by attaching components.

```js
export class Player extends Entity {
  constructor(x, y) {
    super("Player");
    this.tag = "player";
    this.zIndex = 10;

    this.addComponent("transform",   new TransformComponent({ position: { x, y } }));
    this.addComponent("rigidbody2d", new Rigidbody2DComponent({ mass: 1, gravityScale: 1 }));
    this.addComponent("collider",    new ColliderComponent({ width: 50, height: 50 }));
    this.addComponent("renderer",    new BoxRenderComponent({ color: "red" }));
    this.addComponent("controller",  new PlayerController());
  }
}
```

```

**Script lifecycle:** `onAttach → onStart → update → lateUpdate → onDestroy`
