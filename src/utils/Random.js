export class Random {

    static range(min, max) {
        return Math.random() * (max - min) + min;
    }

    static int(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static SeedRand32(seed){
        const multiplier = 1103515245 // scales the previous state
        // 12345 is a odd number
        const increment = 12345; //shifts the state
        // This is the 32 bit int linit
        const mod = 2147483648; // determines the range of outputs

        //LCG formula
        let state = ((Math.imul(multiplier, seed) + increment) >>> 0) % mod;
        return state / mod;
    }

    static SeedRand64(seed){
        const multiplier = 1103515245n;
        const increment = 12345n;
        const mod = 2147483648n;

        
        let state;
        try {
            state = (multiplier * BigInt(seed) + increment) % mod;
        } catch {
            state = 0n; // fallback
        }

        if (state < 0n) state += mod;
        return Number(state) / Number(mod);
    }

}
