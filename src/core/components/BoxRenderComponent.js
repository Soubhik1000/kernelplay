import { Component } from "../Component.js";

export class BoxRenderComponent extends Component {
  constructor(color = "#FF0000") {
    super();
    this.width = 50;
    this.height = 50;
    this.color = color;
  }

  init() {
    this.transform = this.entity.getComponent("transform");
  }

  render(ctx) {
    ctx.save();
    ctx.translate(this.transform.position.x, this.transform.position.y);
    ctx.rotate(this.transform.rotation.z); // 🔥 only Z axis for 2D
    ctx.scale(this.transform.scale.x, this.transform.scale.y);

    ctx.fillStyle = this.color || "black";
    ctx.fillRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    ctx.restore();

    // ctx.fillStyle = this.color;
    // // ctx.fillRect(this.entity.getComponent("position").x, this.entity.getComponent("position").y, this.width, this.height);
    // ctx.fillRect(this.transform.position.x, this.transform.position.y, this.width, this.height);
  }
}