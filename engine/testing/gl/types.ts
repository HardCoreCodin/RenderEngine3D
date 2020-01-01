export type TypedArray = Float32Array|Int32Array|Int16Array|Int8Array|Uint32Array|Uint16Array|Uint8Array;
export type TypedArrayConstructor<T> = {
    new (): T;
    new (length: number): T;
    new (object: ArrayLike<number>): T;
    new (buffer: ArrayBuffer, bytesOffset?: number, length?: number): T;
    BYTES_PER_ELEMENT: number;
}

export interface IAttribute {
    readonly component_count: GLint;
    location?: GLuint;
}

export interface IUniform {
    readonly location: WebGLUniformLocation;
    readonly type: GLenum;

    use(value: TypedArray, transpose?: GLboolean): void;
}

export type IUniforms = {[key: string]: IUniform}
export type IAttributes =  {[key: string]: IAttribute};
export type IAttributeLocations =  {[key: string]: GLint};

export interface IBuffer<ArrayType extends TypedArray = TypedArray> {
    readonly type: GLenum;
    readonly usage: GLenum;
    readonly data_type: GLenum;
    readonly count: number;

    bind(): void;
}

export interface IVertexBuffer extends IBuffer {
    readonly attributes: IAttributes;
    readonly attribute_size: number;
    readonly attribute_order: string[];
}