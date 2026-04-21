import { BoxRenderComponent, Entity, Game, Random, ref, Scene } from "../../src/index.js";
import {
    TransformComponent,
    CameraComponent,
    Rigidbody2DComponent,
    SpriteComponent,
    ScriptComponent,
    ColliderComponent,
    AudioListener,
    AudioSource
} from "../../src/index.js";
import { AnimatorComponent, AnimatorController, AnimationClip } from "../../src/index.js";
import { Keyboard, KeyCode } from "../../src/index.js";
import { Mathf, Vector2, degToRad } from "../../src/index.js";

// This is player animation controller, which defines the animation states and transitions based on parameters set by the PlayerScript.
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
        loop: true,    
        gridWidth: 4,
        frameWidth: 64,
        frameHeight: 64,
    });

    return new AnimatorController()
        .addParameter("speed", "float", 0)
        .addParameter("isGrounded", "bool", false)
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

// This is a simpler animator controller for the coins, which just loops through a spinning animation.
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

// This is a simpler animator controller for the enemies, which just loops through a walking animation. It takes a 'skin' parameter to choose between two different enemy spritesheets.
function EnemyAnimatorController(skin) {
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

    if (skin === 1) {
        return new AnimatorController().addState("walk", walkClip_1);
    } else if (skin === 2) {
        return new AnimatorController().addState("walk", walkClip_2);
    } else {
        return new AnimatorController().addState("walk", walkClip_1);
    }
}

// Main Camera
class Camera extends Entity {
    constructor(x, y, width, height) {
        super("MainCamera");
        this.id = 100;

        this.addComponent("transform", new TransformComponent({
            position: { x, y }
        }))

        this.addComponent("audioListener", new AudioListener());

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
        this.audio = this.entity.getComponent("audio");

        this._isRunningSoundPlaying = false;
        this._isJumping = false;
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
            if (this._isJumping) this._isJumping = false;
            if (Keyboard.isPressed(KeyCode.Space)) {
                this.rb.addForce(0, -600, "impulse");
                this.animator.setTrigger("jump");
                this.jumpSound();
                this._isJumping = true;
            }
        }

        this.transform.position.x = Mathf.clamp(this.transform.position.x, -710, 710)

        if (isMoving && this.rb.isGrounded) {
            if (!this._isRunningSoundPlaying) {
                this.runSound();
                this._isRunningSoundPlaying = true;
                console.log("running");
            }
        } else {
            if (this._isRunningSoundPlaying) {
                if(!this._isJumping) this.audio.stopAll();
                this._isRunningSoundPlaying = false;
            }
        }
    }

    runSound() {
        this.audio.playLoop('./assets/run.mp3', {
            volume: 0.5,
        });
    }
    jumpSound() {
        this.audio.stopAll();
        this.audio.playOneShot('./assets/jump.mp3', {
            volume: 0.1,
        });
    }
    coinSound() {
        this.audio.stopAll();
        this.audio.playOneShot('./assets/coin.wav', {
            volume: 1,
        });
    }
    hitSound() {
        this.audio.playOneShot('./assets/lose.wav', {
            volume: 0.5,
            position: this.transform.position
        });
    }

    getKill() {
        this.playerCorpse.getComponent("transform").position.x = this.transform.position.x;
        this.playerCorpse.getComponent("transform").position.y = this.transform.position.y;
        this.audio.stopAll();
        this.hitSound();
        this.destroy();
    }

    onCollision(other) {
        if (other.name === "Coin") {
            this.coinSound();
            other.getComponent('transform').position.x = Random.range(-600, 600);
            other.getComponent("transform").position.y = 0;
            console.log("Coin Collected");
            this.scene.score += 1;
        }

        if (this.rb.isGrounded) {
            if (other.name === "Enemy") {
                other.getComponent('transform').position.x = Random.range(-600, 600);
                other.getComponent("transform").position.y = 0;
                console.log("Enemy Kill");
                this.scene.score += 2;
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
        }));

        this.addComponent("collider", new ColliderComponent({ width: 20, height: 45 }));

        this.addComponent("renderer", new SpriteComponent({
            image: "./assets/player_sheet.png",
            sourceWidth: 64,
            sourceHeight: 64,
            width: 50,
            height: 50,
            anchor: { x: 0.5, y: 0.5 },
            zIndex: 10,
        }));

        this.addComponent("animator", new AnimatorComponent({ controller: PlayerAnimatorController() }));
        this.addComponent("audio", new AudioSource());
        this.addComponent('script', new PlayerScript({
            speed: 200,
            playerCorpse: ref(300)
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
    }));

    entity.addComponent("collider", new ColliderComponent({ width: 40, height: 70 }));

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

