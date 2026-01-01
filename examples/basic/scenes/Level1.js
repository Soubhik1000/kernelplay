import { Scene } from "../../../src/core/Scene.js";
import { Player } from "../prefabs/Player.js";
import { Wall } from "../prefabs/Wall.js";

export class Level1 extends Scene {
  init() {
    const player = Player(100, 100);
    const wall = new Wall(400, 200);
    
    wall.getComponent('renderer').color = 'red';
    player.getComponent("playerController").wall = wall;

    this.addEntity(player);
    this.addEntity(new Wall(200, 70));
    this.addEntity(new Wall(300, 70, true));
    this.addEntity(wall);
  }
}
