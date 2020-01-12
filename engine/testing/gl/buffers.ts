import {IGLAttributeInputs, IGLAttributeLocations, IGLAttributes, IGLBuffer, TypedArray} from "./types.js";

let gl: WebGL2RenderingContext;

abstract class GLBuffer implements IGLBuffer {
    abstract draw(mode?: GLenum): void;

    protected readonly _id: WebGLBuffer;
    protected _data_type: GLenum;
    protected _length: number;
    protected _component_count: number;

    protected constructor(
        readonly _contex: WebGL2RenderingContext,
        readonly _type: GLenum,
        readonly _count: number,
        data?: TypedArray,
        readonly usage: GLenum = _contex.STATIC_DRAW
    ) {
        this._id = _contex.createBuffer();
        if (data)
            this.load(data, usage);
    }

    load(data: TypedArray, usage: GLenum = this.usage) {
        gl = this._contex;
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

    bind(): void {this._contex.bindBuffer(this._type, this._id)}
    unbind(): void {this._contex.bindBuffer(this._type, null)}
    delete(): void {this._contex.deleteBuffer(this._id)}
}

export class GLArrayBuffer extends GLBuffer {
    protected constructor(
        contex: WebGL2RenderingContext,
        count: number,
        data?: TypedArray,
        usage: GLenum = contex.STATIC_DRAW,
    ) {
        super(contex, contex.ARRAY_BUFFER, count, data, usage);
    }

    draw(mode: GLenum = this._contex.TRIANGLES): void {
        gl = this._contex;
        gl.bindBuffer(this._type, this._id);
        gl.drawArrays(mode, 0, this._count);
        gl.bindBuffer(this._type, null);
    }
}

export class GLElementArrayBuffer extends GLBuffer {
    protected constructor(
        contex: WebGL2RenderingContext,
        count: number,
        data?: TypedArray,
        usage: GLenum = contex.STATIC_DRAW,
    ) {
        super(contex, contex.ELEMENT_ARRAY_BUFFER, count, data, usage);
    }

    draw(mode: GLenum = this._contex.TRIANGLES): void {
        gl = this._contex;
        gl.bindBuffer(this._type, this._id);
        gl.drawElements(mode, this._length, this._data_type, 0);
        // gl.bindBuffer(this._type, null);
    }
}

export class GLIndexBuffer extends GLElementArrayBuffer {
    constructor(
        contex: WebGL2RenderingContext,
        indices?: TypedArray,
        usage: GLenum = contex.STATIC_DRAW
    ) {
        super(contex, indices.length, indices, usage);
    }
}

export class GLVertexBuffer extends GLArrayBuffer {
    constructor(
        contex: WebGL2RenderingContext,
        vertex_count: number,
        vertices?: TypedArray,
        usage: GLenum = contex.STATIC_DRAW
    ) {
        super(contex, vertex_count, vertices, usage);
    }
}

export class GLVertexArray {
    private readonly _id: WebGLVertexArrayObject;
    readonly attributes: IGLAttributes = {};

    constructor(
        readonly _contex: WebGL2RenderingContext,
        readonly vertex_count: number,
        attributes?: IGLAttributeInputs,
        locations?: IGLAttributeLocations
    ) {
        this._id = _contex.createVertexArray();

        if (attributes) {
            this.load(attributes);
            if (locations)
                this.bindToLocations(locations);
        }
    }

    load(attributes: IGLAttributeInputs): void {
        let attribute: TypedArray|IGLBuffer;

        for (const name of Object.keys(attributes)) {
            attribute = attributes[name];
            this.attributes[name] = attribute instanceof GLVertexBuffer ?
                attribute :
                new GLVertexBuffer(this._contex, this.vertex_count, attribute as TypedArray);
        }
    }

    bindToLocations(locations: IGLAttributeLocations): void {
        gl = this._contex;

        gl.bindVertexArray(this._id);

        let location: GLuint;
        let attribute: IGLBuffer;

        for (const name of Object.keys(locations)) {
            location = locations[name];
            attribute = this.attributes[name];
            if (attribute) {
                attribute.bind();
                gl.enableVertexAttribArray(location);
                gl.vertexAttribPointer(location, attribute.component_count, attribute.data_type, false, 0, 0);
                attribute.unbind();
            } else
                throw `Missing data for attribute ${name}!`;
        }
    }

    bind(): void {this._contex.bindVertexArray(this._id)}
    unbind(): void {this._contex.bindVertexArray(null)}

    delete(): void {
        for (const attribute of Object.values(this.attributes)) attribute.delete();
        this._contex.deleteVertexArray(this._id);
    }
}

export class GLTexture {
    private readonly _id: WebGLVertexArrayObject;
    private _slot: number = -1;

    constructor(
        readonly _contex: WebGL2RenderingContext,
        data?: HTMLImageElement,
        protected _type: GLenum = _contex.TEXTURE_2D,

        wrap_u: GLenum = _contex.CLAMP_TO_EDGE,
        wrap_v: GLenum = wrap_u,

        min_filter: GLenum = _contex.LINEAR,
        mag_filter: GLenum = min_filter
    ) {
        this._id = _contex.createTexture();
        if (data)
            this.load(data, wrap_u, wrap_v, min_filter, mag_filter);
    }

    load(
        data: HTMLImageElement,

        wrap_u: GLenum = gl.CLAMP_TO_EDGE,
        wrap_v: GLenum = wrap_u,

        min_filter: GLenum = gl.LINEAR,
        mag_filter: GLenum = min_filter
    ) {
        gl = this._contex;

        gl.bindTexture(this._type, this._id);

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texParameteri(this._type, gl.TEXTURE_WRAP_S, wrap_u);
        gl.texParameteri(this._type, gl.TEXTURE_WRAP_T, wrap_v);

        gl.texParameteri(this._type, gl.TEXTURE_MIN_FILTER, min_filter);
        gl.texParameteri(this._type, gl.TEXTURE_MAG_FILTER, mag_filter);

        gl.texImage2D(this._type, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data);

        gl.bindTexture(this._type, null);
    }

    get slot() {return this._slot}

    bind(slot: GLenum = 0): void {
        this._slot = slot;
        gl  = this._contex;
        gl.activeTexture(gl.TEXTURE0 + this._slot);
        gl.bindTexture(this._type, this._id);
    }

    unbind(): void {this._contex.bindTexture(this._type, null)}
    delete(): void {this._contex.deleteTexture(this._id)}
}