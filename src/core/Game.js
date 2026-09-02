import { Loop } from "./Loop.js";
import { Time } from "./Time.js";
import { Keyboard } from "../input/Keyboard.js";
import { Mouse } from "../input/Mouse.js";
import { Gamepad } from "../input/Gamepad.js";
import { Touch } from "../input/Touch.js";
import { Config } from "./Config.js";
import { SceneManager } from "./SceneManager.js";
import { Canvas } from "../graphics/Canvas.js";
import { CanvasRenderer } from "../graphics/CanvasRenderer.js";
import { Camera2D } from "./components/Camera2D.js";
import { AudioManager } from "./AudioManager.js";
import { UICanvas } from "./ui/Uicanvas.js";
import {DebugOverlay} from "./DebugOverlay.js"
import { DebugStats } from "../utils/DebugStats.js";

export class Game {
  constructor(options = {}) {
    this.config = new Config(options);
    Keyboard.init();

    // 🔥 Single canvas for entire game
    this.canvas = new Canvas(this.config);
    this.ctx = this.canvas.ctx;

    // this.camera = new Camera2D(this.config.width, this.config.height);
    this.audio = new AudioManager();
    Mouse.init(this.canvas.canvas); // 🔥 IMPORTANT

    Touch.init(this.canvas.canvas);
    // console.log(this.canvas.canvas);

    Gamepad.init();

    // 🔥 default renderer
    this.renderer = options.renderer || new CanvasRenderer();
    this.renderer.init(this);

    // create the UI layer
    this.ui = new UICanvas(this);
    this.ui.init();

    

    // 🔥 Inject Game into SceneManager
    this.sceneManager = new SceneManager(this);

    this.loop = new Loop({
      update: (dt) => {
        Time.update(dt, performance.now());
        dt = Math.min(dt, 0.05);

        this.update(dt);
        this.sceneManager.update(dt);
        this.audio.update();
        this.ui.update(dt);
        if (this.config.debug) this.debug.update(dt);

        Keyboard.update();
        Mouse.update();
        Touch.update();
        Gamepad.update();

      },

      fixedUpdate: (dt) => {
        this.fixedUpdate(dt);
        this.sceneManager.fixedUpdate(dt);
      },

      render: () => {
        this.render();
        this.debugStats?.beginFrame();

        // // 🔥 Centralized render
        // const { width, height } = this.config;
        // this.ctx.clearRect(0, 0, width, height);

        // if (this.sceneManager.currentScene) {
        //   this.sceneManager.currentScene.render();
        // }

        this.sceneManager.render(this.renderer);
        this.ui.render();
        this.debugStats?.endFrame();
      },

      fps: this.config.fps,
      calcRate: this.config.calcRate,
      fixedRate: this.config.fixedRate,
      container: this.config.container,
    });
  }

  init() {
    // console.log("init");

    // this.renderer.init(this);
    // console.log("init");
    // await this.renderer.init(this);
    // console.log("yeah");
  }
  update(dt) { }
  fixedUpdate(dt) { }
  render() { }

  start() {
    this.init();
    this.loop.start();
    
    // In Game constructor — after ui is ready:
    if (this.config.debug) {
      this.debugStats = new DebugStats(this);
      this.debug = new DebugOverlay(this);
      this.debug.init();
    }

  }

  stop() {
    this.loop.stop();
  }
}
