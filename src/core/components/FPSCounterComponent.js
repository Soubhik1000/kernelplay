import { Component } from "../Component.js";

export class FPSCounterComponent extends Component {
    constructor(x = 10, y = 20) {
        super();

        this.x = x;
        this.y = y;

        this.frames = 0;
        this.lastTime = performance.now();
        this.fps = 0;
    }

    update(dt) {
        this.frames++;

        const now = performance.now();

        if (now >= this.lastTime + 1000) {
            this.fps = this.frames;
            this.frames = 0;
            this.lastTime = now;
        }
    }

    render(ctx) {
        ctx.fillStyle = "black";
        ctx.font = "16px monospace";
        ctx.fillText(`FPS: ${this.fps}`, this.x, this.y);
    }
}