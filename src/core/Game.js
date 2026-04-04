import { Loop } from "./Loop.js";
import { Time } from "./Time.js";
import { Keyboard } from "../input/Keyboard.js";
import { Mouse } from "../input/Mouse.js";
import { Config } from "./Config.js";
import { SceneManager } from "./SceneManager.js";
import { Canvas } from "../graphics/Canvas.js";
import { CanvasRenderer } from "../graphics/CanvasRenderer.js";
import { Camera2D } from "./components/Camera2D.js";
import { AudioManager } from "./AudioManager.js";
import { Physics2D } from "./physics/Physics2D.js";

export class Game {
  constructor(options = {}) {
    this.config = new Config(options);
    Keyboard.init();

    // 🔥 Single canvas for entire game
    this.canvas = new Canvas(this.config);
    this.ctx = this.canvas.ctx;

    // this.camera = new Camera2D(this.config.width, this.config.height);
    this.audio = new AudioManager();

    // In constructor, after renderer init:
    this.physics = options.physics || new Physics2D();

    // In SceneManager.startScene (or wherever scene.game is injected):
    // scene.physics = this.game.physics;
    this.physics.init(this);

    Mouse.init(this.canvas.canvas); // 🔥 IMPORTANT

    // 🔥 default renderer
    this.renderer = options.renderer || new CanvasRenderer();
    this.renderer.init(this);

    // 🔥 Inject Game into SceneManager
    this.sceneManager = new SceneManager(this);

    this.loop = new Loop({
      update: (dt) => {
        Time.update(dt, performance.now());
        dt = Math.min(dt, 0.05);

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

    // this.renderer.init(this);
    // console.log("init");
    // await this.renderer.init(this);
  }
  update(dt) { }
  render() { }

  start() {
    this.init();
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }
}
