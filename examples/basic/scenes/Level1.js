import { Scene } from "../../../src/core/Scene.js";
import { Player } from "../prefabs/Player.js";
import { Wall } from "../prefabs/Wall.js";
import { Grass } from "../prefabs/Grass.js";
import { CameraComponent, Entity, TransformComponent, FPSCounterComponent } from "../../../src/index.js";
// import { Cube } from "../prefabs/Cube.js";
// import { Cube1 } from "../prefabs/Cube1.js";
// import { Bullet } from "../prefabs/Bullet.js";
import { AudioListener } from "../../../src/index.js";

export class Level1 extends Scene {
  init() {
    this.ctx = this.game.renderer.ctx;
    this.fps = 0;
    this.frames = 0;
    this.lastTime = performance.now();

    const player = Player(100, 100);
    const wall = new Wall(670, 260);

    wall.getComponent('renderer').color = '#ff0000';
    player.getComponent("playerController").wall = wall;
    // player.id = 100;
    wall.getComponent("transform").scale.y = 1.5;
    wall.getComponent("transform").scale.x = 20;
    // wall.getComponent("transform").rotation.z = 0.5;

    const wall1 = new Wall(100, 400);
    wall1.getComponent("transform").scale.x = 3;
    wall1.getComponent("transform").scale.y = 4;


    // Simple static camera
    const camera = new Entity("MainCamera");
    camera.id = 100;
    camera.addComponent("transform", new TransformComponent({
      position: { x: 400, y: 300, z: 10 }
    }));
    camera.addComponent("audioListener", new AudioListener());
    camera.addComponent("camera", new CameraComponent({
      width: 800,
      height: 600,
      isPrimary: true,
      // target: player,
    }));

    const camera2 = new Entity("Camera2");
    camera2.id = 101;
    camera2.addComponent("transform", new TransformComponent({
      position: { x: 0, y: 0, z: 10 }
    }));
    camera2.addComponent("camera", new CameraComponent({
      width: 800,
      height: 600,
      isPrimary: false,
      // target: player,
    }));

    // const FPSCounter = new Entity("FPSCounter");
    // FPSCounter.addComponent('renderers', new FPSCounterComponent(10, 20));
    // this.addEntity(FPSCounter);

    // this.addEntity(new Bullet(100, 150));
    this.addEntity(camera);
    this.addEntity(camera2);
    this.addEntity(player);

    this.addEntity(wall1);
    this.addEntity(new Wall(200, 100));
    this.addEntity(new Wall(300, 100, true));
    this.addEntity(wall);
    // this.addEntity(new Grass(400, 400));

    // Three
    // let ground = new Cube1(0,-4,0);
    // ground.getComponent("transform").scale.x = 10;
    // ground.getComponent("transform").scale.z = 10;

    // this.addEntity(new Cube(0,0,0));
    // this.addEntity(new Cube1(4,0,0));
    // this.addEntity(ground);
  }

  update(dt) {
    
    super.update(dt);
    
    // this.frames++;
    // const now = performance.now();

    // if (now >= this.lastTime + 1000) {
    //   this.fps = this.frames;
    //   this.frames = 0;
    //   this.lastTime = now;
    // }
    
  }

  render() {
    super.render(this.game.renderer);

    this.frames++;
    const now = performance.now();

    if (now >= this.lastTime + 1000) {
      this.fps = this.frames;
      this.frames = 0;
      this.lastTime = now;
    }

    this.ctx.save();
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    this.ctx.font = "16px monospace";
    this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);

    this.ctx.restore();
  }
}
