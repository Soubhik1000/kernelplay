import { Component } from "../Component.js";

export class ColliderComponent extends Component {
  constructor(options) {
    super();

    const {
      width = 50,
      height = 50,
      isTrigger = false
    } = options ?? {};

    this.width = width;
    this.height = height;
    this.isTrigger = isTrigger;
  }

  get bounds() {
    const t = this.entity.getComponent("transform");

    return {
      x: t.position.x - (this.width * t.scale.x) / 2,
      y: t.position.y - (this.height * t.scale.y) / 2,
      width: this.width * t.scale.x,
      height: this.height * t.scale.y
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
