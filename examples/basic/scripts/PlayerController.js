// import { ScriptComponent } from "../../../src/core/components/ScriptComponent.js";
import { ScriptComponent, Keyboard, Mouse } from "../../../src/index.js";
import { Wall } from "../prefabs/Wall.js";
import { Layers } from "../../../src/index.js";

export class PlayerController extends ScriptComponent {

    start() {
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

        if (Keyboard.wasPressed("x")) {
            console.log("add");
            let position = this.entity.getComponent().position;
            this.entity.scene.addEntity(new Wall(position.x, position.y, true));
        }

        // if(Mouse.isPressed(0)){
        //     // console.log(Mouse.x, Mouse.y);
        //     this.entity.getComponent().position.x = Mouse.x;
        //     this.entity.getComponent().position.y = Mouse.y;
        // }

        if (Keyboard.wasPressed('c')) {
            // this.wall.getComponent('position').x = 0;
            // console.log(this.entity.hasTag("wall"));

            const wall = this.entity.scene.findByTag("wall");
            wall.getComponent('position').x = 0;

            // const wall = this.entity.scene.findAllByTag("wall");
            // wall[1].getComponent('position').x = 0;
        }

        if (Mouse.wasPressed(0)) {
            // const hit = this.entity.scene.raycast(Mouse.x, Mouse.y);

            const hit = this.entity.scene.pick(Mouse.x, Mouse.y);
            if (hit) {
                // console.log("Clicked:", hit.entity.name);
                console.log("Clicked:", hit.name, hit.tag);
            }

            // const mask = Layers.Player | Layers.Ground;

            // const hit = this.entity.scene.raycast(Mouse.x, Mouse.y, {
            //     layerMask: Layers.Player
            // });

            // const hit = this.entity.scene.raycast(Mouse.x, Mouse.y, {
            //     layerMask: mask
            // });

            // console.log("Hit (Player layer only):", hit?.entity?.tag);
        }

    }

    onCollision(other) {
        console.log("Player hit:", other.name);
    }

    onTriggerEnter(other) {
        console.log("Player onTriggerEnter:", other.name);
    }
}
