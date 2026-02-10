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
  }

  render(ctx) {
    if (this.transform._dirty || this._dirty) {
      // rebuild cached transform
      this._x = this.transform.position.x;
      this._y = this.transform.position.y;
      this._rot = this.transform.rotation.z;
      this._sx = this.transform.scale.x;
      this._sy = this.transform.scale.y;

      this.transform.clearDirty();
      this._dirty = false;
    }

    // ALWAYS DRAW
    ctx.save();
    ctx.translate(this._x, this._y);
    ctx.rotate(this._rot);
    ctx.scale(this._sx, this._sy);

    ctx.fillStyle = this.color;
    ctx.fillRect(
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );

    ctx.restore();
  }
}