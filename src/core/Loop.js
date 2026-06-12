export class Loop {
  constructor({ update, fixedUpdate, render, fps = 60, calcRate = 60, fixedRate = 60 }) {
    this.update = update;
    this.fixedUpdate = fixedUpdate;
    this.render = render;

    this.targetFPS = fps;
    this.frameInterval = 1000 / fps;

    this.calcRate = calcRate;
    this.calcInterval = 1000 / calcRate;
    this.accumulator = 0;


    this.fixedDeltaTime = 1 / fixedRate;
    this.fixedInterval = 1000 / fixedRate;
    this.lastFixedTime = 0;

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
    if (currentTime - this.lastFixedTime > 1000) this.lastFixedTime = currentTime;
    if (currentTime - this.lastRenderTime > 1000) this.lastRenderTime = currentTime;

    // ⚙️ variable update, throttled to calcRate
    if (currentTime - this.lastCalcTime >= this.calcInterval) {
      this.lastCalcTime += this.calcInterval;
      if (this.update) this.update(clampedDt);
    }

    // 🔧 fixed update, throttled to fixedRate
    if (currentTime - this.lastFixedTime >= this.fixedInterval) {
      this.lastFixedTime += this.fixedInterval;
      if (this.fixedUpdate) this.fixedUpdate(this.fixedDeltaTime);
    }

    // 🎨 render, throttled to frameRate
    if (currentTime - this.lastRenderTime >= this.frameInterval) {
      this.lastRenderTime += this.frameInterval;
      const alpha = (currentTime - this.lastFixedTime) / this.fixedInterval;
      if (this.render) this.render(alpha);
    }

    requestAnimationFrame(this._tick);
  }
}