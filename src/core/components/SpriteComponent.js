import { Component } from "../Component.js";
import { RenderData } from "../../graphics/RenderData.js";

export class SpriteComponent extends Component {
  constructor(props = {}) {
    super();

    const {
      image = null,           // Image path or Image object
      width = 32,
      height = 32,
      sourceX = 0,            // Source rect in spritesheet
      sourceY = 0,
      sourceWidth = null,     // null = use width
      sourceHeight = null,    // null = use height
      anchor = { x: 0.5, y: 0.5 },  // Pivot point (0-1)
      flipX = false,
      flipY = false,
      tint = null,            // Color tint (hex string)
      alpha = 1.0,
      zIndex = 0
    } = props;

    this.image = image;
    this.width = width;
    this.height = height;
    this.sourceX = sourceX;
    this.sourceY = sourceY;
    // this.sourceWidth = sourceWidth || width;
    // this.sourceHeight = sourceHeight || height;
    this.sourceWidth = sourceWidth ?? null;
    this.sourceHeight = sourceHeight ?? null;
    this.anchor = anchor;
    this.flipX = flipX;
    this.flipY = flipY;
    this.tint = tint;
    this.alpha = alpha;
    this.zIndex = zIndex;

    // Internal
    this._imageElement = null;
    this._loaded = false;
    this._dirty = true; // 🔥 renderer dirty
    this.batchable = false;
  }

  init() {
    this.transform = this.entity.getComponent("transform");
    this.loadImage();
    this._cachedBounds = { x: 0, y: 0, width: 0, height: 0 };
    this._rd = new RenderData(); // cached — no allocation per frame
    this._rd.type = "sprite";
    this.batchable = false;      // sprites never batch
  }

  loadImage() {
    if (!this.image) return;

    if (typeof this.image === 'string') {
      this._imageElement = new Image();
      this._imageElement.onload = () => {
        this._loaded = true;

        if (this.sourceWidth === null)
          this.sourceWidth = this._imageElement.width;

        if (this.sourceHeight === null)
          this.sourceHeight = this._imageElement.height;
      };
      this._imageElement.onerror = () => {
        console.error(`Failed to load image: ${this.image}`);
      };
      this._imageElement.src = this.image;
    } else if (this.image instanceof Image) {
      this._imageElement = this.image;
      this._loaded = this._imageElement.complete;
    }
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
    if (!this._loaded || !this._imageElement) return null;
    const t = this.transform;
    if (!t) return null;

    if (t._dirty || this._dirty) {
      this._rd.x = t.position.x;
      this._rd.y = t.position.y;
      this._rd.z = t.position.z ?? 0;
      this._rd.rot = t.rotation.z;
      this._rd.scaleX = t.scale.x;
      this._rd.scaleY = t.scale.y;
      this._rd.flipX = this.flipX;
      this._rd.flipY = this.flipY;
      this._rd.width = this.width;
      this._rd.height = this.height;
      this._rd.anchorX = this.anchor.x;
      this._rd.anchorY = this.anchor.y;
      this._rd.alpha = this.alpha;
      this._rd.zIndex = this.zIndex;
      this._rd.tint = this.tint;

      // Texture data
      this._rd.texture = this._imageElement;
      this._rd.frameX = this.sourceX;
      this._rd.frameY = this.sourceY;
      this._rd.frameW = this.sourceWidth;
      this._rd.frameH = this.sourceHeight;

      t.clearDirty();
      this._dirty = false;
    }

    return this._rd;
  }
  
  // Helper to change sprite frame

  setFrame(x, y, width, height) {
    this.sourceX = x;
    this.sourceY = y;
    if (width !== undefined) this.sourceWidth = width;
    if (height !== undefined) this.sourceHeight = height;
  }

  setTint(tint) {
    // Invalidate old tint from cache before changing
    if (this._loaded && this.tint !== tint) {
      SpriteDrawer2D.invalidateTint(
        this._imageElement, this.tint,
        this.sourceX, this.sourceY,
        this.sourceWidth, this.sourceHeight
      );
    }
    this.tint = tint;
    this._dirty = true;
  }

  toJSON() {
    return {
      type: "SpriteComponent",
      image: this.image,
      width: this.width,
      height: this.height,
      sourceX: this.sourceX,
      sourceY: this.sourceY,
      sourceWidth: this.sourceWidth,
      sourceHeight: this.sourceHeight,
      anchor: this.anchor,
      flipX: this.flipX,
      flipY: this.flipY,
      tint: this.tint,
      alpha: this.alpha,
      zIndex: this.zIndex
    };
  }

  static fromJSON(data) {
    return new SpriteComponent(data);
  }


}