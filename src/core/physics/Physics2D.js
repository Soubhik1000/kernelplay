import { PhysicsEngine } from "./PhysicsEngine.js";
import { AABB } from "../physics/Collision.js";

export class Physics2D extends PhysicsEngine {
  constructor() {
    super();
    this._grid = new Map();
    this._gridCellSize = 128;
  }

  init(scene) {
    // nothing needed for now
  }

  step(scene, dt) {
    // console.log(scene);
    
    const gravity = scene.game?.config?.gravity ?? 980;

    // Integrate
    for (const rb of scene._rigidbodies) {
    //   if (rb.isKinematic || !rb.entity.active) continue;
      if (rb.isKinematic) continue;
// console.log('hi');

      rb.isGrounded = false;

      if (rb.useGravity) {
        rb.force.y += gravity * rb.gravityScale * rb.mass;
      }

      const ax = rb.force.x / rb.mass;
      const ay = rb.force.y / rb.mass;

      rb.velocity.x += ax * dt;
      rb.velocity.y += ay * dt;

      rb.velocity.x *= 1 - rb.drag * dt;
      rb.velocity.y *= 1 - rb.drag * dt;

      const t = rb.entity.getComponent("transform");
      if (t) {
        t.position.x += rb.velocity.x * dt;
        t.position.y += rb.velocity.y * dt;
        t.markDirty();
      }

      rb.force.x = 0;
      rb.force.y = 0;
    }

    this._handleCollisions(scene);
  }

  addForce(rb, x, y, mode = "force") {
    if (mode === "impulse") {
      rb.velocity.x += x / rb.mass;
      rb.velocity.y += y / rb.mass;
    } else {
      rb.force.x += x;
      rb.force.y += y;
    }
  }

  _handleCollisions(scene) {
    const EPS = 0.0001;

    this._grid.clear();

    for (const collider of scene._colliders) {
      this._insert(collider);
    }

    for (const cell of this._grid.values()) {
      for (let i = 0; i < cell.length; i++) {
        const cA = cell[i];
        const boundsA = cA.bounds;
        const posA = cA.transform.position;
        const rbA = cA.entity.getComponent("rigidbody");

        for (let j = i + 1; j < cell.length; j++) {
          const cB = cell[j];
          const boundsB = cB.bounds;
          const posB = cB.transform.position;

          if (!AABB(boundsA, boundsB)) continue;

          const isTrigger = cA.isTrigger || cB.isTrigger;

          if (!isTrigger) {
            const overlapX =
              Math.min(boundsA.x + boundsA.width, boundsB.x + boundsB.width) -
              Math.max(boundsA.x, boundsB.x);

            const overlapY =
              Math.min(boundsA.y + boundsA.height, boundsB.y + boundsB.height) -
              Math.max(boundsA.y, boundsB.y);

            if (overlapX < overlapY) {
              posA.x += posA.x < posB.x ? -overlapX : overlapX;
              if (rbA) rbA.velocity.x = 0;
            } else {
              if (posA.y < posB.y) {
                posA.y -= overlapY + EPS;
                if (rbA) {
                  rbA.velocity.y = 0;
                  rbA.isGrounded = true;
                }
              } else {
                posA.y += overlapY + EPS;
                if (rbA) rbA.velocity.y = 0;
              }
            }

            cA.transform.markDirty();
          }

          scene._dispatchCollisionEvents(cA.entity, cB.entity, isTrigger);
        }
      }
    }
  }

  _insert(collider) {
    const bounds = collider.bounds;
    const minX = Math.floor(bounds.x / this._gridCellSize);
    const minY = Math.floor(bounds.y / this._gridCellSize);
    const maxX = Math.floor((bounds.x + bounds.width) / this._gridCellSize);
    const maxY = Math.floor((bounds.y + bounds.height) / this._gridCellSize);

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const key = `${x},${y}`;
        if (!this._grid.has(key)) this._grid.set(key, []);
        this._grid.get(key).push(collider);
      }
    }
  }

  destroy() {
    this._grid.clear();
  }
}