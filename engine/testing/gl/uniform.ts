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

    load(data: TypedArray, transpose: GLboolean = false): void {
        switch (this.type) {
            case gl.FLOAT: this._validateFloat(data); gl.uniform1fv(this.location, data); break;
            case gl.FLOAT_VEC2: this._validateFloat(data); gl.uniform2fv(this.location, data); break;
            case gl.FLOAT_VEC3: this._validateFloat(data); gl.uniform3fv(this.location, data); break;
            case gl.FLOAT_VEC4: this._validateFloat(data); gl.uniform4fv(this.location, data); break;
            case gl.INT: this._validateInt(data); gl.uniform1iv(this.location, data); break;
            case gl.INT_VEC2: this._validateInt(data); gl.uniform2iv(this.location, data); break;
            case gl.INT_VEC3: this._validateInt(data); gl.uniform3iv(this.location, data); break;
            case gl.INT_VEC4: this._validateInt(data); gl.uniform4iv(this.location, data); break;
            // case gl.BOOL: break;
            // case gl.BOOL_VEC2: break;
            // case gl.BOOL_VEC3: break;
            // case gl.BOOL_VEC4: break;
            case gl.FLOAT_MAT2: this._validateFloat(data); gl.uniformMatrix2fv(this.location, transpose, data); break;
            case gl.FLOAT_MAT3: this._validateFloat(data); gl.uniformMatrix3fv(this.location, transpose, data); break;
            case gl.FLOAT_MAT4: this._validateFloat(data); gl.uniformMatrix4fv(this.location, transpose, data); break;
            // case gl.SAMPLER_2D: break;
            // case gl.SAMPLER_CUBE: break;
        }
    }
}