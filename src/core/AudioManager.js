export class AudioManager {
    constructor() {
        this.cache = new Map();

        // 🔥 listener is always a plain object (NO Proxy)
        this.listener = { x: 0, y: 0 };
    }

    // 🔥 Load & cache
    load(src) {
        if (this.cache.has(src)) return this.cache.get(src);

        const audio = new Audio(src);
        audio.preload = "auto";

        this.cache.set(src, audio);
        return audio;
    }

    // 🔊 PLAY SFX (supports overlapping)
    play(src, options = {}) {
        const {
            volume = 1,
            playbackRate = 1,
            position = null
        } = options;

        const base = this.load(src);

        // 🔥 clone for overlapping sounds
        const audio = base.cloneNode(true);

        // 🔥 reset
        audio.currentTime = 0;
        audio.loop = false;
        audio.playbackRate = playbackRate;

        // 🔥 spatial volume
        let finalVolume = volume;

        if (this.listener && position) {
            const dx = position.x - this.listener.x;
            const dy = position.y - this.listener.y;
            const distSq = dx * dx + dy * dy;

            const maxDist = 800;
            const falloff = Math.max(0, 1 - distSq / (maxDist * maxDist));

            finalVolume *= falloff;
        }

        audio.volume = finalVolume;

        audio.play().catch(() => {});

        return audio;
    }

    // 🎵 PLAY LOOP (music / ambient)
    playLoop(src, options = {}) {
        const {
            volume = 1,
            playbackRate = 1
        } = options;

        const audio = this.load(src);

        // 🔥 IMPORTANT: no clone for loop
        audio.currentTime = 0;
        audio.loop = true;
        audio.playbackRate = playbackRate;
        audio.volume = volume;

        audio.play().catch(() => {});

        return audio;
    }

    stop(audio) {
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
    }

    stopAll() {
        for (const audio of this.cache.values()) {
            audio.pause();
            audio.currentTime = 0;
        }
    }

    // 🔥 auto-sync with camera (BEST DESIGN)
    updateListener(scene) {
        const cam = scene.getPrimaryCamera();
        if (!cam) return;

        this.listener.x = cam.position.x;
        this.listener.y = cam.position.y;
    }
}