export type TypedArray = Float32Array|Int32Array|Int16Array|Int8Array|Uint32Array|Uint16Array|Uint8Array;
export type TypedArrayConstructor<T> = {
    new (): T;
    new (length: number): T;
    new (object: ArrayLike<number>): T;
    new (buffer: ArrayBuffer, bytesOffset?: number, length?: number): T;
    BYTES_PER_ELEMENT: number;
}

export interface IAttribute {
    type: GLenum;
    location: GLuint;
    count: GLint;
    normalized: GLboolean;
    stride: GLsizei;
    offset: GLintptr;
}

export interface IUniform {
    readonly type: GLenum;
    readonly location: WebGLUniformLocation;
    load(data: TypedArray, transpose?: GLboolean): void;
}

export type IUniforms = {[key: string]: IUniform}
export type IAttributes = {[key: string]: IAttribute};
export type IAttributeLocations = {[key: string]: GLint};
export type IAttributeArrays = {[name: string]: TypedArray};

export interface IBuffer {
    readonly buffer_type: GLenum;
    load(data: BufferSource, count: number, usage?: GLenum)
    draw(mode?: GLenum): void;
    bind(): void;
}

export interface IVertexBuffer extends IBuffer {
    readonly attributes: IAttributes;
}