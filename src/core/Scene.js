import { AABB, AABB3D, resolveAABB3D } from "../core/physics/Collision.js";
// import { ThreeRenderer } from "../graphics/ThreeRenderer.js";
import { RaycastHit } from "./physics/RaycastHit.js";
import { Entity } from "./Entity.js";

export class Scene {
  constructor(name = "Scene") {
    this.name = name;
    this.entities = [];
    this.fixedTimeStep = 1 / 60;
    this._accumulator = 0;

    this._entityPool = []; // 🔥 ADD THIS
  }

  addEntity(entity) {
    entity.scene = this;   // 🔥 inject scene
    this.entities.push(entity);
    entity._start();
    return entity;
  }

  update(dt) {

    // const gravity = this.game?.config?.gravity ?? 980;

    // 🔥 Physics integration
    // for (const entity of this.entities) {

    //   const rb2d = entity.getComponent("rigidbody2d");
    //   if (rb2d) rb2d.integrate(dt, gravity);
    //   // console.log(rb);

    //   const rb3d = entity.getComponent("rigidbody");
    //   if (rb3d) rb3d.integrate(dt, gravity);

    // }

    this._accumulator += dt;

    while (this._accumulator >= this.fixedTimeStep) {
      this._physicsStep(this.fixedTimeStep);
      this._accumulator -= this.fixedTimeStep;
    }

    // Update all entities
    for (const entity of this.entities) {
      entity.update(dt);
    }

    // Collision check + response
    // for (let i = 0; i < this.entities.length; i++) {
    //   for (let j = i + 1; j < this.entities.length; j++) {
    //     const a = this.entities[i];
    //     const b = this.entities[j];

    //     const ca = a.getComponent("collider");
    //     const cb = b.getComponent("collider");

    //     const c3a = a.getComponent("collider3D");
    //     const c3b = b.getComponent("collider3D");

    //     if (!ca || !cb || !c3a || !c3b) continue;

    //     if (AABB(ca.bounds, cb.bounds)) {
    //       const isTriggerCollision = ca.isTrigger || cb.isTrigger;

    //       const posA = a.getComponent("position");
    //       const posB = b.getComponent("position");

    //       if (!posA || !posB) continue;

    //       // 🔥 NORMAL COLLISION (PHYSICS)
    //       if (!isTriggerCollision) {
    //         const overlapX =
    //           Math.min(
    //             ca.bounds.x + ca.bounds.width,
    //             cb.bounds.x + cb.bounds.width
    //           ) - Math.max(ca.bounds.x, cb.bounds.x);

    //         const overlapY =
    //           Math.min(
    //             ca.bounds.y + ca.bounds.height,
    //             cb.bounds.y + cb.bounds.height
    //           ) - Math.max(ca.bounds.y, cb.bounds.y);

    //         // Resolve on smaller axis
    //         if (overlapX < overlapY) {
    //           if (posA.x < posB.x) posA.x -= overlapX;
    //           else posA.x += overlapX;

    //           const velA = a.getComponent("velocity");
    //           if (velA) velA.vx = 0;
    //         } else {
    //           if (posA.y < posB.y) posA.y -= overlapY;
    //           else posA.y += overlapY;

    //           const velA = a.getComponent("velocity");
    //           if (velA) velA.vy = 0;
    //         }
    //       }

    //       // 🔥 EVENT NOTIFICATION
    //       for (const comp of Object.values(a.components)) {
    //         if (isTriggerCollision && comp.onTriggerEnter) {
    //           comp.onTriggerEnter(b);
    //         } else if (!isTriggerCollision && comp.onCollision) {
    //           comp.onCollision(b);
    //         }
    //       }

    //       for (const comp of Object.values(b.components)) {
    //         if (isTriggerCollision && comp.onTriggerEnter) {
    //           comp.onTriggerEnter(a);
    //         } else if (!isTriggerCollision && comp.onCollision) {
    //           comp.onCollision(a);
    //         }
    //       }
    //     }

    //     if (c3a && c3b && AABB3D(c3a.bounds, c3b.bounds)) {
    //       if (!c3a.isTrigger && !c3b.isTrigger) {
    //         const posA = a.getComponent("position");
    //         const velA = a.getComponent("velocity");
    //         resolveAABB3D(c3a.bounds, c3b.bounds, posA, velA);
    //       }

    //       // 🔥 EVENT NOTIFICATION
    //       for (const comp of Object.values(a.components)) {
    //         if (isTriggerCollision && comp.onTriggerEnter) {
    //           comp.onTriggerEnter(b);
    //         } else if (!isTriggerCollision && comp.onCollision) {
    //           comp.onCollision(b);
    //         }
    //       }

    //       for (const comp of Object.values(b.components)) {
    //         if (isTriggerCollision && comp.onTriggerEnter) {
    //           comp.onTriggerEnter(a);
    //         } else if (!isTriggerCollision && comp.onCollision) {
    //           comp.onCollision(a);
    //         }
    //       }
    //     }

    //   }
    // }

    // this._handleCollisions();


    for (const entity of this.entities) {
      entity.lateUpdate(dt);
    }

    // 🔥 CLEANUP
    // this.entities = this.entities.filter(e => !e._destroyed);

    const alive = [];

    for (const entity of this.entities) {
      if (entity._destroyed) {
        this._recycleEntity(entity); // 🔥 return to pool
      } else {
        alive.push(entity);
      }
    }

    this.entities = alive;

  }

