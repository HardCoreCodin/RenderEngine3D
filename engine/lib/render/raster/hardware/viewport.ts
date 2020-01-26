import GLProgram from "./_core/program.js";
import {Color4D} from "../../../accessors/color.js";
import {GLVertexArray} from "./_core/buffers.js";
import RasterViewport, {
    OrthographicProjectionMatrix,
    PerspectiveProjectionMatrix
} from "../_base/viewport.js";
import {IGLBuffer, IGLUniform} from "./_core/types.js";
import {Grid} from "../../_base/viewport.js";


export default class GLViewport extends RasterViewport<WebGL2RenderingContext, GLGrid> {
    protected _world_to_clip_array: Float32Array;
    protected _border_program: GLProgram;
    protected _border_vao: GLVertexArray;
    protected _border_vbo: IGLBuffer;
    protected _border_positions: Float32Array;
    protected _border_color_array: Float32Array;
    protected _border_color_uniform: IGLUniform;

    protected _init(): void {
        super._init();
        this._world_to_clip_array = new Float32Array(16);
    }

    protected _getGrid(): GLGrid {
        return new GLGrid(this.context, this._world_to_clip_array);
    }

    protected _initOverlay(): void {
        super._initOverlay();
        this._border_color_array = new Float32Array(4);

        this.world_to_clip.toArray(this._world_to_clip_array);
        this._border_color.toArray(this._border_color_array);

        const gl = this.context;
        const border = this._border_positions = Float32Array.of(-1,-1,  1,-1,  1,1,  -1,1);
        this._border_program = new GLProgram(gl, BORDER_VERTEX_SHADER, BORDER_FRAGMENT_SHADER);
        this._border_color_uniform = this._border_program.uniforms.color;
        this._border_vao = new GLVertexArray(gl, 4, {position: border}, this._border_program.locations);
        this._border_vbo = this._border_vao.attributes.position;
    }

    _drawOverlay(): void {
        if (this.grid.display) this.grid.draw();
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

    update(): void {
        super.update();
        this.world_to_clip.toArray(this._world_to_clip_array);
    }

    refresh() {
        this.context.enable(this.context.SCISSOR_TEST);
        this.context.scissor(this._position.x, this._position.y, this._size.width, this._size.height);
        this.context.clearColor(0, 0, 0, 1);
        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
        this.context.viewport(this._position.x, this._position.y, this._size.width, this._size.height);

        this._render_pipeline.render(this);
        this._drawOverlay();

        this.context.disable(this.context.SCISSOR_TEST);
    }

    protected _getPerspectiveProjectionMatrix(): GLPerspectiveProjectionMatrix {
        return new GLPerspectiveProjectionMatrix(this._controller.camera.lense, this.view_frustum);
    }
    protected _getOrthographicProjectionMatrix(): GLOrthographicProjectionMatrix {
        return new GLOrthographicProjectionMatrix(this._controller.camera.lense, this.view_frustum);
    }
}

export class GLPerspectiveProjectionMatrix
    extends PerspectiveProjectionMatrix<WebGL2RenderingContext>
{
    // Override DX-style projection matrix formulation with GL-style one:
    updateZ(): void {
        // GL clip-space has a depth-span of 2 (-1 to 1)
        n = this.view_frustum.near;
        f = this.view_frustum.far;
        d = this.view_frustum.one_over_depth_span;

        this.scale.z       =     (f + n) * d;
        this.translation.z = -2 * f * n  * d;
    }
}

export class GLOrthographicProjectionMatrix
    extends OrthographicProjectionMatrix<WebGL2RenderingContext>
{
    // Override DX-style projection matrix formulation with GL-style one:
    updateZ(): void {
        n = this.view_frustum.near;
        f = this.view_frustum.far;
        d = this.view_frustum.one_over_depth_span;

        this.scale.z =  -2 * d;
        this.translation.z = d * (f + n) ;
    }
}


class GLGrid extends Grid {
    protected readonly _world_to_clip_uniform: IGLUniform;
    protected readonly _color_uniform: IGLUniform;
    protected readonly _color_array = new Float32Array(4);

    protected _program: GLProgram;
    protected _vao: GLVertexArray;
    protected _vbo: IGLBuffer;
    protected _mode: GLenum;

    constructor(
        gl: WebGL2RenderingContext,
        protected readonly _world_to_clip_array: Float32Array
    ) {
        super();
        this._mode = gl.LINES;
        this._program = new GLProgram(gl, GRID_VERTEX_SHADER, GRID_FRAGMENT_SHADER);
        this._color.toArray(this._color_array);
        this._color_uniform = this._program.uniforms.color;
        this._world_to_clip_uniform = this._program.uniforms.world_to_clip;
        this._vao = new GLVertexArray(gl, this._vertex_count, {
            position: this._vertex_positions
        }, this._program.locations);
        this._vbo = this._vao.attributes.position;
    }

    get color(): Color4D {return this._color}
    set color(color: Color4D) {this._color.setFrom(color).toArray(this._color_array)}

    get size(): number {return this._size}
    set size(size: number) {
        super.size = size;
        this._vbo.load(this._vertex_positions, this._vertex_count);
    }

    draw(): void {
        this._program.use();
        this._vao.bind();
        this._color_uniform.load(this._color_array);
        this._world_to_clip_uniform.load(this._world_to_clip_array);
        this._vbo.draw(this._mode);
    }
}

let n, f, d;

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