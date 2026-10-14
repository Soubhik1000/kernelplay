# 🛠️ Helpers & Utilities

[← Back to README](../README.md) · [All docs](./README.md)

---

## Shorthand API (inside ScriptComponent)

```js
this.destroy()                      // entity.destroy()
this.findByTag("wall")              // scene.findByTag("wall")
this.findAllByTag("wall")           // scene.findAllByTag("wall")
this.raycast(Mouse.x, Mouse.y)      // scene.raycast(...)
this.camera                         // scene.game.camera
```

## Input

```js
if (Keyboard.isDown(KeyCode.ArrowRight))    rb.velocity.x = speed;
if (Keyboard.wasPressed(KeyCode.Space))     rb.velocity.y = -jumpForce;
if (Mouse.wasPressed(MouseButton.Left))     this.instantiate(Bullet, x, y);
```

## Math & Vectors

```js
Vector2.add(a, b)           // → Vector2
Vector2.distance(a, b)      // → number
Vector2.distanceSq(a, b)      // → avoiding Math.sqrt()
Vector2.lerp(a, b, 0.5)     // → smooth midpoint
Mathf.clamp(health, 0, 100)
Mathf.lerp(current, target, 0.1)
Mathf.degToRad(90)
```

## Timer & Cooldown

```js
const waveTimer    = new Timer(5.0, true);    // 5s, auto-starts
const fireCooldown = new Cooldown(0.2);       // 5 shots/sec

update(dt) {
  waveTimer.update(dt);
  if (waveTimer.isFinished()) { spawnNextWave(); waveTimer.start(); }

  fireCooldown.update(dt);
  if (Mouse.wasPressed(MouseButton.Left) && fireCooldown.trigger()) {
    this.instantiate(Bullet, x, y);
  }
}
```

## Prop Injection

```js
import { ref } from "kernelplay-js";

player.addComponent("controller", new PlayerController({
  enemy:   ref(5),    // entity ID 5
  camera1: ref(100),
  force:   800,
}));

// Inside PlayerController — available as this.enemy, this.camera1, this.force
```

## Debug Mode

```js
game.config.debugPhysics = true;   // or press F1 in-game
// 🟢 Green = grounded · 🔴 Red = airborne · 🟡 Yellow = trigger
```
