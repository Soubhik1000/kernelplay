export class Config {
  constructor(options = {}) {
    this.width = options.width || 800;
    this.height = options.height || 600;
    this.fps = options.fps || 60; // target FPS
    this.backgroundColor = options.backgroundColor || "#ffffff";

    // Add more defaults here in future (e.g., gravity, scale)
  }
}
