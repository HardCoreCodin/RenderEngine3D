import { hash } from "../../../../../utils.js";
export default class GLShader {
    constructor(gl, type, source, shader = gl.createShader(type)) {
        this.gl = gl;
        this.type = type;
        this.source = source;
        this.shader = shader;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(shader);
            console.error('ERROR compiling shader!', error);
            gl.deleteShader(shader);
            throw error;
        }
    }
    delete() {
        this.gl.deleteShader(this.shader);
    }
    static getCacheKey(source) {
        return hash(source.trim());
    }
    static Compile(gl, type, source) {
        const key = this.getCacheKey(source);
        if (!this.__cache.has(key))
            this.__cache.set(key, new GLShader(gl, type, source));
        return this.__cache.get(key);
    }
}
GLShader.__cache = new Map();
//# sourceMappingURL=shader.js.map