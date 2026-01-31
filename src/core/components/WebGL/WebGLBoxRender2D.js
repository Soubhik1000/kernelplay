import { Component } from "../../Component.js";
import * as PIXI from "pixi.js";

export class WebGLBoxRender2D extends Component {
  constructor({ color }) {
    super();

    this.started = false;
    this.width = 50;
    this.height = 50;
    this.color = "red";

    // 🔥 create graphics object
    this.object = new PIXI.Graphics();

    // 🔥 draw ONCE
    this.object
      .rect(0, 0, this.width, this.height)
      .fill(color)
      .stroke({ width: 4, color: 0xffffff });

    // center pivot like engine transform
    this.object.pivot.set(this.width / 2, this.height / 2);
  }

  // _internalStart() {
  //   if (!this.started) {
  //     this.started = true;
  //     this.start();
  //   }
  // }

  onStart() {
    // this.object.entity = this.entity;
    console.log(this.entity.scene.game.renderer);
    // console.log("Box added to stage", this.object);

    // engine owns canvas, renderer owns stage
    this.entity.scene.game.renderer.stage.addChild(this.object);
  }

  onDestroy() {
    this.object.removeFromParent();
    this.object.destroy();
  }
}
