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

    static remap(value, inMin, inMax, outMin, outMax) {
        // Prevent division by zero
        if (inMin === inMax) {
            return outMin;
        }
        
        const rawT = (value - inMin) / (inMax - inMin);
        const clampedT = Math.max(0, Math.min(1, rawT));

        return outMin + (outMax - outMin) * clampedT; // The standard clamped Linear Interpolation formula
    }

    static wrapAngle(degrees) {
        // Added type check to match the radians function
        if (typeof degrees !== 'number' || !isFinite(degrees)) {
            return 0; 
        }
        
        let wrapped = degrees % 360;

        if (wrapped < 0) wrapped += 360; 
        return wrapped;
    }

    static wrapRadians(radians) {
        if (typeof radians !== 'number' || !isFinite(radians)) {
            return 0;
        }
        
        const TWO_PI = Math.PI * 2;
        let wrapped = radians % TWO_PI;
        
        if (wrapped < 0) wrapped += TWO_PI; 
        return wrapped;
    }

    static RoundToNearest(value,multiple){
        return Math.round(value/multiple) * multiple;
    }

    static CeilToNearest(value,multiple){
        return Math.ceil(value/multiple) * multiple;
    }

    static FloorToNearest(value,multiple){
        return Math.floor(value/multiple) * multiple;
    }

    static pingPong(value,lenght){
        const p = value % (lenght*2)
        // If p >= length, we're on the downward part → length * 2 - p maps length → length and length * 2 → 0.
        return  P < lenght ?  P : lenght * 2 - P; 
    }
    static MidPoint(MinValue,MaxValue){
        return (MinValue + MaxValue) / 2
    }

}
