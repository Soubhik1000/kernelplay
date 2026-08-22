import { UIElement } from "./Uielement.js";

export class UIJoystick extends UIElement {
    constructor(options = {}) {
        super(options);

        this.mode = options.mode || "static";

        this.staticX = options.x ?? 120;
        this.staticY = options.y ?? 480;

        this.radius = options.radius ?? 50;
        this.knobRadius = options.knobRadius ?? this.radius / 2;

        this.canvas = options.canvas || null;

        // Area entro cui è possibile attivare il joystick statico.
        // Puoi metterla a this.radius se vuoi che si attivi solo dentro la base.
        this.activationRadius = options.activationRadius ?? this.radius * 1.5;

        this.active = false;

        this.originX = this.staticX;
        this.originY = this.staticY;

        this.currentX = this.staticX;
        this.currentY = this.staticY;

        this.activePointerId = null;

        this._bindEvents();
    }

    get maxTravel() {
        return Math.max(0, this.radius - this.knobRadius);
    }

    getVector() {
        if (!this.active) {
            return { x: 0, y: 0 };
        }

        const maxTravel = this.maxTravel;

        if (maxTravel <= 0) {
            return { x: 0, y: 0 };
        }

        let x = (this.currentX - this.originX) / maxTravel;
        let y = (this.currentY - this.originY) / maxTravel;

        // Sicurezza numerica: assicura che la magnitudine non superi mai 1.
        const length = Math.hypot(x, y);

        if (length > 1) {
            x /= length;
            y /= length;
        }

        return { x, y };
    }

    _getCanvasCoords(clientX, clientY) {
        if (!this.canvas) {
            return { x: clientX, y: clientY };
        }

        const rect = this.canvas.getBoundingClientRect();

        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    }

    _setKnobFromCoords(coords) {
        const maxTravel = this.maxTravel;

        if (maxTravel <= 0) {
            this.currentX = this.originX;
            this.currentY = this.originY;
            return;
        }

        const dx = coords.x - this.originX;
        const dy = coords.y - this.originY;
        const dist = Math.hypot(dx, dy);

        if (dist > maxTravel) {
            const angle = Math.atan2(dy, dx);

            if (this.mode === "dynamic") {
                // Modalità dynamic floating:
                // la base scorre in modo che il dito/cursore resti sul knob,
                // ma il knob rimane sempre contenuto nel ring.
                this.originX = coords.x - Math.cos(angle) * maxTravel;
                this.originY = coords.y - Math.sin(angle) * maxTravel;
            }

            this.currentX = this.originX + Math.cos(angle) * maxTravel;
            this.currentY = this.originY + Math.sin(angle) * maxTravel;
        } else {
            this.currentX = coords.x;
            this.currentY = coords.y;
        }
    }

    _bindEvents() {
        const target = this.canvas || window;

        if (this.canvas) {
            this.canvas.style.touchAction = "none";
        }

        const handleStart = (e) => {
            if (this.active) return;

            // Ignora tasti mouse diversi dal sinistro.
            if (e.pointerType === "mouse" && e.button !== 0) return;

            const coords = this._getCanvasCoords(e.clientX, e.clientY);

            if (this.mode === "dynamic") {
                this.originX = coords.x;
                this.originY = coords.y;
                this.currentX = coords.x;
                this.currentY = coords.y;
                this.active = true;
            } else {
                const dist = Math.hypot(
                    coords.x - this.staticX,
                    coords.y - this.staticY
                );

                if (dist <= this.activationRadius) {
                    this.active = true;

                    this.originX = this.staticX;
                    this.originY = this.staticY;

                    // Importante: clamp immediato anche al pointerdown.
                    this._setKnobFromCoords(coords);
                }
            }

            if (this.active) {
                this.activePointerId = e.pointerId;

                if (this.canvas && this.canvas.setPointerCapture) {
                    try {
                        this.canvas.setPointerCapture(e.pointerId);
                    } catch (_) { }
                }

                if (e.cancelable) {
                    e.preventDefault();
                }
            }
        };

        const handleMove = (e) => {
            if (!this.active) return;
            if (e.pointerId !== this.activePointerId) return;

            const coords = this._getCanvasCoords(e.clientX, e.clientY);

            this._setKnobFromCoords(coords);

            if (e.cancelable) {
                e.preventDefault();
            }
        };

        const handleEnd = (e) => {
            if (!this.active) return;
            if (e.pointerId !== this.activePointerId) return;

            this.active = false;
            this.activePointerId = null;

            if (this.mode === "static") {
                this.originX = this.staticX;
                this.originY = this.staticY;
            }

            this.currentX = this.originX;
            this.currentY = this.originY;

            if (this.canvas && this.canvas.releasePointerCapture) {
                try {
                    this.canvas.releasePointerCapture(e.pointerId);
                } catch (_) { }
            }

            if (e.cancelable) {
                e.preventDefault();
            }
        };

        target.addEventListener("pointerdown", handleStart, { passive: false });
        window.addEventListener("pointermove", handleMove, { passive: false });
        window.addEventListener("pointerup", handleEnd, { passive: false });
        window.addEventListener("pointercancel", handleEnd, { passive: false });

        this._removeEvents = () => {
            target.removeEventListener("pointerdown", handleStart);
            window.removeEventListener("pointermove", handleMove);
            window.removeEventListener("pointerup", handleEnd);
            window.removeEventListener("pointercancel", handleEnd);
        };
    }

    dispose() {
        if (this._removeEvents) {
            this._removeEvents();
            this._removeEvents = null;
        }
    }

    draw(ctx) {
        if (this.mode === "dynamic" && !this.active) return;

        const baseX = this.mode === "dynamic" ? this.originX : this.staticX;
        const baseY = this.mode === "dynamic" ? this.originY : this.staticY;

        ctx.save();

        // Base / Anello esterno
        ctx.beginPath();
        ctx.arc(baseX, baseY, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
        ctx.fill();
        ctx.strokeStyle = "rgba(0, 0, 0, 0.6)";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Pomello
        ctx.beginPath();
        ctx.arc(this.currentX, this.currentY, this.knobRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.active
            ? "rgba(0, 0, 0, 0.8)"
            : "rgba(0, 0, 0, 0.4)";
        ctx.fill();

        ctx.restore();
    }
}