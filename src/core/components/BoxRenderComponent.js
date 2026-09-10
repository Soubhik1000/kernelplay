import { Component } from "../Component.js";

export class BoxRenderComponent extends Component {
  constructor({
    color = "#FF0000",
    zIndex = 0
  }) {
    super();
    this.width = 50;
    this.height = 50;
    this.color = color;
    this.zIndex = zIndex; // 🔥 ADD THIS

    this._dirty = true; // 🔥 renderer dirty
    this.batchable = true;
    this.type = "box";
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

  getRenderData() {
    const t = this.transform;

    if (!this._renderData) {
      this._renderData = {
        type: "box",
        x: 0,
        y: 0,
        rot: 0,
        scaleX: 1,
        scaleY: 1,
        width: 0,
        height: 0,
        color: null,
        zIndex: 0,
      };
    }

    if (t._dirty || this._dirty) {
      const data = this._renderData;

      data.x = t.position.x;
      data.y = t.position.y;
      data.rot = t.rotation.z;
      data.scaleX = t.scale.x;
      data.scaleY = t.scale.y;

      data.width = this.width;
      data.height = this.height;
      data.color = this.color;
      data.zIndex = this.zIndex;

      t.clearDirty();
      this._dirty = false;
    }

    return this._renderData;
  }

  // render(ctx) {
  //   const t = this.transform;

  //   // 🔥 Update cached transform only if dirty
  //   if (t._dirty || this._dirty) {
  //     this._x = t.position.x;
  //     this._y = t.position.y;
  //     this._rot = t.rotation.z;
  //     this._sx = t.scale.x;
  //     this._sy = t.scale.y;

  //     t.clearDirty();
  //     this._dirty = false;
  //   }

  //   const halfW = this.width * 0.5;
  //   const halfH = this.height * 0.5;

  //   // 🔥 FAST PATH (no rotation, no scale)
  //   if (
  //     this._rot === 0 &&
  //     this._sx === 1 &&
  //     this._sy === 1
  //   ) {
  //     ctx.fillRect(
  //       this._x - halfW,
  //       this._y - halfH,
  //       this.width,
  //       this.height
  //     );
  //   }
  //   // 🔥 FULL TRANSFORM PATH
  //   else {
  //     ctx.save();

  //     ctx.translate(this._x, this._y);

  //     if (this._rot !== 0) {
  //       ctx.rotate(this._rot);
  //     }

  //     if (this._sx !== 1 || this._sy !== 1) {
  //       ctx.scale(this._sx, this._sy);
  //     }

  //     ctx.fillRect(
  //       -halfW,
  //       -halfH,
  //       this.width,
  //       this.height
  //     );

  //     ctx.restore();
  //   }
  // }
}