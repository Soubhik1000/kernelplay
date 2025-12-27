export class Loop {
  constructor({ update, render, fps = 60 }) {
    this.update = update;
    this.render = render;

    this.running = false;
    this.lastTime = 0;

    this.fps = fps;
    this.frameDuration = 1000 / this.fps; // ms per frame

    this._tick = this._tick.bind(this);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this._tick);
  }

  stop() {
    this.running = false;
  }

  _tick(currentTime) {
    if (!this.running) return;

    const deltaTime = currentTime - this.lastTime;

    if (deltaTime >= this.frameDuration) {
      this.lastTime = currentTime;

      const dtSeconds = deltaTime / 1000;

      if (this.update) this.update(dtSeconds);
      if (this.render) this.render();
    }

    requestAnimationFrame(this._tick);
  }
}
