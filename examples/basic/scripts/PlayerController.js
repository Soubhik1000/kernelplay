// import { ScriptComponent } from "../../../src/core/components/ScriptComponent.js";
import { ScriptComponent, Keyboard, Mouse } from "../../../src/index.js";
import { Wall } from "../prefabs/Wall.js";
import { Bullet } from "../prefabs/Bullet.js";
import { Layers } from "../../../src/index.js";
import { KeyCode } from "../../../src/index.js";
import { MouseButton } from "../../../src/index.js";

// import * as PIXI from "pixi.js";

export class PlayerController extends ScriptComponent {

    // start() {
    //     console.log('start player');
    // }

    onStart() {
        console.log('onStart player');
        this.isGround = false;
        this.primarycamera = this.entity.scene.getPrimaryCamera();

        this.animator = this.entity.getComponent("animator");
        this.sprite = this.entity.getComponent("renderer");
        this.audio = this.entity.getComponent("audio");

        // console.log(this.entity.scene.game.camera);
        // this.camera = this.entity.scene.game.camera;
        // console.log(this.camera);

        // Animation callbacks
        this.animator.onAnimationEnd = (animName) => {
            if (animName === "attack") {
                this.animator.play("idle");
                this.audio.stopAll();
            }
            if (animName === "jump") {
                this.animator.play("idle");
                this.audio.stopAll();
            }
        };
    }

