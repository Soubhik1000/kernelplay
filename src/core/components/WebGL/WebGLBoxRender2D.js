import { Component } from "../../Component.js";

export class WebGLBoxRender2D extends Component {
  constructor(color = "#FF0000") {
    super();
    this.width = 50;
    this.height = 50;
    this.color = color;
  }

  render(WebGL) {
    // const pos = this.entity.getComponent("transform").position;
    // const { r, g, b } = WebGL.hexToRGB(this.color);
    // WebGL.gl.uniform3f(WebGL.colorLocation, r, g, b);

    // WebGL._drawRect(
    //     pos.x,
    //     pos.y,
    //     this.width,
    //     this.height
    // );
    WebGL.drawBox(this.entity);
  }
}