  // render() {
  //   for (const entity of this.entities) {
  //     entity.render(this.ctx);
  //   }
  // }

  render(renderer) {
    renderer.render(this);
  }

  raycast2D(x, y, options = {}) {
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

  raycast3D(x, y, options = {}) {
    const {
      layerMask = null,
      tag = null,
      triggerOnly = false,
      ignore = null,
      maxDistance = Infinity
    } = options;

    const renderer = this.game.renderer;
    if (!renderer?.raycaster) return null;

    const rect = renderer.renderer.domElement.getBoundingClientRect();

    const ndc = {
      x: (x / rect.width) * 2 - 1,
      y: -(y / rect.height) * 2 + 1
    };

    renderer.raycaster.setFromCamera(ndc, renderer.camera);

    const hits = renderer.raycaster.intersectObjects(
      renderer.scene3D.children,
      true
    );

    if (hits.length === 0) return null;

    const h = hits[0];
    if (h.distance > maxDistance) return null;

    const entity = h.object.userData?.entity;
    if (!entity) return null;

    if (ignore && entity === ignore) return null;

    if (tag && entity.tag !== tag) return null;

    if (layerMask !== null && (entity.layer & layerMask) === 0) return null;

    if (triggerOnly && !collider.isTrigger) return null;

    return new RaycastHit({
      entity,
      point: { x: h.point.x, y: h.point.y, z: h.point.z },
      normal: {
        x: h.face.normal.x,
        y: h.face.normal.y,
        z: h.face.normal.z
      },
      distance: h.distance
    });
  }

  raycast(x, y, options = {}) {
    if (this.game.renderer?.type === "three") {
      return this.raycast3D(x, y, options);
    }

    // Fallback to 2D
    return this.raycast2D(x, y, options);
  }

  pick(x, y, options) {
    // Prefer 3D if renderer is Three.js
    // console.log(this.game.renderer.type);
    // const renderer = this.game.renderer;
    // console.log(renderer);
    // console.log(renderer?.raycaster);
    // console.log(renderer?.type === "three");

    if (this.game.renderer?.type === "three") {
      return this.pick3D(x, y);
    }

    // Fallback to 2D
    return this.pick2D(x, y, options);
  }

  pick2D(x, y, options) {
    const hit = this.raycast2D(x, y, options);
    return hit ? hit.entity : null;
  }

  pick3D(x, y, options) {
    const hit = this.raycast3D(x, y, options);
    return hit ? hit.entity : null;
  }

  // pick3D(x, y) {
  //   const renderer = this.game.renderer;
  //   if (!renderer?.raycaster) return null;

  //   const rect = renderer.renderer.domElement.getBoundingClientRect();

  //   const ndc = {
  //     x: (x / rect.width) * 2 - 1,
  //     y: -(y / rect.height) * 2 + 1
  //   };

  //   renderer.raycaster.setFromCamera(ndc, renderer.camera);

  //   const intersects = renderer.raycaster.intersectObjects(
  //     renderer.scene3D.children,
  //     true
  //   );

  //   if (intersects.length === 0) return null;

  //   const object = intersects[0].object;
  //   return { entity: object.userData.entity };
  // }

  spawn(prefabFn, ...args) {
    let entity;

    if (this._entityPool.length > 0) {
      entity = this._entityPool.pop();
      entity.reset();
      console.log("old object pooled");
    } else {
      entity = new Entity();
      console.log("new object created");
    }

    const newEntity = prefabFn(...args);

    // copy components from prefab into pooled entity
    entity.name = newEntity.name;
    entity.tag = newEntity.tag;
    entity.components = newEntity.components;
    entity._componentCache = newEntity._componentCache;

    return this.addEntity(entity);
  }


  findByTag(tag) {
    return this.entities.find(e => e.tag === tag) || null;
  }

  findAllByTag(tag) {
    return this.entities.filter(e => e.tag === tag);
  }


  _dispatchCollisionEvents(a, b, isTrigger) {
    for (const comp of Object.values(a.components)) {
      if (isTrigger && comp.onTriggerEnter) comp.onTriggerEnter(b);
      else if (!isTrigger && comp.onCollision) comp.onCollision(b);
    }

    for (const comp of Object.values(b.components)) {
      if (isTrigger && comp.onTriggerEnter) comp.onTriggerEnter(a);
      else if (!isTrigger && comp.onCollision) comp.onCollision(a);
    }
  }

  _handleCollisions() {
    const EPS = 0.0001;

    for (let i = 0; i < this.entities.length; i++) {
      for (let j = i + 1; j < this.entities.length; j++) {
        const a = this.entities[i];
        const b = this.entities[j];

        const c2a = a.getComponent("collider");
        const c2b = b.getComponent("collider");

        const c3a = a.getComponent("collider3D");
        const c3b = b.getComponent("collider3D");

        const posA = a.getComponent("transform").position;
        const posB = b.getComponent("transform").position;

        const rbA2 = a.getComponent("rigidbody2d");
        const rbA = a.getComponent("rigidbody");

        if (!posA || !posB) continue;

        /* =======================
           🔹 2D COLLISION
        ======================= */
        if (c2a && c2b && AABB(c2a.bounds, c2b.bounds)) {
          const isTrigger = c2a.isTrigger || c2b.isTrigger;

          if (!isTrigger) {
            const overlapX =
              Math.min(
                c2a.bounds.x + c2a.bounds.width,
                c2b.bounds.x + c2b.bounds.width
              ) - Math.max(c2a.bounds.x, c2b.bounds.x);

            const overlapY =
              Math.min(
                c2a.bounds.y + c2a.bounds.height,
                c2b.bounds.y + c2b.bounds.height
              ) - Math.max(c2a.bounds.y, c2b.bounds.y);

            // if (overlapX < overlapY) {
            //   posA.x += posA.x < posB.x ? -overlapX : overlapX;

            // } else {
            //   posA.y += posA.y < posB.y ? -overlapY : overlapY;

            // }

            if (overlapX < overlapY) {
              // X axis
              if (posA.x < posB.x) posA.x -= overlapX;
              else posA.x += overlapX;

              if (rbA2) rbA2.velocity.x = 0;
            } else {
              // Y axis (GROUND LOGIC 🔥)
              if (posA.y < posB.y) {
                // A is ABOVE B
                posA.y -= overlapY + EPS;

                if (rbA2) {
                  rbA2.velocity.y = 0;
                  rbA2.isGrounded = true;
                }
              } else {
                // A hit B from below
                posA.y += overlapY + EPS;
                if (rbA2) rbA2.velocity.y = 0;
              }
            }
          }

          this._dispatchCollisionEvents(a, b, isTrigger);
        }

        /* =======================
           🔹 3D COLLISION
        ======================= */
        if (c3a && c3b && AABB3D(c3a.bounds, c3b.bounds)) {
          const isTrigger = c3a.isTrigger || c3b.isTrigger;

          if (!isTrigger) {
            const overlapX =
              Math.min(
                c3a.bounds.x + c3a.bounds.width,
                c3b.bounds.x + c3b.bounds.width
              ) - Math.max(c3a.bounds.x, c3b.bounds.x);

            const overlapY =
              Math.min(
                c3a.bounds.y + c3a.bounds.height,
                c3b.bounds.y + c3b.bounds.height
              ) - Math.max(c3a.bounds.y, c3b.bounds.y);

            const overlapZ =
              Math.min(
                c3a.bounds.z + c3a.bounds.depth,
                c3b.bounds.z + c3b.bounds.depth
              ) - Math.max(c3a.bounds.z, c3b.bounds.z);

            // Resolve on smallest axis
            // if (overlapX <= overlapY && overlapX <= overlapZ) {
            //   posA.x += posA.x < posB.x ? -overlapX : overlapX;
            // } else if (overlapY <= overlapZ) {
            //   posA.y += posA.y < posB.y ? -overlapY : overlapY;
            // } else {
            //   posA.z += posA.z < posB.z ? -overlapZ : overlapZ;
            // }

            // 🔥 resolve on smallest penetration axis
            if (overlapX <= overlapY && overlapX <= overlapZ) {
              posA.x += posA.x < posB.x ? -overlapX - EPS : overlapX + EPS;
              if (rbA) rbA.velocity.x = 0;
            }
            else if (overlapY <= overlapZ) {
              // Y AXIS (GROUND LOGIC)
              if (posA.y < posB.y) {
                // A is ABOVE B
                posA.y -= overlapY + EPS;

                if (rbA) {
                  rbA.velocity.y = 0;
                  rbA.isGrounded = true;
                }
              } else {
                // hit from below
                posA.y += overlapY + EPS;
                if (rbA) rbA.velocity.y = 0;
                rbA.isGrounded = true;
              }
            }
            else {
              posA.z += posA.z < posB.z ? -overlapZ - EPS : overlapZ + EPS;
              if (rbA) rbA.velocity.z = 0;
            }
          }

          this._dispatchCollisionEvents(a, b, isTrigger);
        }
      }
    }
  }

  _physicsStep(dt) {
    const gravity = this.game?.config?.gravity ?? 980;

    for (const entity of this.entities) {
      const r2b = entity.getComponent("rigidbody2d");
      if (r2b) r2b.isGrounded = false;
      if (r2b) r2b.integrate(dt, gravity);

      const rb3d = entity.getComponent("rigidbody");
      if (rb3d) rb3d.isGrounded = false;
      if (rb3d) rb3d.integrate(dt, gravity);
    }

    this._handleCollisions();
  }

  _recycleEntity(entity) {
    entity.reset();          // must exist in Entity
    entity.scene = null;
    this._entityPool.push(entity);
  }


}
