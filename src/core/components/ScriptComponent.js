import { Component } from "../Component.js";
import { EntityReference, UIReference } from "../EntityReference.js";

export class ScriptComponent extends Component {
  constructor(props = {}) {
    super();
    this.started = false;
    this.camera = null;

    // 🔥 Store all props directly on the instance
    this._props = props;
    this._references = new Map();

    // Inject all props as instance properties
    for (const [key, value] of Object.entries(props)) {
      this[key] = value;

      // Track EntityReferences for auto-resolution
      // if (value instanceof EntityReference) {
      //   this._references.set(key, value);
      // }

      if (value instanceof EntityReference || value instanceof UIReference) {
        this._references.set(key, value);
      }
    }
  }

  // 🔥 Auto-resolve all entity references when attached
  onAttach() {

  }

  // Called once when entity enters scene
  start() {
    // this.camera = this.entity.scene.game.camera;
    this.camera = this.entity.scene.getPrimaryCamera();
    this.game = this.entity.scene.game;
    this.scene = this.entity.scene;

    if (!this.entity.scene) return;

    // for (const [key, ref] of this._references) {
    //   this[key] = ref.resolve(this.entity.scene);
    // }

    for (const [key, ref] of this._references) {
      // existing entity refs
      if (ref instanceof EntityReference) {
        this[key] = ref.resolve(this.entity.scene);
      }
      // ← add this
      if (ref instanceof UIReference) {
        this[key] = ref.resolve(this.entity.scene.game);
      }
    }
  }

  // Called every frame
  update(dt) { }
  // Lifecycle hooks (override these)
  onStart() { }
  update(dt) { }
  lateUpdate(dt) { }
  fixedUpdate(dt) { }
  onCollision(other) { }
  onTriggerEnter(other) { }
  onDestroy() { }

  // Called when collision happens
  // onCollision(other) {}

  // instantiate(factory, ...args){
  //   const entity = factory(...args);
  //   this.entity.scene.addEntity(entity);
  //   return entity;
  // }


  setFPS(fps) {
    this.entity.scene.game.loop.frameInterval = 1000 / fps;
  }

  getFPS() {
    return Math.round(1000 / this.entity.scene.game.loop.frameInterval);
  }

  setcalcRate(rate){
    this.entity.scene.game.loop.calcInterval = 1000 / rate;
  }

  getcalcRate(){
    return Math.round(1000 / this.entity.scene.game.loop.calcInterval); 
  }

  setfixedRate(rate){
    this.entity.scene.game.loop.fixedInterval = 1000 / rate;
  }

  getfixedRate(){
    return Math.round(1000 / this.entity.scene.game.loop.fixedInterval); 
  }

  setPrimaryCamera(camera) {
    const cam = camera.getComponent("camera");
    this.entity.scene.setPrimaryCamera(cam);
    this.camera = cam;
  }

  instantiate(entity, ...args) {
    return this.entity.scene.spawn(entity, ...args);
  }

  hasTag(tag) {
    return this.entity.hasTag(tag);
  }

  findById(id) {
    return this.entity.scene.findById(id);
  }

  findByName(name) {
    return this.entity.scene.findByName(name);
  }

  findByTag(tag) {
    return this.entity.scene.findByTag(tag);
  }

  findAllByTag(tag) {
    return this.entity.scene.findAllByTag(tag);
  }

  raycast(MouseX, MouseY) {
    return this.entity.scene.raycast(MouseX, MouseY);
  }

  pick(MouseX, MouseY) {
    return this.entity.scene.pick(MouseX, MouseY);
  }

  destroy() {
    this.entity.destroy();
  }

  // 🔥 Serialize props
  toJSON() {
    const data = { type: this.constructor.name };

    for (const [key, value] of Object.entries(this._props)) {
      if (value instanceof EntityReference) {
        data[key] = { entityId: value.entityId };
      } else {
        data[key] = value;
      }
    }

    return data;
  }

  // 🔥 Deserialize props
  static fromJSON(data) {
    const props = {};

    for (const [key, value] of Object.entries(data)) {
      if (key === 'type') continue;

      if (value && typeof value === 'object' && value.entityId !== undefined) {
        props[key] = new EntityReference(value.entityId);
      } else {
        props[key] = value;
      }
    }

    return new this(props);
  }

  _internalStart() {
    if (!this.started) {
      this.started = true;
      this.start();
    }
  }
}
