export class Canvas {
  constructor(config) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = config.width;
    this.canvas.height = config.height;
    // document.body.appendChild(this.canvas);

    let container;

    if (config.container) {
      // user provided a container — use it directly
      container = document.querySelector(config.container);
      if (!container) {
        console.warn(`KernelPlayJS: container "${config.container}" not found, creating one.`);
        container = this._createContainer();
      }
    } else {
      // no container specified — create our own wrapper div
      container = this._createContainer();
    }

    container.style.position = "relative";  // needed for UI canvas absolute positioning
    container.appendChild(this.canvas);

    // store reference so UICanvas can find it
    this.container = container;

    // this.ctx = this.canvas.getContext("2d");

    // this.ctx = this.canvas.getContext("2d");

    // // Fill background on init
    // this.ctx.fillStyle = config.backgroundColor;
    // this.ctx.fillRect(0, 0, config.width, config.height);
  }

  _createContainer() {
    const div = document.createElement("div");
    div.id = "kernelplay-container";
    document.body.appendChild(div);
    return div;
  }
}

