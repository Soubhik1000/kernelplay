# 🎥 Camera System *(New in v0.2.3)*

[← Back to README](../README.md) · [All docs](./README.md)

---

No more hassle with manual game camera handling.

## ❌ Old Way (Manual Camera)

Previously, you had to manually sync the camera with the player:

```js
// Camera follows player manually
this.camera.x = transform.position.x - this.camera.width / 2;
this.camera.y = transform.position.y - this.camera.height / 2;
```

---

## ✅ New Way (Camera as a GameObject)

Now, the camera is just another `Entity` in your scene.

```js
class GameScene extends Scene {
  init() {
    // Create player
    const player = new Player(400, 300);
    this.addEntity(player);

    // Create camera entity
    const camera = new Entity("MainCamera");

    camera.addComponent("transform", new TransformComponent({
      position: { x: 400, y: 300, z: 0 }
    }));

    camera.addComponent("camera", new CameraComponent({
      width: this.game.config.width,
      height: this.game.config.height,

      // 🔥 Follow system
      target: player,
      followSpeed: 5,

      // Offset from target
      offset: { x: 0, y: -50, z: 0 },

      // Level bounds (prevents showing outside world)
      bounds: {
        minX: 0,
        maxX: 2000,
        minY: 0,
        maxY: 1500
      },

      isPrimary: true
    }));

    this.addEntity(camera);
  }
}
```

---

## 🎮 Using Camera in Scripts

```js
export class PlayerController extends ScriptComponent {
  onStart() {
    // Get primary camera
    this.primaryCamera = this.entity.scene.getPrimaryCamera();
  }

  update(dt) {
    // Shortcut access
    this.camera;
  }
}
```

---

## 🧠 CameraComponent Methods

```js
// Set follow target
this.camera.setTarget(this.entity);

// Screen shake effect
this.camera.shake(20, 0.5);

// Convert screen → world coordinates
const worldPos = this.camera.screenToWorld(Mouse.x, Mouse.y);

// Convert world → screen coordinates
const screenPos = this.camera.worldToScreen(pos.x, pos.y);

// Check if a position is visible
this.camera.isInView(x, y);
```

---

## 🎥 Multiple Cameras Setup

```js
// Camera 1 (Primary)
const camera1 = new Entity("MainCamera");
camera1.id = 100;

camera1.addComponent("transform", new TransformComponent({
  position: { x: 400, y: 300, z: 10 }
}));

camera1.addComponent("camera", new CameraComponent({
  width: 800,
  height: 600,
  isPrimary: true
}));

// Camera 2
const camera2 = new Entity("Camera2");
camera2.id = 101;

camera2.addComponent("transform", new TransformComponent({
  position: { x: 0, y: 0, z: 10 }
}));

camera2.addComponent("camera", new CameraComponent({
  width: 800,
  height: 600,
  isPrimary: false
}));
```

---

## 🔄 Switching Between Cameras

```js
// Inside ScriptComponent
this.setPrimaryCamera(this.camera2);
```
