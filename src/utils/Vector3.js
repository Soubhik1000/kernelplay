export class Vector3 {

    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // ---------- Instance Methods ----------

    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    clone() {
        return new Vector3(this.x, this.y, this.z);
    }

    length() {
        return Math.sqrt(
            this.x * this.x +
            this.y * this.y +
            this.z * this.z
        );
    }

    normalize() {
        const len = this.length();

        if (len === 0) return this;

        this.x /= len;
        this.y /= len;
        this.z /= len;

        return this;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    scale(s) {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }

    // ---------- Static Methods ----------

    static add(a, b) {
        return new Vector3(
            a.x + b.x,
            a.y + b.y,
            a.z + b.z
        );
    }

    static sub(a, b) {
        return new Vector3(
            a.x - b.x,
            a.y - b.y,
            a.z - b.z
        );
    }

    static scale(v, s) {
        return new Vector3(
            v.x * s,
            v.y * s,
            v.z * s
        );
    }

    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;

        return Math.sqrt(
            dx * dx +
            dy * dy +
            dz * dz
        );
    }

    static dot(a, b) {
        return (
            a.x * b.x +
            a.y * b.y +
            a.z * b.z
        );
    }

    static cross(a, b) {
        return new Vector3(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x
        );
    }

    static normalize(v) {
        const len = Math.sqrt(
            v.x * v.x +
            v.y * v.y +
            v.z * v.z
        );

        if (len === 0) return new Vector3(0, 0, 0);

        return new Vector3(
            v.x / len,
            v.y / len,
            v.z / len
        );
    }

    static lerp(a, b, t) {
        return new Vector3(
            a.x + (b.x - a.x) * t,
            a.y + (b.y - a.y) * t,
            a.z + (b.z - a.z) * t
        );
    }

    // ---------- Constants ----------

    static ZERO = new Vector3(0, 0, 0);
    static ONE = new Vector3(1, 1, 1);

}