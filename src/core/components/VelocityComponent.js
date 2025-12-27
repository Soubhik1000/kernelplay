import { Component } from "../Component.js";

export class VelocityComponent extends Component {
  constructor(vx = 0, vy = 0) {
    super();
    this.vx = vx;
    this.vy = vy;
  }

  update(dt) {
    const pos = this.entity.getComponent("position");
    if (!pos) return;
    pos.x += this.vx * dt;
    pos.y += this.vy * dt;
  }
}
