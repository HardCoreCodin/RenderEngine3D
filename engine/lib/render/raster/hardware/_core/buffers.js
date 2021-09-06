let gl;
class GLBuffer {
    constructor(_contex, _type, _count, data, usage = _contex.STATIC_DRAW) {
        this._contex = _contex;
        this._type = _type;
        this._count = _count;
        this.usage = usage;
        this._id = _contex.createBuffer();
        if (data)
            this.load(data, _count, usage);
    }
    load(data, count = this._count, usage = this.usage) {
        gl = this._contex;
        this._data_type = (data instanceof Float32Array ? gl.FLOAT :
            data instanceof Int8Array ? gl.BYTE :
                data instanceof Int16Array ? gl.SHORT :
                    data instanceof Int32Array ? gl.INT :
                        data instanceof Uint8Array ? gl.UNSIGNED_BYTE :
                            data instanceof Uint16Array ? gl.UNSIGNED_SHORT :
                                data instanceof Uint32Array ? gl.UNSIGNED_INT : -1);
        if (this._data_type === -1)
            throw `Unsupported data type for ${data}`;
        this._count = count;
        this._length = data.length;
        this._component_count = this._length / this._count;
        gl.bindBuffer(this._type, this._id);
        gl.bufferData(this._type, data, usage);
        gl.bindBuffer(this._type, null);
    }
    get count() { return this._count; }
    get length() { return this._length; }
    get component_count() { return this._component_count; }
    get data_type() { return this._data_type; }
    bindToLocation(location) {
        gl = this._contex;
        gl.bindBuffer(this._type, this._id);
        gl.enableVertexAttribArray(location);
        gl.vertexAttribPointer(location, this._component_count, this.data_type, false, 0, 0);
        gl.bindBuffer(this._type, null);
    }
    bind() { this._contex.bindBuffer(this._type, this._id); }
    unbind() { this._contex.bindBuffer(this._type, null); }
    delete() { this._contex.deleteBuffer(this._id); }
}
export class GLArrayBuffer extends GLBuffer {
    constructor(contex, count, data, usage = contex.STATIC_DRAW) {
        super(contex, contex.ARRAY_BUFFER, count, data, usage);
    }
    draw(mode = this._contex.TRIANGLES) {
        gl = this._contex;
        gl.bindBuffer(this._type, this._id);
        gl.drawArrays(mode, 0, this._count);
        gl.bindBuffer(this._type, null);
    }
}
export class GLElementArrayBuffer extends GLBuffer {
    constructor(contex, count, data, usage = contex.STATIC_DRAW) {
        super(contex, contex.ELEMENT_ARRAY_BUFFER, count, data, usage);
    }
    draw(mode = this._contex.TRIANGLES) {
        gl = this._contex;
        gl.bindBuffer(this._type, this._id);
        gl.drawElements(mode, this._length, this._data_type, 0);
        gl.bindBuffer(this._type, null);
    }
}
export class GLIndexBuffer extends GLElementArrayBuffer {
    constructor(contex, indices, usage = contex.STATIC_DRAW) {
        super(contex, indices.length, indices, usage);
    }
}
export class GLVertexBuffer extends GLArrayBuffer {
    constructor(contex, vertex_count, vertices, usage = contex.STATIC_DRAW) {
        super(contex, vertex_count, vertices, usage);
    }
}
export class GLVertexArray {
    constructor(_contex, vertex_count, attributes, locations) {
        this._contex = _contex;
        this.vertex_count = vertex_count;
        this.attributes = {};
        this._id = _contex.createVertexArray();
        if (attributes) {
            this.load(attributes);
            if (locations)
                this.bindToLocations(locations);
        }
    }
    load(attributes) {
        let attribute;
        for (const name of Object.keys(attributes)) {
            attribute = attributes[name];
            this.attributes[name] = attribute instanceof GLVertexBuffer ?
                attribute :
                new GLVertexBuffer(this._contex, this.vertex_count, attribute);
        }
    }
    bindToLocations(locations) {
        gl = this._contex;
        gl.bindVertexArray(this._id);
        for (const attribute in locations)
            if (attribute in this.attributes)
                this.attributes[attribute].bindToLocation(locations[attribute]);
            else
                throw `Missing data for attribute ${name}!`;
        gl.bindVertexArray(null);
    }
    bind() { this._contex.bindVertexArray(this._id); }
    unbind() { this._contex.bindVertexArray(null); }
    delete() {
        for (const attribute of Object.values(this.attributes))
            attribute.delete();
        this._contex.deleteVertexArray(this._id);
    }
}
export class GLTexture {
    constructor(_contex, data, _type = _contex.TEXTURE_2D, wrap_u = _contex.CLAMP_TO_EDGE, wrap_v = wrap_u, min_filter = _contex.LINEAR, mag_filter = min_filter) {
        this._contex = _contex;
        this._type = _type;
        this._slot = -1;
        this._id = _contex.createTexture();
        if (data)
            this.load(data, wrap_u, wrap_v, min_filter, mag_filter);
    }
    load(data, wrap_u = gl.CLAMP_TO_EDGE, wrap_v = wrap_u, min_filter = gl.LINEAR, mag_filter = min_filter) {
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
    get slot() { return this._slot; }
    bind(slot = 0) {
        this._slot = slot;
        gl = this._contex;
        gl.activeTexture(gl.TEXTURE0 + this._slot);
        gl.bindTexture(this._type, this._id);
    }
    unbind() { this._contex.bindTexture(this._type, null); }
    delete() { this._contex.deleteTexture(this._id); }
}
//# sourceMappingURL=buffers.js.map