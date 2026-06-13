// import { Game, Scene, Entity, TransformComponent, BoxRenderComponent } from "kernelplay-js";

import {
  Game,
  Scene,
  Entity,
  TransformComponent,
  BoxRenderComponent,
  CameraComponent,
  ScriptComponent,
  Keyboard, KeyCode,
} from "../../src/index.js";

// function base
const game = new Game({
  width: 800,
  height: 600,
  fps: 60
});

const camera = new Entity("MainCamera");

camera.addComponent("transform", new TransformComponent({ position: { x: 400, y: 300, z: 0 } }));
camera.addComponent("camera", new CameraComponent({
  width: game.config.width,
  height: game.config.height,
  isPrimary: true,
}));

const myScript = {
  onStart() {
    console.log(this);
    this.transform = this.entity.getComponent("transform");
    this.speed = 200;
  },
  update(dt) {

    if(Keyboard.isPressed(KeyCode.W)){
      this.transform.position.y -= this.speed*dt;
    }
    if(Keyboard.isPressed(KeyCode.S)){
      this.transform.position.y += this.speed*dt;
    }
    if(Keyboard.isPressed(KeyCode.A)){
      this.transform.position.x -= this.speed*dt;
    }
    if(Keyboard.isPressed(KeyCode.D)){
      this.transform.position.x += this.speed*dt;
    }
  }
}

const box = new Entity();
box.addComponent("transform", new TransformComponent({ position: { x: 300, y: 200 } }));
box.addComponent("renderer", new BoxRenderComponent({ color: "red" }));
// box.addComponent("script", new MyScript());
box.addComponent("script", new ScriptComponent(myScript));

const MyScene = new Scene("Main");
MyScene.addEntity(camera);
MyScene.addEntity(box);

game.sceneManager.addScene(MyScene);
game.sceneManager.startScene("Main");
game.start();




// Class Base

// class MyScene extends Scene {
//   init() {
//     const camera = new Entity("MainCamera");
//     camera.addComponent("transform", new TransformComponent({ position: { x: 400, y: 300, z: 0 } }));
//     camera.addComponent("camera", new CameraComponent({
//       width: this.game.config.width,
//       height: this.game.config.height,
//       isPrimary: true,
//     }));

//     const box = new Entity();
//     box.addComponent("transform", new TransformComponent({ position: { x: 300, y: 200 } }));
//     box.addComponent("renderer", new BoxRenderComponent({ color: "red" }));

//     this.addEntity(camera);
//     this.addEntity(box);
//   }
// }

// class MyGame extends Game {
//   init() {
//     this.sceneManager.addScene(new MyScene("Main"));
//     this.sceneManager.startScene("Main");
//   }
// }

// new MyGame({ width: 800, height: 600, fps: 60 }).start();