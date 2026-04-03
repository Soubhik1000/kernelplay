// AnimatorComponent.js
// Unity-style Animator — drives 2D sprites and 3D property tracks.
// Requires an AnimatorController.

import { Component } from "../Component.js";
import { AnimatorController } from "../../graphics/AnimatorController.js";
import { AnimationClip } from "../../graphics/AnimationClip.js";

export class AnimatorComponent extends Component {
  constructor(props = {}) {
    super();

    const {
      controller = null,
      animations = null,
      defaultAnimation = null,
      autoPlay = true,
      speed = 1.0,
    } = props;

    this.controller = controller;
    this.autoPlay = autoPlay;
    this.speed = speed;

    if (!controller && animations) {
      this.controller = AnimatorComponent._buildSimpleController(
        animations,
        defaultAnimation
      );
    }

    this._currentState = null;
    this._prevState = null;
    this._time = 0;
    this._frameIndex = -1;
    this._isPlaying = false;

    this._crossfading = false;
    this._crossfadeTime = 0;
    this._crossfadeDuration = 0;
    this._crossfadeFromState = null;

    this.onStateEnter = null;
    this.onStateExit = null;
    this.onAnimationEnd = null;
  }

  init() {
    this._sprite = this.entity.getComponent("sprite")
                ?? this.entity.getComponent("renderer");

    if (!this.controller) {
      console.warn("AnimatorComponent: no controller assigned.");
      return;
    }

    if (this.autoPlay && this.controller.entryState) {
      this._enterState(this.controller.entryState);
    }
  }

  // ── Public API ───────────────────────────────────────────────────────

  play(stateName, reset = true) {
    if (!this.controller?.states[stateName]) {
      console.warn(`AnimatorComponent: state "${stateName}" not found`);
      return;
    }
    if (this._currentState === stateName && !reset) {
      this._isPlaying = true;
      return;
    }
    this._enterState(stateName);
  }

  crossFade(stateName, duration = 0.15) {
    if (!this.controller?.states[stateName]) return;
    if (this._currentState === stateName) return;

    this._crossfading = true;
    this._crossfadeFromState = this._currentState;
    this._crossfadeTime = 0;
    this._crossfadeDuration = duration;
    this._enterState(stateName, true);
  }

  setParameter(name, value) {
    this.controller?.setParameter(name, value);
  }

  setTrigger(name) {
    this.controller?.setTrigger(name);
  }

  getParameter(name) {
    return this.controller?.getParameter(name);
  }

  stop()   { this._isPlaying = false; }
  pause()  { this._isPlaying = false; }
  resume() { this._isPlaying = true; }

  get currentState() { return this._currentState; }
  get isPlaying()    { return this._isPlaying; }

  isInState(name) { return this._currentState === name; }

  // ── Update ───────────────────────────────────────────────────────────

  update(dt) {
    if (!this._isPlaying || !this._currentState || !this.controller) return;

    const stateData = this.controller.states[this._currentState];
    if (!stateData) return;

    const clip = stateData.clip;
    const effectiveDt = dt * this.speed * stateData.speed;

    // ── Check transitions BEFORE advancing time ──────────────────────
    const normalizedTime = (clip.length > 0)
        ? Math.min(this._time / clip.length, 1)
        : 1;

    const transition = this.controller.evaluateTransitions(
        this._currentState,
        normalizedTime
    );

    if (transition) {
        if (transition.duration > 0) {
            this.crossFade(transition.to, transition.duration);
        } else {
            this._enterState(transition.to);
        }
        return;
    }

    // ── Advance time ─────────────────────────────────────────────────
    this._time += effectiveDt;

    if (this._time >= clip.length && clip.length > 0) {
        if (clip.loop) {
            this._time %= clip.length;
        } else {
            this._time = clip.length - 0.001; // hold last frame
            this._isPlaying = false;
            if (this.onAnimationEnd) this.onAnimationEnd(this._currentState);
            return;
        }
    }

    // ── Crossfade timer ───────────────────────────────────────────────
    if (this._crossfading) {
        this._crossfadeTime += effectiveDt;
        if (this._crossfadeTime >= this._crossfadeDuration) {
            this._crossfading = false;
        }
    }

    // ── Apply frame ───────────────────────────────────────────────────
    this._applyFrame(clip);
    if (Object.keys(clip.tracks).length > 0) {
        this._applyTracks(clip, this._time);
    }
  }

  // ── Internal ─────────────────────────────────────────────────────────

  _enterState(stateName, keepCrossfade = false) {
    if (!this.controller.states[stateName]) {
        console.warn(`AnimatorComponent: state "${stateName}" not found`);
        return;
    }

    if (this._currentState && this.onStateExit) {
        this.onStateExit(this._currentState);
    }

    this._prevState = this._currentState;
    this._currentState = stateName;
    this._time = 0;
    this._frameIndex = -1; // force frame refresh

    if (!keepCrossfade) {
        this._crossfading = false;
    }

    this._isPlaying = true;

    if (this.onStateEnter) this.onStateEnter(stateName);

    // Apply first frame immediately on enter
    const stateData = this.controller.states[stateName];
    if (stateData) {
        this._applyFrame(stateData.clip);
    }
  }

  _applyFrame(clip) {
    if (!this._sprite || clip.frames.length === 0) return;

    const frameIndex = Math.min(
        Math.floor(this._time * clip.frameRate),
        clip.frames.length - 1
    );

    if (frameIndex === this._frameIndex) return;
    this._frameIndex = frameIndex;

    const rect = clip.getFrameRect(frameIndex);
    if (rect) {
        this._sprite.setFrame(rect.x, rect.y, rect.w, rect.h);
    }
  }

  _applyTracks(clip, time) {
    for (const [path] of Object.entries(clip.tracks)) {
        const value = clip.sampleTrack(path, time);
        if (value === null) continue;
        this._applyTrackValue(path, value);
    }
  }

  _applyTrackValue(path, value) {
    const parts = path.split(".");
    if (parts.length < 2) return;

    let target = this.entity.getComponent(parts[0]);
    if (!target) return;

    for (let i = 1; i < parts.length - 1; i++) {
        target = target[parts[i]];
        if (target == null) return;
    }

    target[parts[parts.length - 1]] = value;
  }

  // ── Static helpers ───────────────────────────────────────────────────

  static _buildSimpleController(animations, defaultAnimation) {
    const ac = new AnimatorController();

    for (const [name, config] of Object.entries(animations)) {
        const clip = new AnimationClip({
            name,
            frames: config.frames ?? [],
            frameRate: config.frameRate ?? 10,
            loop: config.loop ?? true,
            gridWidth: config.gridWidth ?? 1,
            frameWidth: config.frameWidth ?? 32,
            frameHeight: config.frameHeight ?? 32,
            tracks: config.tracks ?? {},
        });
        ac.addState(name, clip);
    }

    if (defaultAnimation) ac.entryState = defaultAnimation;
    return ac;
  }

  // ── Serialization ────────────────────────────────────────────────────

  toJSON() {
    return {
        type: "AnimatorComponent",
        controller: this.controller?.toJSON() ?? null,
        autoPlay: this.autoPlay,
        speed: this.speed,
    };
  }

  static fromJSON(data) {
    return new AnimatorComponent({
        autoPlay: data.autoPlay,
        speed: data.speed,
    });
  }
}