import { BoxRenderComponent, Entity, Game, Random, ref, Scene } from "../../src/index.js";
import {
    TransformComponent,
    CameraComponent,
    Rigidbody2DComponent,
    SpriteComponent,
    ScriptComponent,
    ColliderComponent,
} from "../../src/index.js";
import { AnimatorComponent, AnimatorController, AnimationClip } from "../../src/index.js";
import { Keyboard, KeyCode } from "../../src/index.js";
import { Mathf, Vector2, degToRad } from "../../src/index.js";

function PlayerAnimatorController() {
    const idleClip = new AnimationClip({
        name: "idle",
        frames: [0, 2],
        frameRate: 2,
        loop: true,
        gridWidth: 4,
        frameWidth: 64,
        frameHeight: 64,
    });

    const walkClip = new AnimationClip({
        name: "walk",
        frames: [8, 9, 10, 11],
        frameRate: 6,
        loop: true,
        gridWidth: 4,
        frameWidth: 64,
        frameHeight: 64,
    });

    const jumpClip = new AnimationClip({
        name: "jump",
        frames: [9],
        frameRate: 1,
        loop: true,   // plays once
        // length: 0.5, 
        gridWidth: 4,
        frameWidth: 64,
        frameHeight: 64,
    });

    return new AnimatorController()
        .addParameter("speed", "float", 0)
        .addParameter("isGrounded", "bool", false)  // ← add this
        .addParameter("jump", "trigger")

        .addState("idle", idleClip)
        .addState("walk", walkClip)
        .addState("jump", jumpClip)

        // idle → walk: must be moving AND grounded
        .addTransition("idle", "walk", {
            conditions: [
                { param: "speed", op: ">", value: 0.1 },
                { param: "isGrounded", op: "true" },   // ← grounded check
            ],
            hasExitTime: false,
            duration: 0,
        })

        // walk → idle: stopped OR not grounded
        .addTransition("walk", "idle", {
            conditions: [
                { param: "speed", op: "<=", value: 0.1 },
            ],
            hasExitTime: false,
            duration: 0,
        })

        // walk → jump if leaves ground (e.g. walks off a ledge)
        .addTransition("walk", "jump", {
            conditions: [
                { param: "isGrounded", op: "false" },  // ← fell off ledge
            ],
            hasExitTime: false,
            duration: 0,
        })

        // AnyState → jump on trigger
        .addAnyStateTransition("jump", {
            conditions: [{ param: "jump", op: "trigger" }],
            hasExitTime: false,
            priority: 10,
        })

        // jump → idle only when grounded again
        .addTransition("jump", "idle", {
            conditions: [
                { param: "isGrounded", op: "true" },   // ← wait for landing
            ],
            hasExitTime: false,
            duration: 0,
        });

}

function CoinAnimatorController() {
    const clip = new AnimationClip({
        name: "clip",
        frames: [0, 1, 2, 3, 4, 5],
        frameRate: 10,
        loop: true,
        gridWidth: 6,
        frameWidth: 200,
        frameHeight: 200,
    });

    return new AnimatorController().addState("clip", clip);
}

function EnemyAnimatorController(animation) {
    const walkClip_1 = new AnimationClip({
        frames: [
            { x: 7, y: 320, w: 70, h: 65 },
            { x: 80, y: 320, w: 70, h: 65 },
            { x: 155, y: 300, w: 70, h: 65 },
            { x: 225, y: 305, w: 70, h: 65 },
        ],
        frameRate: 6,
        loop: true,
    });

    const walkClip_2 = new AnimationClip({
        frames: [
            { x: 13, y: 435, w: 125, h: 65 },
            { x: 565, y: 435, w: 125, h: 65 },
            { x: 150, y: 435, w: 125, h: 65 },
            { x: 704, y: 435, w: 125, h: 65 },
        ],
        frameRate: 6,
        loop: true,
    });

    if (animation === 1) {
        return new AnimatorController().addState("walk", walkClip_1);
    }else if (animation === 2) {
        return new AnimatorController().addState("walk", walkClip_2);
    }else{
        return new AnimatorController().addState("walk", walkClip_1); 
    }
}

class Camera extends Entity {
    constructor(x, y, width, height) {
        super("MainCamera");
        this.id = 100;

        this.addComponent("transform", new TransformComponent({
            position: { x, y }
        }))

        this.addComponent('camera', new CameraComponent({
            width,
            height,
            bounds: {
                minX: -730,
                maxX: 730,
                minY: 0,
                maxY: 600
            },
            isPrimary: true
        }))
    }
}

