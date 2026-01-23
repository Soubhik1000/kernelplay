import { Entity } from "../../../src/index.js";
import {
    BoxRenderComponent,
    PositionComponent,
    VelocityComponent,
    GravityComponent,
    ColliderComponent
} from "../../../src/index.js";
import { PlayerController } from "../scripts/PlayerController.js";
import { Layers } from "../../../src/index.js";

import { WebGLBoxRender2D } from "../../../src/core/components/WebGL/WebGLBoxRender2D.js";
import { TransformComponent } from "../../../src/core/components/TransformComponent.js";

export function Player(x = 100, y = 100) {
    const player = new Entity("Player");
    player.layer = Layers.Player;

    // player.addComponent("position", new PositionComponent(x, y));
    player.addComponent("position", new TransformComponent({
        position: {x, y}
    }));
    player.addComponent("velocity", new VelocityComponent());
    player.addComponent("collider", new ColliderComponent(40, 40));

    player.addComponent("renderer", new BoxRenderComponent(40, 40, "#FF0000"));
    // player.addComponent("renderer", new WebGLBoxRender2D(40, 40, "#FF0000"));

    player.addComponent("playerController", new PlayerController());

    return player;
}
