import { Renderer } from "./Renderer.js";

export class WebGL2DRenderer extends Renderer {
  init(game) {
    super.init(game);
    
    console.log(this);

    // 🔥 Get WebGL context
    this.gl =
      game.canvas.canvas.getContext("webgl") ||
      game.canvas.canvas.getContext("experimental-webgl");

    if (!this.gl) {
      throw new Error("WebGL not supported");
    }

    const gl = this.gl;

    // Setup viewport
    gl.viewport(0, 0, game.config.width, game.config.height);

    // Clear color (black)
    gl.clearColor(0, 0, 0, 1);

    // 🔥 Basic shader program
    this.program = this._createProgram(gl);
    gl.useProgram(this.program);

    // Position buffer
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

    const positionLocation = gl.getAttribLocation(
      this.program,
      "a_position"
    );
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(
      positionLocation,
      2,
      gl.FLOAT,
      false,
      0,
      0
    );
  }

  render(scene) {
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);

    // this.sc = scene.game.config; 

    // 🔥 For now, render simple rectangles
    for (const entity of scene.entities) {
      const pos = entity.getComponent("position");
      const renderer = entity.getComponent("renderer");

      if (!pos || !renderer) continue;

      this._drawRect(
        pos.x,
        pos.y,
        renderer.width,
        renderer.height
      );
    }
  }

  _drawRect(x, y, w, h) {
    // console.log(this);
    
    const gl = this.gl;
    const cw = this.game.config.width;
    const ch = this.game.config.height;

    // Convert pixels → clip space
    const x1 = (x / cw) * 2 - 1;
    const y1 = 1 - (y / ch) * 2;
    const x2 = ((x + w) / cw) * 2 - 1;
    const y2 = 1 - ((y + h) / ch) * 2;

    const vertices = new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  _createProgram(gl) {
    const vs = this._compileShader(
      gl,
      gl.VERTEX_SHADER,
      `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0, 1);
      }
      `
    );

    const fs = this._compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(1, 1, 1, 1);
      }
      `
    );

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("Shader link error");
    }

    return program;
  }

  _compileShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader));
    }

    return shader;
  }
}
