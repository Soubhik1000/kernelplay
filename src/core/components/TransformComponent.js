import { Component } from "../Component.js";

export class TransformComponent extends Component {
  constructor(options) {
    super();

    const {
      position = {x: 0, y: 0, z: 0}, 
      rotation = {x: 0, y: 0, z: 0}, 
      scale = {x: 1, y: 1, z: 1}
    } = options;

    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
  }
}