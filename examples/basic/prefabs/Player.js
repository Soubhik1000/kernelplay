import { Entity } from "../../../src/index.js";
import { BoxRenderComponent, ColliderComponent } from "../../../src/index.js";
import { PlayerController } from "../scripts/PlayerController.js";
import { Layers } from "../../../src/index.js";
import { ref } from "../../../src/index.js";

// import { WebGLBoxRender2D } from "../../../src/index.js";
import { TransformComponent } from "../../../src/index.js";
import { Rigidbody2DComponent } from "../../../src/index.js";

import { SpriteComponent } from "../../../src/index.js";
import { AnimatorComponent, AnimationClip, AnimatorController } from "../../../src/index.js";
import { AudioSource } from "../../../src/index.js";


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
    loop: false,   // plays once
    // length: 0.5, 
    gridWidth: 4,
    frameWidth: 64,
    frameHeight: 64,
});

const controller = new AnimatorController()
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

export function Player(x = 100, y = 100) {
    const player = new Entity("Player", "player");
    player.layer = Layers.Player;
    player.zIndex = -10;

    // player.addComponent("position", new PositionComponent(x, y));
    player.addComponent("transform", new TransformComponent({
        position: { x, y },
        scale: { x: 1.4, y: 1.4 }
    }));

    player.addComponent("rigidbody2d", new Rigidbody2DComponent({
        mass: 1,
        gravityScale: 1,
        drag: 1,
        // useGravity: false
    }));

    // player.addComponent("velocity", new VelocityComponent());
    player.addComponent("collider", new ColliderComponent({ width: 20, height: 45 }));

    // player.addComponent("renderer", new BoxRenderComponent({color:"#FF0000", zIndex:-10}));
    // player.addComponent("renderer", new WebGLBoxRender2D({color:"#FF0000"}));

    player.addComponent("renderer", new SpriteComponent({
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

    player.addComponent("animator", new AnimatorComponent({ controller }));

    // Animator component
    // player.addComponent("animator", new AnimatorComponent({
    //     animations: {
    //         idle: {
    //             frames: [0, 2],      // Frame indices
    //             frameRate: 2,              // 8 FPS
    //             loop: true,
    //             gridWidth: 4,              // 8 frames per row
    //             frameWidth: 64,
    //             frameHeight: 64
    //         },
    //         walk: {
    //             frames: [8, 9, 10, 11],
    //             frameRate: 6,
    //             loop: true,
    //             gridWidth: 4,
    //             frameWidth: 64,
    //             frameHeight: 64
    //         },
    //         jump: {
    //             frames: [9],
    //             frameRate: 1,
    //             loop: false,              // Don't loop jump
    //             gridWidth: 4,
    //             frameWidth: 64,
    //             frameHeight: 64
    //         },
    //         attack: {
    //             frames: [12, 13, 14, 15],
    //             frameRate: 4,
    //             loop: false,
    //             gridWidth: 4,
    //             frameWidth: 64,
    //             frameHeight: 64
    //         }
    //     },
    //     defaultAnimation: "idle",
    //     autoPlay: true
    // }));

    player.addComponent("playerController", new PlayerController({
        enemy: ref(5),
        force: 400,
        speed: 100,
        camera1: ref(100),
        camera2: ref(101),
        enemypos: ref(5).getComponent("transform"),
    }));

    player.addComponent("audio", new AudioSource({
        // clip: "./assets/jump.mp3",
        volume: 0.15
    }));

    return player;
}
