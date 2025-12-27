export class Loop {
  constructor(update, render) {
    this.update = update;
    this.render = render;
    this.lastTime = 0;
  }

  start() {
    requestAnimationFrame(this.tick.bind(this));
  }

  tick(time) {
    const dt = (time - this.lastTime) / 1000;
    this.lastTime = time;

    this.update(dt);
    this.render();

    requestAnimationFrame(this.tick.bind(this));
  }
}
