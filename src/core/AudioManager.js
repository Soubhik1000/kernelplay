export class AudioManager {
    constructor() {
        this.cache = new Map();
        this.listener = null; // 🔥 active listener
    }

    load(src) {
        if (this.cache.has(src)) return this.cache.get(src);

        const audio = new Audio(src);
        audio.preload = "auto";
        this.cache.set(src, audio);

        return audio;
    }

    play(src, options = {}) {
        const {
            volume = 1,
            loop = false,
            playbackRate = 1,
            position = null // 🔥 world position
        } = options;

        const base = this.load(src);
        const audio = base.cloneNode();

        // 🔥 spatial volume
        let finalVolume = volume;

        if (this.listener && position) {
            const dx = position.x - this.listener.x;
            const dy = position.y - this.listener.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            const maxDist = 500;
            const falloff = Math.max(0, 1 - dist / maxDist);

            finalVolume *= falloff;
        }

        audio.volume = finalVolume;
        audio.loop = loop;
        audio.playbackRate = playbackRate;

        audio.play().catch(() => {});

        return audio;
    }
}