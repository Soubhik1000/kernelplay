# KernelPlayJS

KernelPlayJS is a lightweight **2D JavaScript game engine** inspired by Unity's **Entity–Component architecture**. It is designed for learning, experimentation, and building small-to-medium 2D games using HTML5 Canvas.

> This project is currently in **alpha**. APIs may change.

---

## 🔴 Live Demo
Experience the new render pipeline and physics features in real time:  
👉 https://soubhik-rjs.github.io/kernelplay-js-demo/


## 🚀 New Features

* Added Render Pipeline
Introduced a new render pipeline to improve rendering structure, performance, and future extensibility.
* CanvasRenderer (2D)
* WebGL2DRenderer (2D)
* ThreeRenderer (Three.js 3D)
* Added Physics Support
Integrated a physics system to enable realistic movement, collisions.

## ✨ Features (Alpha)

* Game loop with configurable FPS
* Scene & SceneManager system
* Entity–Component architecture (ECS-lite)
* Script components (Unity-like behaviour)
* Keyboard & Mouse input
* Collision detection
* Trigger vs solid colliders
* Raycasting / mouse picking
* Tags & Layers (bitmask-based)
* Single-canvas rendering
* Script Lifecycle onStart(), onDestroy()
* Prefabs Factory functions
* Reusable game objects
* Instantiate / Destroy

---

## 📦 Installation

```bash
npm install kernelplay-js --save
npm install three --save
```

```bash
<script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/"
    }
  }
</script>
<script type="importmap">
  {
    "imports": {
      "kernelplay-js": "https://cdn.jsdelivr.net/npm/kernelplay-js/src/index.js"
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
    // add components here
    box.addComponent("transform", new TransformComponent({
       position: { x: 300, y: 200 },
    }));
    box.addComponent("renderer", new BoxRenderComponent("red"));

    this.addEntity(box);
  }
}

class MyGame extends Game {
  init() {
    const scene = new MyScene("Main");
    this.sceneManager.addScene(scene);
    this.sceneManager.startScene("Main");
  }
}

new MyGame({ width: 800, height: 600, fps: 60 }).start();
```

---

## 🧱 Core Concepts

### Scene

* Owns entities
* Handles update, render, collision, raycast

### Entity

* GameObject equivalent
* Holds components
* Has `tag` and `layer`

### Component

* Behaviour attached to entity
* Includes ScriptComponent, Collider, Renderer, etc.

### ScriptComponent

* Custom logic (similar to Unity's MonoBehaviour)

---

## Project Structure

```text
project-root/
├── node_modules/           # Project dependencies
├── prefabs/                # Reusable game objects
│   ├── Player.js
│   └── Box.js
├── scenes/                 # Game scenes / levels
│   └── Level1.js
├── scripts/                # Game logic scripts
│   └── PlayerController.js
├── index.html              # Entry HTML file
├── main.js                 # Application entry point
├── package.json            # Project metadata & dependencies
└── README.md               # Project documentation
```

## 🧩 Example Code

### ``` index.html ```

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>KernelPlay Test</title>
</head>
<body>
  <script type="importmap">
    {
      "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js",
        "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/"
      }
    }
  </script>
  <script type="importmap">
    {
      "imports": {
        "kernelplay-js": "https://cdn.jsdelivr.net/npm/kernelplay-js/src/index.js"
      }
    }
  </script>
  <script type="module" src="./main.js"></script>
</body>
</html>
```

### ``` main.js ```

```js
import { Game } from "kernelplay-js";
import { Level1 } from "./scenes/Level1.js";

class MyGame extends Game {
  init() {
    this.sceneManager.addScene(new Level1("Level1"));
    this.sceneManager.startScene("Level1");
  }
}

const game = new MyGame({
  width: 800,
  height: 600,
  fps: 60
});

game.start();

```
### ``` scenes/Level1.js ```

```js
import { Scene } from "kernelplay-js";
import { Player } from "../prefabs/Player.js";
import { Box } from "../prefabs/Box.js";

export class Level1 extends Scene {
  init() {
    this.addEntity(new Player(400, 300));
    this.addEntity(new Box(500, 300));
  }
}

```

### ``` prefabs/Player.js ```

```js
import {
    Entity,
    TransformComponent,
    ColliderComponent,
    BoxRenderComponent,
    Rigidbody2DComponent
} from "kernelplay-js";

import { PlayerController } from "../scripts/PlayerController.js";
import { Layers } from "kernelplay-js";

export class Player extends Entity {
    constructor(x, y) {
        super("Player");

        this.layer = Layers.Player;
        this.tag = "player"

        this.addComponent("transform", new TransformComponent({
            position: { x, y },
        }));
        this.addComponent("rigidbody2d",new Rigidbody2DComponent({
            useGravity: false
        }))
        this.addComponent("collider", new ColliderComponent());
        this.addComponent("renderer", new BoxRenderComponent("red"));
        this.addComponent("playerController", new PlayerController());
    }
}
```

### ``` prefabs/Box.js ```

```js
import {
    Entity,
    TransformComponent,
    ColliderComponent,
    BoxRenderComponent,
} from "kernelplay-js";

import { Layers } from "kernelplay-js";

export class Box extends Entity {
    constructor(x, y) {
        super("Box");

        this.layer = Layers.Player;
        this.tag = "box"

        this.addComponent("transform", new TransformComponent({
            position: { x, y },
        }));

        this.addComponent("collider", new ColliderComponent());
        this.addComponent("renderer", new BoxRenderComponent("blue"));
    }
}
```

### ``` scripts/PlayerController.js ```

```js
import { ScriptComponent, Keyboard, Mouse, Layers } from "kernelplay-js";

