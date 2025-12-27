export class Loop {
  constructor({ update, render }) {
    this.update = update;
    this.render = render;

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

  _tick(time) {
    if (!this.running) return;

    const delta = (time - this.lastTime) / 1000; // seconds
    this.lastTime = time;

    if (this.update) this.update(delta);
    if (this.render) this.render();

    requestAnimationFrame(this._tick);
  }
}
