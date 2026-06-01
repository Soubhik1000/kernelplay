/**
 * AudioManager
 * 
 * Attached to game.audio — handles all playback, spatial volume,
 * and background music. Uses Web Audio API (GainNode) so volume
 * updates happen every frame without gaps or stutters.
 */
export class AudioManager {
    constructor() {
        this._ctx = null;   // AudioContext — created on first interaction
        this._masterGain = null;
        this._bgmGain = null;   // separate gain chain for BGM (never spatialized)
        this._sfxGain = null;   // separate gain chain for SFX

        // listener world position — set by AudioListener component every frame
        this.listener = { x: 0, y: 0 };

        // { clip: string → AudioBuffer }
        this._buffers = new Map();

        // active spatial sources  [{ sourceNode, gainNode, position: {x,y} }]
        this._spatialSources = [];

        // active BGM  { sourceNode, gainNode, buffer, loop }
        this._bgm = null;

        // config
        this.maxDistance = 800;   // pixels — beyond this volume = 0
        this.rolloff = 1.5;   // higher = steeper distance fade

        this.masterVolume = 1.0;
        this.sfxVolume = 1.0;
        this.bgmVolume = 1.0;
    }

    // ─────────────────────────────────────────────────────────────
    //  INIT  (call once per frame from game loop, or lazily)
    // ─────────────────────────────────────────────────────────────

    _ensureContext() {
        if (this._ctx) return;

        this._ctx = new (window.AudioContext || window.webkitAudioContext)();
        this._masterGain = this._ctx.createGain();
        this._masterGain.connect(this._ctx.destination);

        this._bgmGain = this._ctx.createGain();
        this._bgmGain.connect(this._masterGain);

        this._sfxGain = this._ctx.createGain();
        this._sfxGain.connect(this._masterGain);

        this._applyVolumes();
    }

    _applyVolumes() {
        if (!this._ctx) return;
        const t = this._ctx.currentTime;
        this._masterGain.gain.setTargetAtTime(this.masterVolume, t, 0.01);
        this._bgmGain.gain.setTargetAtTime(this.bgmVolume, t, 0.01);
        this._sfxGain.gain.setTargetAtTime(this.sfxVolume, t, 0.01);
    }

    // ─────────────────────────────────────────────────────────────
    //  LOAD
    // ─────────────────────────────────────────────────────────────

    /**
     * Pre-load an audio file into a decoded AudioBuffer.
     * Call this in your scene's init() for zero-delay playback.
     * 
     * @param {string} clip  — path or URL to audio file
     * @returns {Promise<AudioBuffer>}
     */
    async load(clip) {
        if (this._buffers.has(clip)) return this._buffers.get(clip);

        this._ensureContext();

        const response = await fetch(clip);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this._ctx.decodeAudioData(arrayBuffer);

        this._buffers.set(clip, audioBuffer);
        return audioBuffer;
    }

    /**
     * Pre-load multiple clips at once.
     * await game.audio.loadAll(["sfx/shoot.wav", "sfx/explode.wav"]);
     */
    async loadAll(clips) {
        await Promise.all(clips.map(c => this.load(c)));
    }

    // ─────────────────────────────────────────────────────────────
    //  PLAY — SFX (spatialized, one-shot)
    // ─────────────────────────────────────────────────────────────

    /**
     * Play a one-shot SFX at a world position.
     * Volume fades with distance from AudioListener.
     * Returns a handle { stop() } so caller can cancel early.
     *
     * @param {string}  clip
     * @param {object}  options
     * @param {number}  options.volume    — 0..1, local multiplier
     * @param {{x,y}}   options.position  — world position (pass transform.position)
     */
    play(clip, { volume = 1, position = null } = {}) {
        this._ensureContext();

        const buffer = this._buffers.get(clip);
        if (!buffer) {
            // Not pre-loaded — load and play (small delay on first call)
            this.load(clip).then(() => this.play(clip, { volume, position }));
            return _noop();
        }

        const gainNode = this._ctx.createGain();
        const sourceNode = this._ctx.createBufferSource();
        sourceNode.buffer = buffer;
        sourceNode.loop = false;

        gainNode.connect(this._sfxGain);
        sourceNode.connect(gainNode);

        const entry = { sourceNode, gainNode, position: position ? { ...position } : null, volume };

        // set initial volume
        const spatialVol = position ? this._spatialVolume(position) : 1;
        gainNode.gain.setValueAtTime(volume * spatialVol, this._ctx.currentTime);

        sourceNode.start();
        this._spatialSources.push(entry);

        sourceNode.onended = () => {
            this._spatialSources = this._spatialSources.filter(e => e !== entry);
            gainNode.disconnect();
        };

        return {
            stop: () => { try { sourceNode.stop(); } catch (_) { } }
        };
    }

    // ─────────────────────────────────────────────────────────────
    //  PLAY LOOP — looping SFX / ambient (spatialized)
    // ─────────────────────────────────────────────────────────────

