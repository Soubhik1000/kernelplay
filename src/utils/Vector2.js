export class Vector2 {

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    clone() {
        return new Vector2(this.x, this.y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    lengthSq() {
        return this.x * this.x + this.y * this.y;
    }

    angle() {
        return Math.atan2(this.y, this.x);
    }

    normalize() {
        const len = this.length();
        if (len === 0) return this;
        this.x /= len;
        this.y /= len;
        return this;
    }

    // -------- Static Methods --------

    static add(a, b) {
        return new Vector2(a.x + b.x, a.y + b.y);
    }

    static sub(a, b) {
        return new Vector2(a.x - b.x, a.y - b.y);
    }

    static scale(v, s) {
        return new Vector2(v.x * s, v.y * s);
    }

    static normalize(v) {
        const len = Math.sqrt(v.x * v.x + v.y * v.y);

        if (len === 0) {
            return new Vector2();
        }

        return new Vector2(
            v.x / len,
            v.y / len
        );
    }

    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static distanceSq(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return dx * dx + dy * dy;
    }

    static dot(a, b) {
        return a.x * b.x + a.y * b.y;
    }

    static lerp(a, b, t) {
        return new Vector2(
            a.x + (b.x - a.x) * t,
            a.y + (b.y - a.y) * t
        );
    }
    
    static Magnitude(v) {
        return Math.sqrt(v.x ** 2 + v.y ** 2);
    }
    
    static MagnitudeSq(v){
        return v.x ** 2 + v.y ** 2;
    }

    static Reflect(incident, normal) {
    // Dot product: incident * normal 
    const dot = incident.x * normal.x + incident.y * normal.y; 
    
    // R = V - 2 * (V * N) * N 
    return new Vector2( 
        incident.x - 2 * dot * normal.x, 
        incident.y - 2 * dot * normal.y 
    ); 
    }
}
