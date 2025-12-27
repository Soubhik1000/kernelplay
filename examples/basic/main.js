import { Game, Canvas, Keyboard } from "../../src/index.js";

class DemoGame extends Game {
  init() {
    this.canvas = new Canvas(600, 400);
    this.ctx = this.canvas.ctx;
    this.x = 0;
  }

  update(dt) {
    // this.x += 200 * dt;
    // if (this.x > 600) this.x = 0;

    if (Keyboard.isPressed("ArrowRight")) this.x += 200 * dt;
    if (Keyboard.isPressed("ArrowLeft")) this.x -= 200 * dt;

    // wrap around
    if (this.x > 600) this.x = 0;
    if (this.x < 0) this.x = 600;
  }

  render() {
    this.ctx.clearRect(0, 0, 600, 400);
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(this.x, 150, 50, 50);
  }
}

const game = new DemoGame();
game.start();