    update(dt) {
        const rb = this.entity.getComponent("rigidbody2d");
        const transform = this.entity.getComponent("transform");

        const isMoving = Keyboard.isPressed(KeyCode.ArrowLeft) || Keyboard.isPressed(KeyCode.ArrowRight);

        // const renderer = this.entity.getComponent("renderer");
        // console.log(transform.position);

        // if (!vel) return;

        rb.velocity.x = 0;
        // rb.velocity.y = 0;

        // if (Keyboard.isPressed("ArrowRight")) transform.position.x += 10;
        // if (Keyboard.isPressed("ArrowLeft")) transform.position.x -= 10;
        // if (Keyboard.isPressed("ArrowUp")) transform.position.y -= 10;
        // if (Keyboard.isPressed("ArrowDown")) transform.position.y += 10;


        // if (Keyboard.isPressed("ArrowRight")) rb.velocity.x = 200;
        // if (Keyboard.isPressed("ArrowLeft")) rb.velocity.x = -200;
        // if (Keyboard.isPressed("ArrowUp")) rb.velocity.y = -200;
        // if (Keyboard.isPressed("ArrowDown")) rb.velocity.y = 200;

        // if (Keyboard.isPressed(KeyCode.ArrowRight)) rb.addForce(800, 0);
        if (Keyboard.isPressed(KeyCode.ArrowRight)) {
            // rb.addForce(this.force, 0);
            rb.velocity.x = this.speed;
            this.sprite.flipX = false;
        }
        if (Keyboard.isPressed(KeyCode.ArrowLeft)) {
            // rb.addForce(-this.force, 0);
            rb.velocity.x = -this.speed;
            this.sprite.flipX = true;
        }
        if (Keyboard.isPressed(KeyCode.W)) rb.addForce(0, -30, "impulse");
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


        // console.log(this.entity.scene);

        // Camera follows player automatically
        // this.camera.x = transform.position.x - this.camera.width / 2;
        // this.camera.y = transform.position.y - this.camera.height / 2;

        if (transform.position.y > 1000) {
            transform.setPosition(100, 100);
        }


        if (Keyboard.isPressed("q")) transform.rotation.z -= 2 * dt;
        if (Keyboard.isPressed("e")) transform.rotation.z += 2 * dt;
        // if (Keyboard.isPressed("l")) {
        //     console.log('done');
        //     this.game.config.debugPhysics = true;
        // }


        if (rb.isGrounded) {
            if (Keyboard.isPressed(KeyCode.Space)) {
                rb.addForce(0, -600, "impulse");
                this.isGround = false;
                if (!this.animator.isAnimationPlaying("jump")) {
                    this.audio.stopAll();
                    this.animator.play("jump");

                    // this.audio.clip = "./assets/jump.mp3";
                    // this.audio.play();

                    // this.audio.playOneShot('./assets/jump.mp3')

                    // console.log(this.entity.scene.game.audio.listener);
                }
            }
        }

        // Animation state machine
        if (!this.animator.isAnimationPlaying("attack") && !this.animator.isAnimationPlaying("jump")) {
            if (isMoving && rb.isGrounded) {
                if (!this.animator.isAnimationPlaying("walk")) {
                    this.animator.play("walk");

                    // this.audio.stopAll();
                    // this.audio.clip = './assets/run.mp3';
                    // this.audio.loop = true;
                    // this.audio.volume = 0.5;
                    // this.audio.play();
                }
            } else {
                if (!this.animator.isAnimationPlaying("idle")) {
                    this.animator.play("idle");
                    this.audio.stopAll();
                }
            }
        }


        if (Keyboard.isPressed("g")) {
            console.log(rb.isGrounded);

        }

        if (Keyboard.wasPressed("a")) {
            console.log("add");
            let position = this.entity.getComponent("transform").position;
            // this.entity.scene.addEntity(new Wall(position.x, position.y, true));
            this.instantiate(Wall, position.x, position.y, true)

            // this.entity.scene.spawn(Wall, position.x, position.y, true);
        }

        if (Keyboard.wasPressed("m")) {
            // this.entity.scene.spawn(Bullet, transform.position.x+10, transform.position.y);
            this.instantiate(Bullet, transform.position.x, transform.position.y, true);
        }

        if (Keyboard.wasPressed('x')) {
            // this.entity.destroy();
            this.destroy();
        }

        if (Keyboard.wasPressed(KeyCode.K)) {
            const wall = this.findById(3);
            wall.getComponent("transform").position.x += 100;
            console.log(wall.getComponent("transform").position.x);
            // console.log(this.entity.id);

        }

        if (Keyboard.wasPressed(KeyCode.O)) {
            // this.primarycamera.target = this.entity;
            this.camera.setTarget(this.entity);
            this.camera.shake(20, 0.5);
            // this.primarycamera.zoom = 2.0;  // 2x zoom

            console.log(this.camera);

        }

        // if(Mouse.isPressed(0)){
        //     // console.log(Mouse.x, Mouse.y);
        //     this.entity.getComponent().position.x = Mouse.x;
        //     this.entity.getComponent().position.y = Mouse.y;
        // }

        if (Keyboard.wasPressed('c')) {
            // this.wall.getComponent('position').x = 0;
            // console.log(this.entity.hasTag("player"));

            // console.log(this.hasTag("player"));

            // const wall = this.entity.scene.findByTag("wall");

            // const wall = this.findByTag("wall");
            // wall.getComponent('transform').position.x = 0;

            // const wall = this.entity.scene.findAllByTag("wall");

            // const wall = this.findAllByTag("wall");
            // wall[1].getComponent('transform').position.x = 0;

            // this.enemy.destroy();
            //         if (this.enemy) {
            //             // console.log(this.enemy);
            //   const enemyPos = this.enemy.getComponent("transform").position;
            //   console.log("Enemy at:", enemyPos.x);
            // }

            // this.camera1.setTarget(this.entity);
            // this.camera1.getComponent("camera").setTarget();
            // console.log(this.camera1.getComponent("transform").getPosition());

            // this.camera1.getComponent("transform").position.x = 0;

        }

        if (Keyboard.wasPressed(KeyCode.L)) {
            // this.camera1.getComponent("camera").isPrimary = false;
            // this.camera2.getComponent("camera").isPrimary = true;

            // // 🔥 Update scene's primary camera reference
            // this.entity.scene.primaryCamera = this.camera2.getComponent("camera");
            // this.camera = this.camera2.getComponent("camera");

            // console.log(this.camera1.getComponent("camera"), this.camera2.getComponent("camera"));   

            this.setPrimaryCamera(this.camera2);
        }

        // if (Mouse.wasPressed('0')) {
        if (Mouse.wasPressed(MouseButton.Left)) {
            // Convert mouse to world coordinates
            const worldPos = this.primarycamera.screenToWorld(Mouse.x, Mouse.y);
            console.log("Mouse in world:", worldPos, "Mouse:", Mouse.x, Mouse.y);

            // const hit = this.entity.scene.raycast(Mouse.x, Mouse.y);

            // const hit = this.raycast(Mouse.x, Mouse.y);
            const hit = this.raycast(worldPos.x, worldPos.y);

            // const hit = this.entity.scene.pick(Mouse.x, Mouse.y);

            // const hit = this.pick(Mouse.x, Mouse.y);
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

    onDestroy() {
        console.log("Player Destroy");

    }

    onCollision(other) {
        // console.log("Player hit:", other.name);
        // this.rb.velocity.y = 0; // simple resolution
        this.isGround = true;
        // console.log("Player onTriggerEnter:", other.name, other.id);
    }

    onTriggerEnter(other) {
        console.log("Player onTriggerEnter:", other.name, other.id);
    }
}
