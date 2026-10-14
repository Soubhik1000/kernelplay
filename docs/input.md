# 🎮 Input System *(New in v0.5.0)*

[← Back to README](../README.md) · [All docs](./README.md)

Unified Keyboard, Mouse, Gamepad and Touch input. Use `Input` for normal gameplay, and use `Keyboard`, `Mouse`, `Gamepad` or `Touch` directly for device-specific behavior.

## Table of Contents

- [Keyboard](#keyboard)
- [Mouse](#mouse)
  - [Raycasting from Mouse](#raycasting-from-mouse)
- [Touch](#touch)
  - [Setup](#touch-setup)
  - [Joystick](#joystick)
  - [Swipe Gestures](#swipe-gestures)
  - [Sensitivity](#touch-sensitivity)
  - [API Reference](#touch-api-reference)
- [Gamepad](#gamepad)
  - [Setup](#gamepad-setup)
  - [Buttons](#buttons)
  - [Analog Sticks](#analog-sticks)
  - [Triggers](#triggers)
  - [Deadzone](#deadzone)
  - [GamepadButton Reference](#gamepadbutton-reference)
  - [API Reference](#gamepad-api-reference)
- [InputManager](#inputmanager)
  - [Setup](#inputmanager-setup)
  - [Predefined Actions](#predefined-actions)
  - [getAxis](#getaxis)
  - [Custom Actions](#custom-actions)
  - [JSON Config](#json-config)
  - [Sensitivity](#sensitivity)
  - [API Reference](#inputmanager-api-reference)

---

## Keyboard

```js
import { Keyboard, KeyCode } from "kernelplay-js";

// Held down this frame
if (Keyboard.isPressed(KeyCode.ArrowRight)) {
  rb.velocity.x = 200;
}

// Pressed exactly this frame (good for jumps/actions)
if (Keyboard.wasPressed(KeyCode.Space)) {
  rb.velocity.y = -400;
}

// Released this frame
if (Keyboard.wasReleased(KeyCode.Escape)) {
  pauseGame();
}
```

Common key codes:

| Group | Keys |
|---|---|
| Arrow keys | `ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight` |
| WASD | `W`, `A`, `S`, `D` |
| Misc | `Space`, `Enter`, `Escape`, `ShiftLeft`, `ShiftRight` |
| Any key | Use the `KeyboardEvent.key` value directly |

| Method | Returns | Description |
|---|---|---|
| `Keyboard.isPressed(key)` | `boolean` | True while the key is held |
| `Keyboard.wasPressed(key)` | `boolean` | True only on the frame the key goes down |
| `Keyboard.wasReleased(key)` | `boolean` | True only on the frame the key is released |

---

## Mouse

```js
import { Mouse, MouseButton } from "kernelplay-js";

// Position (canvas-relative)
const x = Mouse.x;
const y = Mouse.y;

// Buttons: MouseButton.Left (0), Middle (1), Right (2)
if (Mouse.isPressed(MouseButton.Left)) {
  /* holding left button */
}

if (Mouse.wasPressed(MouseButton.Left)) {
  /* clicked this frame */
}

if (Mouse.wasReleased(MouseButton.Right)) {
  /* right button released */
}

// Delta movement since last frame
const dx = Mouse.deltaX;
const dy = Mouse.deltaY;

// Scroll wheel
const scroll = Mouse.scrollDelta;
```

| Member | Type | Description |
|---|---|---|
| `Mouse.x`, `Mouse.y` | `number` | Canvas-relative position |
| `Mouse.deltaX`, `Mouse.deltaY` | `number` | Movement since last frame |
| `Mouse.scrollDelta` | `number` | Scroll wheel movement |
| `Mouse.isPressed(button)` | `boolean` | True while the button is held |
| `Mouse.wasPressed(button)` | `boolean` | True on the frame the button goes down |
| `Mouse.wasReleased(button)` | `boolean` | True on the frame the button is released |

### Raycasting from Mouse

Use the scene's `raycast()` method with the mouse position to pick entities.

```js
class ClickToSelect extends ScriptComponent {
  update(dt) {
    if (Mouse.wasPressed(MouseButton.Left)) {
      const hit = this.raycast(Mouse.x, Mouse.y);

      if (hit) {
        console.log("Clicked entity:", hit.entity.name);

        hit.entity.getComponent("renderer").color = "yellow";
      }
    }
  }
}
```

---

## Touch

The `Touch` class handles all touch input — a virtual joystick on the left side of the screen and swipe gestures on the right side. It follows the same static API pattern as `Keyboard` and `Gamepad`.

### Touch Setup

`Touch` is initialized automatically by the engine in `Game.js` — you do not need to call `Touch.init()` yourself.

```js
// Already handled internally by the engine:
// Touch.init(this.canvas.canvas);
```

To use it in a script, just import it:

```js
import { Touch } from "kernelplay-js";
```

---

### Joystick

The left side of the screen is the joystick zone (35% of the canvas width by default). Touch and drag to move — the knob clamps to the ring radius and returns a normalized axis value.

```js
update(dt) {
    const axis = Touch.getAxis();
    // axis.x — horizontal: -1 (left) to 1 (right)
    // axis.y — vertical:   -1 (up)   to 1 (down)

    this.rb.addForce(800 * axis.x, 0);
    this.rb.addForce(0, 800 * axis.y);
}
```

The joystick returns `{ x: 0, y: 0 }` when no finger is on the left zone.

**Joystick zone size** — by default the left 35% of the canvas width. Change it in `Touch.js`:

```js
const LEFT_ZONE = canvas.getBoundingClientRect().width * 0.35; // adjust 0.35
```

---

### Swipe Gestures

The right side of the screen detects swipes. Each swipe method returns `true` once then resets — same pattern as `Keyboard.wasPressed`.

```js
update(dt) {
    if (Touch.swipeUp())    this.rb.addForce(0, -800);
    if (Touch.swipeDown())  this.rb.addForce(0,  800);
    if (Touch.swipeLeft())  this.rb.addForce(-800, 0);
    if (Touch.swipeRight()) this.rb.addForce( 800, 0);
}
```

**Swipe threshold** — minimum pixel distance to register a swipe. Lower = more sensitive to quick flicks:

```js
// Inside Touch.js
static #swipe = {
    threshold: 20, // default 20px — increase if too sensitive
};
```

---

### Touch Sensitivity

Control joystick sensitivity via `Input.TOUCH_SENSITIVITY` (see [InputManager Sensitivity](#sensitivity)), or manually scale the axis value:

```js
const SENSITIVITY = 0.6; // 0.0 to 1.0
const axis = Touch.getAxis();
this.rb.addForce(800 * axis.x * SENSITIVITY, 0);
```

---

### Touch API Reference

| Method | Returns | Description |
|---|---|---|
| `Touch.getAxis()` | `{ x, y }` | Normalized joystick axis (-1 to 1) |
| `Touch.joystickActive()` | `boolean` | Whether a finger is on the joystick zone |
| `Touch.joystickOrigin()` | `{ x, y }` | Screen position of the joystick base |
| `Touch.joystickCurrent()` | `{ x, y }` | Current finger screen position |
| `Touch.joystickRadius()` | `number` | Joystick ring radius in pixels |
| `Touch.swipeUp()` | `boolean` | True once on upward swipe |
| `Touch.swipeDown()` | `boolean` | True once on downward swipe |
| `Touch.swipeLeft()` | `boolean` | True once on leftward swipe |
| `Touch.swipeRight()` | `boolean` | True once on rightward swipe |
| `Touch.getJoystickState()` | `object` | Full joystick state for rendering overlays |
| `Touch.update()` | `void` | Called by engine each frame (no-op, exists for API consistency) |

> **Note:** Touch input only fires on real touch devices. To test on PC, use Chrome DevTools → Toggle Device Toolbar (`Ctrl + Shift + M`) and select a mobile device, then refresh.

---

## Gamepad

### Gamepad Setup

To use the `Gamepad` class, you must first initialize it to set up connection event listeners. Then, call the `update()` method once per frame at the beginning of your game loop to poll the latest input states.

```js
import { Gamepad, GamepadButton } from "kernelplay-js";

// 1. Initialize event listeners once at startup
Gamepad.init();

function gameLoop() {
    // 2. Poll the gamepad state every frame before updating game objects
    Gamepad.update();

    if (Gamepad.isConnected()) {
        // Handle input here...
        if (Gamepad.wasPressed(GamepadButton.A)) {
            console.log("Jump!");
        }
    }

    requestAnimationFrame(gameLoop);
}
```

### Buttons

The API keeps track of three different button states per frame, allowing for precise input handling:

- **`Gamepad.isPressed(button)`**: Returns `true` if the button is currently being held down. Good for continuous actions like running.
- **`Gamepad.wasPressed(button)`**: Returns `true` only on the exact frame the button was pressed down. Good for single actions like jumping or UI selection.
- **`Gamepad.wasReleased(button)`**: Returns `true` only on the exact frame the button was let go.

```js
if (Gamepad.wasPressed(GamepadButton.Start)) {
    pauseGame();
}
```

### Analog Sticks

The `Gamepad` class automatically applies a radial deadzone and normalizes the output of the analog sticks.

- **`Gamepad.leftStick()`**
- **`Gamepad.rightStick()`**

Both methods return an object containing the normalized axes and the total magnitude: `{ x: number, y: number, magnitude: number }`

- `x`: Horizontal axis (-1.0 to 1.0)
- `y`: Vertical axis (-1.0 to 1.0)
- `magnitude`: The normalized distance from the center (0.0 to 1.0)

```js
const movement = Gamepad.leftStick();
if (movement.magnitude > 0) {
    player.x += movement.x * speed;
    player.y += movement.y * speed;
}
```

### Triggers

Modern controllers feature analog triggers that can read varying levels of pressure. The API provides both analog (raw value) and digital (threshold-based) methods for triggers.

- **Analog reads (0.0 to 1.0):**
  - `Gamepad.leftTrigger()`
  - `Gamepad.rightTrigger()`
- **Digital checks (boolean):** Returns true if the trigger is pulled past `Gamepad.TRIGGER_THRESHOLD`.
  - `Gamepad.isLeftTriggerPressed()`
  - `Gamepad.isRightTriggerPressed()`

### Deadzone

Controllers often have "drift" where the analog sticks do not perfectly return to center. The `Gamepad` class prevents this by applying a deadzone.

- **`Gamepad.DEADZONE`** (Default: `0.15`): Inputs with a magnitude below this value are completely ignored (returns `{ x: 0, y: 0, magnitude: 0 }`). Inputs beyond the deadzone are re-normalized so they smoothly scale from 0 to 1.
- **`Gamepad.TRIGGER_THRESHOLD`** (Default: `0.1`): The minimum pressure required for a trigger to register as "pressed" when using digital checks.

You can adjust these globally:

```js
Gamepad.DEADZONE = 0.2; // Increase if older controllers drift
Gamepad.TRIGGER_THRESHOLD = 0.5; // Require half-pull for digital trigger actions
```

---

### GamepadButton Reference

Use the `GamepadButton` export to reference standard controller buttons (based on the standard Xbox layout) instead of memorizing index numbers.

| Constant | ID | Description |
| :--- | :--- | :--- |
| `GamepadButton.A` | `0` | Bottom Face Button (A / Cross) |
| `GamepadButton.B` | `1` | Right Face Button (B / Circle) |
| `GamepadButton.X` | `2` | Left Face Button (X / Square) |
| `GamepadButton.Y` | `3` | Top Face Button (Y / Triangle) |
| `GamepadButton.LB` | `4` | Left Bumper / L1 |
| `GamepadButton.RB` | `5` | Right Bumper / R1 |
| `GamepadButton.LT` | `6` | Left Trigger / L2 (Digital Check) |
| `GamepadButton.RT` | `7` | Right Trigger / R2 (Digital Check) |
| `GamepadButton.Select` | `8` | Back / Select / Share |
| `GamepadButton.Start` | `9` | Start / Options |
| `GamepadButton.LS` | `10` | Left Stick Click / L3 |
| `GamepadButton.RS` | `11` | Right Stick Click / R3 |
| `GamepadButton.DPadUp` | `12` | D-Pad Up |
| `GamepadButton.DPadDown` | `13` | D-Pad Down |
| `GamepadButton.DPadLeft` | `14` | D-Pad Left |
| `GamepadButton.DPadRight` | `15` | D-Pad Right |
| `GamepadButton.Home` | `16` | Home / Guide / PS Button |

---

### Gamepad API Reference

#### Static Properties

- `DEADZONE`: `<number>` Distance required to register analog stick movement.
- `TRIGGER_THRESHOLD`: `<number>` Pressure required to register digital trigger press.

#### Core Methods

- `init()`: Sets up connection/disconnection event listeners.
- `isConnected()`: `<boolean>` Checks if a gamepad is currently active.
- `update()`: Polls navigator gamepads. **Must be called once per frame.**

#### Input Methods

- `isPressed(button)`: `<boolean>` True while the button is held.
- `wasPressed(button)`: `<boolean>` True on the first frame the button is pressed.
- `wasReleased(button)`: `<boolean>` True on the first frame the button is released.
- `leftStick()`: `<Object>` Returns `{x, y, magnitude}`.
- `rightStick()`: `<Object>` Returns `{x, y, magnitude}`.
- `leftTrigger()`: `<number>` Returns analog value 0 to 1.
- `rightTrigger()`: `<number>` Returns analog value 0 to 1.
- `isLeftTriggerPressed()`: `<boolean>` True if left trigger >= `TRIGGER_THRESHOLD`.
- `isRightTriggerPressed()`: `<boolean>` True if right trigger >= `TRIGGER_THRESHOLD`.

---

## InputManager

`Input` is a unified static class that combines `Keyboard`, `Gamepad`, `Touch` and `Mouse` into a single named-action API — the same concept as Unity's Input Manager. Scripts never need to check which device is active; `Input` handles it automatically.

### InputManager Setup

`Input` requires no initialization. Import and use directly in any script:

```js
import { Input } from "kernelplay-js";
```

To load a custom config before the game starts:

```js
await Input.loadConfig("./input.config.json");
new MyGame({ width: 800, height: 600, fps: 60 }).start();
```

---

### Predefined Actions

These actions are available out of the box — no setup needed:

| Action | Keyboard | Gamepad |
|---|---|---|
| `moveRight` | `ArrowRight`, `D` | `DPadRight` |
| `moveLeft` | `ArrowLeft`, `A` | `DPadLeft` |
| `moveUp` | `ArrowUp`, `W` | `DPadUp` |
| `moveDown` | `ArrowDown`, `S` | `DPadDown` |
| `jump` | `Space`, `W` | `A` |
| `attack` | `Z`, `J` | `X` |
| `altAttack` | `X`, `K` | `Y` |
| `interact` | `E`, `F` | `B` |
| `dash` | `Shift` | `RB` |
| `guard` | `Ctrl` | `LB` |
| `pause` | `Escape` | `Start` |
| `confirm` | `Enter`, `Space` | `A` |
| `cancel` | `Escape` | `B` |
| `run` | `Shift` | `B` |
| `crouch` | `ArrowDown`, `S` | `DPadDown` |
| `shoot` | `Z` | `RT` |
| `reload` | `R` | `X` |
| `melee` | `V` | `RS` |
| `aim` | `X` | `LT` |
| `openMap` | `M` | `Select` |
| `openInv` | `I` | `Y` |
| `hotkey1` | `1` | `DPadUp` |
| `hotkey2` | `2` | `DPadDown` |
| `hotkey3` | `3` | `DPadLeft` |
| `hotkey4` | `4` | `DPadRight` |

---

### getAxis

`Input.getAxis(axis)` returns a smooth `-1` to `1` value combining all devices. Device priority: **Gamepad stick → Touch joystick → Keyboard**.

```js
update(dt) {
    const h = Input.getAxis("horizontal");
    const v = Input.getAxis("vertical");

    this.rb.addForce(800 * h, 0);
    this.rb.addForce(0, 800 * v);
}
```

| Axis | Description |
|---|---|
| `"horizontal"` | Left/right — WASD, arrows, left stick, touch joystick |
| `"vertical"` | Up/down — WASD, arrows, left stick, touch joystick |
| `"horizontalRight"` | Right stick X (gamepad only) |
| `"verticalRight"` | Right stick Y (gamepad only) |
| `"triggerLeft"` | LT analog value (0 to 1) |
| `"triggerRight"` | RT analog value (0 to 1) |

**Why keyboard returns -1 or 1 exactly:**
Keyboard is digital — it has no in-between. Gamepad and touch return fractional values so gentle input = less force. One `getAxis` call handles all three naturally:

```js
// Keyboard   → h = exactly 1.0   → full force
// Gamepad    → h = 0.45          → half force
// Touch      → h = 0.72          → 72% force
this.rb.addForce(800 * h, 0);
```

---

### Custom Actions

**Add a new action:**

```js
Input.registerAction("shoot", {
    keys:    [KeyCode.Z, KeyCode.X],
    buttons: [GamepadButton.X, GamepadButton.RB],
});
```

**Override an existing action:**

```js
Input.setBinding("jump", {
    keys:    [KeyCode.Space, KeyCode.ArrowUp],
    buttons: [GamepadButton.A, GamepadButton.B],
});
```

Register actions before `game.start()`. Predefined actions not mentioned stay untouched.

---

### JSON Config

Define bindings in a JSON file — good for letting players remap controls or shipping different control schemes per platform.

**`input.config.json`:**

```json
{
    "actions": {
        "jump": { "keys": ["Space", "ArrowUp"], "buttons": ["A", "B"] },
        "go":   { "keys": ["x", "z"],           "buttons": ["DPadRight"] }
    }
}
```

- **New action name** → added alongside predefined defaults
- **Existing action name** → overrides that action only
- **Actions not in JSON** → untouched

Load it at startup:

```js
await Input.loadConfig("./input.config.json");
new MyGame({ width: 800, height: 600, fps: 60 }).start();
```

Key names in JSON match `KeyCode` property names (`"Space"`, `"ArrowRight"`, `"a"`) and button names match `GamepadButton` property names (`"A"`, `"DPadRight"`, `"RB"`).

---

### Sensitivity

Control analog sensitivity globally without touching your movement code:

```js
Input.GAMEPAD_SENSITIVITY = 0.8; // default 1.0
Input.TOUCH_SENSITIVITY   = 0.6; // default 1.0
```

Applied automatically inside `getAxis` — keyboard always returns full digital values unaffected.

Hook into a settings slider:

```js
sensitivitySlider.onChange = (v) => {
    Input.GAMEPAD_SENSITIVITY = v;
    Input.TOUCH_SENSITIVITY   = v;
};
```

---

### InputManager API Reference

**Action checks:**

| Method | Returns | Description |
|---|---|---|
| `Input.isPressed(action)` | `boolean` | Action held this frame — any device |
| `Input.wasPressed(action)` | `boolean` | Action just pressed this frame — any device |
| `Input.wasReleased(action)` | `boolean` | Action just released this frame — any device |
| `Input.getAxis(axis)` | `number` | Smooth -1 to 1 from all devices |

**Binding management:**

| Method | Description |
|---|---|
| `Input.registerAction(name, binding)` | Add a new named action |
| `Input.setBinding(name, binding)` | Override an existing action's bindings |
| `Input.loadConfig(path)` | Load bindings from a JSON file (async) |

**Device info:**

| Method | Returns | Description |
|---|---|---|
| `Input.isTouchDevice()` | `boolean` | Whether the device supports touch |
| `Input.isGamepadConnected()` | `boolean` | Whether a gamepad is connected |

**Raw passthrough** — escape hatch if you need direct device access:

| Property | Description |
|---|---|
| `Input.keyboard` | Raw `Keyboard` class |
| `Input.gamepad` | Raw `Gamepad` class |
| `Input.touch` | Raw `Touch` class |
| `Input.mouse` | Raw `Mouse` class |

**Sensitivity:**

| Property | Default | Description |
|---|---|---|
| `Input.GAMEPAD_SENSITIVITY` | `1.0` | Gamepad stick axis multiplier |
| `Input.TOUCH_SENSITIVITY` | `1.0` | Touch joystick axis multiplier |
| `Input.DEADZONE` | `0.15` | Axis deadzone threshold |