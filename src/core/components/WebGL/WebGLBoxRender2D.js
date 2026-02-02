import { Component } from "../../Component.js";
import * as PIXI from "pixi.js";

export class WebGLBoxRender2D extends Component {
  constructor({ color }) {
    super();

    this.width = 50;
    this.height = 50;
    this.color = color || 0xff0000;

    // 🔥 create graphics object
    this.object = new PIXI.Graphics().rect(0, 0, this.width, this.height);
    // .stroke({ width: 4, color: 0xffffff });
      

    // center pivot like engine transform
    this.object.pivot.set(this.width / 2, this.height / 2);
  }

  onStart() {
    this.object.entity = this.entity;
    this.object.fill(this.color);
    // this.entity.scene.game.renderer.stage.addChild(this.object);
    this.entity.scene.game.renderer.app.stage.addChild(this.object);
  }

  onDestroy() {
    this.object.removeFromParent();
    this.object.destroy();
  }
}
