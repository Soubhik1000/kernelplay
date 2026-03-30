import { Component } from "../Component.js";

export class AudioSource extends Component {
    constructor({
        clip = null,
        loop = false,
        playOnStart = false,
        volume = 1,
        playbackRate = 1
    } = {}) {
        super();

        this.clip = clip;
        this.loop = loop;
        this.playOnStart = playOnStart;
        this.volume = volume;
        this.playbackRate = playbackRate;

        this._audioInstance = null;
    }

    init() {
        this.transform = this.entity.getComponent("transform");
    }

    start() {
        if (this.playOnStart) {
            this.play();
        }
    }

    play() {
        if (!this.clip) return;

        this._audioInstance = this.entity.scene.game.audio.play(this.clip, {
            volume: this.volume,
            loop: this.loop,
            playbackRate: this.playbackRate,
            position: this.transform?.position
        });
    }

    stop() {
        if (this._audioInstance) {
            this._audioInstance.pause();
            this._audioInstance = null;
        }
    }

    setVolume(v) {
        this.volume = v;
        if (this._audioInstance) {
            this._audioInstance.volume = v;
        }
    }
}