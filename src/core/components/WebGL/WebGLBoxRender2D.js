import { Component } from "../../Component.js";

export class WebGLBoxRender2D extends Component {
  constructor(width = 50, height = 50, color = "#FF0000") {
    super();
    this.width = width;
    this.height = height;
    this.color = color;
  }

  render(WebGL) {
    const pos = this.entity.getComponent("transform").position;
    const { r, g, b } = WebGL.hexToRGB(this.color);
    WebGL.gl.uniform3f(WebGL.colorLocation, r, g, b);

    WebGL._drawRect(
        pos.x,
        pos.y,
        this.width,
        this.height
    );
  }
}