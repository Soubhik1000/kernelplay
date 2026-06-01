import { Scene } from "../../../src/core/Scene.js";
import { TestPlayer } from "../prefabs/TestPlayer.js"
import { CameraComponent, Entity, TransformComponent, AudioListener } from "../../../src/index.js";

export class Level2 extends Scene {
  init() {
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

    this.addEntity(new TestPlayer(100, 100));
  }
}
