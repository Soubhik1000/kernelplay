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

  // instantiate(factory, ...args){
  //   const entity = factory(...args);
  //   this.entity.scene.addEntity(entity);
  //   return entity;
  // }

  instantiate(entity, ...args){
    this.entity.scene.spawn(entity, ...args);
    return entity;
  }

  _internalStart() {
    if (!this.started) {
      this.started = true;
      this.start();
    }
  }
}
