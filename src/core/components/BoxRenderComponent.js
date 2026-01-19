import { Component } from "../Component.js";

export class BoxRenderComponent extends Component {
  constructor(width = 50, height = 50, color = "#FF0000") {
    super();
    this.width = width;
    this.height = height;
    this.color = color;
  }

  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.entity.getComponent("position").x, this.entity.getComponent("position").y, this.width, this.height);
  }
}