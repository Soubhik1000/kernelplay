import { ScriptComponent, Keyboard } from "../../../src/index.js";
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/controls/OrbitControls.js';

export class CubeScript extends ScriptComponent{
    onStart(){
        console.log(this.entity.scene.game.renderer);
        const renderer = this.entity.scene.game.renderer;

        // OrbitControls
        const controls = new OrbitControls(renderer.camera, renderer.renderer.domElement);
        controls.enableDamping = true;       // smooth motion
        controls.dampingFactor = 0.05;
        controls.target.set(0, 1, 0);        // focus point
        controls.update();
    }

    update(dt){
        const pos = this.entity.getComponent("position");

        if (Keyboard.isPressed("ArrowRight")) pos.x += 10 * dt;
        if (Keyboard.isPressed("ArrowLeft")) pos.x += -10 * dt;
        if (Keyboard.isPressed("ArrowUp")) pos.y += 10 * dt;
        if (Keyboard.isPressed("ArrowDown")) pos.y += -10 * dt;
    }
}