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

    this.timeScale = 1.0; // 1.0 = normal, 0.5 = slow-mo, 0 = paused, 2.0 = fast-forward
    this.maxDt = 0.1;     // Cap raw dt at 100ms to prevent tunneling on lag spikes

    this._tick = this._tick.bind(this);
  }

  setCalcRate(hz) {
    this.calcRate = hz;
    this.calcInterval = 1000 / hz;
    this.fixedDeltaTime = 1 / hz;
  }

  // start() {
  //   if (this.running) return;

  //   this.running = true;
  //   this.lastTime = performance.now();

  //   requestAnimationFrame(this._tick);
  // }

  start() {
    if (this.running) return;

    this.running = true;
    const now = performance.now();
    this.lastTime = now;
    this.lastCalcTime = now;
    this.lastRenderTime = now;
    this.accumulator = 0;

    requestAnimationFrame(this._tick);
  }

  stop() {
    this.running = false;
  }

  setTimeScale(scale) {
    // Prevent negative time
    this.timeScale = Math.max(0, scale);
  }

  // _tick(currentTime) {
  //   if (!this.running) return;

  //   const dt = (currentTime - this.lastTime) / 1000;
  //   this.lastTime = currentTime;

  //   const clampedDt = Math.min(dt, 0.1);

  //   // 🛡️ tab switch fix
  //   if (currentTime - this.lastCalcTime > 1000) this.lastCalcTime = currentTime;
  //   if (currentTime - this.lastFixedTime > 1000) this.lastFixedTime = currentTime;
  //   if (currentTime - this.lastRenderTime > 1000) this.lastRenderTime = currentTime;

  //   // ⚙️ variable update, throttled to calcRate
  //   if (currentTime - this.lastCalcTime >= this.calcInterval) {
  //     this.lastCalcTime += this.calcInterval;
  //     if (this.update) this.update(clampedDt);
  //   }

  //   // 🔧 fixed update, throttled to fixedRate
  //   if (currentTime - this.lastFixedTime >= this.fixedInterval) {
  //     this.lastFixedTime += this.fixedInterval;
  //     if (this.fixedUpdate) this.fixedUpdate(this.fixedDeltaTime);
  //   }

  //   // 🎨 render, throttled to frameRate
  //   if (currentTime - this.lastRenderTime >= this.frameInterval) {
  //     this.lastRenderTime += this.frameInterval;
  //     const alpha = (currentTime - this.lastFixedTime) / this.fixedInterval;
  //     if (this.render) this.render(alpha);
  //   }

  //   requestAnimationFrame(this._tick);
  // }

  _tick(currentTime) {
    if (!this.running) return;

    const rawDt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // 1. Clamp rawDt BEFORE scaling so fast-forward isn't capped
    const unscaledDt = Math.min(rawDt, this.maxDt);
    const scaledDt = unscaledDt * this.timeScale;

    // Tab switch guard
    if (currentTime - this.lastCalcTime > 1000) this.lastCalcTime = currentTime;
    if (currentTime - this.lastRenderTime > 1000) this.lastRenderTime = currentTime;

    // 2. Variable update (pass both scaled and unscaled)
    if (currentTime - this.lastCalcTime >= this.calcInterval) {
      this.lastCalcTime += this.calcInterval;
      if (this.update) this.update(scaledDt, unscaledDt);
    }

    // 3. Fixed update driven by scaledDt accumulator
    // if (this.timeScale > 0) {
    //   this.accumulator += scaledDt;

    //   // Safety cap prevents spiral of death at very high timeScale
    //   let steps = 0;
    //   const maxSteps = 10;

    //   while (this.accumulator >= this.fixedDeltaTime && steps < maxSteps) {
    //     if (this.fixedUpdate) this.fixedUpdate(this.fixedDeltaTime);
    //     this.accumulator -= this.fixedDeltaTime;
    //     steps++;
    //   }
    // }
    // 3. Fixed update driven by scaledDt accumulator
    if (this.timeScale > 0) {
      // Scale fixed step down in slow-mo for silky 1:1 frames,
      // but keep it at base fixedDeltaTime for fast-forward (> 1)
      const effectiveFixedDt = this.fixedDeltaTime * Math.min(1, this.timeScale);

      this.accumulator += scaledDt;

      let steps = 0;
      const maxSteps = 10;

      while (this.accumulator >= effectiveFixedDt && steps < maxSteps) {
        if (this.fixedUpdate) this.fixedUpdate(effectiveFixedDt);
        this.accumulator -= effectiveFixedDt;
        steps++;
      }
    }

    // 4. Render (always runs even when paused)
    if (currentTime - this.lastRenderTime >= this.frameInterval) {
      this.lastRenderTime += this.frameInterval;
      const alpha = this.accumulator / this.fixedDeltaTime;
      if (this.render) this.render(alpha);
    }

    requestAnimationFrame(this._tick);
  }
}