import {
  Game,
  Scene,
  Entity,
  TransformComponent,
  BoxRenderComponent,
  CameraComponent,
  ScriptComponent,
  Keyboard,
  KeyCode
} from "../../src/index.js";

import { UIJoystick } from "../../src/core/ui/UiJoystick.js";

class MyScene extends Scene {
  init() {
    const camera = new Entity("MainCamera");
    camera.addComponent("transform", new TransformComponent({ position: { x: 400, y: 300, z: 0 } }));
    camera.addComponent("camera", new CameraComponent({
      width: this.game.config.width,
      height: this.game.config.height,
      isPrimary: true,
    }));

    // 1. Canvas dedicato per la UI
    this.uiCanvas = document.createElement("canvas");
    this.uiCanvas.width = this.game.config.width;
    this.uiCanvas.height = this.game.config.height;
    this.uiCanvas.style.position = "absolute";
    this.uiCanvas.style.top = "0";
    this.uiCanvas.style.left = "0";
    this.uiCanvas.style.pointerEvents = "auto";
    this.uiCanvas.style.zIndex = "100";
    document.body.appendChild(this.uiCanvas);

    this.uiCtx = this.uiCanvas.getContext("2d");

    // 2. Istanza del Joystick passata con il riferimento del canvas
    this.joystick = new UIJoystick({
      mode: 'static',
      x: 120,
      y: this.game.config.height - 120,
      radius: 50,
      canvas: this.uiCanvas
    });

    // 3. Creazione del Box con riferimento diretto al joystick
    const box = new Entity();
    box.addComponent("transform", new TransformComponent({ position: { x: 300, y: 200 } }));
    box.addComponent("renderer", new BoxRenderComponent({ color: "red" }));
    box.addComponent("script", new MyScript({ speed: 200, joystick: this.joystick, gameWidth: this.game.config.width, gameHeight: this.game.config.height }));

    this.addEntity(camera);
    this.addEntity(box);
  }

  update(dt) {
    super.update(dt);

    if (this.uiCtx && this.joystick) {
      this.uiCtx.clearRect(0, 0, this.uiCanvas.width, this.uiCanvas.height);
      this.joystick.draw(this.uiCtx);
    }
  }
}

class MyScript extends ScriptComponent {
  constructor(options = {}) {
    super(options);
    this.speed = options.speed || 200;
    this.joystick = options.joystick || null;
    this.gameWidth = options.gameWidth || 800;
    this.gameHeight = options.gameHeight || 600;
    this.boxSize = 32; // Dimensione dell'entità
  }

  onStart() {
    this.transform = this.entity.getComponent("transform");
  }

  update(dt) {
    if (!this.transform) return;

    // Movimento Tastiera PC
    if (Keyboard.isPressed(KeyCode.W) || Keyboard.isPressed(KeyCode.ArrowUp)) this.transform.position.y -= this.speed * dt;
    if (Keyboard.isPressed(KeyCode.S) || Keyboard.isPressed(KeyCode.ArrowDown)) this.transform.position.y += this.speed * dt;
    if (Keyboard.isPressed(KeyCode.A) || Keyboard.isPressed(KeyCode.ArrowLeft)) this.transform.position.x -= this.speed * dt;
    if (Keyboard.isPressed(KeyCode.D) || Keyboard.isPressed(KeyCode.ArrowRight)) this.transform.position.x += this.speed * dt;

    // Movimento Touch / Joystick Mobile
    if (this.joystick && this.joystick.active) {
      const vector = this.joystick.getVector();
      this.transform.position.x += vector.x * this.speed * dt;
      this.transform.position.y += vector.y * this.speed * dt;
    }

    // Blocco confini schermo (Clamping)
    this.transform.position.x = Math.max(0, Math.min(this.gameWidth - this.boxSize, this.transform.position.x));
    this.transform.position.y = Math.max(0, Math.min(this.gameHeight - this.boxSize, this.transform.position.y));
  }
}

class MyGame extends Game {
  init() {
    this.sceneManager.addScene(new MyScene("Main"));
    this.sceneManager.startScene("Main");
  }
}

new MyGame({ width: 800, height: 600, fps: 60 }).start();