class PlayerScript extends ScriptComponent {
    onStart() {
        this.animator = this.entity.getComponent("animator");
        this.sprite = this.entity.getComponent("renderer");
        this.rb = this.entity.getComponent("rigidbody2d");
        this.transform = this.entity.getComponent("transform");
    }

    update(dt) {
        this.rb.velocity.x = 0;

        if (Keyboard.isPressed(KeyCode.ArrowRight)) {
            this.rb.velocity.x = this.speed;
            this.sprite.flipX = false;
        }
        if (Keyboard.isPressed(KeyCode.ArrowLeft)) {
            this.rb.velocity.x = -this.speed;
            this.sprite.flipX = true;
        }

        const isMoving = this.rb.velocity.x !== 0;
        this.animator.setParameter("speed", isMoving ? 1 : 0);
        this.animator.setParameter("isGrounded", this.rb.isGrounded);

        if (this.rb.isGrounded) {
            if (Keyboard.isPressed(KeyCode.Space)) {
                this.rb.addForce(0, -600, "impulse");
                this.animator.setTrigger("jump");
            }
        }

        this.transform.position.x = Mathf.clamp(this.transform.position.x, -710, 710)
    }

    onCollision(other) {
        if (other.name === "Coin") {
            // other.destroy();
            other.getComponent('transform').position.x = Random.range(-600, 600);
            other.getComponent("transform").position.y = 0;
            console.log("Coin Collected");
        }

        if (this.rb.isGrounded) {
            if (other.name === "Enemy") {
                // console.log("Enemy Kill");
                other.destroy();
            }
        }
    }
}

class Player extends Entity {
    constructor(x, y) {
        super("Player");
        this.id = 200;
        this.addComponent("transform", new TransformComponent({
            position: { x, y },
            scale: { x: 1.4, y: 1.4 }
        }));

        this.addComponent("rigidbody2d", new Rigidbody2DComponent({
            mass: 1,
            gravityScale: 1,
            drag: 1,
            // useGravity: false
        }));

        this.addComponent("collider", new ColliderComponent({ width: 20, height: 45 }));

        this.addComponent("renderer", new SpriteComponent({
            image: "./assets/player_sheet.png",
            // sourceX: 6,
            // sourceY: 12,
            sourceWidth: 64,
            sourceHeight: 64,
            width: 50,
            height: 50,
            anchor: { x: 0.5, y: 0.5 },
            zIndex: 10,
            // alpha: 1
        }));

        this.addComponent("animator", new AnimatorComponent({ controller: PlayerAnimatorController() }));
        this.addComponent('script', new PlayerScript({
            speed: 200
        }))
    }
}

class BackGround extends Entity {
    constructor(x, y) {
        super("BackGround");
        this.zIndex = -100;

        this.addComponent("transform", new TransformComponent({
            position: { x, y },
            scale: { x: 2.5, y: 2.5 }
        }));

        this.addComponent("renderer", new SpriteComponent({
            image: "./assets/background.jpg",
            width: 589,
            height: 295,
        }));
    }
}

function Ground(entity, x, y, w, h) {
    entity.name = "Ground";
    entity.addComponent("transform", new TransformComponent({
        position: { x, y },
        scale: { x: w, y: h }
    }));

    entity.addComponent("collider", new ColliderComponent());
    // entity.addComponent("renderer", new BoxRenderComponent({ color: "green" }));
}

function Platform(entity, x, y) {
    entity.name = "Ground";
    entity.zIndex = -99;
    entity.addComponent("transform", new TransformComponent({
        position: { x, y },
        scale: { x: 1, y: 1 }
    }));

    entity.addComponent("collider", new ColliderComponent({ width: 100, height: 55 }));
    entity.addComponent("renderer", new SpriteComponent({
        image: "./assets/ground_sprites.png",
        sourceX: 3,
        sourceY: 35,
        sourceWidth: 230,
        sourceHeight: 150,
        width: 120,
        height: 80,
    }));
}

function PlatformLong(entity, x, y) {
    entity.name = "Ground";
    entity.zIndex = -99;
    entity.addComponent("transform", new TransformComponent({
        position: { x, y },
        scale: { x: 1, y: 1 }
    }));

    entity.addComponent("collider", new ColliderComponent({ width: 200, height: 45 }));
    entity.addComponent("renderer", new SpriteComponent({
        image: "./assets/ground_sprites.png",
        sourceX: 3,
        sourceY: 215,
        sourceWidth: 350,
        sourceHeight: 130,
        width: 220,
        height: 80,
    }));
}

