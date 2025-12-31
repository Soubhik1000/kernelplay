// import { ScriptComponent } from "../../../src/core/components/ScriptComponent.js";
import { ScriptComponent, Keyboard } from "../../../src/index.js";
import { Wall } from "../prefabs/Wall.js";

export class PlayerController extends ScriptComponent {

    start(){
        console.log('player');
    }

    update(dt) {
        const vel = this.entity.getComponent("velocity");
        if (!vel) return;

        vel.vx = 0;
        vel.vy = 0;

        if (Keyboard.isPressed("ArrowRight")) vel.vx = 200;
        if (Keyboard.isPressed("ArrowLeft")) vel.vx = -200;
        if (Keyboard.isPressed("ArrowUp")) vel.vy = -200;
        if (Keyboard.isPressed("ArrowDown")) vel.vy = 200;

        if (Keyboard.isPressed("x")) {
            console.log("add");
            let position = this.entity.getComponent().position;
            this.entity.scene.addEntity(new Wall(position.x, position.y, true));
        }
    }

    onCollision(other) {
        console.log("Player hit:", other.name);
    }

    onTriggerEnter(other) {
        console.log("Player onTriggerEnter:", other.name);
    }
}
