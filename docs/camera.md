# 🎥 Camera System *(New in v0.2.3)*

[← Back to README](../README.md) · [All docs](./README.md)

---

The camera is now a full Entity in your scene:

```js
const camera = new Entity("MainCamera");

camera.addComponent("transform", new TransformComponent({ position: { x: 400, y: 300, z: 0 } }));
camera.addComponent("camera", new CameraComponent({
  width:       this.game.config.width,
  height:      this.game.config.height,
  target:      player,       // smooth follow
  followSpeed: 5,
  offset:      { x: 0, y: -50, z: 0 },
  bounds:      { minX: 0, maxX: 2000, minY: 0, maxY: 1500 },
  isPrimary:   true,
}));

this.addEntity(camera);
```

**Useful methods:**

```js
this.camera.shake(20, 0.5);                         // screen shake — intensity, duration
this.camera.screenToWorld(Mouse.x, Mouse.y);        // screen → world coords
this.camera.worldToScreen(pos.x, pos.y);            // world → screen coords
this.camera.isInView(x, y);                         // visibility check
this.setPrimaryCamera(this.camera2);                // switch cameras
```