    /**
     * Play a looping sound at a world position (ambient, engine hum, etc.).
     * Volume updates every frame based on listener distance.
     * Returns a handle { stop() }.
     *
     * FIX: previously loop sounds had no position passed → no distance fade.
     * FIX: Web Audio API loop has zero gap (unlike HTMLAudioElement).
     */
    playLoop(clip, { volume = 1, position = null } = {}) {
        this._ensureContext();

        const buffer = this._buffers.get(clip);
        if (!buffer) {
            this.load(clip).then(() => this.playLoop(clip, { volume, position }));
            return _noop();
        }

        const gainNode = this._ctx.createGain();
        const sourceNode = this._ctx.createBufferSource();
        sourceNode.buffer = buffer;
        sourceNode.loop = true;   // Web Audio loop — no gap, no delay

        gainNode.connect(this._sfxGain);
        sourceNode.connect(gainNode);

        const entry = { sourceNode, gainNode, position: position ? { ...position } : null, volume };

        const spatialVol = position ? this._spatialVolume(position) : 1;
        gainNode.gain.setValueAtTime(volume * spatialVol, this._ctx.currentTime);

        sourceNode.start();
        this._spatialSources.push(entry);

        return {
            stop: () => {
                try { sourceNode.stop(); } catch (_) { }
                this._spatialSources = this._spatialSources.filter(e => e !== entry);
                gainNode.disconnect();
            },
            // update world position if the emitter moves
            setPosition: (pos) => { entry.position = { ...pos }; }
        };
    }

    // ─────────────────────────────────────────────────────────────
    //  BGM — background music (never spatialized)
    // ─────────────────────────────────────────────────────────────

    /**
     * Play background music. Always full volume regardless of distance.
     * Only one BGM track at a time. Crossfades when switching.
     *
     * @param {string}  clip
     * @param {object}  options
     * @param {boolean} options.loop          — default true
     * @param {number}  options.fadeDuration  — seconds to crossfade (default 1.0)
     * @param {number}  options.volume        — 0..1
     */
    playBGM(clip, { loop = true, fadeDuration = 1.0, volume = 1 } = {}) {
        this._ensureContext();

        const startNew = (buffer) => {
            const gainNode = this._ctx.createGain();
            const sourceNode = this._ctx.createBufferSource();
            sourceNode.buffer = buffer;
            sourceNode.loop = loop;

            gainNode.connect(this._bgmGain);
            sourceNode.connect(gainNode);

            // fade in
            gainNode.gain.setValueAtTime(0, this._ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume, this._ctx.currentTime + fadeDuration);

            sourceNode.start();
            this._bgm = { sourceNode, gainNode, volume };
        };

        // fade out existing BGM
        if (this._bgm) {
            const old = this._bgm;
            const t = this._ctx.currentTime;
            old.gainNode.gain.linearRampToValueAtTime(0, t + fadeDuration);
            setTimeout(() => {
                try { old.sourceNode.stop(); } catch (_) { }
                old.gainNode.disconnect();
            }, fadeDuration * 1000);
            this._bgm = null;
        }

        const buffer = this._buffers.get(clip);
        if (buffer) {
            startNew(buffer);
        } else {
            this.load(clip).then(buf => startNew(buf));
        }
    }

    /** Stop BGM with optional fade. */
    stopBGM(fadeDuration = 1.0) {
        if (!this._bgm) return;
        const old = this._bgm;
        const t = this._ctx.currentTime;
        old.gainNode.gain.linearRampToValueAtTime(0, t + fadeDuration);
        setTimeout(() => {
            try { old.sourceNode.stop(); } catch (_) { }
            old.gainNode.disconnect();
        }, fadeDuration * 1000);
        this._bgm = null;
    }

    // ─────────────────────────────────────────────────────────────
    //  VOLUME CONTROLS
    // ─────────────────────────────────────────────────────────────

    setMasterVolume(v) { this.masterVolume = v; this._applyVolumes(); }
    setSFXVolume(v) { this.sfxVolume = v; this._applyVolumes(); }
    setBGMVolume(v) { this.bgmVolume = v; this._applyVolumes(); }

    // ─────────────────────────────────────────────────────────────
    //  UPDATE — called every frame by the game loop
    // ─────────────────────────────────────────────────────────────

    /**
     * Call this inside your game loop each frame.
     * Updates spatial volume for all active SFX sources.
     * BGM is intentionally skipped — it never fades with distance.
     */
    update() {
        // console.log('hi');

        if (!this._ctx) return;

        for (const entry of this._spatialSources) {
            if (!entry.position) continue;  // non-spatial source — skip

            const vol = entry.volume * this._spatialVolume(entry.position);

            // smooth ramp avoids clicks — 10ms smoothing window
            entry.gainNode.gain.setTargetAtTime(vol, this._ctx.currentTime, 0.01);
        }
    }

    // ─────────────────────────────────────────────────────────────
    //  INTERNAL
    // ─────────────────────────────────────────────────────────────

    /**
     * Calculate 0..1 volume multiplier based on distance from listener.
     * Uses inverse power falloff: vol = 1 / (1 + rolloff * normalizedDist)
     */
    _spatialVolume(position) {
        const dx = position.x - this.listener.x;
        const dy = position.y - this.listener.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist >= this.maxDistance) return 0;

        // smooth inverse falloff
        const t = dist / this.maxDistance;
        return Math.max(0, 1 - Math.pow(t, this.rolloff));
    }

    stopAll() {
        for (const entry of this._spatialSources) {
            try { entry.sourceNode.stop(); } catch (_) { }
            entry.gainNode.disconnect();
        }
        this._spatialSources = [];
        this.stopBGM(0);   // instant stop, no fade
    }
}

// returns a no-op handle for when buffer isn't ready yet
function _noop() {
    return { stop: () => { }, setPosition: () => { } };
}