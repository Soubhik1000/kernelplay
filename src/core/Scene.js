import { AABB, AABB3D, resolveAABB3D } from "../core/physics/Collision.js";
// import { ThreeRenderer } from "../graphics/ThreeRenderer.js";
import { RaycastHit } from "./physics/RaycastHit.js";
import { Entity } from "./Entity.js";
import { Camera2D } from "./components/Camera2D.js";

export class Scene {
  constructor(name = "Scene") {
    this.name = name;
    this.entities = [];
    this.fixedTimeStep = 1 / 60;
    this._accumulator = 0;

    this._entityPool = []; // 🔥 ADD THIS

    // 🔥 Component registries
    this._rigidbody2D = [];
    this._rigidbody3D = [];
    this._colliders = [];
    this._colliders3D = [];
    this._renderers = [];
    this._meshes = []; // 🔥 ADD THIS
    this._cameras = [];

    this._renderGrid2D = new Map();     // for rendering
    this._grid2D = new Map();
    this._grid3D = new Map();
    this._gridCellSize = 128; // adjust as needed
    this.primaryCamera = null;
    this._rigidbodies = [];
  }

  addEntity(entity) {
    entity.scene = this;   // 🔥 inject scene
    this.entities.push(entity);

    // 🔥 Register all existing components
    for (const [type, comp] of Object.entries(entity.components)) {
      this._registerComponent(type, comp);
    }

    entity._start();
    return entity;
  }

  update(dt) {

    // 🔥 UPDATE CAMERAS
    for (const camera of this._cameras) {
      if (camera.entity.active) {
        camera.update(dt);
      }
    }

    // Update all entities
    for (const entity of this.entities) {
      entity.update(dt);
    }

    for (const entity of this.entities) {
      entity.lateUpdate(dt);
    }

    // 🔥 CLEANUP
    // this.entities = this.entities.filter(e => !e._destroyed);

    const alive = [];

    for (const entity of this.entities) {
      if (entity._destroyed) {

        // 🔥 Unregister its components
        for (const [type, comp] of Object.entries(entity.components)) {
          this._unregisterComponent(type, comp);
        }

        this._recycleEntity(entity); // 🔥 return to pool
      } else {
        alive.push(entity);
      }
    }

    this.entities = alive;

  }

  fixedUpdate(dt){

    for (const entity of this.entities) {
      entity.fixedUpdate(dt);
    }

    // this._physicsStep(dt);
    this.game.physics?.step(this, dt);
  }

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

  spawn(prefabFn, ...args) {
    let entity;

    if (this._entityPool.length > 0) {
      entity = this._entityPool.pop();
      entity.reset();
      // console.log("old object pooled");
    } else {
      entity = new Entity();
      // console.log("new object created");
    }

    prefabFn(entity, ...args);

    return this.addEntity(entity);
  }

  setPrimaryCamera(cameraComponent) {
    // Disable old primary camera
    if (this.primaryCamera) {
      this.primaryCamera.isPrimary = false;
    }

    // Set new primary camera
    this.primaryCamera = cameraComponent;
    cameraComponent.isPrimary = true;
  }

  findById(id) {
    return this.entities.find(e => e.id === id) || null;
  }

  findByName(name) {
    return this.entities.find(e => e.name === name) || null;
  }

  findByTag(tag) {
    return this.entities.find(e => e.tag === tag) || null;
  }

  findAllByTag(tag) {
    return this.entities.filter(e => e.tag === tag);
  }

  _registerComponent(type, component) {
    switch (type) {
      case "rigidbody2d":
        // this._rigidbody2D.push(component);
        this._rigidbodies.push(component);
        break;

      case "rigidbody":
        // this._rigidbody3D.push(component);
        this._rigidbodies.push(component);
        break;

      case "collider":
        this._colliders.push(component);
        break;

      case "collider3D":
        this._colliders3D.push(component);
        break;

      case "renderer":
      case "boxrender":
      case "spriterender":
      case "meshrender":
        this._renderers.push(component);
        break;

      case "mesh":
        this._meshes.push(component);

      case "camera":
        this._cameras.push(component);
        if (component.isPrimary) {
          this.primaryCamera = component;
        }
        break;
    }
  }

  _unregisterComponent(type, component) {
    let list;

    switch (type) {
      case "rigidbody2d":
        list = this._rigidbody2D;
        break;
      case "rigidbody":
        list = this._rigidbody3D;
        break;
      case "collider":
        list = this._colliders;
        break;
      case "collider3D":
        list = this._colliders3D;
        break;
      case "renderer":
        list = this._renderers;
        break;
      case "mesh":
        list = this._meshes;
        break;
      default:
        return;
    }

    const index = list.indexOf(component);
    if (index !== -1) list.splice(index, 1);
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

  _recycleEntity(entity) {
    entity.reset();          // must exist in Entity
    entity.scene = null;
    this._entityPool.push(entity);
  }


  _getCellRange2D(bounds) {
    const minX = Math.floor(bounds.x / this._gridCellSize);
    const minY = Math.floor(bounds.y / this._gridCellSize);
    const maxX = Math.floor((bounds.x + bounds.width) / this._gridCellSize);
    const maxY = Math.floor((bounds.y + bounds.height) / this._gridCellSize);

    return { minX, minY, maxX, maxY };
  }

  _getCellRange3D(bounds) {
    const minX = Math.floor(bounds.x / this._gridCellSize);
    const minY = Math.floor(bounds.y / this._gridCellSize);
    const minZ = Math.floor(bounds.z / this._gridCellSize);

    const maxX = Math.floor((bounds.x + bounds.width) / this._gridCellSize);
    const maxY = Math.floor((bounds.y + bounds.height) / this._gridCellSize);
    const maxZ = Math.floor((bounds.z + bounds.depth) / this._gridCellSize);

    return { minX, minY, minZ, maxX, maxY, maxZ };
  }

  // 🔥 Insert renderer into render grid
  _insertRenderer2D(renderer) {
    const bounds = renderer.getBounds();
    const { minX, minY, maxX, maxY } = this._getCellRange2D(bounds);

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const key = `${x},${y}`;

        if (!this._renderGrid2D.has(key)) {
          this._renderGrid2D.set(key, []);
        }

        this._renderGrid2D.get(key).push(renderer);
      }
    }
  }

  // 🔥 Get visible renderers from render grid
  _getVisibleRenderers(cameraBounds) {
    const visible = [];

    // 🔥 Rebuild render grid each frame
    this._renderGrid2D.clear();

    for (const renderer of this._renderers) {
      if (!renderer.entity.active) continue;
      this._insertRenderer2D(renderer);
    }

    const { minX, minY, maxX, maxY } = this._getCellRange2D(cameraBounds);
    const checked = new Set();

    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        const key = `${x},${y}`;
        const cell = this._renderGrid2D.get(key);

        if (!cell) continue;

        for (const renderer of cell) {
          if (checked.has(renderer)) continue;
          checked.add(renderer);

          if (AABB(renderer.getBounds(), cameraBounds)) {
            visible.push(renderer);
          }
        }
      }
    }

    this._visibleCount = visible.length; // 🔥 Store for debug
    return visible;
  }

  getPrimaryCamera() {
    return this.primaryCamera || (this._cameras.length > 0 ? this._cameras[0] : null);
  }

  _clearGrid() {
    this._grid2D.clear();
    this._grid3D.clear();
  }

}
