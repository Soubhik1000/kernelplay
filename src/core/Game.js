import { Loop } from "./Loop.js";
import { Time } from "./Time.js";
import { Keyboard } from "../input/Keyboard.js";
import { Config } from "./Config.js";

export class Game {
  constructor(options = {}) {
    this.config = new Config(options);

    Keyboard.init();

    this.loop = new Loop({
      update: (dt) => {
        Time.update(dt, performance.now());
        Keyboard.update();
        this.update(dt);
      },
      render: () => this.render(),
      fps: this.config.fps
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
