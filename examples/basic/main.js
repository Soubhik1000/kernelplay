import { Game } from "../../src/index.js";
import { MenuScene } from "./scenes/MenuScene.js";
import { Level1 } from "./scenes/Level1.js";

// ---------------------------
// Main Game
// ---------------------------
class MyGame extends Game {
  init() {
    this.sceneManager.addScene(new MenuScene("Menu"));
    this.sceneManager.addScene(new Level1("Level1"));

    this.sceneManager.startScene("Menu");
  }
}

// ---------------------------
// Start the game
// ---------------------------
const game = new MyGame({
  width: 600,
  height: 400,
  fps: 60,
  backgroundColor: "#eeeeee"
});

game.start();
