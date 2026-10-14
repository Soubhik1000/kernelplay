# 🎮 Core Concepts

[← Back to README](../README.md) · [All docs](./README.md)

---

Everything in KernelPlayJS is built around three ideas:

- **Entities** — your game objects (player, bullet, enemy, tree)
- **Components** — data attached to entities (position, physics, renderer)
- **Scripts** — the brains; custom logic that runs every frame

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

**Script lifecycle:** `onAttach → onStart → update → lateUpdate → onDestroy`
