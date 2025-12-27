import { Loop } from "./Loop.js";
import { Time } from "./Time.js";
import { Keyboard } from "../input/Keyboard.js";
import { Config } from "./Config.js";
import { SceneManager } from "./SceneManager.js";
import { Canvas } from "../graphics/Canvas.js";

export class Game {
  constructor(options = {}) {
    this.config = new Config(options);
    Keyboard.init();

    // Create one canvas for the entire game
    this.canvas = new Canvas(this.config);
    this.ctx = this.canvas.ctx;

    this.sceneManager = new SceneManager();

    this.loop = new Loop({
      update: (dt) => {
        Time.update(dt, performance.now());
        Keyboard.update();
        this.update(dt);
        this.sceneManager.update(dt); // update current scene
      },
      render: () => {
        this.render();
        this.sceneManager.render(); // render current scene
      },
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
