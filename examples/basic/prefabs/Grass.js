import { Entity } from "../../../src/index.js";
import { TransformComponent, ColliderComponent } from "../../../src/index.js";
import { SpriteComponent } from "../../../src/index.js";
import { AnimatorController, AnimatorComponent, AnimationClip } from "../../../src/index.js";

const clip = new AnimationClip({
    name: "idle",
    // frames: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,22,23],
    // frames: [0],
    frames: [
        // Row 1
        { x: 0, y: 0, w: 398, h: 486 },
        { x: 398, y: 0, w: 398, h: 486 },
        { x: 796, y: 0, w: 398, h: 486 },
        { x: 1194, y: 0, w: 398, h: 486 },
        { x: 1592, y: 0, w: 398, h: 486 },
        { x: 1990, y: 0, w: 398, h: 486 },

        // Row 2
        { x: 0, y: 486, w: 398, h: 486 },
        { x: 398, y: 486, w: 398, h: 486 },
        { x: 796, y: 486, w: 398, h: 486 },
        { x: 1194, y: 486, w: 398, h: 486 },
        { x: 1592, y: 486, w: 398, h: 486 },
        { x: 1990, y: 486, w: 398, h: 486 },

        // Row 3
        { x: 0, y: 972, w: 398, h: 486 },
        { x: 398, y: 972, w: 398, h: 486 },
        { x: 796, y: 972, w: 398, h: 486 },
        { x: 1194, y: 972, w: 398, h: 486 },
        { x: 1592, y: 972, w: 398, h: 486 },
        { x: 1990, y: 972, w: 398, h: 486 },

        // Row 4
        { x: 0, y: 1458, w: 398, h: 486 },
        { x: 398, y: 1458, w: 398, h: 486 },
        { x: 796, y: 1458, w: 398, h: 486 },
        { x: 1194, y: 1458, w: 398, h: 486 }
    ],
    frameRate: 16,
    loop: true,
    // gridWidth: 6,
    // frameWidth: 235,
    // frameHeight: 535,
});

const controller = new AnimatorController();
controller.addState('anime', clip);

export function Grass(x, y) {
    const e = new Entity("Cube");

    e.addComponent("transform", new TransformComponent({
        position: { x, y },
        scale: { x: 1, y: 1 }
    }));

    // e.addComponent("collider", new ColliderComponent({100,100}));

    e.addComponent("renderer", new SpriteComponent({
        image: "./assets/grass.png",
        // sourceX: 6,
        // sourceY: 12,
        sourceWidth: 400,
        sourceHeight: 400,
        // width: 83.33,
        // height: 166.67,
        width: 200,
        height: 200,
        anchor: { x: 0.5, y: 0.5 },
        zIndex: 10,
        // alpha: 1
    }));

    e.addComponent("animator", new AnimatorComponent({ 
        controller: controller,
        autoPlay: false
    }));
    
    e.getComponent('animator').play('anime');

    return e;
}
