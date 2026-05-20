import { UIElement } from "./UIElement.js";

// ═══════════════════════════════════════════════════════════════════
//  UIPanel  — container with background and optional border
// ═══════════════════════════════════════════════════════════════════

export class UIPanel extends UIElement {
    constructor(options = {}) {
        super({ name: "UIPanel", ...options });
    }

    draw(ctx) {
        const x  = this._x - this.width  * 0.5;
        const y  = this._y - this.height * 0.5;
        const r  = this._s("borderRadius");
        const bw = this._s("borderWidth");

        this._drawRoundedRect(ctx, x, y, this.width, this.height, r);
        ctx.fillStyle = this._s("surfaceColor");
        ctx.fill();

        if (bw > 0) {
            ctx.strokeStyle = this._s("borderColor");
            ctx.lineWidth   = bw;
            ctx.stroke();
        }
    }
}

// ═══════════════════════════════════════════════════════════════════
//  UIText  — label / text display
// ═══════════════════════════════════════════════════════════════════

export class UIText extends UIElement {
    constructor({ text = "Text", ...options } = {}) {
        super({ name: "UIText", interactive: false, ...options });
        this.text = text;
    }

    draw(ctx) {
        ctx.fillStyle    = this._s("textColor");
        ctx.font         = `${this._s("fontWeight")} ${this._s("fontSize")}px ${this._s("fontFamily")}`;
        ctx.textAlign    = this._s("textAlign");
        ctx.textBaseline = this._s("textBaseline");
        ctx.fillText(this.text, this._x, this._y);
    }
}

// ═══════════════════════════════════════════════════════════════════
//  UIButton  — clickable panel + label with hover / press states
// ═══════════════════════════════════════════════════════════════════

export class UIButton extends UIElement {
    constructor({ label = "Button", disabled = false, ...options } = {}) {
        super({ name: "UIButton", interactive: true, ...options });
        this.label    = label;
        this.disabled = disabled;
        this._pressed = false;
    }

    draw(ctx) {
        const x  = this._x - this.width  * 0.5;
        const y  = this._y - this.height * 0.5;
        const r  = this._s("borderRadius");
        const bw = this._s("borderWidth");

        // background color — disabled / press / hover / normal
        let bg;
        if (this.disabled)   bg = this._s("disabledColor");
        else if (this._pressed) bg = this._s("pressColor");
        else if (this._hovered) bg = this._s("hoverColor");
        else                    bg = this._s("primaryColor");

        this._drawRoundedRect(ctx, x, y, this.width, this.height, r);
        ctx.fillStyle = bg;
        ctx.fill();

        if (bw > 0) {
            ctx.strokeStyle = this._s("borderColor");
            ctx.lineWidth   = bw;
            ctx.stroke();
        }

        // label
        const textColor = this.disabled ? this._s("disabledTextColor") : this._s("textColor");
        ctx.fillStyle    = textColor;
        ctx.font         = `${this._s("fontWeight")} ${this._s("fontSize")}px ${this._s("fontFamily")}`;
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.label, this._x, this._y);
    }

    _onPointerDown() {
        if (this.disabled) return;
        this._pressed = true;
    }

    _onPointerUp() {
        if (this.disabled) return;
        if (this._pressed) {
            this._pressed = false;
            this.onClick?.();
        }
    }

    _onPointerExit() {
        this._hovered = false;
        this._pressed = false;
        this.onHoverExit?.();
    }
}

// ═══════════════════════════════════════════════════════════════════
//  UIImage  — draws an image or sprite
// ═══════════════════════════════════════════════════════════════════

export class UIImage extends UIElement {
    constructor({ src = null, ...options } = {}) {
        super({ name: "UIImage", interactive: false, ...options });
        this.src   = src;
        this._img  = null;
        this._loaded = false;
    }

    init() {
        if (!this.src) return;
        this._img = new Image();
        this._img.onload  = () => { this._loaded = true; };
        this._img.onerror = () => { console.warn(`UIImage: failed to load ${this.src}`); };
        this._img.src = this.src;
    }

