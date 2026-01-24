import { Game } from "../../src/index.js";
import { MenuScene } from "./scenes/MenuScene.js";
import { Level1 } from "./scenes/Level1.js";
import { WebGL2DRenderer } from "../../src/index.js";
import { ThreeRenderer } from "../../src/index.js";

// ---------------------------
// Main Game
// ---------------------------
class MyGame extends Game {
  init() {
    this.sceneManager.addScene(new MenuScene("Menu"));
    this.sceneManager.addScene(new Level1("Level1"));

    this.sceneManager.startScene("Level1");
    // this.sceneManager.startScene("Menu");

  }
}

// ---------------------------
// Start the game
// ---------------------------
const game = new MyGame({
  // renderer: new WebGL2DRenderer(),
  renderer: new ThreeRenderer(),
  width: 800,
  height: 600,
  fps: 60,
  backgroundColor: "#eeeeee"
});

game.start();
