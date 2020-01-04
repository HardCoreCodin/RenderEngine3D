import gl from "./context.js";
import {IAttributeLocations, TypedArray} from "./types.js";

interface IBuffer {
    readonly count: number;
    readonly length: number;
    readonly component_count: number;
    readonly usage: GLenum;
    readonly data_type: number;

    load(data: TypedArray, usage?: GLenum): void;
    draw(): void;
    bind(): void;
    unbind(): void;
}

abstract class Buffer implements IBuffer {
    protected readonly _id: WebGLBuffer;
    protected _data_type: GLenum;
    protected _length: number;
    protected _component_count: number;

    abstract draw(): void;

    protected constructor(
        data: TypedArray,
        readonly _type: GLenum,
        readonly _count: number,
        readonly usage: GLenum = gl.STATIC_DRAW,
    ) {
        this._id = gl.createBuffer();
        this.load(data, usage);
    }

    load(data: TypedArray, usage: GLenum = this.usage) {
        this._data_type = (
            data instanceof Float32Array ? gl.FLOAT :
            data instanceof Int8Array ? gl.BYTE :
            data instanceof Int16Array ? gl.SHORT :
            data instanceof Int32Array ? gl.INT :
            data instanceof Uint8Array ? gl.UNSIGNED_BYTE :
            data instanceof Uint16Array ? gl.UNSIGNED_SHORT :
            data instanceof Uint32Array ? gl.UNSIGNED_INT : -1
        );

        if (this._data_type === -1)
            throw `Unsupported data type for ${data}`;

        this._length = data.length;
        this._component_count = this._length / this._count;

        gl.bindBuffer(this._type, this._id);
        gl.bufferData(this._type, data, usage);
        gl.bindBuffer(this._type, null);
    }

    get count(): number {return this._count}
    get length(): number {return this._length}
    get component_count(): number {return this._component_count}
    get data_type(): GLenum {return this._data_type}
    bind(): void {gl.bindBuffer(this._type, this._id)}
    unbind(): void {gl.bindBuffer(this._type, null)}
}

export class ArrayBuffer extends Buffer {
    protected constructor(
        data: TypedArray,
        count: number,
        usage: GLenum = gl.STATIC_DRAW,
    ) {
        super(data, gl.ARRAY_BUFFER, count, usage);
    }

    draw(mode: GLenum = gl.TRIANGLES): void {
        gl.bindBuffer(this._type, this._id);
        gl.drawArrays(mode, 0, this._count);
        gl.bindBuffer(this._type, null);
    }
}

export class ElementArrayBuffer extends Buffer {
    protected constructor(
        data: TypedArray,
        count: number,
        usage: GLenum = gl.STATIC_DRAW,
    ) {
        super(data, gl.ELEMENT_ARRAY_BUFFER, count, usage);
    }

    draw(mode: GLenum = gl.TRIANGLES): void {
        gl.bindBuffer(this._type, this._id);
        gl.drawElements(mode, this._length, this._data_type, 0);
        gl.bindBuffer(this._type, null);
    }
}

export class IndexBuffer extends ElementArrayBuffer {
    constructor(
        indices: TypedArray,
        usage: GLenum = gl.STATIC_DRAW
    ) {
        super(indices, indices.length, usage);
    }
}

export class VertexBuffer extends ArrayBuffer {
    constructor(
        vertices: TypedArray,
        vertex_count: number,
        usage: GLenum = gl.STATIC_DRAW
    ) {
        super(vertices, vertex_count, usage);
    }
}

export class VertexArray {
    private readonly _id: WebGLVertexArrayObject;
    readonly attributes: {[name: string]: IBuffer} = {};

    constructor(
        vertex_count: number,
        locations: IAttributeLocations,
        attributes: {[name: string]: TypedArray|IBuffer} = {}
    ) {
        this._id = gl.createVertexArray();
        gl.bindVertexArray(this._id);

        let location: GLuint;
        let buffer: IBuffer;
        let attribute: TypedArray|IBuffer;

        for (const name of Object.keys(locations)) {
            location = locations[name];
            attribute = attributes[name];
            if (attribute) {
                buffer = this.attributes[name] = attribute instanceof VertexBuffer ? attribute :
                    new VertexBuffer(attribute as TypedArray, vertex_count);

                buffer.bind();
                gl.enableVertexAttribArray(location);
                gl.vertexAttribPointer(location, buffer.component_count, buffer.data_type, false, 0, 0);
                buffer.unbind();
            } else
                throw `Missing data for attribute ${name}!`;
        }

        gl.bindVertexArray(null);
    }

    bind(): void {gl.bindVertexArray(this._id)}
    unbind(): void {gl.bindVertexArray(null)}
}

export class Texture {
    private readonly _id: WebGLVertexArrayObject;

    constructor(
        data: HTMLImageElement,
        protected _type: GLenum = gl.TEXTURE_2D,

        wrap_u: GLenum = gl.CLAMP_TO_EDGE,
        wrap_v: GLenum = wrap_u,

        min_filter: GLenum = gl.LINEAR,
        mag_filter: GLenum = min_filter
    ) {
        this._id = gl.createTexture();
        this.load(data, wrap_u, wrap_v, min_filter, mag_filter);
    }

    load(
        data: HTMLImageElement,

        wrap_u: GLenum = gl.CLAMP_TO_EDGE,
        wrap_v: GLenum = wrap_u,

        min_filter: GLenum = gl.LINEAR,
        mag_filter: GLenum = min_filter
    ) {

        gl.bindTexture(this._type, this._id);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(this._type, gl.TEXTURE_WRAP_S, wrap_u);
        gl.texParameteri(this._type, gl.TEXTURE_WRAP_T, wrap_v);

        gl.texParameteri(this._type, gl.TEXTURE_MIN_FILTER, min_filter);
        gl.texParameteri(this._type, gl.TEXTURE_MAG_FILTER, mag_filter);

        gl.texImage2D(this._type, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);

        gl.bindTexture(this._type, null);
    }

    bind(slot: GLenum = gl.TEXTURE0): void {
        gl.bindTexture(this._type, this._id);
        gl.activeTexture(slot);
    }
    unbind(): void {gl.bindTexture(this._type, null)}
}