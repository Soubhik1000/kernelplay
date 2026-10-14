# Components

[← Back to README](../README.md) · [All docs](./README.md)

---

## TransformComponent

Position, rotation, and scale of an entity in world space.

```js
import { TransformComponent } from "kernelplay-js";

entity.addComponent("transform", new TransformComponent({
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 }
});

// Access later
const t = entity.getComponent("transform");
t.position.x += 5;
t.rotation.z += 0.01;
```

## ColliderComponent

Enables collision detection. Can be solid or trigger-based.

```js
import { ColliderComponent } from "kernelplay-js";

entity.addComponent("collider", new ColliderComponent({
  width: 50,
  height: 50,
  isTrigger: false,   // true = trigger events only, no physics push
  offset: { x: 0, y: 0 }
}));
```

## Rigidbody2DComponent

Adds 2D physics simulation — gravity, velocity, drag, and mass.

```js
import { Rigidbody2DComponent } from "kernelplay-js";

entity.addComponent("rigidbody2d", new Rigidbody2DComponent({
  mass: 1,
  gravityScale: 1,
  isKinematic: false,  // kinematic = not affected by gravity/forces
  drag: 0.05,
  useGravity: true
}));

// Manipulate at runtime
const rb = entity.getComponent("rigidbody2d");
rb.velocity.x = 200;
rb.addForce({ x: 0, y: -500 });  // impulse upward
```

## BoxRenderComponent

Renders a filled rectangle. Great for prototyping.

```js
import { BoxRenderComponent } from "kernelplay-js";

entity.addComponent("renderer", new BoxRenderComponent(
  { color: "red" }
));
```

## ScriptComponent

Attach custom logic with lifecycle hooks. See the [Script Lifecycle](/docs/lifecycle) section.

```js
import { ScriptComponent } from "kernelplay-js";

class Spinner extends ScriptComponent {
  update(dt) {
    const t = this.entity.getComponent("transform");
    t.rotation.z += 2 * dt; // 2 radians/sec
  }
}

entity.addComponent("script", new Spinner());
```