function PlatformShot(entity, x, y) {
    entity.name = "Ground";
    entity.zIndex = -99;
    entity.addComponent("transform", new TransformComponent({
        position: { x, y },
        scale: { x: 1, y: 1 }
    }));

    entity.addComponent("collider", new ColliderComponent({ width: 80, height: 40 }));
    entity.addComponent("renderer", new SpriteComponent({
        image: "./assets/ground_sprites.png",
        sourceX: 19,
        sourceY: 350,
        sourceWidth: 150,
        sourceHeight: 130,
        width: 110,
        height: 80,
    }));
}

function Coin(entity, x, y) {
    entity.name = "Coin";
    // entity.zIndex = 1;
    entity.addComponent("transform", new TransformComponent({
        position: { x, y },
        scale: { x: 0.6, y: 0.6 }
    }));

    entity.addComponent("rigidbody2d", new Rigidbody2DComponent({
        mass: 1,
        gravityScale: 1,
        drag: 1,
        // useGravity: false
    }));

    entity.addComponent("collider", new ColliderComponent({ width: 40, height: 70 }));
    // entity.addComponent("renderer", new BoxRenderComponent({ color: "yellow" }));
    entity.addComponent("renderer", new SpriteComponent({
        image: "./assets/coin.png",
        sourceX: 3,
        sourceY: 0,
        sourceWidth: 200,
        sourceHeight: 200,
        width: 50,
        height: 50,
    }));
    entity.addComponent("animator", new AnimatorComponent({ controller: CoinAnimatorController() }));
}

function Enemy(entity, x, y, animation) {
    entity.name = "Enemy";
    // entity.zIndex = 1;
    entity.addComponent("transform", new TransformComponent({
        position: { x, y },
        scale: { x: 1, y: 1 },
        // rotation: {z: animation === 1?degToRad(0):degToRad(180)}
    }));

    entity.addComponent("rigidbody2d", new Rigidbody2DComponent({
        mass: 1,
        gravityScale: 1,
        drag: 1,
        // useGravity: false
    }));

    entity.addComponent("collider", new ColliderComponent({width: animation === 1?50:70, height: animation === 1?50:40}));
    // entity.addComponent("renderer", new BoxRenderComponent({ color: "yellow" }));
    entity.addComponent("renderer", new SpriteComponent({
        image: "./assets/platformer_enemies.png",
        // sourceX: 19,
        // sourceY: 350,
        sourceWidth: 150,
        sourceHeight: 130,
        width: animation === 1?50:85,
        height: animation === 1?50:40,
    }));
    entity.addComponent("animator", new AnimatorComponent({ controller: EnemyAnimatorController(animation) }));
    entity.addComponent('script', new EnemyScript({
        player: ref(200),
        anime: animation
    }));
}

class EnemyScript extends ScriptComponent {

    // Chase settings
    speed = 100;
    stoppingDistance = 10;
    detectionRadius = 200;

    // Patrol Settings
    patrolSpeed = 40;
    patrolDistance = 150;

    onStart() {
        this.animator = this.entity.getComponent("animator");
        this.sprite = this.entity.getComponent("renderer");
        this.rb = this.entity.getComponent("rigidbody2d");
        this.transform = this.entity.getComponent("transform");

        this.startX = this.transform.position.x;
        this.movingRight = true;

        // --- NEW: QoL Anti-Stuck Variables ---
        this.lastX = this.transform.position.x;
        this.stuckTimer = 0;
    }

    update(dt) {
        if (!this.player || !this.player.getComponent("transform")) {
            this.handlePatrol(dt);
            this.updateAnimator();
            return;
        }

        const playerPos = this.player.getComponent("transform").position;
        const enemyPos = this.transform.position;

        // Using your custom Vector2 class for clean math!
        const trueDistance = Vector2.distance(playerPos, enemyPos);
        const absoluteDistX = Math.abs(playerPos.x - enemyPos.x);

        if (trueDistance > this.detectionRadius) {

            // 1. PATROL STATE
            this.handlePatrol(dt);

        } else if (absoluteDistX > this.stoppingDistance) {

            // 2. CHASE STATE
            // Reset the stuck timer so it doesn't accidentally trigger while chasing
            this.stuckTimer = 0;

            if (playerPos.x > enemyPos.x) {
                this.rb.velocity.x = this.speed;
            } else {
                this.rb.velocity.x = -this.speed;
            }

        } else {

            // 3. ATTACK RANGE
            this.rb.velocity.x = 0;
            this.stuckTimer = 0;

        }

        this.updateAnimator();
    }

