import gl from "./context.js";
import {IAttribute, IAttributes, IBuffer, IVertexBuffer, TypedArray, TypedArrayConstructor} from "./types.js";

export default class Buffer<ArrayType extends TypedArray = TypedArray>
    implements IBuffer<ArrayType>
{
    readonly data_type: GLenum;
    protected readonly _buffer: WebGLBuffer;

    constructor(
        readonly data: ArrayType,
        readonly count: number,
        readonly type: GLenum,
        readonly usage: GLenum
    ) {
        this._buffer = gl.createBuffer();
        if (data instanceof Float32Array) this.data_type = gl.FLOAT;
        else if (data instanceof Int8Array) this.data_type = gl.BYTE;
        else if (data instanceof Int16Array) this.data_type = gl.SHORT;
        else if (data instanceof Int32Array) this.data_type = gl.INT;
        else if (data instanceof Uint8Array) this.data_type = gl.UNSIGNED_BYTE;
        else if (data instanceof Uint16Array) this.data_type = gl.UNSIGNED_SHORT;
        else if (data instanceof Uint32Array) this.data_type = gl.UNSIGNED_INT;

        gl.bindBuffer(type, this._buffer);
        gl.bufferData(type, data as BufferSource, usage);
        gl.bindBuffer(type, null);
    }

    bind(): void {
        gl.bindBuffer(this.type, this._buffer);
    }
}

export class IndexBuffer<ArrayType extends TypedArray = TypedArray>
    extends Buffer<ArrayType>
{
    constructor(
        data: ArrayType,
        index_count: number,
        usage: GLenum = gl.STATIC_DRAW
    ) {
        super(data, index_count, gl.ELEMENT_ARRAY_BUFFER, usage);
    }
}

export class VertexBuffer<ArrayType extends TypedArray = TypedArray>
    extends Buffer<ArrayType>
    implements IVertexBuffer
{
    readonly attributes: IAttributes = {};
    readonly attribute_size: number;
    readonly attribute_order: string[] = [];

    constructor(
        data: ArrayType,
        vertex_count: number,
        spec: [string, number][],
        usage: GLenum = gl.STATIC_DRAW
    ) {
        super(data, vertex_count, gl.ARRAY_BUFFER, usage);

        this.attribute_size = vertex_count * (data.constructor as TypedArrayConstructor<ArrayType>).BYTES_PER_ELEMENT;
        for (const [attribute_name, component_count] of spec) {
            this.attribute_order.push(attribute_name);
            this.attributes[attribute_name] = {component_count: component_count};
        }
    }

    bind(): void {
        super.bind();

        let attribute: IAttribute;
        let offset = 0;
        for (const attribute_name of this.attribute_order) {
            attribute = this.attributes[attribute_name];

            gl.enableVertexAttribArray(attribute.location);
            gl.vertexAttribPointer(
                attribute.location,
                attribute.component_count,
                this.data_type,
                false,
                0,
                offset
            );

            offset += attribute.component_count * this.attribute_size
        }
    }
}