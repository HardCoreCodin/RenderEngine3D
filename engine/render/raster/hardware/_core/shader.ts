import {hash} from "../../../../core/utils.js";


export default class GLShader {
    constructor(
        readonly gl: WebGL2RenderingContext,
        readonly type: GLenum,
        readonly source: string,
        readonly shader: WebGLShader = gl.createShader(type)
    ) {
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const error = gl.getShaderInfoLog(shader);
            console.error('ERROR compiling shader!', error);
            gl.deleteShader(shader);
            throw error;
        }
    }

    delete(): void {
        this.gl.deleteShader(this.shader)
    }

    private static __cache = new Map<string, GLShader>();

    static getCacheKey(source: string): string {
        return hash(source.trim())
    }

    static Compile(gl: WebGL2RenderingContext, type: GLenum, source: string): GLShader {
        const key = this.getCacheKey(source);
        if (!this.__cache.has(key))
            this.__cache.set(key, new GLShader(gl, type, source));

        return this.__cache.get(key);
    }
}