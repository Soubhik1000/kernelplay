# KernelPlayJS — Debug Docs *(New in v0.6.0)*

[← Back to README](../README.md) · [All docs](./README.md)

## Table of Contents

- [Debug System](#debug-system)
  - [Enabling Debug](#enabling-debug)
  - [Debug Overlay](#debug-overlay)
  - [Debug Draw Layers](#debug-draw-layers)
  - [Toggle Keys](#toggle-keys)
  - [Remapping Keys with JSON](#remapping-keys-with-json)
  - [DebugStats](#debugstats)
  - [Debug API Reference](#debug-api-reference)

## Debug System

The debug system has two parts: a UI overlay with live stats, and in-world draw layers for physics, bounds, and cameras.

### Enabling Debug

Pass flags in the game config:

```js
new MyGame({
    width: 800,
    height: 600,
    fps: 60,
    debug: true,           // UI overlay + stats
    debugPhysics: true,    // rigidbody visuals
    debugBounds: true,     // renderer bounds + colliders
    debugCameras: true,    // camera frustums
    debugConfig: "./debug.config.json", // optional key remap
}).start();
```

All draw flags can also be toggled at runtime with the keys below.

---

### Debug Overlay

`DebugOverlay` builds four flat panels on a dedicated `"Debug"` UI layer (order 40, above `"Overlay"`), hidden until toggled.

| Corner | Panel | Shows |
|---|---|---|
| Top-left | Performance | FPS, frame time, average frame, CPU, GC spikes |
| Top-right | Scene | Entities, visible, physics, scene name, camera |
| Bottom-left | Input | Active device, axis H/V, last action, gamepad status |
| Bottom-right | Audio | BGM state, active SFX, master and SFX volume, context state |

FPS and CPU are color coded green, yellow, red.

Each label needs its own style object. If you spread a shared style constant into many labels, change colors through a copy:

```js
style: { ...DebugOverlay.#ROW.style }
```

Otherwise changing one label's color changes all of them, because they share one object.

---

### Debug Draw Layers

Drawn in world space by the renderer on top of the scene.

**Colliders** (`debugBounds`)

| Visual | Color | Meaning |
|---|---|---|
| Solid rect | Green `#00E676` | Normal collider |
| Dashed rect | Yellow `#FFD600` | Trigger collider |
| Dot | Cyan `#00E5FF` | Collider center |
| Crosshair + circle | Red `#FF1744` | Anchor point (`collider.anchor`, default center) |
| Dashed arrow | Orange `#FF6D00` | Facing direction, `0°` = up, clockwise (`transform.rotation.z`) |

**Renderer bounds** (`debugBounds`) — shown only for renderers with no collider. Blue dashed rect, center dot, and a facing arrow.

**Rigidbodies** (`debugPhysics`)

| Visual | Meaning |
|---|---|
| Bright purple dot | Moving |
| Dim purple dot | Nearly still |
| Dashed purple arrow | Velocity direction and magnitude |
| Green dot + `G` | `isGrounded` is true |
| Red dot + `A` | Airborne |
| `px/s` label | Speed |
| `m:` label | Mass |

**Cameras** (`debugCameras`) — dashed view frustum with center crosshair. Primary camera in orange `#FF6E40`, others in light orange `#FFAB91`.

---

### Toggle Keys

| Action | Default |
|---|---|
| Toggle overlay | `F2` or `Ctrl + D` |
| Toggle rigidbody debug | `F4` |
| Toggle bounds + colliders | `F5` |
| Toggle cameras | `F6` |

They are static properties, so you can change them in code:

```js
DebugOverlay.TOGGLE_KEYS       = [KeyCode.F3];
DebugOverlay.TOGGLE_COMBO      = { key: KeyCode.G, modifier: "ctrl" };
DebugOverlay.PHYSICS_DEBUG_KEY = KeyCode.F7;
DebugOverlay.BOUNDS_DEBUG_KEY  = KeyCode.F8;
DebugOverlay.CAMERAS_DEBUG_KEY = KeyCode.F9;
```

---

### Remapping Keys with JSON

Browsers use some function keys for their own shortcuts, so keys can be remapped from a JSON file without touching code.

**`debug.config.json`:**

```json
{
    "keys": {
        "toggle":      "F2",
        "toggleCombo": { "key": "D", "modifier": "ctrl" },
        "physics":     "F4",
        "bounds":      "F5",
        "cameras":     "F6"
    }
}
```

Load it before the game starts:

```js
await DebugOverlay.loadConfig("./debug.config.json");
```

Or pass `debugConfig` in the game options and the engine loads it for you. Key names match `KeyCode` property names. A name not found in `KeyCode` is used as a raw key string. Only the keys listed in the JSON change.

---

### DebugStats

`DebugStats` collects performance numbers independently of the overlay, so you can read them from anywhere.

```js
game.debugStats.fps
game.debugStats.frameTime   // ms for the last frame
game.debugStats.avgFrame    // average over the last 60 frames
game.debugStats.cpuUsage    // frame time as % of the 16.67ms budget
game.debugStats.gcSpikes    // long-gap frames in the current second
```

The game loop wraps each frame:

```js
update(dt) {
    this.debugStats?.beginFrame();
    // ... update logic ...
    this.debugStats?.endFrame();
}
```

GC spikes are a heuristic: a gap over 50ms between frames counts as a spike. CPU usage is an estimate from frame time, not a real CPU measurement.

---

### Debug API Reference

**DebugOverlay**

| Member | Description |
|---|---|
| `init()` | Build panels and the `"Debug"` layer |
| `update(dt)` | Handle toggle keys and refresh labels |
| `show()` / `hide()` / `toggle()` | Control visibility |
| `isVisible` | Current visibility |
| `trackAction(name)` | Record the last fired input action |
| `DebugOverlay.loadConfig(path)` | Remap keys from JSON (async) |

**Renderer flags**

| Flag | Controls |
|---|---|
| `renderer.debugPhysics` | Rigidbody visuals |
| `renderer.debugBounds` | Renderer bounds and colliders |
| `renderer.debugCameras` | Camera frustums |

**Game config**

| Option | Description |
|---|---|
| `debug` | Create `DebugStats` and `DebugOverlay` |
| `debugPhysics` / `debugBounds` / `debugCameras` | Initial state of each draw layer |
| `debugConfig` | Path to the key remap JSON |
