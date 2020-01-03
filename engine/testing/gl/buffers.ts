import gl from "./context.js";
import {IAttributeLocations, TypedArray} from "./types.js";

interface IBuffer {
    readonly count: number;
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

    abstract draw(): void;

    protected constructor(
        data: TypedArray,
        readonly _type: GLenum,
        protected _count: number,
        readonly usage: GLenum = gl.STATIC_DRAW
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

        gl.bindBuffer(this._type, this._id);
        gl.bufferData(this._type, data, usage);
        gl.bindBuffer(this._type, null);
    }

    get count(): number {return this._count}
    get data_type(): GLenum {return this._data_type}
    bind(): void {gl.bindBuffer(this._type, this._id)}
    unbind(): void {gl.bindBuffer(this._type, null)}
}

export class ElementArrayBuffer extends Buffer {

    protected constructor(
        data: TypedArray,
        protected _count: number,
        readonly usage: GLenum = gl.STATIC_DRAW
    ) {
        super(data, gl.ELEMENT_ARRAY_BUFFER, _count, usage);
    }

    draw(mode: GLenum = gl.TRIANGLES): void {
        gl.bindBuffer(this._type, this._id);
        gl.drawElements(mode, this.count, this._data_type, 0);
        gl.bindBuffer(this._type, null);
    }
}

export class ArrayBuffer extends Buffer {
    protected constructor(
        data: TypedArray,
        protected _count: number,
        readonly usage: GLenum = gl.STATIC_DRAW
    ) {
        super(data, gl.ARRAY_BUFFER, _count, usage);
    }

    draw(mode: GLenum = gl.TRIANGLES): void {
        gl.bindBuffer(this._type, this._id);
        gl.drawArrays(mode, 0, this.count);
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
        super(vertices, vertices.length / vertex_count, usage);
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
                gl.vertexAttribPointer(location, buffer.count, buffer.data_type, false, 0, 0);
                buffer.unbind();
            } else
                throw `Missing data for attribute ${name}!`;
        }

        gl.bindVertexArray(null);
    }

    bind(): void {gl.bindVertexArray(this._id)}
    unbind(): void {gl.bindVertexArray(null)}
}