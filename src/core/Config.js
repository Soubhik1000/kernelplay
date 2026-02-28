export class Config {
  constructor(options = {}) {
    this.width = options.width || 800;
    this.height = options.height || 600;
    this.fps = options.fps || 60; // target FPS
    this.backgroundColor = options.backgroundColor || "#ffffff";

    this.gravity = 980;
    this.debugPhysics = options.debugPhysics;

    // Add more defaults here in future (e.g., gravity, scale)
  }
}
