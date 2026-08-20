import { UIElement } from "./Uielement.js";
import { Touch } from "../../input/Touch.js";

export class UIJoystick extends UIElement {
    constructor(options = {}) {
        super(options);
    }

    render(ctx) {

        const state = Touch.getJoystickState();
        if (!state.active) return;


        ctx.beginPath();
        ctx.arc(state.originX, state.originY, state.radius, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(state.currentX, state.currentY, state.radius / 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fill();
    }
}