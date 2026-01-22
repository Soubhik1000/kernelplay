import * as THREE from "three";
import { Entity, ColliderComponent } from "../../../src/index.js";
import { PositionComponent3D } from "../../../src/core/components/WebGL_3D/PositionComponent3D.js";
import { MeshComponent } from "../../../src/core/components/WebGL_3D/MeshComponent.js";
import { CubeScript } from "../scripts/CubeScript.js";
import { BoxCollider3D } from "../../../src/core/components/WebGL_3D/BoxCollider3D.js";

export function Cube(x, y, z = 0) {
  const e = new Entity("Cube");

  e.addComponent("position", new PositionComponent3D(x, y, z));

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: "blue" })
  );

  e.addComponent("mesh", new MeshComponent(mesh));
  // e.addComponent("collider", new ColliderComponent(1, 1));
  e.addComponent("collider3D", new BoxCollider3D(1, 1, 1));
  e.addComponent("CubeScript", new CubeScript());

  return e;
}
