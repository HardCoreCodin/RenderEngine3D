export type TypedArray = Float32Array|Int32Array|Int16Array|Int8Array|Uint32Array|Uint16Array|Uint8Array;

export interface IUniform {
    readonly type: GLenum;
    readonly location: WebGLUniformLocation;
    load(data: TypedArray, transpose?: GLboolean): void;
}

export type IUniforms = {[name: string]: IUniform}
export type IAttributeLocations = {[name: string]: GLint};