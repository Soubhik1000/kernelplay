import { Scene } from "../../../src/core/Scene.js";
import { TestPlayer } from "../prefabs/TestPlayer.js"
import { CameraComponent, Entity, TransformComponent, AudioListener, UIJoystick, UIText } from "../../../src/index.js";

export class Level2 extends Scene {
  init() {
    console.log("scn");
    
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

    this.addEntity(camera);
    this.addEntity(new TestPlayer());

    const label = this.game.ui.add(new UIText({
      text: "Score: 0", anchor: "topLeft", offset: { x: 20, y: 20 },
      style: { textColor: "#000000", fontSize: 18, fontWeight: "bold" },
    }));

    // this.game.ui.add(new UIText({
    //   text: "Score: 0", anchor: "center", offset: { x: 0, y: 0 },
    //   style: { textColor: "#000000", fontSize: 18, fontWeight: "bold" },
    // }));

    this.game.ui.add(new UIJoystick({
      anchor: "center", 
      mode: "dynamic",
      // active: true,
      // offset: { x: 100, y: 200 },
      // style: { textColor: "#000000", fontSize: 18, fontWeight: "bold" },
    }));


  }
}
