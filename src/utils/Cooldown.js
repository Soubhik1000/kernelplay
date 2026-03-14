export class Cooldown {
    constructor(duration = 1) {
        this.duration = duration;
        this.time = duration; // ready at start
    }

    update(dt) {
        if (this.time < this.duration) {
            this.time += dt;
        }
    }

    canUse() {
        return this.time >= this.duration;
    }

    trigger() {
        if (!this.canUse()) return false;

        this.time = 0;
        return true;
    }

    reset() {
        this.time = this.duration;
    }

    progress() {
        return Math.min(this.time / this.duration, 1);
    }
}