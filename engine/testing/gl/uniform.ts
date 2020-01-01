import {IUniform, TypedArray} from "./types.js";
import gl from "./context.js";

export default class Uniform implements IUniform {
    constructor (
        readonly location: WebGLUniformLocation,
        readonly type: GLenum
    ) {}

    private _validateFloat(value: TypedArray) {
        if (!(value instanceof Float32Array))
            throw `Invalid value type for float uniform: ${value} expected Float32Array got ${typeof value}`;
    }

    private _validateInt(value: TypedArray) {
        if (!(value instanceof Int32Array))
            throw `Invalid value type for int uniform: ${value} expected Int32Array got ${typeof value}`;
    }

    use(value: TypedArray, transpose: GLboolean = false): void {
        switch (this.type) {
            case gl.FLOAT: this._validateFloat(value); gl.uniform1fv(this.location, value); break;
            case gl.FLOAT_VEC2: this._validateFloat(value); gl.uniform2fv(this.location, value); break;
            case gl.FLOAT_VEC3: this._validateFloat(value); gl.uniform3fv(this.location, value); break;
            case gl.FLOAT_VEC4: this._validateFloat(value); gl.uniform4fv(this.location, value); break;
            case gl.INT: this._validateInt(value); gl.uniform1iv(this.location, value); break;
            case gl.INT_VEC2: this._validateInt(value); gl.uniform2iv(this.location, value); break;
            case gl.INT_VEC3: this._validateInt(value); gl.uniform3iv(this.location, value); break;
            case gl.INT_VEC4: this._validateInt(value); gl.uniform4iv(this.location, value); break;
            // case gl.BOOL: break;
            // case gl.BOOL_VEC2: break;
            // case gl.BOOL_VEC3: break;
            // case gl.BOOL_VEC4: break;
            case gl.FLOAT_MAT2: this._validateFloat(value); gl.uniformMatrix2fv(this.location, transpose, value); break;
            case gl.FLOAT_MAT3: this._validateFloat(value); gl.uniformMatrix3fv(this.location, transpose, value); break;
            case gl.FLOAT_MAT4: this._validateFloat(value); gl.uniformMatrix4fv(this.location, transpose, value); break;
            // case gl.SAMPLER_2D: break;
            // case gl.SAMPLER_CUBE: break;
        }
    }
}