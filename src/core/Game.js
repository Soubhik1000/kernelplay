import { Loop } from "./Loop.js";
import { Time } from "./Time.js";

export class Game {
  constructor({ update, render }) {
    this.loop = new Loop({
      update: (dt) => {
        Time.update(dt, performance.now());
        if (update) update(dt);
      },
      render
    });
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }
}
