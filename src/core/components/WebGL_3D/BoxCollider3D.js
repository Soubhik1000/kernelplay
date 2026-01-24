import { Component } from "../../Component.js";

export class BoxCollider3D extends Component {
  constructor(isTrigger = false) {
    super();
    // this.width = width;
    // this.height = height;
    // this.depth = depth;
    this.isTrigger = isTrigger;
  }

  get bounds() {
    const transform = this.entity.getComponent("transform");
    // console.log(transform.scale.x);
    
    return {
      x: transform.position.x - (transform.scale.x) / 2,
      y: transform.position.y - (transform.scale.y) / 2,
      z: transform.position.z - (transform.scale.z) / 2,
      width: transform.scale.x,
      height: transform.scale.y,
      depth: transform.scale.z
      // width: 1,
      // height: 2,
      // depth: 3
    };
  }
}
