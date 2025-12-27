import { Game, Keyboard, Scene, Entity } from "../../src/index.js";
import { BoxRenderComponent, PositionComponent } from "../../src/index.js";

// ---------------------------
// Menu Scene
// ---------------------------
class MenuScene extends Scene {
  init() {
    this.ctx = this.game.ctx; // use Game's single canvas
  }

  update(dt) {
    if (Keyboard.isPressed("Enter")) {
      this.game.sceneManager.startScene("Level1");
    }
  }

  render() {
    const { width, height } = this.game.config;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = "black";
    this.ctx.font = "24px Arial";
    this.ctx.fillText("Press Enter to Start Level 1", 50, height / 2);
  }
}

// ---------------------------
// Level 1 Scene
// ---------------------------

class Level1Scene extends Scene {
  init() {
    this.ctx = this.game.ctx;

    const box = new Entity("Box");
    box.addComponent("position", new PositionComponent(100, 150));
    box.addComponent("renderer", new BoxRenderComponent());
    // box.getComponent('renderer').color = "black";

    const box1 = new Entity("Box1");
    box1.addComponent("position", new PositionComponent(200, 150));
    box1.addComponent("renderer", new BoxRenderComponent());
    box1.getComponent().renderer.color = 'black';

    this.addEntity(box);
    this.box = box;

    this.addEntity(box1);
    this.box1 = box1;
  }

  update(dt) {
    const pos = this.box.getComponent("position");
    if (Keyboard.isPressed("ArrowRight")) pos.x += 200 * dt;
    if (Keyboard.isPressed("ArrowLeft")) pos.x -= 200 * dt;
  }

  render() {
    const { width, height } = this.game.config;
    this.ctx.clearRect(0, 0, width, height);
    super.render(); // render all entities
  }
}

// ---------------------------
// Main Game
// ---------------------------
class MyGame extends Game {
  init() {
    // Create and register scenes
    const menu = new MenuScene("Menu");
    menu.game = this;

    const level1 = new Level1Scene("Level1");
    level1.game = this;

    this.sceneManager.addScene(menu);
    this.sceneManager.addScene(level1);

    // Start with menu
    this.sceneManager.startScene("Menu");
  }
}

// ---------------------------
// Start the game
// ---------------------------
const game = new MyGame({
  width: 600,
  height: 400,
  fps: 60,
  backgroundColor: "#eeeeee"
});

game.start();
