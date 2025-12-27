import { Component } from "../Component.js";

export class AccelerationComponent extends Component {
  constructor(ax = 0, ay = 0) {
    super();
    this.ax = ax;
    this.ay = ay;
  }

  update(dt) {
    const vel = this.entity.getComponent("velocity");
    if (!vel) return;
    vel.vx += this.ax * dt;
    vel.vy += this.ay * dt;
  }
}
