import { Component } from "../../Component.js";

export class PositionComponent3D extends Component{
  constructor(x = 0, y = 0, z = 0) {
    super();
    this.x = x;
    this.y = y;
    this.z = z;
  }
}
