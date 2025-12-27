import { Game, Canvas, Keyboard } from "../../src/index.js";

class DemoGame extends Game {
  init() {
    this.canvas = new Canvas(this.config);
    this.ctx = this.canvas.ctx;
    this.x = 300;
  }

  update(dt) {
    if (Keyboard.isPressed("ArrowRight")) this.x += 200 * dt;
    if (Keyboard.isPressed("ArrowLeft")) this.x -= 200 * dt;

    // wrap around
    if (this.x > this.config.width) this.x = 0;
    if (this.x < 0) this.x = this.config.width;
  }

  render() {
    this.ctx.clearRect(0, 0, this.config.width, this.config.height);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(this.x, 150, 50, 50);
  }
}

// Configurable FPS, canvas size, background
const game = new DemoGame({
  width: 800,
  height: 600,
  fps: 30,
  backgroundColor: "#eeeeee"
});

game.start();
