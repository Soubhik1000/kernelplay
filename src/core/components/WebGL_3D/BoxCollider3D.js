import { Component } from "../../Component.js";

export class BoxCollider3D extends Component {
  constructor(width, height, depth, isTrigger = false) {
    super();
    this.width = width;
    this.height = height;
    this.depth = depth;
    this.isTrigger = isTrigger;
  }

  get bounds() {
    const pos = this.entity.getComponent("position");
    return {
      x: pos.x,
      y: pos.y,
      z: pos.z || 0,
      width: this.width,
      height: this.height,
      depth: this.depth
    };
  }
}
