export class Loop {
  constructor({ update, render, fps = 60 }) {
    this.update = update;
    this.render = render;

    this.targetFPS = fps;
    this.frameInterval = 1000 / fps;

    this.lastRenderTime = 0;

    this.running = false;
    this.lastTime = 0;

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

  // _tick(currentTime) {
  //   if (!this.running) return;

  //   let dt = (currentTime - this.lastTime) / 1000;

  //   // 🛡️ tab fix
  //   if (dt > 1) dt = 0;

  //   this.lastTime = currentTime;

  //   if (this.update) this.update(dt);
  //   if (this.render) this.render();

  //   requestAnimationFrame(this._tick);
  // }

  // _tick(currentTime) {
  //   if (!this.running) return;

  //   const dt = (currentTime - this.lastTime) / 1000;
  //   this.lastTime = currentTime;

  //   if (this.update) this.update(dt);

  //   // 🔥 throttle render
  //   if (currentTime - this.lastRenderTime >= this.frameInterval) {
  //     this.lastRenderTime += this.frameInterval;

  //     if (this.render) this.render();
  //   }

  //   requestAnimationFrame(this._tick);
  // }

  _tick(currentTime) {
    if (!this.running) return;

    const dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    if (this.update) this.update(dt);

    // 🛡️ tab switch fix
    if (currentTime - this.lastRenderTime > 1000) {
      this.lastRenderTime = currentTime;
    }

    // 🔥 stable FPS throttle
    if (currentTime - this.lastRenderTime >= this.frameInterval) {
      this.lastRenderTime += this.frameInterval;

      if (this.render) this.render();
    }

    requestAnimationFrame(this._tick);
  }
}