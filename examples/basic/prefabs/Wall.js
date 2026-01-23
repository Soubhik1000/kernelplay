import { Entity } from "../../../src/index.js";
import {
    BoxRenderComponent,
    PositionComponent,
    ColliderComponent
} from "../../../src/index.js";

import { WebGLBoxRender2D } from "../../../src/core/components/WebGL/WebGLBoxRender2D.js";
import { TransformComponent } from "../../../src/core/components/TransformComponent.js";

export function Wall(x = 100, y = 100, isTrigger = false) {
    let size = { x: 40, y: 40 };
    const wall = new Entity("Wall", 'wall');

    // wall.addComponent("position", new PositionComponent(x, y));
    wall.addComponent("transform", new TransformComponent({
        position: { x, y },
        scale: {x: 1, y: 2}
    }));
    wall.addComponent("collider", new ColliderComponent({
        isTrigger: isTrigger
    }));
    // wall.addComponent("renderer", new BoxRenderComponent("#000000"));
    wall.addComponent("renderer", new WebGLBoxRender2D(size.x, size.y, "#000000"));

    return wall;
}
