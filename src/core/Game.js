import { Loop } from "./Loop.js";
import { Time } from "./Time.js";
import { Keyboard } from "../input/Keyboard.js";
import { Mouse } from "../input/Mouse.js";
import { Config } from "./Config.js";
import { SceneManager } from "./SceneManager.js";
import { Canvas } from "../graphics/Canvas.js";
import { CanvasRenderer } from "../graphics/CanvasRenderer.js";

export class Game {
  constructor(options = {}) {
    this.config = new Config(options);
    Keyboard.init();

    // 🔥 Single canvas for entire game
    this.canvas = new Canvas(this.config);
    this.ctx = this.canvas.ctx;

    Mouse.init(this.canvas.canvas); // 🔥 IMPORTANT

    // 🔥 default renderer
    this.renderer = options.renderer || new CanvasRenderer();
    this.renderer.init(this);

    // 🔥 Inject Game into SceneManager
    this.sceneManager = new SceneManager(this);

    this.loop = new Loop({
      update: (dt) => {
        Time.update(dt, performance.now());
        
        this.update(dt);
        this.sceneManager.update(dt);
        
        Keyboard.update();
        Mouse.update();
      },

      render: () => {
        // this.render();

        // // 🔥 Centralized render
        // const { width, height } = this.config;
        // this.ctx.clearRect(0, 0, width, height);

        // if (this.sceneManager.currentScene) {
        //   this.sceneManager.currentScene.render();
        // }

        this.sceneManager.render(this.renderer);
      },

      fps: this.config.fps
    });
  }

  init() {
    // console.log("init");
    
    this.renderer.init(this);
  }
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
