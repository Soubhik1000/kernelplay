import { Loop } from "./Loop.js";
import { Time } from "./Time.js";

export class Game {
  constructor() {
    this.loop = new Loop({
      update: (dt) => {
        Time.update(dt, performance.now());
        this.update(dt);
      },
      render: () => {
        this.render();
      }
    });
  }

  // lifecycle hooks
  init() {}
  update(dt) {}
  render() {}

  start() {
    this.init();
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }
}
