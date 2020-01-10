// import gl from "./context.js";
import {IGLAttributeLocations, IGLUniforms} from "./types.js";
import GLUniform from "./uniform.js";

let gl: WebGL2RenderingContext;

export default class GLProgram {
    readonly uniforms: IGLUniforms = {};
    readonly link_error: string;
    readonly validation_error: string;
    readonly vertex_shader_error: string;
    readonly fragment_shader_error: string;

    protected readonly _id: WebGLProgram;
    protected readonly _locations: IGLAttributeLocations = {};

    get locations(): IGLAttributeLocations {return this._locations}

    constructor(
        readonly _contex: WebGL2RenderingContext,
        readonly vertex_shader_code: string,
        readonly fragment_shader_code: string
    ) {
        gl = _contex;
        const program = this._id = gl.createProgram();

        const vertex_shader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertex_shader, vertex_shader_code);
        gl.compileShader(vertex_shader);
        if (!gl.getShaderParameter(vertex_shader, gl.COMPILE_STATUS)) {
            this.vertex_shader_error = gl.getShaderInfoLog(vertex_shader);
            console.error('ERROR compiling vertex shader!', this.vertex_shader_error);
            gl.deleteShader(vertex_shader);
            throw this.vertex_shader_error;
        }

        const fragment_shader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragment_shader, fragment_shader_code);
        gl.compileShader(fragment_shader);
        if (!gl.getShaderParameter(fragment_shader, gl.COMPILE_STATUS)) {
            this.fragment_shader_error = gl.getShaderInfoLog(fragment_shader);
            console.error('ERROR compiling fragment shader!', this.fragment_shader_error);
            gl.deleteShader(vertex_shader);
            gl.deleteShader(fragment_shader);
            throw this.fragment_shader_error;
        }

        gl.attachShader(program, vertex_shader);
        gl.attachShader(program, fragment_shader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            this.link_error = gl.getProgramInfoLog(program);
            console.error('ERROR linking program!', this.link_error);
            gl.deleteShader(vertex_shader);
            gl.deleteShader(fragment_shader);
            gl.deleteProgram(program);
            throw this.link_error;
        }

        gl.validateProgram(program);
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            this.validation_error = gl.getProgramInfoLog(program);
            console.error('ERROR validating program!', this.validation_error);
            gl.deleteShader(vertex_shader);
            gl.deleteShader(fragment_shader);
            gl.deleteProgram(program);
            throw this.validation_error;
        }

        // The shaders are already compiled into the probram at this point:
        gl.deleteShader(vertex_shader);
        gl.deleteShader(fragment_shader);

        gl.useProgram(this._id);

        let i, count: number;
        let info: WebGLActiveInfo;

        count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (i = 0; i < count; ++i) {
            info = gl.getActiveUniform(program, i);
            if (info)
                this.uniforms[info.name] = new GLUniform(gl, gl.getUniformLocation(program, info.name), info.type);
            else
                break;
        }

        for (let i = 0; i < gl.getProgramParameter(this._id, gl.ACTIVE_ATTRIBUTES); ++i) {
            info = gl.getActiveAttrib(this._id, i);
            if (info)
                this._locations[info.name] = gl.getAttribLocation(this._id, info.name);
            else
                break;
        }
    }

    use(): void {this._contex.useProgram(this._id)}
    delete(): void {this._contex.deleteProgram(this._id)}
}