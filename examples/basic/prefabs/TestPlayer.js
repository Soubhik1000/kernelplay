import { Entity, ScriptComponent } from "../../../src/index.js";
import { BoxRenderComponent, ColliderComponent } from "../../../src/index.js";
import { PlayerController } from "../scripts/PlayerController.js";
import { Layers, KeyCode, Keyboard } from "../../../src/index.js";

// import { WebGLBoxRender2D } from "../../../src/index.js";
import { TransformComponent } from "../../../src/index.js";
import { Rigidbody2DComponent } from "../../../src/index.js";

import { Vector2, Vector3, Mathf, Random } from "../../../src/index.js";

export function TestPlayer(x = 100, y = 100) {
    const player = new Entity("Player", "player");
    player.layer = Layers.Player;
    player.zIndex = -10;

    // player.addComponent("position", new PositionComponent(x, y));
    player.addComponent("transform", new TransformComponent({
        position: { x, y },
        scale: { x: 1, y: 1 }
    }));

    player.addComponent("rigidbody2d", new Rigidbody2DComponent({
        mass: 1,
        gravityScale: 1,
        drag: 1,
        useGravity: false
    }));

    // player.addComponent("velocity", new VelocityComponent());
    player.addComponent("collider", new ColliderComponent());

    player.addComponent("renderer", new BoxRenderComponent({ color: "#FF0000", zIndex: -10 }));
    // player.addComponent("renderer", new WebGLBoxRender2D({color:"#FF0000"}));

    player.addComponent("PlayerScript", new PlayerScript());

    return player;
}

class PlayerScript extends ScriptComponent {
    onStart() {
        this.rb = this.entity.getComponent("rigidbody2d");
        this.transform = this.entity.getComponent("transform");
    }

    update(dt) {
        if (Keyboard.isPressed(KeyCode.ArrowRight)) this.rb.addForce(800, 0);
        if (Keyboard.isPressed(KeyCode.ArrowLeft)) this.rb.addForce(-800, 0);
        if (Keyboard.isPressed(KeyCode.ArrowDown)) this.rb.addForce(0, 800);
        if (Keyboard.isPressed(KeyCode.ArrowUp)) this.rb.addForce(0, -800);

        if (Keyboard.isPressed(KeyCode.Shift)) {
            const movement = Vector2.scale(this.rb.velocity, dt);
            const newp = Vector2.add(this.transform.position, movement);
            this.transform.position.x = newp.x;
            this.transform.position.y = newp.y;
        }

        if (Keyboard.isPressed(KeyCode.Q)) {
            const position = new Vector2(10, 5);
            const velocity = new Vector2(2, 1);

            const newPosition = Vector2.add(position, velocity);

            console.log(newPosition);
            // this.transform.setPosition(newPosition.x,newPosition.y);
            this.transform.setPosition(newPosition)
        }


    }
}
