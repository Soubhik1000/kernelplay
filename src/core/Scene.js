import { AABB } from "../core/physics/Collision.js";

export class Scene {
  constructor(name = "Scene") {
    this.name = name;
    this.entities = [];
  }

  addEntity(entity) {
    this.entities.push(entity);
    return entity;
  }

  update(dt) {
    // Update all entities
    for (const entity of this.entities) {
      entity.update(dt);
    }

    // Collision check + response
    for (let i = 0; i < this.entities.length; i++) {
      for (let j = i + 1; j < this.entities.length; j++) {
        const a = this.entities[i];
        const b = this.entities[j];

        const ca = a.getComponent("collider");
        const cb = b.getComponent("collider");

        if (!ca || !cb) continue;

        if (AABB(ca.bounds, cb.bounds)) {
          const posA = a.getComponent("position");
          const posB = b.getComponent("position");

          // Safety check
          if (!posA || !posB) continue;

          const overlapX =
            Math.min(ca.bounds.x + ca.bounds.width, cb.bounds.x + cb.bounds.width) -
            Math.max(ca.bounds.x, cb.bounds.x);

          const overlapY =
            Math.min(ca.bounds.y + ca.bounds.height, cb.bounds.y + cb.bounds.height) -
            Math.max(ca.bounds.y, cb.bounds.y);

          // Resolve on smaller axis
          if (overlapX < overlapY) {
            if (posA.x < posB.x) posA.x -= overlapX;
            else posA.x += overlapX;

            const velA = a.getComponent("velocity");
            if (velA) velA.vx = 0;
          } else {
            if (posA.y < posB.y) posA.y -= overlapY;
            else posA.y += overlapY;

            const velA = a.getComponent("velocity");
            if (velA) velA.vy = 0;
          }

          // Collision callbacks
          // if (a.onCollision) a.onCollision(b);
          // if (b.onCollision) b.onCollision(a);
          
          // Notify scripts on entity A
          for (const comp of Object.values(a.components)) {
            if (comp.onCollision) comp.onCollision(b);
          }

          // Notify scripts on entity B
          for (const comp of Object.values(b.components)) {
            if (comp.onCollision) comp.onCollision(a);
          }
        }
      }
    }
  }

  render() {
    for (const entity of this.entities) {
      entity.render(this.ctx);
    }
  }
}
