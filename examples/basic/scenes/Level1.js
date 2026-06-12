import { Scene } from "../../../src/core/Scene.js";
import { Player } from "../prefabs/Player.js";
import { Wall } from "../prefabs/Wall.js";
import { Grass } from "../prefabs/Grass.js";
import { Shape } from "../prefabs/Shape.js";
import { uiRef } from "../../../src/index.js";
import { CameraComponent, Entity, TransformComponent, FPSCounterComponent, ScriptComponent } from "../../../src/index.js";
// import { Cube } from "../prefabs/Cube.js";
// import { Cube1 } from "../prefabs/Cube1.js";
// import { Bullet } from "../prefabs/Bullet.js";
import { AudioListener } from "../../../src/index.js";
import { UIText } from "../../../src/index.js";
import { UIButton } from "../../../src/index.js";
import { UICheckbox } from "../../../src/index.js";
import { UISlider } from "../../../src/index.js";
import { UIInputField } from "../../../src/index.js";


export class Level1 extends Scene {
  init() {
    this.ctx = this.game.renderer.ctx;
    this.fps = 0;
    this.frames = 0;
    this.lastTime = performance.now();

    this.cal = 0;
    this.calframes = 0;
    this.lastTime_cal = performance.now();
    
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

    this.spawn(Shape, 400, 100)

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

    const UI_EventHandeler = new Entity("UI_EventHandeler");
    UI_EventHandeler.id = 150;
    UI_EventHandeler.addComponent("Script", new class extends ScriptComponent {
      start() {
        super.start();
        this.input = {
          moveLeft: false,
          moveRight: false,
          jump: false,
        };

        this.leftBtn.onPointerDown = () => { this.input.moveLeft = true; };
        this.leftBtn.onPointerUp = () => { this.input.moveLeft = false; };
        this.rightBtn.onPointerDown = () => { this.input.moveRight = true; };
        this.rightBtn.onPointerUp = () => { this.input.moveRight = false; };
      }
    }({
      leftBtn: uiRef(100),
      rightBtn: uiRef(101),
    }));
    this.addEntity(UI_EventHandeler);


    console.log(this);

    this.fpsText = this.game.ui.add(new UIText({
      text: `FPS: 00`,
      anchor: "topLeft",
      offset: { x: 5, y: 5 },
      style: {
        textColor: "#1d1d1d",
        fontSize: 16,
        // fontWeight: "bold",
      },
    }));

    this.calText = this.game.ui.add(new UIText({
      text: `CAL: 00`,
      anchor: "topLeft",
      offset: { x: 5, y: 20 },
      style: {
        textColor: "#1d1d1d",
        fontSize: 16,
        // fontWeight: "bold",
      },
    }));

    // const label = this.game.ui.add(new UIText({
    //   text: "Score: 0",
    //   anchor: "topRight",
    //   offset: { x: 20, y: 20 },
    //   style: {
    //     textColor: "#ff0000",
    //     fontSize: 18,
    //     fontWeight: "bold",
    //   },
    // }));

    const btn = this.game.ui.add(new UIButton({
      label: "Level 2",
      anchor: "topRight",
      offset: { x: 0, y: 0 },
      width: 160,
      height: 48,
      zIndex: 1,
      style: {
        primaryColor: "#4a91e200",
        hoverColor: "#5aa1f223",
        pressColor: "#3a81d200",
        textColor: "#000000",
        fontSize: 16,
        fontWeight: "bold",
      },
    }));

    btn.onClick = () => {
      console.log("Play clicked!");
      this.game.sceneManager.startScene("Level2");
    };

    const leftBtn = this.game.ui.add(new UIButton({
      id: 100,
      label: "◀",
      anchor: "bottomCenter",
      offset: { x: -100, y: 30 },
      width: 160,
      height: 48,
      zIndex: 1,
      style: {
        primaryColor: "#4a91e200",
        hoverColor: "#5aa1f223",
        pressColor: "#3a81d200",
        textColor: "#000000",
        fontSize: 16,
        fontWeight: "bold",
      },
    }));

    // leftBtn.onPointerDown = () => { this._moveLeft  = true;  };
    // leftBtn.onPointerUp   = () => { this._moveLeft  = false; };

    const rightBtn = this.game.ui.add(new UIButton({
      id: 101,
      label: "▶",
      anchor: "bottomCenter",
      offset: { x: 100, y: 30 },
      width: 160,
      height: 48,
      zIndex: 1,
      style: {
        primaryColor: "#4a91e200",
        hoverColor: "#5aa1f223",
        pressColor: "#3a81d200",
        textColor: "#000000",
        fontSize: 16,
        fontWeight: "bold",
      },
    }));

    // rightBtn.onPointerDown = () => { this._moveRight = true;  };
    // rightBtn.onPointerUp   = () => { this._moveRight = false; };


    // const sfxToggle = this.game.ui.add(new UICheckbox({
    //   label: "Sound Effects",
    //   checked: true,
    //   anchor: "middleLeft",
    //   offset: { x: 0, y: -20 },
    //   width: 200,
    //   height: 30,
    // }));

    // const volumeSlider = this.game.ui.add(new UISlider({
    //   value: 0.8,
    //   min: 0,
    //   max: 1,
    //   showValue: true,
    //   anchor: "middleRight",
    //   offset: { x: 0, y: 40 },
    //   width: 220,
    //   height: 30,
    // }));

    // const nameField = this.game.ui.add(new UIInputField({
    //   placeholder: "Enter your name...",
    //   value: "",
    //   maxLength: 20,
    //   anchor: "bottomCenter",
    //   offset: { x: 0, y: 0 },
    //   width: 260,
    //   height: 42,
    // }));

  }

  update(dt) {

    super.update(dt);

    this.calframes++;
    const now = performance.now();

    if (now >= this.lastTime_cal + 1000) {
      this.cal = this.calframes;
      this.calframes = 0;
      this.lastTime_cal = now;
    }
    this.calText.text = `CAL: ${this.cal}`;

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

    this.fpsText.text = `FPS: ${this.fps}`;

    // this.ctx.save();
    // this.ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    // this.ctx.font = "16px monospace";
    // this.ctx.fillText(`FPS: ${this.fps}`, 10, 20);

    // this.ctx.restore();
  }
}
