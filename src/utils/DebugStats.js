export class DebugStats {
  // ─── State ────────────────────────────────────────────────────────────────
  fps         = 0;
  frameTime   = 0;
  avgFrame    = 0;
  cpuUsage    = 0;
  gcSpikes    = 0;

  #frames     = 0;
  #lastTime   = performance.now();
  #frameTimes = [];
  #frameStart = 0;

  // ─── GC detection (heuristic — large dt gaps = GC pause) ─────────────────
  #lastFrameTime = performance.now();
  #GC_THRESHOLD  = 50; // ms spike to count as GC

  constructor(game) {
    this.game = game;
  }

  // ─── Call at the very start of each frame ─────────────────────────────────
  beginFrame() {
    this.#frameStart = performance.now();

    // GC spike detection
    const gap = this.#frameStart - this.#lastFrameTime;
    if (gap > this.#GC_THRESHOLD) this.gcSpikes++;
    this.#lastFrameTime = this.#frameStart;
  }

  // ─── Call at the very end of each frame ───────────────────────────────────
  endFrame() {
    const now = performance.now();

    // Frame time
    this.frameTime = now - this.#frameStart;
    this.#frameTimes.push(this.frameTime);
    if (this.#frameTimes.length > 60) this.#frameTimes.shift();
    this.avgFrame = this.#frameTimes.reduce((a, b) => a + b, 0) / this.#frameTimes.length;

    // CPU usage — frame time as % of budget (16.67ms = 60fps)
    this.cpuUsage = Math.min((this.frameTime / 16.67) * 100, 100);

    // FPS counter
    this.#frames++;
    if (now >= this.#lastTime + 1000) {
      this.fps = Math.round((this.#frames * 1000) / (now - this.#lastTime));
      this.#frames   = 0;
      this.#lastTime = now;
      this.gcSpikes  = 0; // reset per second
    }
  }
}