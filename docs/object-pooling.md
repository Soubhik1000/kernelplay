# 🔫 Object Pooling

[← Back to README](../README.md) · [All docs](./README.md)

---

No setup needed — KernelPlayJS silently recycles destroyed entities:

```js
this.instantiate(Bullet, x, y);   // reuses a pooled entity if one exists
this.destroy();                    // returns to pool, not the garbage collector
```

Bullet prefabs must use the function form (not `class extends Entity`):

```js
export function Bullet(entity, x = 0, y = 0) {
  entity.name = "Bullet";
  entity.tag  = "bullet";
  entity.addComponent("transform",   new TransformComponent({ position: { x, y } }));
  entity.addComponent("rigidbody2d", new Rigidbody2DComponent({ useGravity: false }));
  entity.addComponent("collider",    new ColliderComponent({ isTrigger: true }));
  entity.addComponent("renderer",    new BoxRenderComponent({ color: "#00ff11" }));
  entity.addComponent("script",      new BulletScript());
}
```
