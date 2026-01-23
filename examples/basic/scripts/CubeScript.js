import { ScriptComponent, Keyboard, Mouse } from "../../../src/index.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';
import { Cube1 } from "../prefabs/Cube1.js";
import { Layers } from "../../../src/index.js";

export class CubeScript extends ScriptComponent {
    onStart() {
        console.log(this.entity.scene.game.renderer);
        const renderer = this.entity.scene.game.renderer;

        // OrbitControls
        const controls = new OrbitControls(renderer.camera, renderer.renderer.domElement);
        controls.enableDamping = true;       // smooth motion
        controls.dampingFactor = 0.05;
        controls.target.set(0, 1, 0);        // focus point
        controls.update();
    }

    update(dt) {
        const pos = this.entity.getComponent("position");

        if (Keyboard.isPressed("ArrowRight")) pos.x += 10 * dt;
        if (Keyboard.isPressed("ArrowLeft")) pos.x += -10 * dt;
        if (Keyboard.isPressed("ArrowUp")) pos.y += 10 * dt;
        if (Keyboard.isPressed("ArrowDown")) pos.y += -10 * dt;
        if (Keyboard.isPressed("w")) pos.z += -10 * dt;
        if (Keyboard.isPressed("s")) pos.z += 10 * dt;

        if (Keyboard.wasPressed('x')) {
            this.entity.destroy();
        }

        if (Keyboard.wasPressed('a')) {
            this.instantiate(Cube1, pos.x, pos.y, pos.z)
        }

        if (Mouse.wasPressed(0)) {
            // const hit = this.entity.scene.raycast(Mouse.x, Mouse.y);

            const hit = this.entity.scene.raycast(Mouse.x, Mouse.y,{
                layerMask: Layers.Player
            });

            // const hit = this.entity.scene.pick(Mouse.x, Mouse.y);
            if (hit) {
                // raycast
                console.log("Clicked:", hit.entity.name);

                // pick
                // console.log("Clicked:", hit.name, hit.tag);
                // console.log("Clicked:", hit);
            }
        }
    }

    onCollision(object) {
        console.log(object.name);
    }

    onTriggerEnter(other) {
        console.log("Player onTriggerEnter:", other.name);
    }
}