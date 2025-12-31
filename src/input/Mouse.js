export class Mouse {
  static x = 0;
  static y = 0;

  static buttons = {};
  static justPressed = {};
  static justReleased = {};

  static init(canvas) {
    // Mouse move
    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      Mouse.x = e.clientX - rect.left;
      Mouse.y = e.clientY - rect.top;
    });

    // Mouse down
    canvas.addEventListener("mousedown", (e) => {
      if (!Mouse.buttons[e.button]) {
        Mouse.justPressed[e.button] = true;
      }
      Mouse.buttons[e.button] = true;
    });

    // Mouse up
    canvas.addEventListener("mouseup", (e) => {
      Mouse.buttons[e.button] = false;
      Mouse.justReleased[e.button] = true;
    });

    // Prevent right-click menu (optional)
    canvas.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  // Button is held
  static isPressed(button) {
    return !!Mouse.buttons[button];
  }

  // Button pressed this frame
  static wasPressed(button) {
    return !!Mouse.justPressed[button];
  }

  // Button released this frame
  static wasReleased(button) {
    return !!Mouse.justReleased[button];
  }

  // Clear per-frame state (call END of frame)
  static update() {
    Mouse.justPressed = {};
    Mouse.justReleased = {};
  }
}
