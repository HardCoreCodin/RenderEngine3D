import GLCamera from "./nodes/camera.js";
import GLProgram from "./_core/program.js";
import {GLVertexArray} from "./_core/buffers.js";
import {IGLBuffer, IGLUniform} from "./_core/types.js";

import {Color4D} from "../../../accessors/color.js";
import RasterViewport from "../_base/viewport.js";


export default class GLViewport extends RasterViewport<WebGL2RenderingContext, GLCamera> {
    protected _world_to_clip_array: Float32Array;

    protected _border_program: GLProgram;
    protected _border_vao: GLVertexArray;
    protected _border_vbo: IGLBuffer;
    protected _border_positions: Float32Array;
    protected _border_color_array: Float32Array;
    protected _border_color_uniform: IGLUniform;

    protected _grid_program: GLProgram;
    protected _grid_vao: GLVertexArray;
    protected _grid_vbo: IGLBuffer;
    protected _grid_positions: Float32Array;
    protected _grid_color_array: Float32Array;
    protected _grid_color_uniform: IGLUniform;
    protected _world_to_clip_uniform: IGLUniform;

    protected _initOverlay(): void {
        this._world_to_clip_array = new Float32Array(16);
        this._border_color_array = new Float32Array(4);
        this._grid_color_array = new Float32Array(4);

        this.world_to_clip.toArray(this._world_to_clip_array);
        this._border_color.toArray(this._border_color_array);
        this._grid_color.toArray(this._grid_color_array);

        const gl = this.context;
        const border = this._border_positions = Float32Array.of(-1,-1,  1,-1,  1,1,  -1,1);
        this._border_program = new GLProgram(gl, BORDER_VERTEX_SHADER, BORDER_FRAGMENT_SHADER);
        this._border_color_uniform = this._border_program.uniforms.color;
        this._border_vao = new GLVertexArray(gl, 4, {position: border}, this._border_program.locations);
        this._border_vbo = this._border_vao.attributes.position;

        const right_and_front = this.grid_size >>> 1;
        const left_and_back = -right_and_front;
        const vertex_count = 2 * (this.grid_size + 1) * 2;
        const offset_to_v = 2 * (this.grid_size + 1) * 3;
        const grid = this._grid_positions = new Float32Array(vertex_count * 3);
        let o = 0;
        for (let i = left_and_back; i <= right_and_front; i++) {
            grid[o    ] = grid[o + 3] = grid[o + offset_to_v + 2] = grid[o + offset_to_v + 5] = i;
            grid[o + 2] = grid[o + offset_to_v    ] = right_and_front;
            grid[o + 5] = grid[o + offset_to_v + 3] = left_and_back;
            o += 6;
        }
        this._grid_program = new GLProgram(gl, GRID_VERTEX_SHADER, GRID_FRAGMENT_SHADER);
        this._grid_color_uniform = this._grid_program.uniforms.color;
        this._world_to_clip_uniform = this._grid_program.uniforms.world_to_clip;
        this._grid_vao = new GLVertexArray(gl, vertex_count, {position: grid}, this._grid_program.locations);
        this._grid_vbo = this._grid_vao.attributes.position;
    }

    _drawOverlay(): void {
        this.context.viewport(this._position.x, this._position.y, this._size.width, this._size.height);

        if (this.display_grid) {
            this._grid_program.use();
            this._grid_vao.bind();
            this._grid_color_uniform.load(this._grid_color_array);
            this._world_to_clip_uniform.load(this._world_to_clip_array);
            this._grid_vbo.draw(this.context.LINES);
        }

        if (this.display_border) {
            this._border_program.use();
            this._border_vao.bind();
            this._border_color_uniform.load(this._border_color_array);
            this._border_vbo.draw(this.context.LINE_LOOP);
        }
    }

    setBorderColor(color: Color4D): void {
        this._border_color.setFrom(color);
        this._border_color.toArray(this._border_color_array);
    }

    setGridColor(color: Color4D): void {
        this._grid_color.setFrom(color);
        this._grid_color.toArray(this._grid_color_array);
    }

    updateMatrices(): void {
        super.updateMatrices();
        this.world_to_clip.toArray(this._world_to_clip_array);
    }

    protected _pre_render(): void {
        this.context.enable(this.context.SCISSOR_TEST);
        this.context.scissor(this._position.x, this._position.y, this._size.width, this._size.height);
        this.context.clearColor(0, 0, 0, 1);
        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
        this.context.viewport(this._position.x, this._position.y, this._size.width, this._size.height);
    }

    protected _post_render(): void {
        this.context.disable(this.context.SCISSOR_TEST);
    }
}

const BORDER_VERTEX_SHADER = `#version 300 es
in vec4 position;
void main() {gl_Position = position;}`;

const BORDER_FRAGMENT_SHADER = `#version 300 es
precision mediump float;
uniform vec4 color;
out vec4 fragment_color;
void main() {fragment_color = color;}`;

const GRID_VERTEX_SHADER = `#version 300 es
in vec3 position;
uniform mat4 world_to_clip;
void main() {gl_Position = world_to_clip * vec4(position, 1.0);}`;

const GRID_FRAGMENT_SHADER = `#version 300 es
precision mediump float;
uniform vec4 color;
out vec4 fragment_color;
void main() {fragment_color = color;}`;