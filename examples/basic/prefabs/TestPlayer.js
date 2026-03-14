import { Entity, MouseButton, ScriptComponent } from "../../../src/index.js";
import { BoxRenderComponent, ColliderComponent } from "../../../src/index.js";
import { PlayerController } from "../scripts/PlayerController.js";
import { Layers, KeyCode, Keyboard, Mouse } from "../../../src/index.js";

// import { WebGLBoxRender2D } from "../../../src/index.js";
import { TransformComponent } from "../../../src/index.js";
import { Rigidbody2DComponent } from "../../../src/index.js";

import { Vector2, Vector3, Mathf, Random } from "../../../src/index.js";
import { Timer, Cooldown } from "../../../src/index.js";

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

        this.fireCooldown = new Cooldown(0.2); // 5 shots/sec
        this.timer = new Timer(3, true);
    }

    update(dt) {

        this.fireCooldown.update(dt);
        // this.timer.update(dt);

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

            // const newPosition = Vector2.add(position, velocity);
            // console.log(newPosition);

            // this.transform.setPosition(newPosition.x,newPosition.y);
            // this.transform.setPosition(newPosition);


            // Game Example (enemy chasing player)
            // const dir = Vector2.sub(position, velocity);
            // console.log(dir);
            // this.transform.setPosition(new Vector2(100, 50));

            // Distance (AI / triggers / collision)
            // const a = new Vector2(0, 0);
            // const b = new Vector2(3, 4);

            // const distance = Vector2.distance(a, b);
            // console.log(distance);


            // Normalize (direction vector)
            // const v = new Vector2(10, 0);
            // const n = new Vector2(10,0).normalize();
            // console.log(n);

            // direction vector
            // let s = Vector2.sub(new Vector2(0,0), this.transform.position)
            // const dir = new Vector2(
            //     s.x,
            //     s.y
            // ).normalize();

            // const dir = Vector2.sub(new Vector2(0,0), this.transform.position).normalize();
            // console.log(dir);

            // this.transform.position.x += dir.x * 100 * dt;
            // this.transform.position.y += dir.y * 100 * dt;

        }

        this.transform.position.x = Mathf.clamp(this.transform.position.x, 20, 780)
        this.transform.position.y = Mathf.clamp(this.transform.position.y, 20, 580)


        if (Mouse.isPressed(MouseButton.Left)) {
            this.transform.position.x = Mathf.lerp(this.transform.position.x, Mouse.x, 0.05)
            this.transform.position.y = Mathf.lerp(this.transform.position.y, Mouse.y, 0.05)
        }

        if(Keyboard.wasPressed(KeyCode.W)){
            const x = Random.range(0, 100);
            const n = Random.int(1, 6);
            console.log(x, n);   
        }

        if(Keyboard.isPressed(KeyCode.F)){
            if (this.fireCooldown.trigger()) {
                this.shoot();
            }
        }

        if (this.timer.isFinished()) {

            this.spawnEnemy();

            this.timer.start();
        }

        // console.log(this.timer.progress);
        


    }

    shoot() {
        console.log("Bang!");
    }

    spawnEnemy(){
        console.log("Spawn!");
    }
}
