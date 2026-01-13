# KernelPlayJS

KernelPlayJS is a lightweight **2D JavaScript game engine** inspired by Unity's **Entity–Component architecture**. It is designed for learning, experimentation, and building small-to-medium 2D games using HTML5 Canvas.

> This project is currently in **alpha**. APIs may change.

---

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
```

---

## 🚀 Quick Start

```js
import { Game, Scene, Entity } from "kernelplay-js";
import { PositionComponent, BoxRenderComponent } from "kernelplay-js";

class MyScene extends Scene {
  init() {
    const box = new Entity();
    // add components here
    box.addComponent("position", new PositionComponent(300, 200));
    box.addComponent("renderer", new BoxRenderComponent(40, 40, "red"));

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
│   └── Player.js
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

export class Level1 extends Scene {
  init() {
    this.addEntity(new Player(100, 100));
  }
}
```

### ``` prefabs/Player.js ```

```js
import {
    Entity,
    PositionComponent,
    VelocityComponent,
    ColliderComponent,
    BoxRenderComponent,
} from "kernelplay-js";

import { PlayerController } from "../scripts/PlayerController.js";
import { Layers } from "kernelplay-js";

export class Player extends Entity {
    constructor(x, y) {
        super("Player");

        this.layer = Layers.Player;
        this.tag = "player"

        this.addComponent("position", new PositionComponent(x, y));
        this.addComponent("velocity", new VelocityComponent());
        this.addComponent("collider", new ColliderComponent(40, 40));
        this.addComponent("renderer", new BoxRenderComponent(40, 40, "blue"));
        this.addComponent("playerController", new PlayerController());
    }
}
```

### ``` scripts/PlayerController.js ```

```js
import { ScriptComponent, Keyboard, Mouse, Layers } from "kernelplay-js";

export class PlayerController extends ScriptComponent {
    update(dt) {
        const vel = this.entity.getComponent("velocity");

        vel.vx = 0;
        vel.vy = 0;

        if (Keyboard.isPressed("ArrowRight")) vel.vx = 200;
        if (Keyboard.isPressed("ArrowLeft")) vel.vx = -200;
        if (Keyboard.isPressed("ArrowUp")) vel.vy = -200;
        if (Keyboard.isPressed("ArrowDown")) vel.vy = 200;

        if (Mouse.wasPressed(0)) {
            const hit = this.entity.scene.raycast(Mouse.x, Mouse.y, {
                layerMask: Layers.Player
            });

            console.log("Hit (Player layer only):", hit?.entity?.tag);
        }
    }
}

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

* Version: `0.1.1-alpha`
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
