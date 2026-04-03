// AnimationClip.js
// Pure data object — describes a single animation.
// Works for 2D (sprite frames) and 3D (property tracks).

export class AnimationClip {
  constructor(props = {}) {
    const {
      name = "clip",
      frameRate = 12,
      loop = true,
      // 2D sprite sheet frames
      frames = [],          // array of frame indices OR { x, y, w, h } objects
      gridWidth = 1,        // columns in the sprite sheet
      frameWidth = 32,
      frameHeight = 32,
      // 3D / property animation tracks
      tracks = {},          // { "transform.position.x": [ {time, value}, ... ] }
      length = null,        // clip duration in seconds (auto-calc if null)
    } = props;

    this.name = name;
    this.frameRate = frameRate;
    this.loop = loop;
    this.frames = frames;
    this.gridWidth = gridWidth;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.tracks = tracks;

    // Auto-calculate length from frames or tracks
    if (length !== null) {
      this.length = length;
    } else if (frames.length > 0) {
      this.length = frames.length / frameRate;
    } else {
      const maxTime = Object.values(tracks)
        .flat()
        .reduce((m, kf) => Math.max(m, kf.time), 0);
      this.length = maxTime || 0;
    }
  }

  // Get the 2D source rect for a given frame index
  getFrameRect(frameIndex) {
    const frame = this.frames[frameIndex];
    if (frame === undefined) return null;

    if (typeof frame === "object") {
      // Explicit { x, y, w, h }
      return {
        x: frame.x,
        y: frame.y,
        w: frame.w ?? this.frameWidth,
        h: frame.h ?? this.frameHeight,
      };
    }

    // Numeric index → compute from grid
    const col = frame % this.gridWidth;
    const row = Math.floor(frame / this.gridWidth);
    return {
      x: col * this.frameWidth,
      y: row * this.frameHeight,
      w: this.frameWidth,
      h: this.frameHeight,
    };
  }

  // Sample a property track at a given time (linear interpolation)
  sampleTrack(trackName, time) {
    const keyframes = this.tracks[trackName];
    if (!keyframes || keyframes.length === 0) return null;
    if (keyframes.length === 1) return keyframes[0].value;

    // Clamp to range
    if (time <= keyframes[0].time) return keyframes[0].value;
    if (time >= keyframes[keyframes.length - 1].time)
      return keyframes[keyframes.length - 1].value;

    // Find surrounding keyframes
    for (let i = 0; i < keyframes.length - 1; i++) {
      const a = keyframes[i];
      const b = keyframes[i + 1];
      if (time >= a.time && time <= b.time) {
        const t = (time - a.time) / (b.time - a.time);
        // Lerp numbers, objects recursively
        return lerpValue(a.value, b.value, t);
      }
    }
    return null;
  }

  toJSON() {
    return {
      type: "AnimationClip",
      name: this.name,
      frameRate: this.frameRate,
      loop: this.loop,
      frames: this.frames,
      gridWidth: this.gridWidth,
      frameWidth: this.frameWidth,
      frameHeight: this.frameHeight,
      tracks: this.tracks,
      length: this.length,
    };
  }

  static fromJSON(data) {
    return new AnimationClip(data);
  }
}

// Lerp helper — handles numbers, {x,y,z} vectors, arrays
function lerpValue(a, b, t) {
  if (typeof a === "number") return a + (b - a) * t;
  if (Array.isArray(a)) return a.map((v, i) => v + (b[i] - v) * t);
  if (typeof a === "object" && a !== null) {
    const out = {};
    for (const k in a) out[k] = lerpValue(a[k], b[k], t);
    return out;
  }
  return t < 0.5 ? a : b;
}