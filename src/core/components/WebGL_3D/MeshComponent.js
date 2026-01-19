import { Component } from "../../Component.js";

export class MeshComponent extends Component {
  constructor(object3D) {
    super();
    this.object = object3D;
  }

  onStart() {
    this.entity.scene.game.renderer.scene3D.add(this.object);
  }

  onDestroy() {
    this.entity.scene.game.renderer.scene3D.remove(this.object);
  }
}
