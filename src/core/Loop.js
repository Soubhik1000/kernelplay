export class Loop {
  constructor({ update, fixedUpdate, render, fps = 60, calcRate = 60 }) {
    this.update = update;
    this.fixedUpdate = fixedUpdate;
    this.render = render;

    this.targetFPS = fps;
    this.frameInterval = 1000 / fps;

    this.calcRate = calcRate;
    this.calcInterval = 1000 / calcRate;
    this.fixedDeltaTime = 1 / calcRate;
    this.accumulator = 0;

    this.lastRenderTime = 0;
    this.lastCalcTime = 0;
    this.lastTime = 0;

    this.running = false;

    this._tick = this._tick.bind(this);
  }

  setCalcRate(hz) {
    this.calcRate = hz;
    this.calcInterval = 1000 / hz;
    this.fixedDeltaTime = 1 / hz;
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

    const dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    const clampedDt = Math.min(dt, 0.1);

    // 🛡️ tab switch fix
    if (currentTime - this.lastCalcTime > 1000) this.lastCalcTime = currentTime;
    if (currentTime - this.lastRenderTime > 1000) this.lastRenderTime = currentTime;

    // ⚙️ calc, always throttled to calcInterval
    if (currentTime - this.lastCalcTime >= this.calcInterval) {
      this.lastCalcTime += this.calcInterval;

      this.accumulator += clampedDt;

      while (this.accumulator >= this.fixedDeltaTime) {
        if (this.fixedUpdate) this.fixedUpdate(this.fixedDeltaTime);
        this.accumulator -= this.fixedDeltaTime;
      }

      if (this.update) this.update(clampedDt);
    }

    // 🎨 render, always throttled to frameInterval
    if (currentTime - this.lastRenderTime >= this.frameInterval) {
      this.lastRenderTime += this.frameInterval;
      const alpha = this.accumulator / this.fixedDeltaTime;
      if (this.render) this.render(alpha);
    }

    requestAnimationFrame(this._tick);
  }
}