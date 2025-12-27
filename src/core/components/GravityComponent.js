import { Component } from "../Component.js";

export class GravityComponent extends Component {
  constructor(g = 500) { // pixels/sec²
    super();
    this.g = g;
  }

  update(dt) {
    const vel = this.entity.getComponent("velocity");
    if (!vel) return;
    vel.vy += this.g * dt;
  }
}
