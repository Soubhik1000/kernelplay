# Script Lifecycle
onAttach, onStart, update, lateUpdate, onCollision, onDestroy.

[← Back to README](../README.md) · [All docs](./README.md)

---

## Full Lifecycle Example

```js
import { ScriptComponent } from "kernelplay-js";

class MyScript extends ScriptComponent {

  // Called once when the entity is added to the scene
  onAttach() {
    console.log("Entity added to scene");
    this.speed = 0;
  }

  // Called once before the very first update()
  onStart() {
    this.speed = 150;
    this.health = 100;
  }

  // Called every frame — dt = delta time in seconds
  update(dt) {
    const t = this.entity.getComponent("transform");
    t.position.x += this.speed * dt;
  }

  // Called after ALL entities have run update() — good for cameras
  lateUpdate(dt) {
    this.syncCamera();
  }

  // Called when this collider hits a solid collider
  onCollision(other) {
    if (other.tag === "spike") this.health -= 10;
    console.log("Hit:", other.name, "Health:", this.health);
  }

  // Called when overlapping a trigger collider (isTrigger: true)
  onTriggerEnter(other) {
    if (other.tag === "checkpoint") this.savePosition();
  }

  // Called when leaving a trigger zone
  onTriggerExit(other) {
    console.log("Left trigger:", other.name);
  }

  // Called when entity.destroy() is used or scene unloads
  onDestroy() {
    console.log("Cleanup resources");
  }
}
```

## Execution Order

1. `onAttach()` — entity enters scene
2. `onStart()` — first frame only
3. `update(dt)` — every frame
4. `lateUpdate(dt)` — after all updates
5. `onCollision / onTriggerEnter / onTriggerExit` — as events fire
6. `onDestroy()` — entity removed
