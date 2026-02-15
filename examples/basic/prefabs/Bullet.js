import { Entity } from "../../../src/index.js";
import { BoxRenderComponent, ColliderComponent, Rigidbody2DComponent } from "../../../src/index.js";

import { TransformComponent, Keyboard } from "../../../src/index.js";
import { ScriptComponent } from "../../../src/index.js";
import { Layers } from "../../../src/index.js";

class BulletScript extends ScriptComponent {

    onStart() {
        this.speed = 50;
        // this.transform = this.entity.getComponent("transform");
        this.rb = this.entity.getComponent("rigidbody2d");
    }

    update(dt) {
        // this.transform.position.x += this.speed * dt;

        // if (Keyboard.isPressed("ArrowRight")) this.rb.velocity.x = 100;
        // if (Keyboard.isPressed("ArrowLeft")) this.rb.velocity.x = -100;
        // if (Keyboard.isPressed("ArrowUp")) this.rb.velocity.y = -100;
        // if (Keyboard.isPressed("ArrowDown")) this.rb.velocity.y = 100;
    }
}

export class Bullet extends Entity {
    constructor(x = 100, y = 100) {
        super("Bullet");
        this.tag = "bullet"
        this.layer = Layers.Player;

        this.addComponent("transform", new TransformComponent({
            position: { x, y },
            scale: { x: 0.2, y: 0.2 }
        }));

        this.addComponent("rigidbody2d", new Rigidbody2DComponent({
            mass: 1,
            gravityScale: 1,
            drag: 1,
            // useGravity: false
        }));

        this.addComponent("collider", new ColliderComponent());


        this.addComponent("renderer", new BoxRenderComponent("#00ff11"));
        this.addComponent("bulletscript", new BulletScript());
    }
}
