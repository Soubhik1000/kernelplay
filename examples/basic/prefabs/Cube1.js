import * as THREE from "three";
import { Entity, ColliderComponent } from "../../../src/index.js";
import { PositionComponent3D } from "../../../src/core/components/WebGL_3D/PositionComponent3D.js";
import { MeshComponent } from "../../../src/core/components/WebGL_3D/MeshComponent.js";
import { CubeScript } from "../scripts/CubeScript.js";

export function Cube1(x, y, z = 0) {
  const e = new Entity("Cube");

  e.addComponent("position", new PositionComponent3D(x, y, z));

  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: "red" })
  );

  e.addComponent("mesh", new MeshComponent(mesh));
  e.addComponent("collider", new ColliderComponent(x, y));

  return e;
}
