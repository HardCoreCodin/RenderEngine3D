import gl from "./context.js";
import {IAttributeLocations, IUniforms} from "./types.js";
import Uniform from "./uniform.js";
import {IndexBuffer, VertexBuffer} from "./buffers.js";

export default class Program {
    readonly uniforms: IUniforms = {};
    readonly link_error: string;
    readonly validation_error: string;
    readonly vertex_shader_error: string;
    readonly fragment_shader_error: string;

    protected _vertex_buffer: VertexBuffer;
    protected readonly _attribute_locations: IAttributeLocations = {};

    constructor(
        readonly vertex_shader_code: string,
        readonly fragment_shader_code: string,
        vertex_buffer?: VertexBuffer,
        public index_buffer?: IndexBuffer,
        protected readonly _program = gl.createProgram()
    ) {
        const vertex_shader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertex_shader, vertex_shader_code);
        gl.compileShader(vertex_shader);
        if (!gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS)) {
            this.vertex_shader_error = gl.getShaderInfoLog(vertex_shader);
            console.error('ERROR compiling vertex shader!', this.vertex_shader_error);
            gl.deleteShader(vertex_shader);
            return;
        }

        const fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragment_shader, fragment_shader_code);
        gl.compileShader(fragment_shader);
        if (!gl.getShaderParameter(fragment_shader, gl.COMPILE_STATUS)) {
            this.fragment_shader_error = gl.getShaderInfoLog(fragment_shader);
            console.error('ERROR compiling fragment shader!', this.fragment_shader_error);
            gl.deleteShader(fragment_shader);
            return;
        }

        gl.attachShader(_program, vertex_shader);
        gl.attachShader(_program, fragment_shader);
        gl.linkProgram(_program);
        if (!gl.getProgramParameter(_program, gl.LINK_STATUS)) {
            this.link_error = gl.getProgramInfoLog(_program);
            console.error('ERROR linking program!', this.link_error);
            gl.deleteProgram(_program);
            return;
        }

        gl.validateProgram(_program);
        if (!gl.getProgramParameter(_program, gl.VALIDATE_STATUS)) {
            this.validation_error = gl.getProgramInfoLog(_program);
            console.error('ERROR validating program!', this.validation_error);
            gl.deleteProgram(_program);
            return;
        }

        // The shaders are already compiled into the probram at this point:
        gl.deleteShader(vertex_shader);
        gl.deleteShader(fragment_shader);

        gl.useProgram(this._program);

        let i, count: number;
        let info: WebGLActiveInfo;

        count = gl.getProgramParameter(_program, gl.ACTIVE_UNIFORMS);
        for (i = 0; i < count; ++i) {
            info = gl.getActiveUniform(_program, i);
            if (info)
                this.uniforms[info.name] = new Uniform(gl.getUniformLocation(_program, info.name), info.type);
            else
                break;
        }

        for (let i = 0; i < gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES); ++i) {
            info = gl.getActiveAttrib(this._program, i);
            if (info)
                this._attribute_locations[info.name] = gl.getAttribLocation(this._program, info.name);
            else
                break;
        }

        if (vertex_buffer)
            this.vertex_buffer = vertex_buffer;
    }

    get vertex_buffer(): VertexBuffer {return this._vertex_buffer}
    set vertex_buffer(vertex_buffer: VertexBuffer) {
        this._vertex_buffer = vertex_buffer;

        for (const attribute in this._attribute_locations)
            vertex_buffer.attributes[attribute].location = this._attribute_locations[attribute];
    }

    use(): void {
        gl.useProgram(this._program);
    }

    draw(mode: GLenum = gl.TRIANGLES): void {
        if (this.index_buffer) {
            this.vertex_buffer.bind();
            this.index_buffer.draw(mode);
        } else
            this.vertex_buffer.draw(mode);
    }
}