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

    // 🔥 Single canvas for entire game
    this.canvas = new Canvas(this.config);
    this.ctx = this.canvas.ctx;

    // 🔥 Inject Game into SceneManager
    this.sceneManager = new SceneManager(this);

    this.loop = new Loop({
      update: (dt) => {
        Time.update(dt, performance.now());
        Keyboard.update();

        this.update(dt);
        this.sceneManager.update(dt);
      },

      render: () => {
        this.render();

        // 🔥 Centralized render
        const { width, height } = this.config;
        this.ctx.clearRect(0, 0, width, height);

        if (this.sceneManager.currentScene) {
          this.sceneManager.currentScene.render();
        }
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
