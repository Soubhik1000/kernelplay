export class Keyboard {
  static keys = {};
  static justPressed = {};
  static justReleased = {};

  static init() {
    window.addEventListener("keydown", (e) => {
      if (!Keyboard.keys[e.key]) {
        Keyboard.justPressed[e.key] = true;
      }
      Keyboard.keys[e.key] = true;
    });

    window.addEventListener("keyup", (e) => {
      Keyboard.keys[e.key] = false;
      Keyboard.justReleased[e.key] = true;
    });
  }

  // key is currently pressed
  static isPressed(key) {
    return !!Keyboard.keys[key];
  }

  // key was just pressed this frame
  static wasPressed(key) {
    return !!Keyboard.justPressed[key];
  }

  // key was just released this frame
  static wasReleased(key) {
    return !!Keyboard.justReleased[key];
  }

  // reset per-frame keys (call once per frame)
  static update() {
    Keyboard.justPressed = {};
    Keyboard.justReleased = {};
  }
}
