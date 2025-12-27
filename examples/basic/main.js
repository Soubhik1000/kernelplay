import { Game, Keyboard, Scene } from "../../src/index.js";

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
    this.ctx = this.game.ctx; // use Game's single canvas
    this.x = 100;
  }

  update(dt) {
    if (Keyboard.isPressed("ArrowRight")) this.x += 200 * dt;
    if (Keyboard.isPressed("ArrowLeft")) this.x -= 200 * dt;

    // wrap around horizontally
    if (this.x > this.game.config.width) this.x = 0;
    if (this.x < 0) this.x = this.game.config.width;
  }

  render() {
    const { width, height } = this.game.config;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(this.x, height / 2, 50, 50);
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
