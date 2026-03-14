import { Game } from "../../src/index.js";
import { MenuScene } from "./scenes/MenuScene.js";
import { Level1 } from "./scenes/Level1.js";
import { Level2 } from "./scenes/Level2.js";
import { BenchmarkScene } from "./scenes/BenchmarkScene.js";
// import { WebGL2DRenderer } from "../../src/index.js";
// import { ThreeRenderer } from "../../src/index.js";

// ---------------------------
// Main Game
// ---------------------------
class MyGame extends Game {
  init() {
    this.sceneManager.addScene(new MenuScene("Menu"));
    this.sceneManager.addScene(new Level1("Level1"));
    this.sceneManager.addScene(new Level2("Level2"));
    this.sceneManager.addScene(new BenchmarkScene("Benchmark"));

    // this.sceneManager.startScene("Level1");
    this.sceneManager.startScene("Level2");
    // this.sceneManager.startScene("Benchmark");
    // this.sceneManager.startScene("Menu");

  }
}

// ---------------------------
// Start the game
// ---------------------------
const game = new MyGame({
  // renderer: new WebGL2DRenderer(),
  // renderer: new ThreeRenderer(),
  width: 800,
  height: 600,
  fps: 90,
  backgroundColor: "#eeeeee",
  // debugPhysics: true
});

game.start();
