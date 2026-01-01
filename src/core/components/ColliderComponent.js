import { Component } from "../Component.js";

export class ColliderComponent extends Component {
  constructor(width, height, isTrigger = false) {
    super();
    this.width = width;
    this.height = height;
    this.isTrigger = isTrigger;
  }

  get bounds() {
    const pos = this.entity.getComponent("position");
    return {
      x: pos.x,
      y: pos.y,
      width: this.width,
      height: this.height
    };
  }

  containsPoint(x, y) {
    const b = this.bounds;
    return (
      x >= b.x &&
      x <= b.x + b.width &&
      y >= b.y &&
      y <= b.y + b.height
    );
  }

}
