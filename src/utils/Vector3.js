export class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

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

    static distance(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
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
}