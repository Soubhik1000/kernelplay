import * as THREE from "three";
import { Entity, ColliderComponent } from "../../../src/index.js";
import { CubeScript } from "../scripts/CubeScript.js";

import { Layers } from "../../../src/index.js";

// import { MeshComponent } from "../../../src/index.js";
// import { BoxCollider3D } from "../../../src/index.js";
import { TransformComponent } from "../../../src/index.js";
import { RigidbodyComponent } from "../../../src/index.js";

export function Cube(x, y, z = 0) {
  const e = new Entity("Cube");
  e.layer = Layers.Player;

  // e.addComponent("position", new PositionComponent3D(x, y, z));

  e.addComponent("transform", new TransformComponent({
    position: { x, y, z},
    scale: { x: 1, y: 1, z: 1}
  }));

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: "blue" })
  );

  e.addComponent("mesh", new MeshComponent(mesh));
  // e.addComponent("collider", new ColliderComponent(1, 1));
  e.addComponent("collider3D", new BoxCollider3D());
  e.addComponent("rigidbody", new RigidbodyComponent({
    gravityScale: 0.05,
    drag: 1
  }));
  e.addComponent("CubeScript", new CubeScript());

  return e;
}
