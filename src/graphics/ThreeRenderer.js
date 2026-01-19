import { Renderer } from "./Renderer.js";
import * as THREE from "three";

export class ThreeRenderer extends Renderer {
  init(game) {
    super.init(game);

    // 🔥 THREE core
    this.scene3D = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      game.config.width / game.config.height,
      0.1,
      1000
    );

    this.renderer = new THREE.WebGLRenderer({
      canvas: game.canvas.el,
      antialias: true
    });

    this.renderer.setSize(
      game.config.width,
      game.config.height
    );

    this.renderer.setClearColor(
      new THREE.Color(game.config.background || "#000000")
    );

    this.camera.position.set(0, 0, 5);

    // 🔥 basic lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(1, 1, 1);
    this.scene3D.add(light);

    const ambient = new THREE.AmbientLight(0x404040);
    this.scene3D.add(ambient);
  }

  render(scene) {
    // Sync ECS → Three objects
    for (const entity of scene.entities) {
      const pos = entity.getComponent("position");
      const mesh = entity.getComponent("mesh");

      if (!pos || !mesh) continue;

      mesh.object.position.set(
        pos.x,
        pos.y,
        pos.z || 0
      );
    }

    this.renderer.render(this.scene3D, this.camera);
  }

  destroy() {
    this.renderer.dispose();
  }
}
