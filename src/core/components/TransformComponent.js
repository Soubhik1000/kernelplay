import { Component } from "../Component.js";

export class TransformComponent extends Component {
  constructor(options = {}) {
    super();

    const {
      position = { x: 0, y: 0, z: 0 },
      rotation = { x: 0, y: 0, z: 0 },
      scale = { x: 1, y: 1, z: 1 }
    } = options;

    this._dirty = true;

    // 🔥 internal proxied state
    this._position = this._makeProxy({ ...position });
    this._rotation = this._makeProxy({ ...rotation });
    this._scale = this._makeProxy({ ...scale });
  }

  _makeProxy(target) {
    return new Proxy(target, {
      set: (obj, prop, value) => {
        if (obj[prop] !== value) {
          obj[prop] = value;
          this._dirty = true;
        }
        return true;
      }
    });
  }

  // 🔒 read-only references
  get position() { return this._position; }
  get rotation() { return this._rotation; }
  get scale()    { return this._scale; }

  // 🔥 helpers
  translate(dx = 0, dy = 0, dz = 0) {
    if (dx === 0 && dy === 0 && dz === 0) return;
    this._position.x += dx;
    this._position.y += dy;
    this._position.z += dz;
    // dirty set automatically by proxy
  }

  setPosition(x, y, z = this._position.z) {
    this._position.x = x;
    this._position.y = y;
    this._position.z = z;
  }

  setRotation(x, y, z) {
    this._rotation.x = x;
    this._rotation.y = y;
    this._rotation.z = z;
  }

  setScale(x, y, z = this._scale.z) {
    this._scale.x = x;
    this._scale.y = y;
    this._scale.z = z;
  }

  markDirty() {
    this._dirty = true;
  }

  clearDirty() {
    this._dirty = false;
  }
}