    draw(ctx) {
        const x = this._x - this.width  * 0.5;
        const y = this._y - this.height * 0.5;

        if (this._loaded && this._img) {
            ctx.drawImage(this._img, x, y, this.width, this.height);
        } else {
            // placeholder while loading
            ctx.fillStyle = this._s("surfaceColor");
            ctx.fillRect(x, y, this.width, this.height);
            ctx.strokeStyle = this._s("borderColor");
            ctx.strokeRect(x, y, this.width, this.height);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════
//  UIProgressBar  — fill ratio 0..1, supports direction + colors
// ═══════════════════════════════════════════════════════════════════

export class UIProgressBar extends UIElement {
    constructor({
        value     = 1,       // 0..1
        direction = "left",  // "left" | "right" | "up" | "down"
        showText  = false,
        ...options
    } = {}) {
        super({ name: "UIProgressBar", interactive: false, ...options });
        this.value     = Math.max(0, Math.min(1, value));
        this.direction = direction;
        this.showText  = showText;
    }

    /** Set value — clamped to 0..1. */
    setValue(v) {
        this.value = Math.max(0, Math.min(1, v));
    }

    draw(ctx) {
        const x  = this._x - this.width  * 0.5;
        const y  = this._y - this.height * 0.5;
        const r  = this._s("borderRadius");

        // track
        this._drawRoundedRect(ctx, x, y, this.width, this.height, r);
        ctx.fillStyle = this._s("progressTrackColor");
        ctx.fill();

        // fill
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, this.width, this.height);
        ctx.clip();

        const fillColor = this._s("progressFillColor");
        ctx.fillStyle   = fillColor;

        switch (this.direction) {
            case "left":
                ctx.fillRect(x, y, this.width * this.value, this.height);
                break;
            case "right":
                ctx.fillRect(x + this.width * (1 - this.value), y, this.width * this.value, this.height);
                break;
            case "up":
                ctx.fillRect(x, y + this.height * (1 - this.value), this.width, this.height * this.value);
                break;
            case "down":
                ctx.fillRect(x, y, this.width, this.height * this.value);
                break;
        }

        ctx.restore();

        // border
        const bw = this._s("borderWidth");
        if (bw > 0) {
            this._drawRoundedRect(ctx, x, y, this.width, this.height, r);
            ctx.strokeStyle = this._s("borderColor");
            ctx.lineWidth   = bw;
            ctx.stroke();
        }

        // optional percentage text
        if (this.showText) {
            ctx.fillStyle    = this._s("textColor");
            ctx.font         = `${this._s("fontSize")}px ${this._s("fontFamily")}`;
            ctx.textAlign    = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${Math.round(this.value * 100)}%`, this._x, this._y);
        }
    }
}

// ═══════════════════════════════════════════════════════════════════
//  UICheckbox  — toggle with label
// ═══════════════════════════════════════════════════════════════════

export class UICheckbox extends UIElement {
    constructor({ checked = false, label = "Option", ...options } = {}) {
        super({ name: "UICheckbox", interactive: true, ...options });
        this.checked = checked;
        this.label   = label;
        this.onChange = null;
    }

    draw(ctx) {
        const size = this._s("checkSize");
        const bx   = this._x - this.width * 0.5;
        const by   = this._y - size * 0.5;
        const r    = 4;

        // box background
        this._drawRoundedRect(ctx, bx, by, size, size, r);
        ctx.fillStyle = this._hovered
            ? this._s("hoverColor")
            : this._s("inputBackground");
        ctx.fill();

        // box border
        ctx.strokeStyle = this.checked ? this._s("checkColor") : this._s("borderColor");
        ctx.lineWidth   = this._s("borderWidth") + 1;
        ctx.stroke();

        // checkmark
        if (this.checked) {
            ctx.strokeStyle = this._s("checkColor");
            ctx.lineWidth   = 2.5;
            ctx.lineCap     = "round";
            ctx.lineJoin    = "round";
            ctx.beginPath();
            ctx.moveTo(bx + size * 0.2, by + size * 0.5);
            ctx.lineTo(bx + size * 0.45, by + size * 0.75);
            ctx.lineTo(bx + size * 0.8,  by + size * 0.25);
            ctx.stroke();
        }

        // label
        ctx.fillStyle    = this._s("textColor");
        ctx.font         = `${this._s("fontSize")}px ${this._s("fontFamily")}`;
        ctx.textAlign    = "left";
        ctx.textBaseline = "middle";
        ctx.fillText(this.label, bx + size + 8, this._y);
    }

    _onPointerUp() {
        this.checked = !this.checked;
        this.onClick?.();
        this.onChange?.(this.checked);
    }
}

// ═══════════════════════════════════════════════════════════════════
//  UISlider  — draggable track + handle, value 0..1
// ═══════════════════════════════════════════════════════════════════

export class UISlider extends UIElement {
    constructor({ value = 0.5, min = 0, max = 1, showValue = false, ...options } = {}) {
        super({ name: "UISlider", interactive: true, ...options });
        this.value     = value;
        this.min       = min;
        this.max       = max;
        this.showValue = showValue;
        this._dragging = false;
        this.onChange  = null;
    }

    /** Normalized 0..1 position of handle. */
    get _normalized() {
        return (this.value - this.min) / (this.max - this.min);
    }

    draw(ctx) {
        const trackH  = 6;
        const x       = this._x - this.width * 0.5;
        const trackY  = this._y - trackH * 0.5;
        const hr      = this._s("sliderHandleRadius");

        // track background
        this._drawRoundedRect(ctx, x, trackY, this.width, trackH, trackH * 0.5);
        ctx.fillStyle = this._s("sliderTrackColor");
        ctx.fill();

        // filled portion
        const fillW = this.width * this._normalized;
        this._drawRoundedRect(ctx, x, trackY, fillW, trackH, trackH * 0.5);
        ctx.fillStyle = this._s("sliderHandleColor");
        ctx.fill();

        // handle
        const hx = x + fillW;
        ctx.beginPath();
        ctx.arc(hx, this._y, this._dragging ? hr + 2 : hr, 0, Math.PI * 2);
        ctx.fillStyle = this._s("sliderHandleColor");
        ctx.fill();
        ctx.strokeStyle = this._s("borderColor");
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        // optional value label
        if (this.showValue) {
            ctx.fillStyle    = this._s("textSecondary");
            ctx.font         = `${this._s("fontSize") - 2}px ${this._s("fontFamily")}`;
            ctx.textAlign    = "center";
            ctx.textBaseline = "top";
            ctx.fillText(this.value.toFixed(2), hx, this._y + hr + 4);
        }
    }

    _setFromX(px) {
        const x  = this._x - this.width * 0.5;
        const t  = Math.max(0, Math.min(1, (px - x) / this.width));
        this.value = this.min + t * (this.max - this.min);
        this.onChange?.(this.value);
    }

    _onPointerDown(px) { this._dragging = true; this._setFromX(px); }
    _onPointerMove(px) { if (this._dragging) this._setFromX(px); }
    _onPointerUp()     { this._dragging = false; }
    _onPointerExit()   { this._hovered = false; this._dragging = false; this.onHoverExit?.(); }
}

// ═══════════════════════════════════════════════════════════════════
//  UIInputField  — text input with cursor + focus state
// ═══════════════════════════════════════════════════════════════════

export class UIInputField extends UIElement {
    constructor({
        placeholder = "Type here...",
        value       = "",
        maxLength   = 100,
        password    = false,
        ...options
    } = {}) {
        super({ name: "UIInputField", interactive: true, ...options });
        this.value       = value;
        this.placeholder = placeholder;
        this.maxLength   = maxLength;
        this.password    = password;

        this._focused    = false;
        this._cursor     = value.length;
        this._blink      = true;
        this._blinkTimer = 0;

        this.onSubmit    = null;   // called on Enter
        this.onChange    = null;   // called on every keystroke

        this._boundKey   = null;   // keyboard listener reference
    }

    init() {
        this._boundKey = (e) => this._onKey(e);
    }

    update(dt) {
        if (!this._focused) return;
        this._blinkTimer += dt * 1000;
        if (this._blinkTimer >= this._s("cursorBlinkRate")) {
            this._blink      = !this._blink;
            this._blinkTimer = 0;
        }
    }

    draw(ctx) {
        const x  = this._x - this.width  * 0.5;
        const y  = this._y - this.height * 0.5;
        const r  = this._s("borderRadius");
        const p  = this._s("padding");

        // background
        this._drawRoundedRect(ctx, x, y, this.width, this.height, r);
        ctx.fillStyle = this._s("inputBackground");
        ctx.fill();

        // border — focused = highlight color
        ctx.strokeStyle = this._focused ? this._s("inputFocusColor") : this._s("inputBorderColor");
        ctx.lineWidth   = this._focused ? 2 : this._s("borderWidth");
        ctx.stroke();

        // text / placeholder
        const fs   = this._s("fontSize");
        const text = this.password
            ? "•".repeat(this.value.length)
            : this.value;

        ctx.font         = `${fs}px ${this._s("fontFamily")}`;
        ctx.textBaseline = "middle";
        ctx.textAlign    = "left";

        // clip text inside field
        ctx.save();
        ctx.beginPath();
        ctx.rect(x + p, y, this.width - p * 2, this.height);
        ctx.clip();

        if (this.value.length === 0 && !this._focused) {
            ctx.fillStyle = this._s("textSecondary");
            ctx.fillText(this.placeholder, x + p, this._y);
        } else {
            ctx.fillStyle = this._s("textColor");
            ctx.fillText(text, x + p, this._y);

            // cursor
            if (this._focused && this._blink) {
                const cursorText = text.slice(0, this._cursor);
                const cx = x + p + ctx.measureText(cursorText).width;
                ctx.fillStyle = this._s("cursorColor");
                ctx.fillRect(cx, y + 5, 2, this.height - 10);
            }
        }

        ctx.restore();
    }

    _onKey(e) {
        if (!this._focused) return;

        if (e.key === "Enter") {
            this.onSubmit?.(this.value);
            return;
        }
        if (e.key === "Escape") {
            this._blur();
            return;
        }
        if (e.key === "Backspace") {
            if (this._cursor > 0) {
                this.value = this.value.slice(0, this._cursor - 1) + this.value.slice(this._cursor);
                this._cursor--;
                this.onChange?.(this.value);
            }
            return;
        }
        if (e.key === "Delete") {
            this.value = this.value.slice(0, this._cursor) + this.value.slice(this._cursor + 1);
            this.onChange?.(this.value);
            return;
        }
        if (e.key === "ArrowLeft")  { this._cursor = Math.max(0, this._cursor - 1); return; }
        if (e.key === "ArrowRight") { this._cursor = Math.min(this.value.length, this._cursor + 1); return; }
        if (e.key === "Home")       { this._cursor = 0; return; }
        if (e.key === "End")        { this._cursor = this.value.length; return; }

        // printable characters
        if (e.key.length === 1 && this.value.length < this.maxLength) {
            this.value = this.value.slice(0, this._cursor) + e.key + this.value.slice(this._cursor);
            this._cursor++;
            this.onChange?.(this.value);
        }
    }

    _focus() {
        if (this._focused) return;
        this._focused    = true;
        this._blink      = true;
        this._blinkTimer = 0;
        this._cursor     = this.value.length;
        window.addEventListener("keydown", this._boundKey);
    }

    _blur() {
        if (!this._focused) return;
        this._focused = false;
        window.removeEventListener("keydown", this._boundKey);
    }

    _onPointerDown() { this._focus(); }

    destroy() {
        this._blur();
    }
}