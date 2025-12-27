import { Component } from "../Component.js";

export class PositionComponent extends Component {
  constructor(x = 0, y = 0) {
    super();
    this.x = x;
    this.y = y;
  }
}