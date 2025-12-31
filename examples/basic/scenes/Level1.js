import { Scene } from "../../../src/core/Scene.js";
import { Player } from "../prefabs/Player.js";

export class Level1 extends Scene {
  init() {
    const player = Player(100, 100);
    this.addEntity(player);
  }
}
