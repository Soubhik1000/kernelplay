import { Renderer } from "./Renderer.js";

export class WebGL2DRenderer extends Renderer {
    init(game) {
        super.init(game);

        // console.log(this);

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
        // gl.clearColor(0, 0, 0, 1);
        const color = this.hexToRgb(game.config.backgroundColor)
        gl.clearColor(color.r, color.g, color.b, 1);

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
        this.colorLocation = gl.getUniformLocation(
            this.program,
            "u_color"
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

        // 🔥 For now, render simple rectangles
        for (const entity of scene.entities) {
            // const pos = entity.getComponent("position");
            // const renderer = entity.getComponent("renderer");

            // if (!pos || !renderer) continue;

            // const { r, g, b } = this.hexToRGB(renderer.color);

            // this.gl.uniform3f(this.colorLocation, r, g, b);

            // this._drawRect(
            //     pos.x,
            //     pos.y,
            //     renderer.width,
            //     renderer.height
            // );

            entity.render(this);
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

    hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result ? {
            r: parseInt(result[1], 16), // Convert the red part (first two digits)
            g: parseInt(result[2], 16), // Convert the green part (middle two digits)
            b: parseInt(result[3], 16)  // Convert the blue part (last two digits)
        } : null; // Return null if the format is invalid
    }

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
