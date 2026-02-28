export class Camera2D {
  constructor(width = 800, height = 600) {
    this.x = 0; // top-left
    this.y = 0;

    this.width = width;
    this.height = height;
  }

  get viewBounds() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
}