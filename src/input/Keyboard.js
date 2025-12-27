export class Keyboard {
  static keys = {};

  static init() {
    window.addEventListener("keydown", e => {
      Keyboard.keys[e.key] = true;
    });

    window.addEventListener("keyup", e => {
      Keyboard.keys[e.key] = false;
    });
  }

  static isPressed(key) {
    return !!Keyboard.keys[key];
  }
}
