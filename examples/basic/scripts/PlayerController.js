// import { ScriptComponent } from "../../../src/core/components/ScriptComponent.js";
import { ScriptComponent, Keyboard, Mouse } from "../../../src/index.js";
import { Wall } from "../prefabs/Wall.js";
import { Bullet } from "../prefabs/Bullet.js";
import { Layers } from "../../../src/index.js";

// import * as PIXI from "pixi.js";

export class PlayerController extends ScriptComponent {

    start() {
        console.log('start player');
    }

    onStart(){
        console.log('onStart player');
        this.isGround = false;
    }

    update(dt) {
        const rb = this.entity.getComponent("rigidbody2d");
        const transform = this.entity.getComponent("transform");
        const renderer = this.entity.getComponent("renderer");
        // console.log(transform.position);
        
        // if (!vel) return;

        // rb.velocity.x = 0;
        // rb.velocity.y = 0;

        // if (Keyboard.isPressed("ArrowRight")) transform.position.x += 10;
        // if (Keyboard.isPressed("ArrowLeft")) transform.position.x -= 10;
        // if (Keyboard.isPressed("ArrowUp")) transform.position.y -= 10;
        // if (Keyboard.isPressed("ArrowDown")) transform.position.y += 10;


        // if (Keyboard.isPressed("ArrowRight")) rb.velocity.x = 200;
        // if (Keyboard.isPressed("ArrowLeft")) rb.velocity.x = -200;
        // if (Keyboard.isPressed("ArrowUp")) rb.velocity.y = -200;
        // if (Keyboard.isPressed("ArrowDown")) rb.velocity.y = 200;

        if (Keyboard.isPressed("ArrowRight")) rb.addForce(800, 0);
        if (Keyboard.isPressed("ArrowLeft")) rb.addForce(-800, 0);
        if (Keyboard.isPressed("w")) rb.addForce(0, -30, "impulse");
        // if (Keyboard.isPressed("ArrowDown")) rb.addForce(0, 800);

        // if (Keyboard.isPressed("h")) {
        //     const box = new PIXI.Graphics()
        //             // 2. Define geometry: rect(x, y, width, height)
        //             .rect(0, 0, 150, 100)
        //             // 3. Set fill color
        //             .fill(0xff0000)
        //             // 4. Add an optional border (stroke)
        //             .stroke({ width: 4, color: 0xffffff });
            
        //           // Position the box
        //         //   box.x = this.entity.scene.game.renderer.app.screen.width / 2 - 75;
        //         //   box.y = this.entity.scene.game.renderer.app.screen.height / 2 - 50;
            
        //           this.entity.scene.game.renderer.stage.addChild(box);
        // }

        

        if (Keyboard.isPressed("q")) transform.rotation.z -= 2 * dt;
        if (Keyboard.isPressed("e")) transform.rotation.z += 2 * dt;


        if (rb.isGrounded) {
            if (Keyboard.isPressed(" ")) {
                rb.addForce(0, -600, "impulse");
                this.isGround = false;
            }
        }

        if (Keyboard.isPressed("g")){
            console.log(rb.isGrounded);
            
        }

        if (Keyboard.wasPressed("a")) {
            console.log("add");
            let position = this.entity.getComponent("transform").position;
            // this.entity.scene.addEntity(new Wall(position.x, position.y, true));
            this.instantiate(Wall, position.x, position.y, true)

            // this.entity.scene.spawn(Wall, position.x, position.y, true);
        }

        if(Keyboard.wasPressed("m")){
            // this.entity.scene.spawn(Bullet, transform.position.x+10, transform.position.y);
            this.instantiate(Bullet, transform.position.x, transform.position.y, true);
        }

        if (Keyboard.wasPressed('x')) {
            this.entity.destroy();
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
            const hit = this.entity.scene.raycast(Mouse.x, Mouse.y);

            // const hit = this.entity.scene.pick(Mouse.x, Mouse.y);
            if (hit) {
                console.log("Clicked:", hit.entity.name);
                // console.log("Clicked:", hit.name, hit.tag);
            }

            // const mask = Layers.Player | Layers.Ground;

            // const hit = this.entity.scene.raycast(Mouse.x, Mouse.y, {
            //     layerMask: Layers.Player
            // });

            // const hit = this.entity.scene.raycast(Mouse.x, Mouse.y, {
            //     layerMask: mask
            // });

            // console.log("Hit (Player layer only):", hit?.entity?.name);
        }

    }

    // lateUpdate(dt){
        
    // }

    onDestroy(){
        console.log("Player Destroy");
        
    }

    onCollision(other) {
        // console.log("Player hit:", other.name);
        // this.rb.velocity.y = 0; // simple resolution
        this.isGround = true;
    }

    onTriggerEnter(other) {
        console.log("Player onTriggerEnter:", other.name);
    }
}
