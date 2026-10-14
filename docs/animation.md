# 🎞️ Animation System *(New in v0.3.0)*

[← Back to README](../README.md) · [All docs](./README.md)

---

The animation system has three layers that work together:

```
AnimationClip        — pure data (frames, tracks, timing)
AnimatorController   — state machine (states, transitions, parameters)
AnimatorComponent    — runtime (drives sprites or 3D properties each frame)
```

## AnimationClip

Define a clip from a sprite sheet using **frame indices** (KernelPlayJS calculates the source rect for you):

```js
const walkClip = new AnimationClip({
  name:        "walk",
  frames:      [8, 9, 10, 11, 12, 13],
  frameRate:   12,
  loop:        true,
  gridWidth:   8,
  frameWidth:  32,
  frameHeight: 32,
});
```

Or use **explicit pixel rects** per frame:

```js
const walkClip = new AnimationClip({
  frames: [
    { x: 0,  y: 32, w: 32, h: 32 },
    { x: 32, y: 32, w: 32, h: 32 },
  ],
  frameRate: 12,
  loop: true,
});
```

For **3D / property animation**, use tracks (no sprite needed):

```js
const bobClip = new AnimationClip({
  name: "bob", loop: true, length: 1.5,
  tracks: {
    "transform.position.y": [
      { time: 0.0,  value: 0   },
      { time: 0.75, value: 1.5 },
      { time: 1.5,  value: 0   },
    ],
  },
});
```

Track values are linearly interpolated between keyframes. Supported types: `number`, `{ x, y, z }` vectors.

---

## AnimatorController — State Machine

```js
const controller = new AnimatorController()

  // Parameters drive transitions
  .addParameter("speed",      "float",   0)
  .addParameter("isGrounded", "bool",    false)
  .addParameter("jump",       "trigger")   // auto-resets after firing

  // States (first added = entry state)
  .addState("idle", idleClip)
  .addState("walk", walkClip)
  .addState("jump", jumpClip)

  // Transitions — all conditions must be true
  .addTransition("idle", "walk", {
    conditions:  [{ param: "speed", op: ">", value: 0.1 }],
    hasExitTime: false,
    duration:    0,
  })
  .addTransition("walk", "idle", {
    conditions:  [{ param: "speed", op: "<=", value: 0.1 }],
    hasExitTime: false,
    duration:    0,
  })

  // AnyState → fires from any state (great for jump, hurt, death)
  .addAnyStateTransition("jump", {
    conditions: [{ param: "jump", op: "trigger" }],
    priority:   10,
  });
```

**Condition operators:** `"true"` `"false"` `">"` `"<"` `">="` `"<="` `"=="` `"!="` `"trigger"`

---

## AnimatorComponent — Runtime

```js
entity.addComponent("sprite",   new SpriteComponent({ image: "./assets/player.png", width: 32, height: 32 }));
entity.addComponent("animator", new AnimatorComponent({ controller, autoPlay: true }));
```

Driving it from a script each frame:

```js
update(dt) {
  this.animator.setParameter("speed",      this.rb.velocity.x !== 0 ? 1 : 0);
  this.animator.setParameter("isGrounded", this.rb.isGrounded);

  if (Keyboard.wasPressed(KeyCode.Space) && this.rb.isGrounded) {
    this.rb.addForce(0, -600, "impulse");
    this.animator.setTrigger("jump");
  }
}
```

**Useful methods:**

```js
animator.play("idle")           // jump to state immediately
animator.crossFade("run", 0.2)  // smooth 200ms blend
animator.stop()                 // freeze on current frame
animator.currentState           // string — current state name
animator.isInState("walk")      // bool
```

**Callbacks:**

```js
animator.onStateEnter   = (state) => { if (state === "attack") this.hitbox.enabled = true; };
animator.onStateExit    = (state) => { if (state === "attack") this.hitbox.enabled = false; };
animator.onAnimationEnd = (state) => { if (state === "death")  this.entity.destroy(); };
```

---

## Legacy Shorthand

Don't need a state machine? Pass clips directly — a simple controller is built automatically:

```js
entity.addComponent("animator", new AnimatorComponent({
  animations: {
    idle: { frames: [0,1,2,3],     frameRate: 8,  loop: true, gridWidth: 8, frameWidth: 32, frameHeight: 32 },
    walk: { frames: [8,9,10,11],   frameRate: 12, loop: true, gridWidth: 8, frameWidth: 32, frameHeight: 32 },
  },
  defaultAnimation: "idle",
}));

animator.play("walk");
animator.play("idle");
```

---

## Full Platformer Example

```js
const GRID = { gridWidth: 8, frameWidth: 32, frameHeight: 32 };

const idleClip = new AnimationClip({ name: "idle", frames: [0,1,2,3],         frameRate: 8,  loop: true,  ...GRID });
const walkClip = new AnimationClip({ name: "walk", frames: [8,9,10,11,12,13], frameRate: 12, loop: true,  ...GRID });
const jumpClip = new AnimationClip({ name: "jump", frames: [16],              frameRate: 10, loop: false, length: 0.5, ...GRID });
const hurtClip = new AnimationClip({ name: "hurt", frames: [24,25],           frameRate: 10, loop: false, ...GRID });

const controller = new AnimatorController()
  .addParameter("speed",      "float",   0)
  .addParameter("isGrounded", "bool",    false)
  .addParameter("jump",       "trigger")
  .addParameter("hurt",       "trigger")

  .addState("idle", idleClip)
  .addState("walk", walkClip)
  .addState("jump", jumpClip)
  .addState("hurt", hurtClip)

  .addTransition("idle", "walk", { conditions: [{ param: "speed", op: ">",    value: 0.1 }, { param: "isGrounded", op: "true"  }], hasExitTime: false, duration: 0 })
  .addTransition("walk", "idle", { conditions: [{ param: "speed", op: "<=",   value: 0.1 }],                                        hasExitTime: false, duration: 0 })
  .addTransition("walk", "jump", { conditions: [{ param: "isGrounded", op: "false" }],                                              hasExitTime: false, duration: 0 })
  .addTransition("jump", "idle", { conditions: [{ param: "isGrounded", op: "true"  }],                                              hasExitTime: false, duration: 0 })
  .addAnyStateTransition("jump", { conditions: [{ param: "jump", op: "trigger" }], priority: 10 })
  .addAnyStateTransition("hurt", { conditions: [{ param: "hurt", op: "trigger" }], priority: 20 });

entity.addComponent("sprite",   new SpriteComponent({ image: "./assets/player.png", width: 32, height: 32 }));
entity.addComponent("animator", new AnimatorComponent({ controller }));
entity.addComponent("script",   new PlayerScript());
```
