import { Keyboard } from "./Keyboard.js";
import { KeyCode } from "../utils/KeyCode.js";
import { Gamepad, GamepadButton } from "./Gamepad.js";
import { Touch } from "./Touch.js";
import { Mouse } from "./Mouse.js";
import { MouseButton } from "../utils/MouseButton.js";

export class Input {

  // ─── Action Map ────────────────────────────────────────────────────────────
  // Like Unity's Input Manager — edit bindings here or call Input.setBinding()

  // static #actions = {
  //   // Movement
  //   moveRight:  { keys: [KeyCode.ArrowRight, KeyCode.D], buttons: [GamepadButton.DPadRight] },
  //   moveLeft:   { keys: [KeyCode.ArrowLeft,  KeyCode.A], buttons: [GamepadButton.DPadLeft]  },
  //   moveUp:     { keys: [KeyCode.ArrowUp,    KeyCode.W], buttons: [GamepadButton.DPadUp]    },
  //   moveDown:   { keys: [KeyCode.ArrowDown,  KeyCode.S], buttons: [GamepadButton.DPadDown]  },

  //   // Actions
  //   jump:       { keys: [KeyCode.Space, KeyCode.W],  buttons: [GamepadButton.A]      },
  //   attack:     { keys: [KeyCode.Z, KeyCode.J],      buttons: [GamepadButton.X]      },
  //   interact:   { keys: [KeyCode.E, KeyCode.F],      buttons: [GamepadButton.B]      },
  //   pause:      { keys: [KeyCode.Escape],            buttons: [GamepadButton.Start]  },
  //   dash:       { keys: [KeyCode.Shift],             buttons: [GamepadButton.RB]     },
  // };

  static #actions = {

    // ─── Movement ─────────────────────────────────────────────────────────────
    moveRight: { keys: [KeyCode.ArrowRight, KeyCode.D], buttons: [GamepadButton.DPadRight] },
    moveLeft: { keys: [KeyCode.ArrowLeft, KeyCode.A], buttons: [GamepadButton.DPadLeft] },
    moveUp: { keys: [KeyCode.ArrowUp, KeyCode.W], buttons: [GamepadButton.DPadUp] },
    moveDown: { keys: [KeyCode.ArrowDown, KeyCode.S], buttons: [GamepadButton.DPadDown] },

    // ─── Common Actions ───────────────────────────────────────────────────────
    jump: { keys: [KeyCode.Space, KeyCode.W], buttons: [GamepadButton.A] },
    attack: { keys: [KeyCode.Z, KeyCode.J], buttons: [GamepadButton.X] },
    altAttack: { keys: [KeyCode.X, KeyCode.K], buttons: [GamepadButton.Y] },
    interact: { keys: [KeyCode.E, KeyCode.F], buttons: [GamepadButton.B] },
    dash: { keys: [KeyCode.Shift], buttons: [GamepadButton.RB] },
    guard: { keys: [KeyCode.Ctrl], buttons: [GamepadButton.LB] },

    // ─── UI / System ──────────────────────────────────────────────────────────
    pause: { keys: [KeyCode.Escape], buttons: [GamepadButton.Start] },
    confirm: { keys: [KeyCode.Enter, KeyCode.Space], buttons: [GamepadButton.A] },
    cancel: { keys: [KeyCode.Escape, KeyCode.X], buttons: [GamepadButton.B] },
    menuUp: { keys: [KeyCode.ArrowUp, KeyCode.W], buttons: [GamepadButton.DPadUp] },
    menuDown: { keys: [KeyCode.ArrowDown, KeyCode.S], buttons: [GamepadButton.DPadDown] },
    menuLeft: { keys: [KeyCode.ArrowLeft, KeyCode.A], buttons: [GamepadButton.DPadLeft] },
    menuRight: { keys: [KeyCode.ArrowRight, KeyCode.D], buttons: [GamepadButton.DPadRight] },

    // ─── Camera ───────────────────────────────────────────────────────────────
    camUp: { keys: [KeyCode.I], buttons: [GamepadButton.DPadUp] },
    camDown: { keys: [KeyCode.K], buttons: [GamepadButton.DPadDown] },
    camLeft: { keys: [KeyCode.J], buttons: [GamepadButton.DPadLeft] },
    camRight: { keys: [KeyCode.L], buttons: [GamepadButton.DPadRight] },
    zoomIn: { keys: [KeyCode.Equals], buttons: [GamepadButton.RT] },
    zoomOut: { keys: [KeyCode.Minus], buttons: [GamepadButton.LT] },

