import { Scene } from "../../../src/core/Scene.js";
import { Player } from "../prefabs/Player.js";

export class Level1 extends Scene {
  init() {
    this.ctx = this.game.ctx; // use Game's single canvas
    
    const player = Player(100, 100);
    this.addEntity(player);
  }

  render() {
    const { width, height } = this.game.config;
    this.ctx.clearRect(0, 0, width, height);
    super.render(); // render all entities
  }
}
