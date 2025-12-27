import { Game, Canvas } from "../../src/index.js";

const canvas = new Canvas(600, 400);
const ctx = canvas.ctx;

let x = 0;

const game = new Game({
  update: (dt) => {
    x += 200 * dt; // move 200px per second
    if (x > 600) x = 0;
  },

  render: () => {
    ctx.clearRect(0, 0, 600, 400);
    ctx.fillStyle = "black";
    ctx.fillRect(x, 150, 50, 50);
  }
});

game.start();
