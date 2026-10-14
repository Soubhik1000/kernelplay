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

## Controlling Physics in Scripts

```js
class PlayerController extends ScriptComponent {
  update(dt) {
    const rb = this.entity.getComponent("rigidbody2d");
    const speed = 200;

    // Horizontal movement
    if (Keyboard.isPressed("ArrowRight")) rb.velocity.x = speed;
    else if (Keyboard.isPressed("ArrowLeft")) rb.velocity.x = -speed;
    else rb.velocity.x *= 0.8; // friction

    // Jump — only when on ground
    if (Keyboard.wasPressed("Space") && this.isGrounded) {
      rb.addForce(0, -600, "impulse");  //modes force and impulse
    }

    // Use rigidbodies default ground checking systems
    if (this.rb.isGrounded) {
      // your code
    }
  }

  onCollision(other) {
    // Detect ground
    if (other.tag === "ground") this.isGrounded = true;
    if (other.name === "Enemy") other.destroy();
  }
}
```

## Trigger Colliders

Set `isTrigger: true` on a collider to detect overlap without a physical response.

```js
// Coin entity
const coin = new Entity("Coin");
coin.addComponent("collider", new ColliderComponent({
  width: 20, height: 20,
  isTrigger: true        // ← no push, just events
}));
coin.addComponent("script", new class extends ScriptComponent {
  onTriggerEnter(other) {
    if (other.tag === "player") {
      score += 10;
      this.entity.destroy();
    }
  }
}());
```

## Physics Properties

| Property | Type | Description |
| --- | --- | --- |
| `mass` | number | Affects force response (default: 1) |
| `gravityScale` | number | Multiplier on world gravity (default: 1) |
| `drag` | number | Air resistance (0–1, default: 0.05) |
| `isKinematic` | boolean | Script-driven, ignores gravity/forces |
| `velocity` | {x, y} | Current velocity vector |

