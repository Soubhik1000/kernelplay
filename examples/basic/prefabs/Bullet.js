import { Entity } from "../../../src/index.js";
import { BoxRenderComponent, ColliderComponent, Rigidbody2DComponent } from "../../../src/index.js";

import { TransformComponent, Keyboard } from "../../../src/index.js";
import { ScriptComponent } from "../../../src/index.js";
import { Layers } from "../../../src/index.js";

class BulletScript extends ScriptComponent {

    onStart() {
        // console.log('added');
        
        this.speed = 400;
        this.transform = this.entity.getComponent("transform");
        this.rb = this.entity.getComponent("rigidbody2d");

        setTimeout(() => {
            // console.log("Spawning entity, destroyed:", this.entity._destroyed);
            this.entity.destroy();
            // console.log("Spawning entity, destroyed:", this.entity._destroyed);
            
        }, 2000);
    }

    update(dt) {
        // this.transform.position.x += this.speed * dt;
        this.rb.velocity.x += this.speed * dt;

        // if (Keyboard.isPressed("ArrowRight")) this.rb.velocity.x = 100;
        // if (Keyboard.isPressed("ArrowLeft")) this.rb.velocity.x = -100;
        // if (Keyboard.isPressed("ArrowUp")) this.rb.velocity.y = -100;
        // if (Keyboard.isPressed("ArrowDown")) this.rb.velocity.y = 100;
    }
}

export function Bullet(entity, x = 100, y = 100) {
    entity.name = "Bullet";
    entity.tag = "bullet";

    entity.addComponent("transform", new TransformComponent({
        position: { x, y },
        scale: { x: 0.2, y: 0.2 }
    }));

    entity.addComponent("rigidbody2d", new Rigidbody2DComponent({
        mass: 1,
        gravityScale: 1,
        drag: 1,
        useGravity: false
    }));

    entity.addComponent("collider", new ColliderComponent({
        isTrigger: true
    }));


    entity.addComponent("renderer", new BoxRenderComponent("#00ff11"));
    entity.addComponent("bulletscript", new BulletScript());
}

