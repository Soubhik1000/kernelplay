# KernelPlayJS

A **2D/3D JavaScript game engine** that feels like Unity — but lives in your browser.
Built on an Entity–Component architecture, KernelPlayJS is fast, flexible, and surprisingly fun to use.

> **v0.2.2-alpha** · MIT License · Built by Soubhik Mukherjee

---

<div align="left">
  <img height="400" src="https://soubhik2.github.io/HomeLand.github.oi/Images/PerformanceM.png"  />
</div>

---

## 🔴 Live Demo
👉 https://soubhik-rjs.github.io/kernelplay-js-demo/examples/Canvas2D/

🏁 **[Benchmark Demo](https://soubhik-rjs.github.io/kernelplay-js-demo/examples/BenchmarkCanvas2D/)** · 📚 **[Full Documentation](https://soubhik-rjs.github.io/kernelplay-js-demo/docs/)**

---

## ⚡ Why KernelPlayJS?

Most browser game engines either hold your hand too much or leave you drowning in boilerplate. KernelPlayJS hits the sweet spot — it handles the hard stuff (physics [AABB], rendering [**Canvas 2D**, **Pixi JS**, **Three JS**], collision, object pooling) so you can focus on making your game actually fun.

- **10,000+ objects** at 60 FPS on a 7th gen i3 — yes, really
- **3,000 physics objects** with full collision detection at 40+ FPS
- **Spatial grid** turns O(n²) collision into O(n) — automatic, no config needed
- **Frustum culling** — skips anything off-screen entirely
- **Object pooling** — spawn 1000+ bullets/sec with zero GC stutters
- **Dirty flag system** — 91% fewer transform recalculations for static objects
- **Batch rendering** — groups draws by color to cut canvas state changes by 100×

---

## 📦 Installation

```bash
npm install kernelplay-js
```

Or drop it straight into HTML with a CDN:

```html
<script type="importmap">
{
  "imports": {
    "kernelplay-js": "https://cdn.jsdelivr.net/npm/kernelplay-js/dist/kernelplay.es.js"
  }
}
</script>
```

### Optional Renderer Plugins

The core engine ships with Canvas 2D — **zero external dependencies**. When your game needs more visual firepower, bolt on a renderer plugin:

```bash
npm install @kernelplay/pixi-renderer    # Pixi.js — GPU-accelerated 2D sprites & effects
npm install @kernelplay/three-renderer   # Three.js — full 3D with lights, meshes, shadows
```

---

## 🚀 Quick Start

```js
import { Game, Scene, Entity, TransformComponent, BoxRenderComponent } from "kernelplay-js";

class MyScene extends Scene {
  init() {
    const box = new Entity();
    box.addComponent("transform", new TransformComponent({ position: { x: 300, y: 200 } }));
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

Everything in KernelPlayJS is built around three ideas:

- **Entities** — your game objects (player, bullet, enemy, tree)
- **Components** — data attached to entities (position, physics, renderer)
- **Scripts** — the brains; custom logic that runs every frame

```js
export class Player extends Entity {
  constructor(x, y) {
    super("Player");
    this.tag = "player";
    this.zIndex = 10; // renders on top

    this.addComponent("transform", new TransformComponent({ position: { x, y } }));
    this.addComponent("rigidbody2d", new Rigidbody2DComponent({ mass: 1, gravityScale: 1 }));
    this.addComponent("collider", new ColliderComponent({ width: 50, height: 50 }));
    this.addComponent("renderer", new BoxRenderComponent({ color: "red" }));
    this.addComponent("controller", new PlayerController());
  }
}
```

---

## 🧠 Script Lifecycle

Scripts work just like Unity's MonoBehaviour — with clean hooks for every stage of an entity's life:

```js
export class PlayerController extends ScriptComponent {

  onStart() {
    this.speed = 200;
    this.jumpForce = 500;
  }

  update(dt) {
    const rb = this.entity.getComponent("rigidbody2d");

    rb.velocity.x = 0;
    if (Keyboard.isDown(KeyCode.ArrowRight)) rb.velocity.x = this.speed;
    if (Keyboard.isDown(KeyCode.ArrowLeft))  rb.velocity.x = -this.speed;

    if (Keyboard.wasPressed(KeyCode.Space) && rb.isGrounded) {
      rb.velocity.y = -this.jumpForce;
    }

    if (Mouse.wasPressed(MouseButton.Left)) {
      this.instantiate(Bullet, this.transform.position.x, this.transform.position.y);
    }
  }

  onCollision(other) {
    if (other.tag === "enemy") this.takeDamage(10);
  }

  onDestroy() {
    // cleanup resources here
  }
}
```

**Lifecycle order:** `onAttach → onStart → update → lateUpdate → onDestroy`

---

## 🔫 Object Pooling (Automatic)

Spawning hundreds of bullets per second? KernelPlayJS silently recycles destroyed entities back into a pool so they can be reused — no setup, no pool sizes to configure, no GC spikes to fight.

```js
// Creates a Bullet, or quietly reuses a destroyed one from the pool
this.instantiate(Bullet, x, y);

// When the bullet's lifetime ends or it hits something:
this.destroy(); // entity goes back to the pool, not the garbage collector
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

This is what lets bullet-hell games run at 60 FPS. The GC never sees a thing.

---

## 🖥️ Multi-Renderer & Performance

The rendering system is designed to be **swapped out without touching your game logic**. Your entities, scripts, and physics stay exactly the same — only the renderer changes. One line of code, completely different rendering backend.

### Canvas 2D — Default, Zero Dependencies

The built-in renderer. Lightweight, fast, and no install required. Under the hood it uses batch rendering (groups draws by color) and frustum culling (skips off-screen objects entirely) to squeeze every bit of performance from the Canvas API.

```js
// No imports, no config — this is the default
new MyGame({ width: 800, height: 600, fps: 60 }).start();
```

**When to use it:** Prototypes, logic-heavy simulations, games up to ~10,000 objects, anything where you want zero external dependencies.

---

### Pixi.js 2D — GPU-Accelerated Sprites

```bash
npm install @kernelplay/pixi-renderer
```

```js
import { PixiRenderer, PixiSpriteRender } from "@kernelplay/pixi-renderer";

new MyGame({ renderer: new PixiRenderer(), width: 800, height: 600 }).start();

// Swap in the Pixi sprite renderer for textured objects
entity.addComponent("renderer", new PixiSpriteRender("./assets/player.png"));
```

Pixi.js runs on WebGL — it batches thousands of textured sprites into a handful of draw calls and pushes them straight to the GPU. The moment your game goes heavy on sprites, particle effects, or dense visual scenes, this is the renderer to reach for. The same ECS, the same physics, the same scripts — just dramatically more rendering throughput.

**When to use it:** Sprite-heavy games, particle systems, visual effects, scenes with 20,000+ objects, anything that makes Canvas 2D sweat.

---

### Three.js 3D — Full 3D Rendering

```bash
npm install @kernelplay/three-renderer
```

```js
import { ThreeRenderer } from "@kernelplay/three-renderer";

new MyGame({ renderer: new ThreeRenderer(), width: 800, height: 600 }).start();

// Your game logic is unchanged — just use 3D mesh components
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: "royalblue" })
);
entity.addComponent("mesh", new MeshComponent(mesh));
entity.addComponent("collider3D", new BoxCollider3D());
```

Full Three.js under the hood — PBR materials, point lights, shadows, fog, post-processing — all wired into the same entity system you already know. Your physics scripts and game logic don't need to change at all.

**When to use it:** 3D games, isometric views, 2.5D hybrids, any game that needs lighting and depth.

---

### Renderer Comparison

| | Canvas 2D | Pixi.js 2D | Three.js 3D |
|---|---|---|---|
| Install | None | `@kernelplay/pixi-renderer` | `@kernelplay/three-renderer` |
| Rendering | CPU (Canvas API) | GPU (WebGL) | GPU (WebGL) |
| Best for | Prototypes, logic-heavy | Sprite games, VFX | 3D, isometric |
| Smooth object ceiling | ~10,000 | 20,000+ | Scene-dependent |
| External dependency | Zero | Pixi.js | Three.js |

The same ECS, scripts, physics, and input work across all three. Switching renderer is a one-liner.

---

## 🛠️ Helper Classes (New in v0.2.2)

Writing game logic just got cleaner. No more drilling through `this.entity.scene.game...` chains every single time.

### Shorthand API

```js
// Before                                        →  After
this.entity.destroy()                            →  this.destroy()
this.entity.hasTag("wall")                       →  this.hasTag("wall")
this.entity.scene.findByTag("wall")              →  this.findByTag("wall")
this.entity.scene.findAllByTag("wall")           →  this.findAllByTag("wall")
this.entity.scene.raycast(Mouse.x, Mouse.y)      →  this.raycast(Mouse.x, Mouse.y)
this.entity.scene.pick(Mouse.x, Mouse.y)         →  this.pick(Mouse.x, Mouse.y)
this.entity.scene                                →  this.scene
this.entity.scene.game                           →  this.game
this.entity.scene.game.camera                    →  this.camera
```

### KeyCode & MouseButton

No more magic strings or raw numbers buried in your input checks:

```js
if (Keyboard.isPressed(KeyCode.W))           // was: "w"
if (Keyboard.wasPressed(KeyCode.Space))      // was: "Space"
if (Mouse.wasPressed(MouseButton.Left))      // was: 0
if (Mouse.wasPressed(MouseButton.Right))     // was: 2
if (Mouse.wasPressed(MouseButton.Middle))    // was: 1
```

### Vector2 / Vector3

```js
const a = new Vector2(10, 5);
const b = new Vector2(3, 2);

Vector2.add(a, b)           // → Vector2(13, 7)
Vector2.sub(a, b)           // → Vector2(7, 3)
Vector2.distance(a, b)      // → number
Vector2.lerp(a, b, 0.5)     // → smooth midpoint
Vector2.dot(a, b)           // → scalar
a.normalize()               // modifies in place, returns self
a.clone()                   // safe copy
```

### Mathf

```js
Mathf.clamp(health, 0, 100)           // never go below 0 or above 100
Mathf.lerp(currentVal, target, 0.1)   // smooth follow / easing
Mathf.degToRad(90)                    // → 1.5707...
Mathf.radToDeg(Math.PI)               // → 180
```

### Timer & Cooldown

```js
// Timer — great for wave spawning, cutscenes, and delayed events
const waveTimer = new Timer(5.0, true); // 5 seconds, starts immediately

update(dt) {
  waveTimer.update(dt);
  if (waveTimer.isFinished()) {
    spawnNextWave();
    waveTimer.start(); // loop it
  }
}

// Cooldown — fire rates, dash recharge, ability delays
const fireCooldown = new Cooldown(0.2); // 5 shots per second

update(dt) {
  fireCooldown.update(dt);
  if (Mouse.wasPressed(MouseButton.Left) && fireCooldown.trigger()) {
    this.instantiate(Bullet, x, y);
  }
}
```

### Utility Functions

```js
Random.range(1, 10);            // random float between 1 and 10
Random.int(1, 10);              // random int between 1 and 10
HexToRGB("#ff0000")             // → { r: 255, g: 0, b: 0 }
RGBToHex(255, 0, 0)             // → "#ff0000"
```

---

### Raycasting

```js
const hit = this.raycast(Mouse.x, Mouse.y, {
  layerMask: Layers.Enemy,
  tag: "boss",
  ignore: this.entity
});

if (hit) {
  console.log("Hit:", hit.entity.name);
}
```

## 🏷️ Tags, Layers & Raycasting

```js
entity.tag = "enemy";
entity.layer = Layers.Enemy;

// Scene queries
const boss = this.findByTag("boss");
const allEnemies = this.findAllByTag("enemy");

// Raycast — only hits enemies, ignores everything else
const hit = this.raycast(Mouse.x, Mouse.y, { layerMask: Layers.Enemy, ignore: this.entity });
if (hit) console.log("Hit:", hit.entity.name);
```

---

## 🐛 Debug Mode

```js
// Toggle with F1 in-game, or set it in config
game.config.debugPhysics = true;

// Color coding:
// 🟢 Green  = grounded
// 🔴 Red    = airborne
// 🟡 Yellow = trigger collider
```

---

## 📊 Benchmarks

Tested on **i3 7th Gen, 8GB RAM** — a deliberately modest machine:

| Scenario | Objects | Physics % | FPS |
|----------|---------|-----------|-----|
| Light | 1,000 | 10% | 60 |
| Medium | 5,000 | 10% | 60 |
| Heavy | 10,000 | 10% | 50–60 |
| Extreme | 20,000 | 5% | 30–40 |
| Physics Heavy | 3,000 | 100% | 40–45 |

*On modern hardware (i5 10th gen+), 60 FPS holds even at Extreme.*

---

## 🗺️ Roadmap

**v0.2.2** (Current) — Helper Class Update  
✅ Shorthand script API · ✅ KeyCode & MouseButton · ✅ Vector2/Vector3 · ✅ Mathf · ✅ Timer & Cooldown · ✅ Utility helpers

**v0.3.0** — Audio system · Particle effects · Scene save/load · Static object optimization · Continuous collision detection

**v0.4.0** — UI system · Animation · State machine component · Physics constraints · Tilemap support

---

## 🤝 Contributing

Contributions are welcome — especially in these areas: audio system, particle effects, documentation, bug fixes, and renderer plugin improvements.

See [CONTRIBUTING.md](./CONTRIBUTING.md) to get started.

---

## 🔗 Links

- **GitHub:** https://github.com/Soubhik1000/kernelplay
- **NPM:** https://www.npmjs.com/package/kernelplay-js
- **Docs:** https://soubhik-rjs.github.io/kernelplay-js-demo/docs/
<!-- - **Discord:** [Join the community](#) -->

---

Built with ❤️ by **Soubhik Mukherjee** · *KernelPlayJS — Production speed, Unity feel*