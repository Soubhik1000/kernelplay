import { ScriptComponent, Keyboard, Mouse } from "../../../src/index.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';
import { Cube1 } from "../prefabs/Cube1.js";
import { Layers } from "../../../src/index.js";

export class CubeScript extends ScriptComponent {
    onStart() {
        // console.log(this.entity.scene.game.renderer);
        const renderer = this.entity.scene.game.renderer;

        // OrbitControls
        const controls = new OrbitControls(renderer.camera, renderer.renderer.domElement);
        controls.enableDamping = true;       // smooth motion
        controls.dampingFactor = 0.05;
        controls.target.set(0, 1, 0);        // focus point
        controls.update();
    }

    update(dt) {
        const pos = this.entity.getComponent("transform").position;
        const transform = this.entity.getComponent("transform");
        const rb = this.entity.getComponent("rigidbody");

        rb.velocity.x = 0;
        // rb.velocity.y = 0;
        rb.velocity.z = 0;

        if (Keyboard.isPressed("ArrowRight")) rb.velocity.x = 200 * dt;
        if (Keyboard.isPressed("ArrowLeft")) rb.velocity.x = -200 * dt;
        // if (Keyboard.isPressed("ArrowUp")) rb.velocity.y = 200 * dt;
        // if (Keyboard.isPressed("ArrowDown")) rb.velocity.y = -200 * dt;
        // if (Keyboard.isPressed("w")) rb.velocity.z = -200 * dt;
        // if (Keyboard.isPressed("s")) rb.velocity.z = 200 * dt;

        // if (Keyboard.isPressed("ArrowRight")) rb.addForce(10, 0, 0);
        // if (Keyboard.isPressed("ArrowLeft")) rb.addForce(-10, 0, 0);
        // if (Keyboard.isPressed("ArrowUp")) rb.velocity.y = 200 * dt;
        // if (Keyboard.isPressed("ArrowDown")) rb.velocity.y = -200 * dt;
        if (Keyboard.isPressed("ArrowUp")) rb.velocity.z = -200 * dt;
        if (Keyboard.isPressed("ArrowDown")) rb.velocity.z = 200 * dt;

        if (Keyboard.isPressed("q")) transform.rotation.z -= 2 * dt;
        if (Keyboard.isPressed("e")) transform.rotation.z += 2 * dt;
        // console.log(rb.isGrounded);
        
        if(rb.isGrounded){
            if(Keyboard.isPressed(" ")){
                rb.addForce(0, 20, 0, "impulse");
            }
        }

        if (Keyboard.wasPressed('x')) {
            this.entity.destroy();
        }

        if (Keyboard.wasPressed('a')) {
            this.instantiate(Cube1, pos.x, pos.y, pos.z)
        }

        if (Mouse.wasPressed(0)) {
            const hit = this.entity.scene.raycast(Mouse.x, Mouse.y);

            // const hit = this.entity.scene.raycast(Mouse.x, Mouse.y,{
            //     layerMask: Layers.Player
            // });

            // const hit = this.entity.scene.pick(Mouse.x, Mouse.y);
            if (hit) {
                // raycast
                console.log("Clicked:", hit.entity.name, hit.distance, hit.point);

                // pick
                // console.log("Clicked:", hit.name, hit.tag);
                // console.log("Clicked:", hit);
            }
        }
    }

    onCollision(object) {
        // console.log(object.name);
    }

    onTriggerEnter(other) {
        console.log("Player onTriggerEnter:", other.name);
    }
}