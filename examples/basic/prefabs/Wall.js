import { Entity } from "../../../src/index.js";
import {
    BoxRenderComponent,
    PositionComponent,
    ColliderComponent
} from "../../../src/index.js";

export function Wall(x = 100, y = 100, isTrigger=false) {
    let size = {x: 40, y: 100};
    const wall = new Entity("Wall", 'wall');

    wall.addComponent("position", new PositionComponent(x, y));
    wall.addComponent("collider", new ColliderComponent(size.x, size.y, isTrigger));
    wall.addComponent("renderer", new BoxRenderComponent(size.x, size.y, "#000000"));

    return wall;
}
