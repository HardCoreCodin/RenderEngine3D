import { dir3D, Direction3D, pos3D, Position3D } from "../math/vec3.js";
import { BufferSizes } from "../buffer.js";
import { zip } from "../utils.js";
export class Data {
    constructor() {
        this._slices = [];
        this._values = [];
        this.arrays = this._buffer.arrays;
        this._slices.length = this._values.length = this.dim = this.arrays.length;
    }
    init(length) {
        if (this.length)
            this.free();
        this.length = length;
        this.begin = this._buffer.allocate(length);
        this.end = this.begin + length;
    }
    free() {
        this._buffer.deallocate(this.begin, this.end);
        this.length = this.begin = this.end = 0;
    }
    get slices() {
        for (const [i, array] of this.arrays.entries())
            this._slices[i] = array.subarray(this.begin, this.end);
        return this._slices;
    }
    *values(begin = this.begin, end = this.end) {
        for (let i = begin; i < end; i++)
            for (const [i, array] of this.arrays.entries())
                this._values[i] = array[i];
        yield this._values;
    }
}
export class DataAttribute extends Data {
    init(length) {
        super.init(length);
        this.current = new this.Vector(this.begin);
    }
    free() {
        super.free();
        this.current = null;
    }
    *[Symbol.iterator]() {
        for (let id = this.begin; id < this.end; id++) {
            this.current.id = id;
            yield this.current;
        }
    }
}
export class VertexAttribute extends DataAttribute {
    constructor() {
        super(...arguments);
        this.begins = [0, 0, 0];
        this.ends = [0, 0, 0];
    }
    init(length, is_shared = this.is_shared) {
        if (is_shared) {
            super.init(length);
            this.begins[0] = this.begins[1] = this.begins[2] = this.begin;
            this.ends[0] = this.ends[1] = this.ends[2] = this.end;
            return;
        }
        else if (this.length)
            this.free();
        this.length = length;
        this.is_shared = !!is_shared;
        this.begins[0] = this._buffer.allocate(length);
        this.begins[1] = this._buffer.allocate(length);
        this.begins[2] = this._buffer.allocate(length);
        this.ends[0] = this.begins[0] + length;
        this.ends[1] = this.begins[1] + length;
        this.ends[2] = this.begins[2] + length;
        this.currents[0] = new this.Vector(this.begins[0]);
        this.currents[1] = new this.Vector(this.begins[1]);
        this.currents[2] = new this.Vector(this.begins[2]);
    }
    free() {
        if (this.is_shared)
            super.free();
        else
            this._buffer.deallocate(this.begins[0], this.ends[2]);
        this.begins[0] = this.begins[1] = this.begins[2] = this.ends[0] = this.ends[1] = this.ends[2] = 0;
        this.current = this.currents[0] = this.currents[1] = this.currents[2] = null;
    }
    *iterFaceVertexValues(face_vertices) {
        if (this.is_shared) {
            for (const [index_1, index_2, index_3] of face_vertices.values()) {
                this.currents[0].id = this.begin + index_1;
                this.currents[1].id = this.begin + index_2;
                this.currents[2].id = this.begin + index_3;
                yield this.currents;
            }
        }
        else {
            for (let face_index = 0; face_index < this.length; face_index++) {
                this.currents[0].id = this.begins[0] + face_index;
                this.currents[1].id = this.begins[1] + face_index;
                this.currents[2].id = this.begins[2] + face_index;
                yield this.currents;
            }
        }
    }
}
export class LoadableVertexAttribute extends VertexAttribute {
    _loadShared(input, face_vertices) {
        let in_index, out_index;
        const ref_indicies = face_vertices.arrays;
        for (const [in_components, out_component] of zip(input.vertices, this.arrays))
            for (const [in_indicies, out_indicies] of zip(input.faces_vertices, ref_indicies))
                for ([in_index, out_index] of zip(in_indicies, out_indicies))
                    out_component[this.begin + out_index] = in_components[in_index];
    }
    _loadUnshared(input) {
        let face_index, vertex_index;
        for (const [face_vertices, components, begin] of zip(input.faces_vertices, this.arrays, this.begins))
            for (const [inputs, component] of zip(input.vertices, components))
                for ([face_index, vertex_index] of face_vertices.entries())
                    component[begin + face_index] = inputs[vertex_index];
    }
    load(input, face_vertices) {
        if (this.is_shared)
            this._loadShared(input, face_vertices);
        else
            this._loadUnshared(input);
    }
}
export class PulledVertexAttribute extends LoadableVertexAttribute {
    pull(input, vertex_faces) {
        if (this.is_shared) {
            // Average vertex-attribute values from their related face's attribute values:
            const vertex_id__face_ids = vertex_faces.indices;
            let vertex_id, face_id;
            let face_ids;
            for (const [v_component, f_component] of zip(this.arrays, input.arrays))
                for ([vertex_id, face_ids] of vertex_id__face_ids.entries()) {
                    // For each component 'accumulate-in' the face-value of all the faces_vertices of this vertex:
                    let accumulator = 0;
                    for (face_id of face_ids)
                        accumulator += f_component[input.begin + face_id];
                    v_component[this.begin + vertex_id] = accumulator / face_ids.length;
                }
        }
        else {
            // Copy over face-attribute values to their respective vertex-attribute values:
            const face_components = input.slices;
            for (const begin of this.begins)
                for (const [vertexcomponent, face_ccomponent] of zip(this.arrays, face_components))
                    vertexcomponent.set(face_ccomponent, begin);
        }
    }
}
export class PulledFaceAttribute extends DataAttribute {
    pull(input, face_vertices) {
        if (input.is_shared) {
            let face_index;
            for (const [face_component, vertex_component] of zip(this.arrays, input.arrays)) {
                face_index = 0;
                for (const [vertex_index_1, vertex_index_2, vertex_index_3] of face_vertices.values()) {
                    face_component[input.begin + face_index] = (vertex_component[input.begin + vertex_index_1] +
                        vertex_component[input.begin + vertex_index_2] +
                        vertex_component[input.begin + vertex_index_3]) / 3;
                    face_index++;
                }
            }
        }
        else {
            let face_index;
            for (const [vertex_component, face_component] of zip(input.arrays, this.arrays))
                for (face_index = this.begin; face_index < this.end; face_index++)
                    face_component[face_index] = (vertex_component[input.begins[0] + face_index - this.begin] +
                        vertex_component[input.begins[1] + face_index - this.begin] +
                        vertex_component[input.begins[2] + face_index - this.begin]) / 3;
        }
    }
}
export class VertexPositions extends LoadableVertexAttribute {
    constructor() {
        super(...arguments);
        this.attribute_type = 1 /* position */;
    }
    _loadShared(input_attribute) {
        for (const [outputs, inputs] of zip(this.arrays, input_attribute.vertices))
            outputs.set(inputs);
    }
}
export class VertexNormals extends PulledVertexAttribute {
    constructor() {
        super(...arguments);
        this.attribute_type = 2 /* normal */;
    }
}
export class VertexColors extends PulledVertexAttribute {
    constructor() {
        super(...arguments);
        this.attribute_type = 4 /* color */;
    }
    generate() {
        for (const array of this.arrays)
            randomize(array, this.begins[0], this.ends[2]);
    }
}
export class VertexUVs extends LoadableVertexAttribute {
    constructor() {
        super(...arguments);
        this.attribute_type = 8 /* uv */;
    }
}
export class FacePositions extends PulledFaceAttribute {
    constructor() {
        super(...arguments);
        this.attribute_type = 1 /* position */;
    }
}
export class FaceNormals extends PulledFaceAttribute {
    constructor() {
        super(...arguments);
        this.attribute_type = 2 /* normal */;
    }
    pull(vertex_positions, face_vertices) {
        for (const [face_normal, [p1, p2, p3]] of zip(this, vertex_positions.iterFaceVertexValues(face_vertices))) {
            if (p1 instanceof Position3D &&
                p2 instanceof Position3D &&
                p3 instanceof Position3D) {
                p1.to(p2, dir1);
                p1.to(p3, dir2);
            }
            else {
                pos1.setTo(p1.x, p1.y, p1.z);
                pos2.setTo(p2.x, p2.y, p2.z);
                pos3.setTo(p3.x, p3.y, p3.z);
                pos1.to(pos2, dir1);
                pos1.to(pos3, dir2);
            }
            if (face_normal instanceof Direction3D) {
                dir1.cross(dir2).normalized(face_normal);
            }
            else {
                dir1.cross(dir2).normalize();
                face_normal.setTo(dir1.x, dir1.y, dir1.z, 0);
            }
        }
    }
}
export class FaceColors extends PulledFaceAttribute {
    constructor() {
        super(...arguments);
        this.attribute_type = 4 /* color */;
    }
    generate() {
        for (const array of this.arrays)
            randomize(array, this.begin, this.end);
    }
}
class AttributeCollection {
    constructor(mesh) {
        this.mesh = mesh;
        this._validateParameters();
    }
    _validate(value, name, min = 0, max = Number.MAX_SAFE_INTEGER) {
        if (Number.isInteger(value)) {
            if (Number.isFinite(value)) {
                if (value > min) {
                    if (value < max) {
                        return true;
                    }
                    console.debug(`${name} has to be a smaller than ${max} - got ${value}`);
                }
                console.debug(`${name} has to be a greater than ${min} - got ${value}`);
            }
            else
                console.debug(`${name} has to be a finite number - got ${value}`);
        }
        else
            console.debug(`${name} has to be an integer - got ${value}`);
        return false;
    }
}
export class Faces extends AttributeCollection {
    constructor(mesh, positions, normals, colors, vertices) {
        super(mesh);
        this.mesh = mesh;
        this.positions = positions;
        this.normals = normals;
        this.colors = colors;
        this.vertices = vertices;
        this._validateParameters = () => {
            if (!(this._validate(this.mesh.face_count, 'Count') &&
                this._validate(this.mesh.options.face_attributes, 'included', 0b0001, 0b1111)))
                throw `Invalid parameters! count: ${this.mesh.face_count} included: ${this.mesh.options.face_attributes}`;
        };
    }
    get sizes() {
        const sizes = new BufferSizes({
            face_vertices: this.mesh.vertex_count
        });
        const count = this.mesh.face_count;
        const attrs = this.mesh.options.face_attributes;
        if (attrs & 1 /* position */)
            sizes.incrementVec(this.positions.dim, count);
        if (attrs & 2 /* normal */)
            sizes.incrementVec(this.normals.dim, count);
        if (attrs & 4 /* color */)
            sizes.incrementVec(this.colors.dim, count);
        return sizes;
    }
    init() {
        const count = this.mesh.face_count;
        const included = this.mesh.options.face_attributes;
        this.vertices.init(count);
        if (included & 1 /* position */)
            this.positions.init(count);
        if (included & 2 /* normal */)
            this.normals.init(count);
        if (included & 4 /* color */)
            this.colors.init(count);
    }
}
export class Vertices extends AttributeCollection {
    constructor(mesh, positions, normals, colors, uvs, faces) {
        super(mesh);
        this.mesh = mesh;
        this.positions = positions;
        this.normals = normals;
        this.colors = colors;
        this.uvs = uvs;
        this.faces = faces;
        this._validateParameters = () => {
            if (!(this._validate(this.mesh.vertex_count, 'Count') &&
                this._validate(this.mesh.options.vertex_attributes, 'included', 0b0001, 0b1111) &&
                this._validate(this.mesh.options.share, 'shared', 0b0000, 0b1111)))
                throw `Invalid parameters! count: ${this.mesh.vertex_count} included: ${this.mesh.options.vertex_attributes}`;
        };
    }
    get sizes() {
        const sizes = new BufferSizes({
            vertex_faces: this.mesh.inputs.vertex_faces.size
        });
        const attrs = this.mesh.options.vertex_attributes;
        const count = this.mesh.vertex_count;
        sizes.incrementVec(this.positions.dim, count);
        if (attrs & 2 /* normal */)
            sizes.incrementVec(this.normals.dim, count);
        if (attrs & 4 /* color */)
            sizes.incrementVec(this.colors.dim, count);
        if (attrs & 8 /* uv */)
            sizes.incrementVec(this.uvs.dim, count);
        return sizes;
    }
    init() {
        const count = this.mesh.vertex_count;
        const included = this.mesh.options.vertex_attributes;
        const shared = this.mesh.options.share;
        this.faces.init(this.mesh.inputs.vertex_faces.size);
        this.positions.init(count, shared & 1 /* position */);
        if (included & 2 /* normal */)
            this.normals.init(count, shared & 2 /* normal */);
        if (included & 4 /* color */)
            this.colors.init(count, shared & 4 /* color */);
        if (included & 8 /* uv */)
            this.uvs.init(count, shared & 8 /* uv */);
    }
}
const randomize = (array, begin, end) => {
    for (let i = begin; i < end; i++)
        array[i] = Math.random();
};
const dir1 = dir3D();
const dir2 = dir3D();
const pos1 = pos3D();
const pos2 = pos3D();
const pos3 = pos3D();
//# sourceMappingURL=attribute.js.map