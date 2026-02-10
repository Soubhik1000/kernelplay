import * as THREE from "three";
import { Entity, ColliderComponent } from "../../../src/index.js";
// import { MeshComponent } from "../../../src/index.js";
// import { BoxCollider3D } from "../../../src/index.js";
import { TransformComponent } from "../../../src/index.js";

import { CubeScript } from "../scripts/CubeScript.js";

export function Cube1(x, y, z = 0) {
  const e = new Entity("Cube1");

  // e.addComponent("position", new PositionComponent3D(x, y, z));

  e.addComponent("transform", new TransformComponent({
    position: { x, y, z},
    scale: { x: 1, y: 2, z: 3 }
  }));

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: "red" })
  );

  e.addComponent("mesh", new MeshComponent(mesh));
  // e.addComponent("collider", new ColliderComponent(1, 1, true));
  e.addComponent("collider3D", new BoxCollider3D());

  return e;
}
