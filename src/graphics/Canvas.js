export class Canvas {
  constructor(config) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = config.width;
    this.canvas.height = config.height;
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");

    // Fill background on init
    this.ctx.fillStyle = config.backgroundColor;
    this.ctx.fillRect(0, 0, config.width, config.height);
  }
}
