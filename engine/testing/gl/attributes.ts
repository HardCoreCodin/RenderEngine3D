import gl from "./context.js";

export default class Buffer {
    protected _buffer: WebGLBuffer;
    protected _buffer_type: GLenum;

    protected _data: BufferSource;
    protected _data_type: GLenum;

    constructor(
        data: BufferSource,
        type: GLenum = gl.ARRAY_BUFFER,
        usage: GLenum = gl.STATIC_DRAW
    ) {
        if (data)
            this.upload(data, type, usage);
    }


    upload(
        data: BufferSource,
        type: GLenum = gl.ARRAY_BUFFER,
        usage: GLenum = gl.STATIC_DRAW
    ) {
        if (data instanceof Float32Array)
            this._data_type = gl.FLOAT;
        else if (data instanceof Int32Array)
            this._data_type = gl.INT;
        else if (data instanceof Uint32Array)
            this._data_type = gl.UNSIGNED_INT;
        else if (data instanceof Int16Array)
            this._data_type = gl.SHORT;
        else if (data instanceof Uint16Array)
            this._data_type = gl.UNSIGNED_SHORT;
        else if (data instanceof Int8Array)
            this._data_type = gl.BYTE;
        else if (data instanceof Uint8Array)
            this._data_type = gl.UNSIGNED_BYTE;

        this._data = data;
        this._buffer_type = type;
        this._buffer = gl.createBuffer();
        gl.bindBuffer(type, this._buffer);
        gl.bufferData(type, data, usage);
    }

    get data_type(): GLenum {
        return this._data_type;
    }

    bindAttr(
        loc: number,
        size: number,
        stride: number = 0,
        offset: number = 0,
        normalized: boolean = false
    ) {
        gl.bindBuffer(this._buffer_type, this._buffer);
        gl.vertexAttribPointer(loc, size, this._data_type, normalized, stride, offset);
        gl.enableVertexAttribArray(loc);
    }
}