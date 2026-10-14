# 🎮 Input System *(New in v0.5.0)*

[← Back to README](../README.md) · [All docs](./README.md)

---

Unified Keyboard + Gamepad + Touch input through `Input`.

## Touch

Auto-initialized by `Game.js`.

```js
import { Touch } from "kernelplay-js";
```

Default joystick zone: left 35% of canvas. `getAxis()` returns `{x,y}` in `-1..1`; no touch = `{x:0,y:0}`.

```js
update(dt) {
  const a = Touch.getAxis();
  this.rb.addForce(800*a.x, 800*a.y);
}
const LEFT_ZONE = canvas.getBoundingClientRect().width * 0.35;
```

Swipes are on the right; each returns `true` once:

```js
if (Touch.swipeUp())    this.rb.addForce(0,-800);
if (Touch.swipeDown())  this.rb.addForce(0,800);
if (Touch.swipeLeft())  this.rb.addForce(-800,0);
if (Touch.swipeRight()) this.rb.addForce(800,0);
```

Default threshold: `20px`.

```js
static #swipe = { threshold: 20 };
Input.TOUCH_SENSITIVITY = 0.6;
```

Touch API: `getAxis()`, `joystickActive()`, `joystickOrigin()`, `joystickCurrent()`, `joystickRadius()`, `swipeUp()`, `swipeDown()`, `swipeLeft()`, `swipeRight()`, `getJoystickState()`, `update()`.

## Gamepad

Initialize once; call `update()` once per frame.

```js
import { Gamepad, GamepadButton } from "./Gamepad.js";
Gamepad.init();
function gameLoop() {
  Gamepad.update();
  requestAnimationFrame(gameLoop);
}
```

```js
Gamepad.isPressed(button);    // held
Gamepad.wasPressed(button);   // pressed this frame
Gamepad.wasReleased(button);  // released this frame
Gamepad.leftStick();          // {x,y,magnitude}
Gamepad.rightStick();         // {x,y,magnitude}
Gamepad.leftTrigger();        // 0..1
Gamepad.rightTrigger();       // 0..1
Gamepad.isLeftTriggerPressed();
Gamepad.isRightTriggerPressed();
```

Stick x/y = `-1..1`, magnitude = `0..1`. Defaults: `DEADZONE=0.15`, `TRIGGER_THRESHOLD=0.1`.

```js
Gamepad.DEADZONE = 0.2;
Gamepad.TRIGGER_THRESHOLD = 0.5;
```

`DEADZONE` removes drift and renormalizes values above it.

### GamepadButton

`A=0, B=1, X=2, Y=3, LB=4, RB=5, LT=6, RT=7, Select=8, Start=9, LS=10, RS=11, DPadUp=12, DPadDown=13, DPadLeft=14, DPadRight=15, Home=16`.

## InputManager

`Input` unifies Keyboard, Gamepad, and Touch. No initialization.

```js
import { Input } from "kernelplay-js";
```

### Predefined Actions

```text
moveRight: ArrowRight,D / DPadRight
moveLeft: ArrowLeft,A / DPadLeft
moveUp: ArrowUp,W / DPadUp
moveDown: ArrowDown,S / DPadDown
jump: Space,W / A
attack: Z,J / X
altAttack: X,K / Y
interact: E,F / B
dash: Shift / RB
guard: Ctrl / LB
pause: Escape / Start
confirm: Enter,Space / A
cancel: Escape / B
run: Shift / B
crouch: ArrowDown,S / DPadDown
shoot: Z / RT
reload: R / X
melee: V / RS
aim: X / LT
openMap: M / Select
openInv: I / Y
hotkey1: 1 / DPadUp
hotkey2: 2 / DPadDown
hotkey3: 3 / DPadLeft
hotkey4: 4 / DPadRight
```

### Actions

```js
Input.isPressed("attack");
Input.wasPressed("jump");
Input.wasReleased("jump");
```

### Axes

```js
const h = Input.getAxis("horizontal");
const v = Input.getAxis("vertical");
```

Priority: **Gamepad stick → Touch joystick → Keyboard**.

`horizontal` = left/right; `vertical` = up/down; `horizontalRight` = right-stick X; `verticalRight` = right-stick Y; `triggerLeft` = LT; `triggerRight` = RT.

Keyboard axes are `-1/0/1`; Gamepad/Touch can be fractional.

### Custom Actions

```js
Input.registerAction("shoot", {
  keys: [KeyCode.Z, KeyCode.X],
  buttons: [GamepadButton.X, GamepadButton.RB]
});
Input.setBinding("jump", {
  keys: [KeyCode.Space, KeyCode.ArrowUp],
  buttons: [GamepadButton.A, GamepadButton.B]
});
```

Register before `game.start()`.

### JSON Config

```json
{
  "actions": {
    "jump": {"keys":["Space","ArrowUp"],"buttons":["A","B"]},
    "go": {"keys":["x","z"],"buttons":["DPadRight"]}
  }
}
```

New actions are added; existing actions override defaults; omitted actions remain unchanged.

```js
await Input.loadConfig("./input.config.json");
new MyGame({width:800,height:600,fps:60}).start();
```

JSON keys match `KeyCode`; button names match `GamepadButton`.

### Sensitivity

```js
Input.GAMEPAD_SENSITIVITY = 0.8; // default 1.0
Input.TOUCH_SENSITIVITY = 0.6;   // default 1.0
```

Applied by `getAxis()`; keyboard is unaffected.

### Input API

```js
Input.isPressed(action);
Input.wasPressed(action);
Input.wasReleased(action);
Input.getAxis(axis);

Input.registerAction(name, binding);
Input.setBinding(name, binding);
Input.loadConfig(path);

Input.isTouchDevice();
Input.isGamepadConnected();

Input.keyboard;
Input.gamepad;
Input.touch;
Input.mouse;

Input.GAMEPAD_SENSITIVITY; // 1.0
Input.TOUCH_SENSITIVITY;   // 1.0
Input.DEADZONE;            // 0.15
```

## Typical Controller

```js
import { Input } from "kernelplay-js";

update(dt) {
  const x = Input.getAxis("horizontal");
  const y = Input.getAxis("vertical");
  this.rb.addForce(800*x, 800*y);
  if (Input.wasPressed("jump")) this.jump();
  if (Input.isPressed("attack")) this.attack();
  if (Input.wasPressed("dash")) this.dash();
}
```

Use `Input` for normal gameplay; use `Gamepad` or `Touch` directly for device-specific behavior.
