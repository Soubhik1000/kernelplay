export class HashString {
    static HashString32(str) {
        // Prime number do not change at all cost
        const FNV_prime = 16777619;

        // The FNV offset basis for the love of god do not change
        let Hash_32 = 2166136261;

        // Loop over each character
        for (let i = 0; i < str.length; i++) {
            // XOR the bottom 8 bits with the string character code
            Hash_32 ^= str.charCodeAt(i);

            // Multiply by the prime then force result back to 32 bit unsigned
            // >>> 0 unsigned right‑shift by 0 bits forces the result to be a 32 bit unsigned integer
            Hash_32 = Math.imul(Hash_32, FNV_prime) >>> 0;
        }

        return Hash_32;
    }

    static HashString64(str) {
        // Aka 14695981039346656037 do not change its is a composite number
        const Hash_offset_64 = 0xcbf29ce484222325n;

        // Aka 1099511628211 do not change its a prime number
        const Hash_prime_64 = 0x100000001b3n;

        // Aka 0xFFFFFFFFFFFFFFFF its a hex value no not that acts as a mask of what we want
        const Hash_mask_64 = 0xffffffffffffffffn;

        // To save a insistence of the offset
        let Hash_val = Hash_offset_64;

        // Convert string to UTF-8 bytes to handle all Unicode correctly
        // The simple charCodeAt approach only works for ASCII
        // This handles emojis, fonts, safely
        const encoder = new TextEncoder();
        const bytes = encoder.encode(str);

        for (const byte of bytes) {
            // BigInt is needed as BigInts can hold very large integers
            Hash_val ^= BigInt(byte);

            // Mask off anything outside the lower 64 bits
            Hash_val = (Hash_val * Hash_prime_64) & Hash_mask_64;
        }

        return Hash_val;
    }
}
