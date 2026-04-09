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

const PlayerAnimatorController = new AnimatorController()
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
            isPrimary: true
        }))
    }
}

class PlayerScript extends ScriptComponent {
    onStart() {
        this.animator = this.entity.getComponent("animator");
        this.sprite = this.entity.getComponent("renderer");
        this.rb = this.entity.getComponent("rigidbody2d");
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

        this.addComponent("animator", new AnimatorComponent({ controller: PlayerAnimatorController }));
        this.addComponent('script', new PlayerScript({
            speed: 200
        }))
    }
}

// class Ground extends Entity {
//     constructor(x, y, w, h) {
//         super("Ground");

//         this.addComponent("transform", new TransformComponent({
//             position: { x, y },
//             scale: { x: w, y: h }
//         }));

//         this.addComponent("collider", new ColliderComponent());
//         this.addComponent("renderer", new BoxRenderComponent({ color: "green" }));
//     }
// }

function Ground(entity, x, y, w, h) {
    entity.name = "Ground";
    entity.addComponent("transform", new TransformComponent({
        position: { x, y },
        scale: { x: w, y: h }
    }));

    entity.addComponent("collider", new ColliderComponent());
    entity.addComponent("renderer", new BoxRenderComponent({ color: "green" }));
}


class GroundManager extends ScriptComponent {
    onStart() {
        this.chunkWidth = 100;
        this.chunkHeight = 20;

        this.chunks = [];

        // Fixed Y rows — chunks can only sit on these exact values
        this.rowHeight = 40; // must match chunkHeight exactly
        this.baseRow = 14;   // row index (14 * 40 = 560)

        this.rightRow = this.baseRow;
        this.leftRow = this.baseRow;

        this.rightStreak = 0;
        this.leftStreak = 0;

        this.minX = null;
        this.maxX = null;

        this.spawnInitial();
    }

    rowToY(row) {
        return row * this.rowHeight;
    }

    spawnInitial() {
        for (let i = -10; i <= 10; i++) {
            const x = i * this.chunkWidth;

            let row;
            if (i === 0) {
                row = this.baseRow;
            } else if (i > 0) {
                const result = this.generateNextRow(this.rightRow, this.rightStreak);
                this.rightRow = result.row;
                this.rightStreak = result.streak;
                row = this.rightRow;
            } else {
                const result = this.generateNextRow(this.leftRow, this.leftStreak);
                this.leftRow = result.row;
                this.leftStreak = result.streak;
                row = this.leftRow;
            }

            this.createChunk(x, this.rowToY(row));

            if (this.minX === null || x < this.minX) this.minX = x;
            if (this.maxX === null || x > this.maxX) this.maxX = x;
        }
    }

    generateNextRow(currentRow, streak) {
        let options;

        if (streak >= 2) {
            // Forced flat or step down after 2 consecutive ups
            options = [0, 1];
        } else {
            // -1 = up, 0 = flat (weighted), 1 = down
            options = [-1, 0, 0, 1];
        }

        const change = options[Math.floor(Math.random() * options.length)];
        // clamp between row 11 (high) and row 15 (low)
        const newRow = Math.max(11, Math.min(15, currentRow + change));
        const newStreak = change < 0 ? streak + 1 : 0;

        return { row: newRow, streak: newStreak };
    }

    createChunk(x, y) {
        if (Math.random() < 0.15) return;

        const chunk = this.instantiate(
            Ground,
            x,
            y,
            this.chunkWidth / 20,
            this.chunkHeight / 20
        );

        this.chunks.push(chunk);
    }

    update() {
        const playerX = this.player.getComponent("transform").position.x;

        while (playerX + 800 > this.maxX) {
            this.maxX += this.chunkWidth*2;
            const result = this.generateNextRow(this.rightRow, this.rightStreak);
            this.rightRow = result.row;
            this.rightStreak = result.streak;
            this.createChunk(this.maxX, this.rowToY(this.rightRow));
        }

        while (playerX - 800 < this.minX) {
            this.minX -= this.chunkWidth;
            const result = this.generateNextRow(this.leftRow, this.leftStreak);
            this.leftRow = result.row;
            this.leftStreak = result.streak;
            this.createChunk(this.minX, this.rowToY(this.leftRow));
        }

        this.chunks = this.chunks.filter(chunk => {
            const x = chunk.getComponent("transform").position.x;
            if (Math.abs(x - playerX) > 1200) {
                chunk.destroy();
                return false;
            }
            return true;
        });
    }
}


class Level extends Scene {
    init() {
        const camera = new Camera(400, 0, this.game.config.width, this.game.config.height);
        this.addEntity(camera);

        const player = new Player(400, 300);
        this.addEntity(player);

        // this.spawn(Ground, 400, 550, 20, 2);
        // Ground manager entity
        const groundManager = new Entity("GroundManager");
        groundManager.addComponent("script", new GroundManager({ player: ref(200) }));
        this.addEntity(groundManager);

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