export class PlayerController extends ScriptComponent {
    update(dt) {
        const rb = this.entity.getComponent("rigidbody2d");

        rb.velocity.x = 0;
        rb.velocity.y = 0;

        if (Keyboard.isPressed("ArrowRight")) rb.velocity.x = 200;
        if (Keyboard.isPressed("ArrowLeft")) rb.velocity.x = -200;
        if (Keyboard.isPressed("ArrowUp")) rb.velocity.y = -200;
        if (Keyboard.isPressed("ArrowDown")) rb.velocity.y = 200;

        if (Mouse.wasPressed(0)) {
            const hit = this.entity.scene.raycast(Mouse.x, Mouse.y, {
                layerMask: Layers.Player
            });

            console.log("Hit (Player layer only):", hit?.entity?.tag);
        }
    }

    onCollision(other){
        console.log(other.name);
    }
}
```
## New Component

```js
// Transform
this.addComponent("transform", new TransformComponent({
    position = {x: 0, y: 0, z: 0}, 
    rotation = {x: 0, y: 0, z: 0}, 
    scale = {x: 1, y: 1, z: 1}
}));

// Rigidbody 2D
this.addComponent("rigidbody2d",new Rigidbody2DComponent({
    mass = 1,
    gravityScale = 1,
    isKinematic = false,
    drag = 0.05,
    useGravity = true
}));

// Rigidbody 3D
this.addComponent("rigidbody",new RigidbodyComponent({
    mass = 1,
    gravityScale = 1,
    isKinematic = false,
    drag = 0.05,
    useGravity = true
}));
```

## Change Render Pipeline

### CanvasRenderer
```js
const game = new MyGame({
  width: 800,
  height: 600,
  fps: 60
});

game.start();
```

### WebGL2DRenderer
```js
const game = new MyGame({
  renderer: new WebGL2DRenderer(),
  width: 800,
  height: 600,
  fps: 60,
  backgroundColor: "#eeeeee"
});

game.start();
```
```js
this.addComponent("renderer", new BoxRenderComponent("red"));
// Change the renderer
this.addComponent("renderer", new WebGLBoxRender2D("#FF0000"));
```

### ThreeRenderer
```js
const game = new MyGame({
  renderer: new ThreeRenderer(),
  width: 800,
  height: 600,
  fps: 60,
  backgroundColor: "#eeeeee"
});

game.start();
```

```js
// Use
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: "blue" })
);

e.addComponent("mesh", new MeshComponent(mesh));
e.addComponent("collider3D", new BoxCollider3D());
```

## 🖱 Input

```js
// Keyboard Input
Keyboard.isPressed("ArrowRight");    // Key is currently held down
Keyboard.wasPressed("ArrowRight");   // Key was pressed this frame
Keyboard.wasReleased("ArrowRight");  // Key was released this frame

// Mouse Input
Mouse.isPressed(0);                 // Mouse button is held down
Mouse.wasPressed(0);                // Mouse button was pressed this frame
Mouse.wasReleased(0);               // Mouse button was released this frame

// Mouse Button Codes
// 0 → Left Click
// 1 → Middle Click (Wheel)
// 2 → Right Click

```

---

## 🎯 Raycast Example

```js
const hit = this.entity.scene.raycast(Mouse.x, Mouse.y, {
  layerMask: Layers.Enemy
});
```

---

## 🏷 Tags & Layers

```js
entity.tag = "Player";
entity.layer = Layers.Player;
```
## 🔄 Script Lifecycle

```js
onAttach() {
// Called when the entity is added to the scene
// Access other components safely
}

onStart() {
// Called once before the first update
// Scene is fully ready
}

update(dt) {
// Called every frame
// dt = delta time (seconds)
}

lateUpdate(dt) {
// Called every frame after update()
// Useful for cameras or cleanup logic
}

onCollision(other) {
  // Called when a solid collision occurs
  console.log("Player hit:", other.name);
}

onTriggerEnter(other) {
  // Called when entering a trigger collider
  console.log("Player entered trigger:", other.name);
}

onDestroy() {
// Called when the script or entity is removed
// Cleanup resources, listeners, timers
}
```

### Lifecycle Order
```
onAttach()
onStart()
update(dt)
lateUpdate(dt)
onDestroy()
```

## Instantiate / Destroy

```js
// Instantiate (via Scene)
this.entity.scene.addEntity(
  new Wall(position.x, position.y, true)
);

// Instantiate (Script-only helper)
this.instantiate(Wall, position.x, position.y, true);

// Destroy (remove this entity)
this.entity.destroy();


```

---

## Links
- GitHub: https://github.com/Soubhik1000/kernelplay
- npm: https://www.npmjs.com/package/kernelplay-js

## 🧪 Status

* Version: `0.1.2-alpha`
* Stability: Experimental
* Target: Learning & prototyping

---

## 🗺 Roadmap

* Camera & world coordinates
* Physics layer collision matrix
* UI system
* Audio & animation
* Add more Components
* Object Pooling
* Physics Layers
* UI raycast
* Debug Tools
* State Machine
* AI behavior

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome.

---

## 📄 License

MIT License

---

Built with ❤️ by **Soubhik Mukherjee**
