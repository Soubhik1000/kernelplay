import { PhysicsEngine } from "./PhysicsEngine.js";
import { AABB3D } from "../physics/Collision.js";

export class Physics3D extends PhysicsEngine {
  constructor() {
    super();
    this._grid = new Map();
    this._gridCellSize = 128;
  }

  init(scene) {}

  step(scene, dt) {
    const gravity = scene.game?.config?.gravity ?? 980;

    for (const rb of scene._rigidbodies) {
      if (rb.isKinematic || !rb.entity.active) continue;

      rb.isGrounded = false;

      if (rb.useGravity) {
        rb.force.y += gravity * rb.gravityScale * rb.mass;
      }

      const ax = rb.force.x / rb.mass;
      const ay = rb.force.y / rb.mass;
      const az = rb.force.z / rb.mass;

      rb.velocity.x += ax * dt;
      rb.velocity.y += ay * dt;
      rb.velocity.z += az * dt;

      rb.velocity.x *= 1 - rb.drag * dt;
      rb.velocity.y *= 1 - rb.drag * dt;
      rb.velocity.z *= 1 - rb.drag * dt;

      const t = rb.entity.getComponent("transform");
      if (t) {
        t.position.x += rb.velocity.x * dt;
        t.position.y += rb.velocity.y * dt;
        t.position.z += rb.velocity.z * dt;
        t.markDirty();
      }

      rb.force.x = 0;
      rb.force.y = 0;
      rb.force.z = 0;
    }

    this._handleCollisions(scene);
  }

  addForce(rb, x, y, z = 0, mode = "force") {
    if (mode === "impulse") {
      rb.velocity.x += x / rb.mass;
      rb.velocity.y += y / rb.mass;
      rb.velocity.z += z / rb.mass;
    } else {
      rb.force.x += x;
      rb.force.y += y;
      rb.force.z += z;
    }
  }

  _handleCollisions(scene) {
    const EPS = 0.0001;

    this._grid.clear();

    for (const collider of scene._colliders3D) {
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

          if (!AABB3D(boundsA, boundsB)) continue;

          const isTrigger = cA.isTrigger || cB.isTrigger;

          if (!isTrigger) {
            const overlapX =
              Math.min(boundsA.x + boundsA.width, boundsB.x + boundsB.width) -
              Math.max(boundsA.x, boundsB.x);

            const overlapY =
              Math.min(boundsA.y + boundsA.height, boundsB.y + boundsB.height) -
              Math.max(boundsA.y, boundsB.y);

            const overlapZ =
              Math.min(boundsA.z + boundsA.depth, boundsB.z + boundsB.depth) -
              Math.max(boundsA.z, boundsB.z);

            if (overlapX <= overlapY && overlapX <= overlapZ) {
              posA.x += posA.x < posB.x ? -overlapX - EPS : overlapX + EPS;
              if (rbA) rbA.velocity.x = 0;
            } else if (overlapY <= overlapZ) {
              const centerA = posA.y;
              const centerB = posB.y;

              if (centerA > centerB) {
                // A landing on top of B
                posA.y += overlapY + EPS;
                if (rbA) {
                  if (rbA.velocity.y < 0) rbA.velocity.y = 0;
                  rbA.isGrounded = true;
                }
              } else {
                // A hitting ceiling
                posA.y -= overlapY + EPS;
                if (rbA) {
                  if (rbA.velocity.y > 0) rbA.velocity.y = 0;
                }
              }
            } else {
              posA.z += posA.z < posB.z ? -overlapZ - EPS : overlapZ + EPS;
              if (rbA) rbA.velocity.z = 0;
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
    const minZ = Math.floor(bounds.z / this._gridCellSize);
    const maxX = Math.floor((bounds.x + bounds.width) / this._gridCellSize);
    const maxY = Math.floor((bounds.y + bounds.height) / this._gridCellSize);
    const maxZ = Math.floor((bounds.z + bounds.depth) / this._gridCellSize);

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        for (let z = minZ; z <= maxZ; z++) {
          const key = `${x},${y},${z}`;
          if (!this._grid.has(key)) this._grid.set(key, []);
          this._grid.get(key).push(collider);
        }
      }
    }
  }

  destroy() {
    this._grid.clear();
  }
}