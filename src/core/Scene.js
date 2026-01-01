import { AABB } from "../core/physics/Collision.js";

export class Scene {
  constructor(name = "Scene") {
    this.name = name;
    this.entities = [];
  }

  addEntity(entity) {
    entity.scene = this;   // 🔥 inject scene
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
          const isTriggerCollision = ca.isTrigger || cb.isTrigger;

          const posA = a.getComponent("position");
          const posB = b.getComponent("position");

          if (!posA || !posB) continue;

          // 🔥 NORMAL COLLISION (PHYSICS)
          if (!isTriggerCollision) {
            const overlapX =
              Math.min(
                ca.bounds.x + ca.bounds.width,
                cb.bounds.x + cb.bounds.width
              ) - Math.max(ca.bounds.x, cb.bounds.x);

            const overlapY =
              Math.min(
                ca.bounds.y + ca.bounds.height,
                cb.bounds.y + cb.bounds.height
              ) - Math.max(ca.bounds.y, cb.bounds.y);

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
          }

          // 🔥 EVENT NOTIFICATION
          for (const comp of Object.values(a.components)) {
            if (isTriggerCollision && comp.onTriggerEnter) {
              comp.onTriggerEnter(b);
            } else if (!isTriggerCollision && comp.onCollision) {
              comp.onCollision(b);
            }
          }

          for (const comp of Object.values(b.components)) {
            if (isTriggerCollision && comp.onTriggerEnter) {
              comp.onTriggerEnter(a);
            } else if (!isTriggerCollision && comp.onCollision) {
              comp.onCollision(a);
            }
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

  raycast(x, y, options = {}) {
    const {
      layerMask = null,
      tag = null,
      triggerOnly = false,
      ignore = null
    } = options;

    // Topmost first (last added / last rendered)
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const entity = this.entities[i];

      if (ignore && entity === ignore) continue;

      if (tag && entity.tag !== tag) continue;

      if (layerMask !== null && (entity.layer & layerMask) === 0) continue;

      const collider = entity.getComponent("collider");
      if (!collider) continue;

      if (triggerOnly && !collider.isTrigger) continue;

      if (collider.containsPoint(x, y)) {
        return {
          entity,
          collider
        };
      }
    }

    return null;
  }

  pick(x, y, options) {
    const hit = this.raycast(x, y, options);
    return hit ? hit.entity : null;
  }

  findByTag(tag) {
    return this.entities.find(e => e.tag === tag) || null;
  }

  findAllByTag(tag) {
    return this.entities.filter(e => e.tag === tag);
  }


}
