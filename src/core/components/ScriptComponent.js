import { Component } from "../Component.js";

export class ScriptComponent extends Component {
  constructor() {
    super();
    this.started = false;
  }

  // Called once when entity enters scene
  start() {}

  // Called every frame
  update(dt) {}

  // Called when collision happens
  onCollision(other) {}

  _internalStart() {
    if (!this.started) {
      this.started = true;
      this.start();
    }
  }
}
