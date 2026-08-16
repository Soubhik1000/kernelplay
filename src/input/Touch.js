export class Touch {
  static #joystick = {
    active: false,
    touchId: null,
    originX: 0, originY: 0,
    currentX: 0, currentY: 0,
    radius: 60,
  };

  static #swipe = {
    active: false,
    touchId: null,
    startX: 0, startY: 0,
    threshold: 20,
  };

  static #swipeUp    = false;
  static #swipeLeft  = false;
  static #swipeRight = false;
  static #swipeDown  = false;

  // Normalized joystick output (-1 to 1)
  static axis = { x: 0, y: 0 };

  static init(canvas) {
    const LEFT_ZONE = canvas.width * 0.5; // left half = joystick

    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        // Left half → joystick
        if (t.clientX < LEFT_ZONE && !Touch.#joystick.active) {
          Touch.#joystick.active  = true;
          Touch.#joystick.touchId = t.identifier;
          Touch.#joystick.originX  = t.clientX;
          Touch.#joystick.originY  = t.clientY;
          Touch.#joystick.currentX = t.clientX;
          Touch.#joystick.currentY = t.clientY;
        }
        // Right half → swipe
        if (t.clientX >= LEFT_ZONE && !Touch.#swipe.active) {
          Touch.#swipe.active  = true;
          Touch.#swipe.touchId = t.identifier;
          Touch.#swipe.startX  = t.clientX;
          Touch.#swipe.startY  = t.clientY;
        }
      }
    }, { passive: false });

    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        if (t.identifier === Touch.#joystick.touchId) {
          Touch.#joystick.currentX = t.clientX;
          Touch.#joystick.currentY = t.clientY;

          const dx = t.clientX - Touch.#joystick.originX;
          const dy = t.clientY - Touch.#joystick.originY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const clamped = Math.min(dist, Touch.#joystick.radius);
          const angle = Math.atan2(dy, dx);

          Touch.axis.x = (clamped / Touch.#joystick.radius) * Math.cos(angle);
          Touch.axis.y = (clamped / Touch.#joystick.radius) * Math.sin(angle);
        }
      }
    }, { passive: false });

    canvas.addEventListener("touchend", (e) => {
      e.preventDefault();
      for (const t of e.changedTouches) {
        if (t.identifier === Touch.#joystick.touchId) {
          Touch.#joystick.active  = false;
          Touch.#joystick.touchId = null;
          Touch.axis.x = 0;
          Touch.axis.y = 0;
        }
        if (t.identifier === Touch.#swipe.touchId) {
          const dx = t.clientX - Touch.#swipe.startX;
          const dy = t.clientY - Touch.#swipe.startY;
          const absDx = Math.abs(dx);
          const absDy = Math.abs(dy);

          if (Math.max(absDx, absDy) >= Touch.#swipe.threshold) {
            if (absDy > absDx) {
              if (dy < 0) Touch.#swipeUp   = true;
              else        Touch.#swipeDown  = true;
            } else {
              if (dx < 0) Touch.#swipeLeft  = true;
              else        Touch.#swipeRight = true;
            }
          }

          Touch.#swipe.active  = false;
          Touch.#swipe.touchId = null;
        }
      }
    }, { passive: false });
  }

  // Joystick
  static getAxis()         { return Touch.axis; }
  static joystickActive()  { return Touch.#joystick.active; }
  static joystickOrigin()  { return { x: Touch.#joystick.originX, y: Touch.#joystick.originY }; }
  static joystickCurrent() { return { x: Touch.#joystick.currentX, y: Touch.#joystick.currentY }; }
  static joystickRadius()  { return Touch.#joystick.radius; }

  // Swipes — consumed on read, same as wasPressed pattern
  static swipeUp()    { const v = Touch.#swipeUp;    Touch.#swipeUp    = false; return v; }
  static swipeDown()  { const v = Touch.#swipeDown;  Touch.#swipeDown  = false; return v; }
  static swipeLeft()  { const v = Touch.#swipeLeft;  Touch.#swipeLeft  = false; return v; }
  static swipeRight() { const v = Touch.#swipeRight; Touch.#swipeRight = false; return v; }

  // Reset per-frame swipes (call in update before scripts)
  static update() {
    // Swipes are consumed on read so no frame reset needed
    // This exists for API consistency with Keyboard/GPad
  }

  // Joystick renderer data (for drawing the UI overlay)
  static getJoystickState() {
    return {
      active:   Touch.#joystick.active,
      originX:  Touch.#joystick.originX,
      originY:  Touch.#joystick.originY,
      currentX: Touch.#joystick.currentX,
      currentY: Touch.#joystick.currentY,
      radius:   Touch.#joystick.radius,
    };
  }
}