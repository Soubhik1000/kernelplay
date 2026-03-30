import { Entity } from "../../../src/index.js";
import { BoxRenderComponent, ColliderComponent } from "../../../src/index.js";
import { PlayerController } from "../scripts/PlayerController.js";
import { Layers } from "../../../src/index.js";
import { ref } from "../../../src/index.js";

// import { WebGLBoxRender2D } from "../../../src/index.js";
import { TransformComponent } from "../../../src/index.js";
import { Rigidbody2DComponent } from "../../../src/index.js";

import { SpriteComponent } from "../../../src/index.js";
import { AnimatorComponent } from "../../../src/index.js";
import { AudioSource } from "../../../src/index.js";

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
        // sourceWidth: 50,
        // sourceHeight: 50,
        width: 50,
        height: 50,
        anchor: { x: 0.5, y: 0.5 },
        zIndex: 10,
        // alpha: 1
    }));

    // Animator component
    player.addComponent("animator", new AnimatorComponent({
        animations: {
            idle: {
                frames: [0, 2],      // Frame indices
                frameRate: 2,              // 8 FPS
                loop: true,
                gridWidth: 4,              // 8 frames per row
                frameWidth: 64,
                frameHeight: 64
            },
            walk: {
                frames: [8, 9, 10, 11],
                frameRate: 6,
                loop: true,
                gridWidth: 4,
                frameWidth: 64,
                frameHeight: 64
            },
            jump: {
                frames: [9],
                frameRate: 1,
                loop: false,              // Don't loop jump
                gridWidth: 4,
                frameWidth: 64,
                frameHeight: 64
            },
            attack: {
                frames: [12, 13, 14, 15],
                frameRate: 4,
                loop: false,
                gridWidth: 4,
                frameWidth: 64,
                frameHeight: 64
            }
        },
        defaultAnimation: "idle",
        autoPlay: true
    }));

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
