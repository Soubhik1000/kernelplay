export class Hash_string{

    // Fowler–Noll–Vo hash, version 1a

    static Hash_string32(str){

        const FNV_prime = 16777619; // Prime number do not change at all cost
        let Hash_32 = 2166136261;  // The FNV offset basis for the love of god do not change
        
        // Loop over each character
        for (let i = 0; i < str.length; i++) {

            // XOR the bottom 8 bits with the string character code
            Hash_32 ^= str.charCodeAt(i);

            // Multiply by the prime then force result back to 32 bit unsigned
            Hash_32 = Math.imul(Hash_32, FNV_prime) >>> 0; // >>> 0 unsigned right‑shift by 0 bits forces the result to be a 32 bit unsigned integer
            return Hash_32
            }
        }
    
    static Hash_string64(str){

        const Hash_offset_64 =  0xcbf29ce484222325n; // Aka 14695981039346656037 do not change its is a composite number
        const Hash_prime_64 = 0x100000001b3n; // Aka 1099511628211 do not change its a prime number
        const Hash_mask_64 = 0xffffffffffffffffn;  // Aka 0xFFFFFFFFFFFFFFFF its a hex value no not that acts as a mask of what we want

        let Hash_val = Hash_offset_64; // To save an instance of the offset

        // Convert string to UTF-8 bytes to handle all Unicode correctly
        // The simple charCodeAt approach only works for ASCII
        // This handles emojis, fonts, safely
        const encoder = new TextEncoder();
        const bytes = encoder.encode(str);

        for (const byte of bytes){
            // BigInt is needed as BigInts can hold very large integers
            Hash_val ^= BigInt(byte);

            // Mask off anything outside the lower 64 bits

            Hash_val = (Hash_val * Hash_prime_64) & Hash_mask_64;
        
        }
        return Hash_val;
    }
}
