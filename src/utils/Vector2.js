export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    // -------- Static Methods --------

    static add(a, b) {
        return new Vector2(a.x + b.x, a.y + b.y);
    }

    static scale(v, s) {
        return new Vector2(v.x * s, v.y * s);
    }

    static sub(a, b) {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static normalize(v) {
        const len = Math.sqrt(v.x * v.x + v.y * v.y);
        if (len === 0) return new Vector2(0, 0);
        return new Vector2(v.x / len, v.y / len);
    }
}