import gl from "./context.js";
import {
    IAttribute,
    IAttributeArrays,
    IAttributes,
    IBuffer,
    IVertexBuffer,
    TypedArray,
    TypedArrayConstructor
} from "./types.js";

abstract class Buffer
    implements IBuffer
{
    buffer_data: TypedArray;
    protected readonly _buffer: WebGLBuffer = gl.createBuffer();

    abstract draw(): void;
    abstract readonly buffer_type: GLenum;

    protected constructor(
        protected readonly _count: number,
        protected readonly _usage: GLenum = gl.STATIC_DRAW
    ) {}

    protected _getDataType(data: TypedArray): GLenum {
        if (data instanceof Float32Array) return gl.FLOAT;
        if (data instanceof Int8Array) return gl.BYTE;
        if (data instanceof Int16Array) return gl.SHORT;
        if (data instanceof Int32Array) return  gl.INT;
        if (data instanceof Uint8Array) return  gl.UNSIGNED_BYTE;
        if (data instanceof Uint16Array) return  gl.UNSIGNED_SHORT;
        if (data instanceof Uint32Array) return  gl.UNSIGNED_INT;

        throw `Unsupported data type for ${data}`;
    }

    load(data: TypedArray = this.buffer_data, usage: GLenum = this._usage) {
        this.buffer_data = data;
        gl.bindBuffer(this.buffer_type, this._buffer);
        gl.bufferData(this.buffer_type, data, usage);
        gl.bindBuffer(this.buffer_type,null);
    }

    bind(): void {
        gl.bindBuffer(this.buffer_type, this._buffer);
    }
}

export class IndexBuffer extends Buffer {
    readonly buffer_type = gl.ELEMENT_ARRAY_BUFFER;
    protected _data_type: GLenum;

    constructor(
        face_count: number,
        data: TypedArray,
        usage: GLenum = gl.STATIC_DRAW
    ) {
        super(face_count * 3);
        this._data_type = this._getDataType(data);
        this.load(data, usage);
    }

    draw(mode: GLenum = gl.TRIANGLES): void {
        this.bind();
        gl.drawElements(mode, this._count, this._data_type, 0);
    }
}

export class VertexBuffer extends Buffer implements IVertexBuffer {
    readonly buffer_type = gl.ARRAY_BUFFER;
    readonly attributes: IAttributes = {};
    protected readonly _attribute_names: string[];

    draw(mode: GLenum = gl.TRIANGLES): void {
        this.bind();
        gl.drawArrays(mode, 0, this._count);
    }

    constructor(
        vertex_count: number,
        attribute_arrays: IAttributeArrays,
        usage: GLenum = gl.STATIC_DRAW
    ) {
        super(vertex_count, usage);

        this._attribute_names = Object.keys(attribute_arrays);
        let array: TypedArray = attribute_arrays[this._attribute_names[0]];
        const ArrayConstructor = array.constructor as TypedArrayConstructor<typeof array>;
        const type = this._getDataType(array);

        let length = 0;
        const arrays = [];
        for (const attribute_name of this._attribute_names) {
            array = attribute_arrays[attribute_name];
            arrays.push(array);
            length += array.length;
        }

        this.buffer_data = new ArrayConstructor(length);

        const normalized = false;
        const location = 0;
        const stride = 0;

        let count: number;
        let offset = 0;
        let start = 0;
        let i = 0;
        for ([i, array] of arrays.entries()) {
            this.buffer_data.set(array, start);
            count = array.length / vertex_count;

            this.attributes[this._attribute_names[i]] = {location, count, type, normalized, stride, offset, start};

            start += array.length;
            offset += array.byteLength
        }

        this.load();
    }

    bind(): void {
        super.bind();

        let attribute: IAttribute;
        for (const attribute_name of this._attribute_names) {
            attribute = this.attributes[attribute_name];
            gl.enableVertexAttribArray(attribute.location);
            gl.vertexAttribPointer(
                attribute.location,
                attribute.count,
                attribute.type,
                attribute.normalized,
                attribute.stride,
                attribute.offset
            );
        }
    }
}