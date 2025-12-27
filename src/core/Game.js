import { Loop } from "./Loop.js";
import { Time } from "./Time.js";
import { Keyboard } from "../input/Keyboard.js";

export class Game {
  constructor() {
    Keyboard.init(); // init keyboard
    this.loop = new Loop({
      update: (dt) => {
        Time.update(dt, performance.now());
        Keyboard.update(); // reset per-frame key states
        this.update(dt);
      },
      render: () => {
        this.render();
      }
    });
  }

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
