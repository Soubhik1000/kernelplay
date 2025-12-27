import { Entity } from "./Entity.js";

export class Scene {
  constructor(name = "Scene") {
    this.name = name;
    this.entities = [];
  }

  init() {} // custom scene init

  addEntity(entity) {
    this.entities.push(entity);
    return entity;
  }

  update(dt) {
    for (const entity of this.entities) {
      entity.update(dt);
    }
  }

  render() {
    for (const entity of this.entities) {
      entity.render(this.ctx);
    }
  }
}
