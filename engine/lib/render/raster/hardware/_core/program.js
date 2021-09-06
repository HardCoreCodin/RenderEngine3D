import GLShader from "./shader.js";
import GLUniform from "./uniform.js";
export default class GLProgram {
    constructor(gl, vertex_shader_source, fragment_shader_source, vertex = GLShader.Compile(gl, gl.VERTEX_SHADER, vertex_shader_source), fragment = GLShader.Compile(gl, gl.FRAGMENT_SHADER, fragment_shader_source), program = gl.createProgram()) {
        this.gl = gl;
        this.vertex = vertex;
        this.fragment = fragment;
        this.program = program;
        this.uniforms = {};
        this._locations = {};
        gl.attachShader(program, vertex.shader);
        gl.attachShader(program, fragment.shader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const link_error = gl.getProgramInfoLog(program);
            console.error('ERROR linking program!', link_error);
            gl.deleteProgram(program);
            throw link_error;
        }
        gl.validateProgram(program);
        if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
            const validation_error = gl.getProgramInfoLog(program);
            console.error('ERROR validating program!', validation_error);
            gl.deleteProgram(program);
            throw validation_error;
        }
        gl.useProgram(program);
        let i, count;
        let info;
        count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (i = 0; i < count; ++i) {
            info = gl.getActiveUniform(program, i);
            if (info)
                this.uniforms[info.name] = new GLUniform(gl, gl.getUniformLocation(program, info.name), info.type);
            else
                break;
        }
        for (let i = 0; i < gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES); ++i) {
            info = gl.getActiveAttrib(program, i);
            if (info)
                this._locations[info.name] = gl.getAttribLocation(program, info.name);
            else
                break;
        }
    }
    get locations() { return this._locations; }
    use() { this.gl.useProgram(this.program); }
    delete() { this.gl.deleteProgram(this.program); }
    static getCacheKey(vertex_shader_source, fragment_shader_source) {
        return GLShader.getCacheKey(vertex_shader_source) + GLShader.getCacheKey(fragment_shader_source);
    }
    static Compile(gl, vertex_shader_source, fragment_shader_source) {
        const key = this.getCacheKey(vertex_shader_source, fragment_shader_source);
        if (!this.__cache.has(key))
            this.__cache.set(key, new GLProgram(gl, vertex_shader_source, fragment_shader_source));
        return this.__cache.get(key);
    }
}
GLProgram.__cache = new Map();
//# sourceMappingURL=program.js.map