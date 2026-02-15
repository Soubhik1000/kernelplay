import { Component } from "../Component.js";

export class BoxRenderComponent extends Component {
  constructor(color = "#FF0000") {
    super();
    this.width = 50;
    this.height = 50;
    this.color = color;

    this._dirty = true; // 🔥 renderer dirty
  }

  init() {
    this.transform = this.entity.getComponent("transform");
    // 🔥 Cache bounds object to avoid creating new objects
    this._cachedBounds = { x: 0, y: 0, width: 0, height: 0 };
  }

  getBounds() {
    const t = this.transform;

    // 🔥 Only recalculate if dirty
    if (t._dirty || this._dirty) {
      const w = this.width * t.scale.x;
      const h = this.height * t.scale.y;

      this._cachedBounds.x = t.position.x - w * 0.5;
      this._cachedBounds.y = t.position.y - h * 0.5;
      this._cachedBounds.width = w;
      this._cachedBounds.height = h;
    }

    return this._cachedBounds; // 🔥 Reuse same object
  }

  render(ctx) {
    const t = this.transform;

    // 🔥 Update cached transform only if dirty
    if (t._dirty || this._dirty) {
      this._x = t.position.x;
      this._y = t.position.y;
      this._rot = t.rotation.z;
      this._sx = t.scale.x;
      this._sy = t.scale.y;

      t.clearDirty();
      this._dirty = false;
    }

    const halfW = this.width * 0.5;
    const halfH = this.height * 0.5;

    // 🔥 FAST PATH (no rotation, no scale)
    if (
      this._rot === 0 &&
      this._sx === 1 &&
      this._sy === 1
    ) {
      ctx.fillRect(
        this._x - halfW,
        this._y - halfH,
        this.width,
        this.height
      );
    }
    // 🔥 FULL TRANSFORM PATH
    else {
      ctx.save();

      ctx.translate(this._x, this._y);

      if (this._rot !== 0) {
        ctx.rotate(this._rot);
      }

      if (this._sx !== 1 || this._sy !== 1) {
        ctx.scale(this._sx, this._sy);
      }

      ctx.fillRect(
        -halfW,
        -halfH,
        this.width,
        this.height
      );

      ctx.restore();
    }
  }
}