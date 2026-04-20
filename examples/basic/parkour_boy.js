import { BoxRenderComponent, Entity, Game, ref, Scene } from "../../src/index.js";
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
import { Mathf } from "../../src/index.js";

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

    update() {
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
    entity.addComponent("transform", new TransformComponent({
        position: { x, y },
        scale: { x: 1, y: 1 }
    }));

    entity.addComponent("collider", new ColliderComponent({ width: 130, height: 65 }));
    entity.addComponent("renderer", new SpriteComponent({
        image: "./assets/ground_sprites.png",
        sourceX: 3,
        sourceY: 35,
        sourceWidth: 230,
        sourceHeight: 150,
        width: 150,
        height: 90,
    }));
}

function PlatformS(entity, x, y) {
    entity.name = "Ground";
    entity.addComponent("transform", new TransformComponent({
        position: { x, y },
        scale: { x: 1, y: 1 }
    }));

    entity.addComponent("collider", new ColliderComponent());
    entity.addComponent("renderer", new SpriteComponent({
        image: "./assets/ground_sprites.png",
        width: 500,
        height: 300,
    }));
}

class Level extends Scene {
    init() {
        const camera = new Camera(0, 0, this.game.config.width, this.game.config.height);
        this.addEntity(camera);

        const player = new Player(0, 300);
        this.addEntity(player);
        this.addEntity(new BackGround(0, 300));

        this.spawn(Ground, 0, 550, 30, 1);
        this.spawn(PlatformS, 400, 300)
        this.spawn(Platform, 0, 450)

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
    debugPhysics: true
});

game.start();
