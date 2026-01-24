import { Renderer } from "./Renderer.js";

export class WebGL2DRenderer extends Renderer {
  init(game) {
    super.init(game);

    this.game = game;

    // 🔥 WebGL context
    this.gl =
      game.canvas.canvas.getContext("webgl") ||
      game.canvas.canvas.getContext("experimental-webgl");

    if (!this.gl) {
      throw new Error("WebGL not supported");
    }

    const gl = this.gl;

    // Viewport
    gl.viewport(0, 0, game.config.width, game.config.height);

    // Background color
    const bg = this.hexToRGB(game.config.backgroundColor);
    gl.clearColor(bg.r, bg.g, bg.b, 1);

    // Program
    this.program = this._createProgram(gl);
    gl.useProgram(this.program);

    // Locations
    this.positionLocation = gl.getAttribLocation(this.program, "a_position");
    this.colorLocation = gl.getUniformLocation(this.program, "u_color");
    this.modelLocation = gl.getUniformLocation(this.program, "u_model");

    // 🔥 Unit quad buffer (centered)
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

    const vertices = new Float32Array([
      -0.5, -0.5,
       0.5, -0.5,
      -0.5,  0.5,
      -0.5,  0.5,
       0.5, -0.5,
       0.5,  0.5
    ]);

    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    gl.enableVertexAttribArray(this.positionLocation);
    gl.vertexAttribPointer(
      this.positionLocation,
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

    for (const entity of scene.entities) {
      entity.render(this);
    }
  }

  // 🔥 Draw single entity
  drawBox(entity) {
    const gl = this.gl;

    const t = entity.getComponent("transform");
    const r = entity.getComponent("renderer");
    if (!t || !r) return;

    const model = this._createModelMatrix(
      t.position.x,
      t.position.y,
      r.width * t.scale.x,
      r.height * t.scale.y,
      t.rotation.z
    );

    const color = this.hexToRGB(r.color);

    gl.uniform3f(this.colorLocation, color.r, color.g, color.b);
    gl.uniformMatrix4fv(this.modelLocation, false, model);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  // 🔥 Model matrix (pixel → clip space)
  _createModelMatrix(x, y, w, h, rot) {
    const cw = this.game.config.width;
    const ch = this.game.config.height;

    // Position (pixel → clip)
    const tx = (x / cw) * 2 - 1;
    const ty = 1 - (y / ch) * 2;

    // Scale (pixel → clip)
    const sx = (w / cw) * 2;
    const sy = (h / ch) * 2;

    const c = Math.cos(rot);
    const s = Math.sin(rot);

    return new Float32Array([
      c * sx,  s * sy, 0, 0,
     -s * sx,  c * sy, 0, 0,
      0,       0,      1, 0,
      tx,      ty,     0, 1
    ]);
  }

  // 🔥 Shader program
  _createProgram(gl) {
    const vs = this._compileShader(
      gl,
      gl.VERTEX_SHADER,
      `
      attribute vec2 a_position;
      uniform mat4 u_model;

      void main() {
        gl_Position = u_model * vec4(a_position, 0.0, 1.0);
      }
      `
    );

    const fs = this._compileShader(
      gl,
      gl.FRAGMENT_SHADER,
      `
      precision mediump float;
      uniform vec3 u_color;

      void main() {
        gl_FragColor = vec4(u_color, 1.0);
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

  // 🔥 HEX → normalized RGB
  hexToRGB(hex) {
    hex = hex.replace("#", "");
    const num = parseInt(hex, 16);

    return {
      r: ((num >> 16) & 255) / 255,
      g: ((num >> 8) & 255) / 255,
      b: (num & 255) / 255
    };
  }
}
