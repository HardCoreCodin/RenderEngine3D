export type TypedArray = Float32Array|Int32Array|Int16Array|Int8Array|Uint32Array|Uint16Array|Uint8Array;

export interface IGLUniform {
    readonly type: GLenum;
    readonly location: WebGLUniformLocation;
    load(data: TypedArray|number|boolean, transpose?: GLboolean): void;
}

export type IGLUniforms = {[name: string]: IGLUniform}
export type IGLAttributes = {[name: string]: IGLBuffer }
export type IGLAttributeInputs = {[name: string]: TypedArray|IGLBuffer}
export type IGLAttributeLocations = {[name: string]: GLint};

export interface IGLBaseUniforms extends IGLUniforms {
    mvp: IGLUniform;
}

export interface IGLBuffer {
    readonly usage: GLenum;
    readonly count: number;
    readonly length: number;
    readonly data_type: number;
    readonly component_count: number;

    bind(): void;
    unbind(): void;
    delete(): void;

    bindToLocation(location: GLint): void;
    load(data: TypedArray, usage?: GLenum): void;
    draw(mode?: GLenum): void;
}