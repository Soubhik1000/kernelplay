import { Component } from "../Component.js";

export class ColliderComponent extends Component {
  constructor(options = {}) {
    super();

    const {
      width = 50,
      height = 50,
      isTrigger = false
    } = options;

    this.width = width;
    this.height = height;
    this.isTrigger = isTrigger;

    // 🔥 cached AABB
    this._bounds = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    this._dirty = true;
  }

  init() {
    this.transform = this.entity.getComponent("transform");
    this.rebuildBounds();
  }

  rebuildBounds() {
    const t = this.transform;

    this._bounds.x = t.position.x - (this.width * t.scale.x) / 2;
    this._bounds.y = t.position.y - (this.height * t.scale.y) / 2;
    this._bounds.width = this.width * t.scale.x;
    this._bounds.height = this.height * t.scale.y;

    this._dirty = false;
  }

  get bounds() {
    // 🔥 only rebuild if transform changed
    if (this.transform._dirty || this._dirty) {
      this.rebuildBounds();
    }
    return this._bounds;
  }

  containsPoint(x, y) {
    const b = this.bounds;
    return (
      x >= b.x &&
      x <= b.x + b.width &&
      y >= b.y &&
      y <= b.y + b.height
    );
  }
}