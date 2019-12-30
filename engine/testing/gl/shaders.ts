import gl from "./context.js";

class Shader {
    protected _type: GLenum;
    protected _code: string;
    protected _error: string;
    protected _shader: WebGLShader;

    constructor(type: GLenum, shader_code?: string) {
        this._type = type;
        if (shader_code)
            this.load(shader_code);
    }

    get shader(): WebGLShader {return this._shader}

    protected load(shader_code: string): void {
        this._code = shader_code;
        this._shader = gl.createShader(this._type);
        gl.shaderSource(this._shader, shader_code);
        gl.compileShader(this._shader);
        if (gl.getShaderParameter(this._shader, gl.COMPILE_STATUS))
            return;

        this._error = gl.getShaderInfoLog(this._shader);
        console.error('ERROR compiling shader!', this._error);
        gl.deleteShader(this._shader);
    }
}

export class VertexShader extends Shader {
    constructor(source_code?: string) {
        super(gl.VERTEX_SHADER, source_code);
    }
}

export class FragmentShader extends Shader {
    constructor(source_code?: string) {
        super(gl.FRAGMENT_SHADER, source_code);
    }
}