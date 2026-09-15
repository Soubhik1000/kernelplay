export class RenderData {
  constructor() {
    this.type    = "none";   // "rect" | "circle" | "sprite" | "mesh" etc
    this.visible = true;
    this.zIndex  = 0;
    this.alpha   = 1.0;
    this.color   = "#ffffff";

    // Transform snapshot — filled by component each frame
    this.x      = 0;
    this.y      = 0;
    this.z      = 0;
    this.rot    = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.scaleZ = 1;
    this.flipX  = false;
    this.flipY  = false;

    // Shape-specific — each type fills what it needs
    this.width   = 0;
    this.height  = 0;
    this.depth   = 0;    // 3D
    this.radius  = 0;
    this.radiusX = 0;
    this.radiusY = 0;
    this.anchorX = 0.5;
    this.anchorY = 0.5;
    this.points  = [];   // polygon/line

    // Material
    this.filled      = true;
    this.strokeColor = "#ffffff";
    this.strokeWidth = 0;

    // Sprite / texture
    this.texture  = null;   // image / Three.js texture
    this.src      = null;
    this.frameX   = 0;
    this.frameY   = 0;
    this.frameW   = 0;
    this.frameH   = 0;
  }
}