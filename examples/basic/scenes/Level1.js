import { Scene } from "../../../src/core/Scene.js";
import { Player } from "../prefabs/Player.js";
import { Wall } from "../prefabs/Wall.js";
import { Cube } from "../prefabs/Cube.js";
import { Cube1 } from "../prefabs/Cube1.js";

export class Level1 extends Scene {
  init() {
    // const player = Player(100, 100);
    // const wall = new Wall(300, 260);
    
    // wall.getComponent('renderer').color = '#ff0000';
    // player.getComponent("playerController").wall = wall;
    // wall.getComponent("transform").scale.y = 1.5;
    // wall.getComponent("transform").scale.x = 5;
    // // wall.getComponent("transform").rotation.z = 0.5;
    
    // const wall1 = new Wall(100, 400);
    // wall1.getComponent("transform").scale.x = 3;
    // wall1.getComponent("transform").scale.y = 4;

    // this.addEntity(player);
    // this.addEntity(new Wall(200, 100));
    // this.addEntity(wall1);
    // this.addEntity(new Wall(300, 100, true));
    // this.addEntity(wall);

    let ground = new Cube1(0,-4,0);
    ground.getComponent("transform").scale.x = 10;
    ground.getComponent("transform").scale.z = 10;

    this.addEntity(new Cube(0,0,0));
    this.addEntity(new Cube1(4,0,0));
    this.addEntity(ground);
  }
}
