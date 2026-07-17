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
    static remap(value,inMin,inMax,outMin,outMax){
        // To stop / by 0
        if (inMin === inMax) {
        return outMin;
    }
        const raw_t = (value - inMin) / (inMax - inMin)

        const clamped_t = Math.max(0,Math.min(1,raw_t))

        return outMin + (outMax - outMin) * clamped_t; // The standard Linear Interpolation formula
    }
    static warp_angle(degrees){
        if (!isFinite(degrees)) return 0; // To stop the worst case
        let warpped = degrees % 360

        if (warpped < 0 ) warpped += 360; // JS does not have true % like python to stop -num we add 360
        return warpped
    }

    static warp_radians(radians){
        if (typeof radians !== 'number' || !isFinite(radians)) {
        return 0;
    }
        let warpped =  radians %  6.283185307179586 // Its pi * 2 used 15 digits 
        if (warpped < 0) warpped +=  6.283185307179586 //JS does not have true % like python to stop -num we add pi * 2
        return warpped;

    }

}
