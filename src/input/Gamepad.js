export class Gamepad {
    static #pad = null;

    static #buttons = {};
    static #justPressed = {};
    static #justReleased = {};

    static #axes = {};

    static DEADZONE = 0.15;
    static TRIGGER_THRESHOLD = 0.1;

    static init() {
        window.addEventListener("gamepadconnected", (e) => {
            Gamepad.#pad = e.gamepad;
        });

        window.addEventListener("gamepaddisconnected", () => {
            Gamepad.#pad = null;
            Gamepad.#buttons = {};
            Gamepad.#justPressed = {};
            Gamepad.#justReleased = {};
            Gamepad.#axes = {};
        });
    }

    static isConnected() {
        return Gamepad.#pad !== null;
    }

    // call once per frame, before scripts update
    static update() {
        // Gamepad API requires polling — re-fetch each frame
        const pads = navigator.getGamepads();
        Gamepad.#pad = pads[0] ?? null;

        Gamepad.#justPressed = {};
        Gamepad.#justReleased = {};

        if (!Gamepad.#pad) return;

        // --- Buttons ---
        Gamepad.#pad.buttons.forEach((btn, index) => {
            const key = String(index);
            const wasDown = !!Gamepad.#buttons[key];
            const isDown = btn.pressed;

            if (isDown && !wasDown) Gamepad.#justPressed[key] = true;
            if (!isDown && wasDown) Gamepad.#justReleased[key] = true;

            Gamepad.#buttons[key] = isDown;
        });

        // --- Axes ---
        Gamepad.#pad.axes.forEach((value, index) => {
            Gamepad.#axes[index] = value;
        });
    }

    // --- Button methods ---

    static isPressed(button) {
        return !!Gamepad.#buttons[String(button)];
    }

    static wasPressed(button) {
        return !!Gamepad.#justPressed[String(button)];
    }

    static wasReleased(button) {
        return !!Gamepad.#justReleased[String(button)];
    }

    // --- Stick methods ---

    static #applyDeadzone(x, y) {
        const magnitude = Math.sqrt(x * x + y * y);
        if (magnitude < Gamepad.DEADZONE) return { x: 0, y: 0, magnitude: 0 };

        // normalize within deadzone range so it starts from 0, not DEADZONE
        const normalized = (magnitude - Gamepad.DEADZONE) / (1 - Gamepad.DEADZONE);
        const scale = normalized / magnitude;
        return {
            x: x * scale,
            y: y * scale,
            magnitude: Math.min(normalized, 1)
        };
    }

    // Returns { x, y, magnitude } — deadzone applied, normalized direction
    static leftStick() {
        const x = Gamepad.#axes[0] ?? 0;
        const y = Gamepad.#axes[1] ?? 0;
        return Gamepad.#applyDeadzone(x, y);
    }

    static rightStick() {
        const x = Gamepad.#axes[2] ?? 0;
        const y = Gamepad.#axes[3] ?? 0;
        return Gamepad.#applyDeadzone(x, y);
    }

    // --- Trigger methods ---

    // Raw analog value (0 to 1)
    static leftTrigger() {
        return Gamepad.#pad?.buttons[6]?.value ?? 0;
    }

    static rightTrigger() {
        return Gamepad.#pad?.buttons[7]?.value ?? 0;
    }

    // Digital threshold check
    static isLeftTriggerPressed() {
        return Gamepad.leftTrigger() >= Gamepad.TRIGGER_THRESHOLD;
    }

    static isRightTriggerPressed() {
        return Gamepad.rightTrigger() >= Gamepad.TRIGGER_THRESHOLD;
    }
}