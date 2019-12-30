import gl from "./context.js";

export default class Program {
    protected _program: WebGLProgram;
    protected _linking_error: string;
    protected _validation_error: string;

    protected _attribute_count: number;
    protected _attribute_info: WebGLActiveInfo;
    protected _attributes = new Map<string, number>();

    protected _uniform_count: number;
    protected _uniform_info: WebGLActiveInfo;
    protected _uniforms = new Map<string, WebGLUniformLocation>();

    constructor(vertex_shader?: WebGLShader, fragment_shader?: WebGLShader) {
        if (vertex_shader && fragment_shader)
            this.use(vertex_shader, fragment_shader);
    }


    get program(): WebGLProgram {return this._program}
    get uniforms(): Map<string, WebGLUniformLocation> {return this._uniforms}
    get vertex_attributes(): Map<string, number> {return this._attributes}

    get linking_error(): string {return this._linking_error}
    get validation_error(): string {return this._validation_error}

    get uniform_count(): number {return this._uniform_count}
    get uniform_info(): WebGLActiveInfo {return this._uniform_info}

    get attribute_count(): number {return this._attribute_count}
    get attribute_info(): WebGLActiveInfo {return this._attribute_info}

    use(vertex_shader: WebGLShader, fragment_shader: WebGLShader) {
        this._program = gl.createProgram();

        gl.attachShader(this._program, vertex_shader);
        gl.attachShader(this._program, fragment_shader);
        gl.linkProgram(this._program);
        if (gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
            gl.validateProgram(this._program);
            if (gl.getProgramParameter(this._program, gl.VALIDATE_STATUS)) {
                this._uniform_count = gl.getProgramParameter( this._program, gl.ACTIVE_UNIFORMS );
                this._attribute_count = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);

                let i: number;
                for (i = 0; i < this._uniform_count; ++i) {
                    this._uniform_info = gl.getActiveUniform(this._program, i);
                    if (this._uniform_info)
                        this._uniforms[this._uniform_info.name] = gl.getUniformLocation(
                            this._program,
                            this._uniform_info.name
                        );
                    else
                        break;
                }

                for (i = 0; i < this._attribute_count; ++i) {
                    this._attribute_info = gl.getActiveAttrib(this._program, i);
                    if (this._attribute_info)
                        this._attributes[this._attribute_info.name] = gl.getAttribLocation(
                            this._program,
                            this._attribute_info.name
                        );
                    else
                        break;
                }

                gl.useProgram(this._program);
                gl.enable(gl.DEPTH_TEST);
            } else {
                this._validation_error = gl.getProgramInfoLog(this._program);
                console.error('ERROR validating program!', this._validation_error);
                gl.deleteProgram(this._program);
            }
        } else {
            this._linking_error = gl.getProgramInfoLog(this._program);
            console.error('ERROR linking program!', this._linking_error);
            gl.deleteProgram(this._program);
        }
    }
}