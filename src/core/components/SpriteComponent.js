import { Component } from "../Component.js";

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
    this.sourceWidth = sourceWidth || width;
    this.sourceHeight = sourceHeight || height;
    this.anchor = anchor;
    this.flipX = flipX;
    this.flipY = flipY;
    this.tint = tint;
    this.alpha = alpha;
    this.zIndex = zIndex;
    
    // Internal
    this._imageElement = null;
    this._loaded = false;
  }
  
  init() {
    this.transform = this.entity.getComponent("transform");
    this.loadImage();
  }
  
  loadImage() {
    if (!this.image) return;
    
    if (typeof this.image === 'string') {
      this._imageElement = new Image();
      this._imageElement.onload = () => {
        this._loaded = true;
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
  
  render(ctx) {
    if (!this._loaded || !this._imageElement) return;
    if (!this.transform) return;
    
    const pos = this.transform.position;
    const scale = this.transform.scale;
    const rotation = this.transform.rotation.z;
    
    ctx.save();
    
    // Transform
    ctx.translate(pos.x, pos.y);
    ctx.rotate(rotation);
    ctx.scale(
      scale.x * (this.flipX ? -1 : 1),
      scale.y * (this.flipY ? -1 : 1)
    );
    
    // Anchor offset
    const offsetX = -this.width * this.anchor.x;
    const offsetY = -this.height * this.anchor.y;
    
    // Alpha
    ctx.globalAlpha = this.alpha;
    
    // Draw sprite
    ctx.drawImage(
      this._imageElement,
      this.sourceX, this.sourceY,           // Source position
      this.sourceWidth, this.sourceHeight,  // Source size
      offsetX, offsetY,                     // Destination position
      this.width, this.height               // Destination size
    );
    
    ctx.restore();
  }
  
  // Helper to change sprite frame
  setFrame(x, y, width, height) {
    this.sourceX = x;
    this.sourceY = y;
    if (width !== undefined) this.sourceWidth = width;
    if (height !== undefined) this.sourceHeight = height;
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