    // Pass 'dt' into handlePatrol so we can use our stuck timer!
    handlePatrol(dt) {
        const currentX = this.transform.position.x;

        // --- QoL FEATURE 1: The Standard Distance Leash ---
        if (currentX > this.startX + this.patrolDistance) {
            this.movingRight = false;
        } else if (currentX < this.startX - this.patrolDistance) {
            this.movingRight = true;
        }

        // --- QoL FEATURE 2: The Anti-Stuck Wall Bump ---
        // Calculate how far we ACTUALLY moved since the last frame
        const distanceMoved = Math.abs(currentX - this.lastX);

        // If we moved less than 0.1 pixels, we are blocked by a rock/wall!
        if (distanceMoved < 0.1) {
            this.stuckTimer += dt;

            // If we are stuck for more than 0.1 seconds, turn around!
            if (this.stuckTimer > 0.1) {
                this.movingRight = !this.movingRight; // Flip direction
                this.stuckTimer = 0;                  // Reset timer

                // Reset the anchor point so it patrols this new, smaller area
                this.startX = currentX;
            }
        } else {
            // We are walking normally, reset the timer!
            this.stuckTimer = 0;
        }

        // Save our current position for the next frame's check
        this.lastX = currentX;

        // Apply the velocity
        if (this.movingRight) {
            this.rb.velocity.x = this.patrolSpeed;
        } else {
            this.rb.velocity.x = -this.patrolSpeed;
        }
    }

    updateAnimator() {
        // 1. Send the speed to the animator (if you still use it)
        if (this.animator) {
            this.animator.setParameter("speedX", this.rb.velocity.x);
        }

        if(this.anime === 2) this.sprite.flipY = true; 

        // 2. Flip the sprite based on the exact physics velocity!
        if (this.sprite) {
            if (this.rb.velocity.x > 0) {
                // Moving right, draw normally
                this.sprite.flipX = true; 
            } else if (this.rb.velocity.x < 0) {
                // Moving left, flip the image!
                this.sprite.flipX = false;  
            }
            // Notice there is no "else" for 0. 
            // If the velocity is 0, it just stays facing whatever direction it was already looking!
        }
    }

    onCollision(other) {
        if (other.name === "Player") {
            if (!other.getComponent("rigidbody2d").isGrounded) {
                other.destroy();
            }
        }
    }
}

class Level extends Scene {
    init() {
        const camera = new Camera(0, 0, this.game.config.width, this.game.config.height);
        this.addEntity(camera);

        const player = new Player(0, 300);
        this.addEntity(player);
        this.addEntity(new BackGround(0, 300));

        this.spawn(Coin, 250, 200);
        this.spawn(Enemy, -300, 200, 2);
        this.spawn(Enemy, 200, 200, 1);

        this.spawn(Ground, 0, 550, 30, 1);

        // --- LEFT SIDE: The Start ---
        // A basic staircase to get the player off the ground
        this.spawn(Platform, -600, 480);       // First jump
        this.spawn(PlatformShot, -450, 410);   // A shorter, slightly trickier jump
        this.spawn(PlatformLong, -250, 350);   // A nice long resting platform

        // --- MIDDLE: The Split Path ---
        // Upper path (Requires precision)
        this.spawn(PlatformShot, 0, 270);
        // Lower path (Easier drop-down, closer to the ground)
        this.spawn(Platform, 0, 430);

        // --- RIGHT SIDE: The Ascent ---
        // Continuing from the lower path
        this.spawn(PlatformLong, 250, 480);
        this.spawn(Platform, 450, 410);

        // Continuing from the upper path
        this.spawn(Platform, 250, 320);
        this.spawn(PlatformShot, 400, 280);
        this.spawn(PlatformShot, 300, 100);
        // this.spawn(PlatformShot, -300, 100);    
        this.spawn(PlatformLong, 0, 70);

        // --- THE GOAL / PEAK ---
        // A high point at the far right of the map
        this.spawn(PlatformLong, 580, 180);
        this.spawn(PlatformShot, -300, 100);

        // Camera follow
        camera.getComponent("camera").setTarget(player);
    }
}

// ---------------------------
// Main Game
// ---------------------------
class MyGame extends Game {
    init() {
        this.sceneManager.addScene(new Level("Level"));
        this.sceneManager.startScene("Level");
    }
}

// ---------------------------
// Start the game
// ---------------------------
const game = new MyGame({
    width: 800,
    height: 600,
    fps: 60,
    backgroundColor: "#eeeeee",
    // debugPhysics: true
});

game.start();