    // ─── Platformer specific ──────────────────────────────────────────────────
    run: { keys: [KeyCode.Shift], buttons: [GamepadButton.B] },
    crouch: { keys: [KeyCode.ArrowDown, KeyCode.S], buttons: [GamepadButton.DPadDown] },
    wallGrab: { keys: [KeyCode.ArrowUp], buttons: [GamepadButton.LB] },

    // ─── Shooter specific ────────────────────────────────────────────────────
    shoot: { keys: [KeyCode.Z], buttons: [GamepadButton.RT] },
    aim: { keys: [KeyCode.X], buttons: [GamepadButton.LT] },
    reload: { keys: [KeyCode.R], buttons: [GamepadButton.X] },
    melee: { keys: [KeyCode.V], buttons: [GamepadButton.RS] },

    // ─── Top-down / RPG specific ──────────────────────────────────────────────
    openMap: { keys: [KeyCode.M], buttons: [GamepadButton.Select] },
    openInv: { keys: [KeyCode.I], buttons: [GamepadButton.Y] },
    hotkey1: { keys: [KeyCode.Num1], buttons: [GamepadButton.DPadUp] },
    hotkey2: { keys: [KeyCode.Num2], buttons: [GamepadButton.DPadDown] },
    hotkey3: { keys: [KeyCode.Num3], buttons: [GamepadButton.DPadLeft] },
    hotkey4: { keys: [KeyCode.Num4], buttons: [GamepadButton.DPadRight] },
  };

  // ─── Axis Deadzone ─────────────────────────────────────────────────────────
  static DEADZONE = 0.15;
  static GAMEPAD_SENSITIVITY = 1.0;
  static TOUCH_SENSITIVITY = 1.0;

  // ─── Update — call once per frame in Game loop ────────────────────────────
  static update() {
    // individual systems handle their own update
    // this exists for future axis smoothing or input buffering
  }

  // ─── Bindings ──────────────────────────────────────────────────────────────

  // Override or add a binding at runtime
  // Input.setBinding("jump", { keys: [KeyCode.Space], buttons: [GamepadButton.A] })
  static setBinding(action, binding) {
    Input.#actions[action] = binding;
  }

  // Register a completely new action
  static registerAction(name, binding) {
    Input.#actions[name] = binding;
  }

  // ─── isPressed — held down (any device) ───────────────────────────────────
  static isPressed(action) {
    const b = Input.#actions[action];
    if (!b) return false;

    // Keyboard
    if (b.keys?.some(k => Keyboard.isPressed(k))) return true;

    // Gamepad buttons
    if (b.buttons?.some(btn => Gamepad.isPressed(btn))) return true;

    // Gamepad axis as button
    if (action === "moveRight" && Input.getAxis("horizontal") > Input.DEADZONE) return true;
    if (action === "moveLeft" && Input.getAxis("horizontal") < -Input.DEADZONE) return true;
    if (action === "moveUp" && Input.getAxis("vertical") < -Input.DEADZONE) return true;
    if (action === "moveDown" && Input.getAxis("vertical") > Input.DEADZONE) return true;

    // Touch joystick as button
    const t = Touch.getAxis();
    if (action === "moveRight" && t.x > Input.DEADZONE) return true;
    if (action === "moveLeft" && t.x < -Input.DEADZONE) return true;
    if (action === "moveUp" && t.y < -Input.DEADZONE) return true;
    if (action === "moveDown" && t.y > Input.DEADZONE) return true;

    return false;
  }

  // ─── wasPressed — just pressed this frame (any device) ────────────────────
  static wasPressed(action) {
    const b = Input.#actions[action];
    if (!b) return false;

    if (b.keys?.some(k => Keyboard.wasPressed(k))) return true;
    if (b.buttons?.some(btn => Gamepad.wasPressed(btn))) return true;

    // Touch swipes as wasPressed
    if (action === "jump" && Touch.swipeUp()) return true;
    if (action === "moveRight" && Touch.swipeRight()) return true;
    if (action === "moveLeft" && Touch.swipeLeft()) return true;
    if (action === "moveDown" && Touch.swipeDown()) return true;

    // Mouse click as action
    if (action === "attack" && Mouse.wasPressed(MouseButton.Left)) return true;

    return false;
  }

  // ─── wasReleased — just released this frame (any device) ──────────────────
  static wasReleased(action) {
    const b = Input.#actions[action];
    if (!b) return false;

    if (b.keys?.some(k => Keyboard.wasReleased(k))) return true;
    if (b.buttons?.some(btn => Gamepad.wasReleased(btn))) return true;

    return false;
  }

  // ─── getAxis — smooth -1 to 1 (like Unity's Input.GetAxis) ───────────────
  // static getAxis(axis) {
  //   if (axis === "horizontal") {
  //     // Gamepad stick takes priority if active
  //     const gx = Gamepad.leftStick().x;
  //     if (Math.abs(gx) > Input.DEADZONE) return gx;

  //     // Touch joystick
  //     const tx = Touch.getAxis().x;
  //     if (Math.abs(tx) > Input.DEADZONE) return tx;

  //     // Keyboard — digital (-1, 0, 1)
  //     const right = Keyboard.isPressed(KeyCode.ArrowRight) || Keyboard.isPressed(KeyCode.D) ? 1 : 0;
  //     const left = Keyboard.isPressed(KeyCode.ArrowLeft) || Keyboard.isPressed(KeyCode.A) ? 1 : 0;
  //     return right - left;
  //   }

  //   if (axis === "vertical") {
  //     const gy = Gamepad.leftStick().y;
  //     if (Math.abs(gy) > Input.DEADZONE) return gy;

  //     const ty = Touch.getAxis().y;
  //     if (Math.abs(ty) > Input.DEADZONE) return ty;

  //     const down = Keyboard.isPressed(KeyCode.ArrowDown) || Keyboard.isPressed(KeyCode.S) ? 1 : 0;
  //     const up = Keyboard.isPressed(KeyCode.ArrowUp) || Keyboard.isPressed(KeyCode.W) ? 1 : 0;
  //     return down - up;
  //   }

  //   // Right stick axes
  //   if (axis === "horizontalRight") return Gamepad.rightStick().x;
  //   if (axis === "verticalRight") return Gamepad.rightStick().y;

  //   // Triggers
  //   if (axis === "triggerLeft") return Gamepad.leftTrigger();
  //   if (axis === "triggerRight") return Gamepad.rightTrigger();

  //   return 0;
  // }

  static getAxis(axis) {
    if (axis === "horizontal") {
      const gx = Gamepad.leftStick().x;
      if (Math.abs(gx) > Input.DEADZONE) return gx * Input.GAMEPAD_SENSITIVITY;

      const tx = Touch.getAxis().x;
      if (Math.abs(tx) > Input.DEADZONE) return tx * Input.TOUCH_SENSITIVITY;

      const right = Keyboard.isPressed(KeyCode.ArrowRight) || Keyboard.isPressed(KeyCode.D) ? 1 : 0;
      const left = Keyboard.isPressed(KeyCode.ArrowLeft) || Keyboard.isPressed(KeyCode.A) ? 1 : 0;
      return right - left;
    }

    if (axis === "vertical") {
      const gy = Gamepad.leftStick().y;
      if (Math.abs(gy) > Input.DEADZONE) return gy * Input.GAMEPAD_SENSITIVITY;

      const ty = Touch.getAxis().y;
      if (Math.abs(ty) > Input.DEADZONE) return ty * Input.TOUCH_SENSITIVITY;

      const down = Keyboard.isPressed(KeyCode.ArrowDown) || Keyboard.isPressed(KeyCode.S) ? 1 : 0;
      const up = Keyboard.isPressed(KeyCode.ArrowUp) || Keyboard.isPressed(KeyCode.W) ? 1 : 0;
      return down - up;
    }

    if (axis === "horizontalRight") return Gamepad.rightStick().x * Input.GAMEPAD_SENSITIVITY;
    if (axis === "verticalRight") return Gamepad.rightStick().y * Input.GAMEPAD_SENSITIVITY;
    if (axis === "triggerLeft") return Gamepad.leftTrigger();
    if (axis === "triggerRight") return Gamepad.rightTrigger();

    return 0;
  }

  // ─── Device detection ─────────────────────────────────────────────────────
  static isTouchDevice() { return navigator.maxTouchPoints > 0; }
  static isGamepadConnected() { return Gamepad.isConnected(); }

  // ─── Raw passthrough — escape hatch if needed ─────────────────────────────
  static get keyboard() { return Keyboard; }
  static get gamepad() { return Gamepad; }
  static get touch() { return Touch; }
  static get mouse() { return Mouse; }

  static async loadConfig(path) {
    try {
      const res = await fetch(path);
      const json = await res.json();

      if (!json.actions) {
        console.warn("Input: config missing 'actions' key");
        return;
      }

      for (const [name, binding] of Object.entries(json.actions)) {
        // Resolve string key names → actual KeyCode values
        const keys = binding.keys?.map(k => KeyCode[k] ?? k) ?? [];

        // Resolve string button names → actual GamepadButton values
        const buttons = binding.buttons?.map(b => GamepadButton[b] ?? b) ?? [];

        Input.#actions[name] = { keys, buttons };
      }

      console.log(`Input: loaded ${Object.keys(json.actions).length} actions from ${path}`);
    } catch (err) {
      console.error("Input: failed to load config", err);
    }
  }
}