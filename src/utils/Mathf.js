export class Mathf {

    static clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    }

    static lerp(a, b, t) {
        return a + (b - a) * t;
    }

    static degToRad(deg) {
        return deg * (Math.PI / 180);
    }

    static radToDeg(rad) {
        return rad * (180 / Math.PI);
    }

}