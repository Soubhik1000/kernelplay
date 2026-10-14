# Physics System

[← Back to README](../README.md) · [All docs](./README.md)

---

## Physics-Enabled Entity

Combine a `Rigidbody2DComponent` and `ColliderComponent` to get full physics.

```js
const player = new Entity("Player");

player.addComponent("transform", new TransformComponent({
  position: { x: 400, y: 100 }
}));
player.addComponent("rigidbody2d", new Rigidbody2DComponent({
  useGravity: true,
  mass: 1,
  drag: 0.02
}));
player.addComponent("collider", new ColliderComponent());

scene.addEntity(player);
```
