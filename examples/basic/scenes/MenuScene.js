import { Scene } from "../../../src/index.js";
import { Keyboard } from "../../../src/index.js";

export class MenuScene extends Scene {
  init() {
    this.ctx = this.game.renderer.ctx; // use Game's single canvas
    console.log(this);
    
  }

  update(dt) {
    if (Keyboard.isPressed("Enter")) {
      this.game.sceneManager.startScene("Level1");
    }
  }

  render() {
    const { width, height } = this.game.config;
    this.ctx.clearRect(0, 0, width, height);
    this.ctx.fillStyle = "black";
    this.ctx.font = "24px Arial";
    this.ctx.fillText("Press Enter to Start Level 1", 50, height / 2);
  }
}