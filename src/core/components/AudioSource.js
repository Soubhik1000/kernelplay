import { Component } from "../Component.js";

export class AudioSource extends Component {
    constructor({
        clip = null,
        volume = 1,
        loop = false,
        playOnStart = false
    } = {}) {
        super();

        this.clip = clip;
        this.volume = volume;
        this.loop = loop;
        this.playOnStart = playOnStart;

        this._instances = [];
    }

    init() {
        this.transform = this.entity.getComponent("transform");
    }

    start() {
        if (this.playOnStart) {
            this.play();
        }
    }

    // 🔊 play default clip
    play() {
        if (!this.clip) return;

        if (this.loop) {
            return this.playLoop(this.clip);
        } else {
            return this.playOneShot(this.clip);
        }
    }

    // 🔥 SFX (overlapping)
    playOneShot(clip, options = {}) {
        const audio = this.entity.scene.game.audio.play(clip, {
            volume: options.volume ?? this.volume,
            position: this.transform?.position
        });

        this._instances.push(audio);

        // cleanup
        audio.onended = () => {
            this._instances = this._instances.filter(a => a !== audio);
        };

        return audio;
    }

    // 🎵 Looping sound (music / ambient)
    playLoop(clip, options = {}) {
        const audio = this.entity.scene.game.audio.playLoop(clip, {
            volume: options.volume ?? this.volume
        });

        this._instances.push(audio);
        return audio;
    }

    stopAll() {
        for (const a of this._instances) {
            a.pause();
        }
        this._instances = [];
    }
}