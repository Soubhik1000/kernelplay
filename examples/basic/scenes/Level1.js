import { Scene } from "../../../src/core/Scene.js";
import { Player } from "../prefabs/Player.js";
import { Wall } from "../prefabs/Wall.js";

export class Level1 extends Scene {
  init() {
    // const player = Player(100, 100);
    this.addEntity(new Player(100, 100));
    this.addEntity(new Wall(200, 70));
    this.addEntity(new Wall(300, 70, true));
  }
}