function Enemy(entity, x, y, skin) {
    entity.name = "Enemy";
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

    entity.addComponent("collider", new ColliderComponent({ width: skin === 1 ? 50 : 70, height: skin === 1 ? 50 : 40 }));
    entity.addComponent("renderer", new SpriteComponent({
        image: "./assets/platformer_enemies.png",
        sourceWidth: 150,
        sourceHeight: 130,
        width: skin === 1 ? 50 : 85,
        height: skin === 1 ? 50 : 40,
    }));
    entity.addComponent("animator", new AnimatorComponent({ controller: EnemyAnimatorController(skin) }));
    entity.addComponent('script', new EnemyScript({
        player: ref(200),
        skin: skin,
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

        // --- QoL Anti-Stuck Variables ---
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

        // --- Global World Bounds ---
        // If they hit the right edge of the world
        if (currentX >= 710) {
            this.transform.position.x = 710; // Clamp it so they don't fall off
            this.movingRight = false;        // Force them to turn Left
            this.startX = 710;               // Reset patrol anchor
        }
        // If they hit the left edge of the world
        else if (currentX <= -710) {
            this.transform.position.x = -710; // Clamp it
            this.movingRight = true;          // Force them to turn Right
            this.startX = -710;               // Reset patrol anchor
        }

        // --- QoL FEATURE 1: The Standard Distance Leash ---
        if (currentX > this.startX + this.patrolDistance) {
            this.movingRight = false;
        } else if (currentX < this.startX - this.patrolDistance) {
            this.movingRight = true;
        }

        // --- QoL FEATURE 2: The Anti-Stuck Wall Bump ---
        const distanceMoved = Math.abs(currentX - this.lastX);

        if (distanceMoved < 0.1) {
            this.stuckTimer += dt;
            if (this.stuckTimer > 0.1) {
                this.movingRight = !this.movingRight;
                this.stuckTimer = 0;
                this.startX = currentX;
            }
        } else {
            this.stuckTimer = 0;
        }

        this.lastX = currentX;

        // Apply the velocity based on the final direction!
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

        if (this.skin === 2) this.sprite.flipY = true;

        // 2. Flip the sprite based on the exact physics velocity!
        if (this.sprite) {
            if (this.rb.velocity.x > 0) {
                // Moving right, draw normally
                this.sprite.flipX = true;
            } else if (this.rb.velocity.x < 0) {
                // Moving left, flip the image!
                this.sprite.flipX = false;
            }
        }
    }

    onCollision(other) {
        if (other.name === "Player") {
            if (!other.getComponent("rigidbody2d").isGrounded) {
                other.getComponent("script").getKill();
            }
        }
    }
}

function PlayerCorpse(entity, x, y) {
    entity.name = "PlayerCorpse";
    entity.id = 300;
    entity.addComponent("transform", new TransformComponent({
        position: { x, y },
    }));

    entity.addComponent("rigidbody2d", new Rigidbody2DComponent({
        mass: 1,
        gravityScale: 1,
        drag: 1,
        // useGravity: false
    }));

    entity.addComponent("collider", new ColliderComponent({ width: 40, height: 70 }));
    entity.addComponent("renderer", new SpriteComponent({
        image: "./assets/player_set.png",
        sourceX: 1030,
        sourceY: 530,
        sourceWidth: 150,
        sourceHeight: 150,
        width: 50,
        height: 50,
    }));
}

class Level extends Scene {
    init() {

        this.ctx = this.game.renderer.ctx;
        this.fps = 0;
        this.frames = 0;
        this.lastTime = performance.now();
        this.score = 0;

        const camera = new Camera(0, 0, this.game.config.width, this.game.config.height);
        this.addEntity(camera);

        const player = new Player(0, 0);
        this.addEntity(player);
        this.addEntity(new BackGround(0, 300));

        this.spawn(PlayerCorpse, 800, 0);

        // --- SPAWN 10 COINS ---
        for (let i = 0; i < 10; i++) {
            let randomX = Random.int(-710, 710);
            let randomY = Random.int(100, 300);

            this.spawn(Coin, randomX, randomY);
        }

        // --- SPAWN 10 ENEMIES ---
        for (let i = 0; i < 10; i++) {
            let randomX = Random.int(-710, 710);
            let randomY = Random.int(100, 300);

            // Pick either 1 or 2 randomly for the sprite skin!
            let randomSkin = Random.int(1, 2);

            // Spawn the enemy with the random position and random skin
            this.spawn(Enemy, randomX, randomY, randomSkin);
        }

        // Ground Collider
        this.spawn(Ground, 0, 550, 35, 1);

        // All Platforms
        this.spawn(Platform, -600, 480);      
        this.spawn(PlatformShot, -450, 410);  
        this.spawn(PlatformLong, -250, 350);  
        this.spawn(PlatformShot, 0, 270);
        this.spawn(Platform, 0, 430);
        this.spawn(PlatformLong, 250, 480);
        this.spawn(Platform, 450, 410);
        this.spawn(Platform, 250, 320);
        this.spawn(PlatformShot, 400, 280);
        this.spawn(PlatformShot, 300, 100);
        this.spawn(PlatformLong, 0, 70);
        this.spawn(PlatformLong, 580, 180);
        this.spawn(PlatformShot, -300, 100);

        // Camera follow
        camera.getComponent("camera").setTarget(player);
    }

    render() {
    super.render(this.game.renderer);

    this.frames++;
    const now = performance.now();

    if (now >= this.lastTime + 1000) {
      this.fps = this.frames;
      this.frames = 0;
      this.lastTime = now;
    }

    this.ctx.save();
    this.ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    this.ctx.font = "20px monospace";
    this.ctx.fillText(`FPS: ${this.fps}`, 715, 20);

    this.ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    this.ctx.font = "20px monospace";
    this.ctx.fillText(`Score: ${this.score}`, 10, 20);

    this.ctx.restore();
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
