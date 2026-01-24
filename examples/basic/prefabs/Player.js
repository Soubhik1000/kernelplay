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
import { Rigidbody2DComponent } from "../../../src/core/physics/Rigidbody2DComponent.js";

export function Player(x = 100, y = 100) {
    const player = new Entity("Player");
    player.layer = Layers.Player;

    // player.addComponent("position", new PositionComponent(x, y));
    player.addComponent("transform", new TransformComponent({
        position: {x, y},
        scale: {x: 1, y: 1}
    }));

    player.addComponent("rigidbody2d", new Rigidbody2DComponent({
        mass: 1,
        gravityScale: 1,
        drag: 1
    }));

    // player.addComponent("velocity", new VelocityComponent());
    player.addComponent("collider", new ColliderComponent());

    // player.addComponent("renderer", new BoxRenderComponent("#FF0000"));
    player.addComponent("renderer", new WebGLBoxRender2D("#FF0000"));

    player.addComponent("playerController", new PlayerController());

    return player;
}
