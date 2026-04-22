import { Entity } from "../../../src/index.js";
import {
    ShapeRenderer,
    ColliderComponent
} from "../../../src/index.js";

// import { WebGLBoxRender2D } from "../../../src/index.js";
import { TransformComponent } from "../../../src/index.js";

export function Shape(entity, x = 100, y = 100) {

    entity.name = "Shape";

    entity.addComponent("transform", new TransformComponent({
        position: { x, y },
        scale: { x: 1, y: 1 }
    }));

    // entity.addComponent("renderer", new ShapeRenderer({
    //     shape: "roundedrect",
    //     // width: 80,
    //     // height: 40,
    //     radius: 10,
    //     // filled: false,
    //     color: "#4488ff",
    //     strokeColor: "#ff0000",
    //     strokeWidth: 2,
    // }));

    entity.addComponent("renderer", new ShapeRenderer({
        // shape:       "circle",
        shape: "ellipse",
        // radius: 24,
        // radiusX: 40,
        // radiusY: 20,
        color: "#ff4444",
    }));

    // // Triangle
    // entity.addComponent("renderer", new ShapeRenderer({
    //     shape: "triangle",
    //     width: 40,
    //     height: 40,
    //     color: "#aa44ff",
    // }));

    // / Line
    // entity.addComponent("renderer", new ShapeRenderer({
    //     shape: "line",
    //     points: [{ x: -50, y: 0 }, { x: 100, y: 0 }],
    //     strokeWidth: 3,
    //     color: "#ff0000",
    // }));


}
