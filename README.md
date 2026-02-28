# KernelPlayJS

A high-performance **2D/3D JavaScript game engine** with Entity-Component architecture, built for production games and rapid prototyping.

> **Version:** `0.2.0-alpha` | **Status:** Production-ready performance, API stabilizing

---

## 🔴 Live Demo
👉 https://soubhik-rjs.github.io/kernelplay-js-demo/examples/Canvas2D/

## 🔴 Live Benchmark Demo
👉 https://soubhik-rjs.github.io/kernelplay-js-demo/examples/BenchmarkCanvas2D/

## 📚 Full Documentation

Complete documentation with architecture details, tutorials, and API reference:
👉 **[https://soubhik-rjs.github.io/kernelplay-js-demo/docs/](https://soubhik-rjs.github.io/kernelplay-js-demo/docs/)**

---

## ⚡ Performance Highlights

- **10,000+ objects** at 50-60 FPS (i3 7th gen)
- **3,000 physics objects** with 100% collision detection at 40 FPS
- **5,000+ visible sprites** at 40 FPS
- **Spatial grid optimization** - O(n²) → O(n) collision detection
- **Frustum culling** - Only renders visible objects
- **Component registries** - Direct array iteration for systems

---

## 🚀 What's New in v0.2.0

### 🎯 Object Pooling & Spawning System
Eliminate GC pauses in bullet hell games and high-entity scenarios.

```javascript
// Automatic object pooling - reuses entities instead of creating new ones
this.instantiate(Bullet, position.x, position.y, direction);

// Works in any ScriptComponent - handles pooling internally
// Perfect for bullets, particles, enemies, pickups
```

**Benefits:**
- Zero GC pressure for spawn-heavy games
- 1000+ bullets/second with smooth 60 FPS
- Automatic entity recycling when destroyed

### ⚡ Performance Optimizations Added

**Spatial Grid System (v0.2.0)**
- Collision detection: 40,000x faster for large scenes
- Frustum culling: 20,000 objects → 200-500 render checks
- Cell-based partitioning with configurable grid size

**Dirty Flag Pattern**
- Skip unnecessary bound recalculations
- 91% reduction in transform updates for static objects

**Component Registries**
- Direct system access to component arrays
- No more entity filtering overhead
- 10x faster system iteration

**Batch Rendering**
- Group draws by color/material
- Reduce canvas state changes by 100x

### 🚧 Experimental Features

**Camera System**
```javascript
// Camera follows player automatically
game.camera.x = player.position.x - game.camera.width / 2;
game.camera.y = player.position.y - game.camera.height / 2;
```

**Debug Physics Rendering**
```javascript
// Toggle with F1 key
game.config.debugPhysics = true;

// Visualizes all colliders with color coding:
// Green = grounded, Red = airborne, Yellow = trigger
```

**Enhanced Collision Resolution**
```javascript
// Improved ground detection
// Fixes: objects sinking through ground, jittery collisions
// Uses Math.max/min for velocity clamping instead of setting to 0
```

**zIndex Layering**
```javascript
entity.zIndex = 10;  // Higher = rendered on top
// Supports both entity-level and component-level zIndex
```

---

## 📦 Installation

```bash
npm install kernelplay-js
```

Or use CDN:
```html
<script type="importmap">
{
  "imports": {
    "kernelplay-js": "https://cdn.jsdelivr.net/npm/kernelplay-js/src/kernelplay.es.js"
  }
}
</script>
```

---

## 🚀 Quick Start

```js
import { Game, Scene, Entity } from "kernelplay-js";
import { TransformComponent, BoxRenderComponent } from "kernelplay-js";

class MyScene extends Scene {
  init() {
    const box = new Entity();
    box.addComponent("transform", new TransformComponent({
      position: { x: 300, y: 200 }
    }));
    box.addComponent("renderer", new BoxRenderComponent({ color: "red" }));
    this.addEntity(box);
  }
}

class MyGame extends Game {
  init() {
    this.sceneManager.addScene(new MyScene("Main"));
    this.sceneManager.startScene("Main");
  }
}

new MyGame({ width: 800, height: 600, fps: 60 }).start();
```

---

## 🎮 Core Concepts

### Entity Component System (ECS)
- **Entities** - Containers with unique IDs
- **Components** - Data-only modules (Position, Sprite, Health)
- **Systems** - Logic that operates on components (Physics, Rendering)

### Scene Management
```javascript
// Switch between menu, gameplay, game over
sceneManager.addScene(new MenuScene("Menu"));
sceneManager.startScene("Menu");
```

### Object Spawning with Pooling
```javascript
// In any ScriptComponent
this.instantiate(Enemy, x, y, enemyType);

// Automatically pools and reuses entities
// No manual pool management needed
```

---

## 🧩 Usage Examples

### Player Prefab
```js
import { Entity, TransformComponent, ColliderComponent,
         BoxRenderComponent, Rigidbody2DComponent } from "kernelplay-js";
import { PlayerController } from "../scripts/PlayerController.js";

export class Player extends Entity {
  constructor(x, y) {
    super("Player");
    this.tag = "player";
    this.zIndex = 10;  // Render on top

    this.addComponent("transform", new TransformComponent({
      position: { x, y }
    }));
    this.addComponent("rigidbody2d", new Rigidbody2DComponent({
      mass: 1,
      gravityScale: 1
    }));
    this.addComponent("collider", new ColliderComponent({
      width: 50,
      height: 50
    }));
    this.addComponent("renderer", new BoxRenderComponent({ 
      color: "red" 
    }));
    this.addComponent("playerController", new PlayerController());
  }
}
```

### Player Controller Script
```js
import { ScriptComponent, Keyboard, Mouse } from "kernelplay-js";

export class PlayerController extends ScriptComponent {
  onStart() {
    this.speed = 200;
    this.jumpForce = 500;
  }

  update(dt) {
    const rb = this.entity.getComponent("rigidbody2d");
    
    // Horizontal movement
    rb.velocity.x = 0;
    if (Keyboard.isDown("ArrowRight")) rb.velocity.x = this.speed;
    if (Keyboard.isDown("ArrowLeft")) rb.velocity.x = -this.speed;
    
    // Jump
    if (Keyboard.wasPressed("Space") && rb.isGrounded) {
      rb.velocity.y = -this.jumpForce;
    }
    
    // Shoot bullets (with automatic pooling!)
    if (Mouse.wasPressed(0)) {
      this.instantiate(Bullet, this.transform.position.x, 
                              this.transform.position.y, 
                              this.getAimDirection());
    }
  }

  onCollision(other) {
    if (other.tag === "enemy") {
      this.takeDamage(10);
    }
  }
}
```

### Bullet Prefab (Auto-pooled)
```js
// Do not use Entity Object for the Bullet prefab if it will be instantiated.
// It now contains data only for ECS.

export function Bullet(entity, x = 100, y = 100) {
    entity.name = "Bullet";
    entity.tag = "bullet";

    entity.addComponent("transform", new TransformComponent({
        position: { x, y },
        scale: { x: 0.2, y: 0.2 }
    }));

    entity.addComponent("rigidbody2d", new Rigidbody2DComponent({
        mass: 1,
        gravityScale: 1,
        drag: 1,
        useGravity: false
    }));

    entity.addComponent("collider", new ColliderComponent({
        isTrigger: true
    }));

    entity.addComponent("renderer", new BoxRenderComponent({color:"#00ff11", zIndex:-20}));
    entity.addComponent("bulletscript", new BulletScript());
}

class BulletScript extends ScriptComponent {
  constructor(direction) {
    super();
    this.direction = direction;
    this.lifetime = 2.0; // seconds
  }

  update(dt) {
    this.transform.position.x += this.direction.x * 500 * dt;
    this.transform.position.y += this.direction.y * 500 * dt;
    
    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.entity.destroy(); // Returns to pool automatically
    }
  }

  onTriggerEnter(other) {
    if (other.tag === "enemy") {
      other.destroy();
      this.entity.destroy(); // Both return to pool
    }
  }
}
```

---



### Raycasting
```js
const hit = this.entity.scene.raycast(Mouse.x, Mouse.y, {
  layerMask: Layers.Enemy,
  tag: "boss",
  ignore: this.entity
});

if (hit) {
  console.log("Hit:", hit.entity.name);
}
```

---

## 🏷️ Tags & Layers

```js
// Tags for identification
entity.tag = "player";
const enemies = scene.findAllByTag("enemy");

// Layers for filtering (bitmask)
import { Layers } from "kernelplay-js";

entity.layer = Layers.Player;
entity.layer = Layers.Enemy | Layers.Projectile; // Multiple layers

// Raycast with layer filtering
const hit = scene.raycast(x, y, { layerMask: Layers.Enemy });
```

---

## 🎯 Performance Tips

### For Large Scenes (10K+ objects)
```js
// 1. Use spatial partitioning (automatic)
// 2. Enable frustum culling (automatic)
// 3. Use object pooling for frequently spawned objects
this.instantiate(Bullet, x, y); // Pooled automatically

// 4. Set objects as static when they don't move
// (Optimization coming in v0.3.0)
```

### For Physics-Heavy Games
```js
// Use trigger colliders when you don't need physics response
collider.isTrigger = true;

// Adjust physics percentage
// Only 10-20% of objects need physics in most games
```

### For Rendering Performance
```js
// Group objects by color for batch rendering
// Use same colors when possible

// Set appropriate zIndex
entity.zIndex = 0;  // Background
entity.zIndex = 10; // Foreground
```

---

## 🐛 Debug Tools

```js
// 🚧 Experimental Features
// Toggle physics visualization
game.config.debugPhysics = true; // Press F1 in-game

// ⚠️ Work in Progress
// FPS counter
scene.fps // Current FPS (in custom scenes)

// ⚠️ Work in Progress
// Entity count
scene.entities.length
scene._rigidbody2D.length  // Physics objects
scene._visibleCount        // Visible renderers
```

---

## 🗺️ Roadmap

**v0.2.0** (Current)
- ✅ Object pooling & spawn system
- ✅ Spatial grid optimization
- ✅ Frustum culling
- ✅ Camera system
- ✅ Debug rendering

**v0.3.0** (Next)
- [ ] Audio system
- [ ] Particle effects
- [ ] Scene serialization (save/load)
- [ ] Static object optimization
- [ ] Continuous collision detection

**v0.4.0** (Future)
- [ ] UI system with raycasting
- [ ] Animation system
- [ ] State machine component
- [ ] Physics constraints (joints)
- [ ] Tilemap support

---

## 📊 Benchmarks

**Hardware:** i3 7th Gen, 8GB RAM

| Scenario | Objects | Physics | FPS |
|----------|---------|---------|-----|
| Light | 1,000 | 10% | 60 |
| Medium | 5,000 | 10% | 60 |
| Heavy | 10,000 | 10% | 50-60 |
| Extreme | 20,000 | 5% | 30-40 |
| Physics Heavy | 3,000 | 100% | 40-45 |

*Modern hardware (Ryzen 5/i5 10th gen+) achieves 60 FPS even at "Extreme"*

---

## 🤝 Contributing

We welcome contributions! Areas of focus:
- Audio system implementation
- Particle effects optimization
- Documentation & examples
- Bug fixes & performance improvements

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT License - feel free to use in commercial projects

---

## 🔗 Links

- **GitHub:** https://github.com/Soubhik1000/kernelplay
- **NPM:** https://www.npmjs.com/package/kernelplay-js
- **Documentation:** https://soubhik-rjs.github.io/kernelplay-js-demo/docs/
- **Discord:** [Join our community](#)

---

Built with ❤️ by **Soubhik Mukherjee** and contributors

*KernelPlayJS - Production-ready performance, Unity-inspired API*