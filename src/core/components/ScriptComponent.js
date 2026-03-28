import { Component } from "../Component.js";

export class ScriptComponent extends Component {
  constructor() {
    super();
    this.started = false;
    this.camera = null;
  }

  // Called once when entity enters scene
  start() {
    // this.camera = this.entity.scene.game.camera;
    this.camera = this.entity.scene.getPrimaryCamera();
    this.game = this.entity.scene.game;
    this.scene = this.entity.scene;
  }

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

  hasTag(tag){
    return this.entity.hasTag(tag);
  }

  findById(id) {
    return this.entity.scene.findById(id);
  }

  findByName(name) {
    return this.entity.scene.findByName(name);
  }

  findByTag(tag){
    return this.entity.scene.findByTag(tag);
  }

  findAllByTag(tag){
    return this.entity.scene.findAllByTag(tag);
  }

  raycast(MouseX, MouseY){
    return this.entity.scene.raycast(MouseX, MouseY);
  }

  pick(MouseX, MouseY){
    return this.entity.scene.pick(MouseX, MouseY);
  }

  destroy(){
    this.entity.destroy();
  }

  _internalStart() {
    if (!this.started) {
      this.started = true;
      this.start();
    }
  }
}
