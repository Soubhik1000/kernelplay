export class Loop {
  constructor({ update, render, fps = 60 }) {
    this.update = update;
    this.render = render;

    this.running = false;

    this.fps = fps;
    this.frameDuration = 1000 / fps; // ms per update step

    this.lastTime = 0;
    this.accumulator = 0;

    this._tick = this._tick.bind(this);
  }

  start() {
    if (this.running) return;

    this.running = true;
    this.lastTime = performance.now();
    this.accumulator = 0;

    requestAnimationFrame(this._tick);
  }

  stop() {
    this.running = false;
  }

  _tick(currentTime) {
    if (!this.running) return;

    // 🔥 Calculate delta
    let deltaTime = currentTime - this.lastTime;

    // 🛡️ Prevent spiral of death (tab switch / lag spike)
    if (deltaTime > 100) deltaTime = 100;

    this.lastTime = currentTime;
    this.accumulator += deltaTime;

    // 🔁 Fixed update loop
    while (this.accumulator >= this.frameDuration) {
      const dtSeconds = this.frameDuration / 1000;

      if (this.update) this.update(dtSeconds);

      this.accumulator -= this.frameDuration;
    }

    // 🎨 Render (runs every frame, smooth)
    if (this.render) this.render();

    requestAnimationFrame(this._tick);
  }
}