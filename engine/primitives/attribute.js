import { float3, num2, num3, num4 } from "../factories.js";
import { Direction3D, Position3D } from "../math/vec3.js";
export class FaceVertices {
    init(allocator, size) {
        if (!(this.indices && this.indices[0].length === size))
            this.indices = allocator.allocate(size);
    }
    load(inputs) {
        this.indices[0].set(inputs[0]);
        this.indices[1].set(inputs[1]);
        this.indices[2].set(inputs[2]);
    }
}
export class VertexFaces {
    constructor() {
        this.indices = [];
    }
    init(allocator, size) {
        if (!(this._buffer && this._buffer.length === size))
            this._buffer = allocator.allocate(size)[0];
    }
    load(inputs) {
        this.indices.length = inputs.length;
        let offset = 0;
        for (const [i, array] of inputs.entries()) {
            this.indices[i] = this._buffer.subarray(offset, array.length);
            this.indices[i].set(array);
            offset += array.length;
        }
    }
}
export class Attribute {
    constructor() {
        this.dim = 3 /* _3D */;
    }
}
export class InputAttribute extends Attribute {
    constructor(face_type = 3 /* TRIANGLE */, vertices, faces) {
        super();
        this.face_type = face_type;
        this.vertices = vertices;
        this.faces = faces;
        if (!faces)
            switch (face_type) {
                case 3 /* TRIANGLE */:
                    this.faces = num3();
                    break;
                case 4 /* QUAD */:
                    this.faces = num4();
                    break;
                default:
                    throw `Invalid face type ${face_type}! Only supports triangles and quads.`;
            }
        if (!vertices)
            switch (this.dim) {
                case 2 /* _2D */:
                    this.vertices = num2();
                    break;
                case 3 /* _3D */:
                    this.vertices = num3();
                    break;
                default:
                    throw `Invalid vertex dimension ${this.dim}! Only supports 2D or 3D.`;
            }
    }
    triangulate() {
        if (this.face_type === 4 /* QUAD */) {
            const v4 = this.faces.pop();
            const quad_count = v4.length;
            const [v1, v2, v3] = this.faces;
            v1.length *= 2;
            v2.length *= 2;
            v3.length *= 2;
            for (let quad_id = 0; quad_id < quad_count; quad_id++) {
                v1[quad_id + quad_count] = v1[quad_id];
                v2[quad_id + quad_count] = v3[quad_id];
                v3[quad_id + quad_count] = v4[quad_id];
            }
            this.face_type = 3 /* TRIANGLE */;
        }
    }
    getValue(value, is_index) {
        let error;
        if (typeof value === "number") {
            if (Number.isFinite(value)) {
                if (is_index) {
                    if (Number.isInteger(value))
                        return value;
                    else
                        error = `${value} is not an integer`;
                }
                else
                    return value;
            }
            else
                error = `${value} is not a finite number`;
        }
        else if (typeof value === "string")
            return this.getValue(+value, is_index);
        else
            error = `Got ${typeof value} ${value} instead or a number or a string`;
        throw `Invalid ${this} ${is_index ? 'index' : 'value'}! ${error}`;
    }
    checkInputSize(input_size, is_index) {
        const required_size = is_index ? this.face_type : this.dim;
        if (input_size !== required_size)
            throw `Invalid ${this} ${is_index ? 'indices' : 'values'} input! Got ${input_size} ${is_index ? 'vertices per face' : 'dimensions'} instead of ${required_size}`;
    }
    pushVertex(vertex) {
        this.checkInputSize(vertex.length, false);
        for (const [component_num, component_value] of vertex.entries())
            this.vertices[component_num].push(this.getValue(component_value, false));
    }
    pushFace(face) {
        this.checkInputSize(face.length, true);
        for (const [vertex_num, vertex_index] of face.entries())
            this.faces[vertex_num].push(this.getValue(vertex_index, true));
    }
}
class BaseVertexAttribute extends Attribute {
    constructor() {
        super(...arguments);
        this.unshared_values = [undefined, undefined, undefined];
    }
    init(allocator, size, is_shared = this.is_shared) {
        this.is_shared = !!(is_shared);
        if (is_shared) {
            if (!(this.shared_values && this.shared_values[0].length === size))
                this.shared_values = allocator.allocate(size);
        }
        else {
            if (!(this.unshared_values[0] && this.unshared_values[0].length === size)) {
                this.unshared_values[0] = allocator.allocate(size);
                this.unshared_values[1] = allocator.allocate(size);
                this.unshared_values[2] = allocator.allocate(size);
            }
        }
    }
}
class AbstractLoadableVertexAttribute extends BaseVertexAttribute {
    _loadShared(input_attribute, face_vertices) {
        let input_id, output_id;
        for (const [out_component, in_component] of zip(this.shared_values, input_attribute.vertices))
            for (const [output_ids, input_ids] of zip(face_vertices, input_attribute.faces))
                for ([output_id, input_id] of zip(output_ids, input_ids))
                    out_component[output_id] = in_component[input_id];
    }
    _loadUnShared(input_attribute) {
        let face_index, vertex_index;
        for (const [out_components, indices] of zip(this.unshared_values, input_attribute.faces))
            for (const [out_component, in_component] of zip(out_components, input_attribute.vertices))
                for ([face_index, vertex_index] of indices.entries())
                    out_component[face_index] = in_component[vertex_index];
    }
    load(input_attribute, face_vertices) {
        if (this.is_shared)
            this._loadShared(input_attribute, face_vertices);
        else
            this._loadUnShared(input_attribute);
    }
}
class AbstractPulledVertexAttribute extends AbstractLoadableVertexAttribute {
    pull(face_attribute, vertex_faces) {
        if (this.is_shared) // Average vertex-attribute values from their related face's attribute values:
            for (const [vertex_component, face_component] of zip(this.shared_values, face_attribute.face_values))
                for (const [vertex_id, face_ids] of vertex_faces.indices.entries()) {
                    let accumulator = 0;
                    // For each component 'accumulate-in' the face-value of all the faces of this vertex:
                    for (let face_id of face_ids)
                        accumulator += face_component[face_id];
                    vertex_component[vertex_id] += accumulator / face_ids.length;
                }
        else // Copy over face-attribute values to their respective vertex-attribute values:
            for (const vertex_components of this.unshared_values)
                for (const [vertex_component, face_component] of zip(vertex_components, face_attribute.face_values))
                    vertex_component.set(face_component);
    }
}
class BaseFaceAttribute extends Attribute {
    init(allocator, size) {
        if (!(this.face_values && this.face_values[0].length === size))
            this.face_values = allocator.allocate(size);
    }
}
class AbstractFaceAttribute extends BaseFaceAttribute {
    pull(vertex_attribute, face_vertices) {
        if (vertex_attribute.is_shared)
            for (const [output, input] of zip(this.face_values, vertex_attribute.shared_values))
                for (const [face_id, [id_0, id_1, id_2]] of [...zip(face_vertices)].entries())
                    output[face_id] = (input[id_0] + input[id_1] + input[id_2]) / 3;
        else
            for (const [output, ...inputs] of zip(this.face_values, ...vertex_attribute.unshared_values))
                for (const [face_id, values] of [...zip(...inputs)].entries())
                    output[face_id] = avg(values);
        // this.initCurrent();
    }
}
class VertexPositions extends AbstractLoadableVertexAttribute {
    constructor() {
        super(...arguments);
        this.id = 1 /* position */;
    }
    _loadShared(input_attribute) {
        for (const [out_component, in_component] of zip(this.shared_values, input_attribute.vertices))
            out_component.set(in_component);
    }
}
class VertexNormals extends AbstractPulledVertexAttribute {
    constructor() {
        super(...arguments);
        this.id = 2 /* normal */;
    }
}
class VertexColors extends AbstractPulledVertexAttribute {
    constructor() {
        super(...arguments);
        this.id = 4 /* color */;
    }
    generate() {
        if (this.is_shared)
            randomize(this.shared_values);
        else
            for (const values of this.unshared_values)
                randomize(values);
    }
}
class VertexUVs extends AbstractLoadableVertexAttribute {
    constructor() {
        super(...arguments);
        this.id = 2 /* normal */;
        this.dim = 2 /* _2D */;
    }
}
export class InputPositions extends InputAttribute {
    constructor() {
        super(...arguments);
        this.id = 1 /* position */;
    }
}
export class InputNormals extends InputAttribute {
    constructor() {
        super(...arguments);
        this.id = 2 /* normal */;
    }
}
export class InputColors extends InputAttribute {
    constructor() {
        super(...arguments);
        this.id = 4 /* color */;
    }
}
export class InputUVs extends InputAttribute {
    constructor() {
        super(...arguments);
        this.id = 8 /* uv */;
        this.dim = 2 /* _2D */;
    }
}
export class FacePositions extends AbstractFaceAttribute {
    constructor() {
        super(...arguments);
        this.id = 1 /* position */;
    }
}
export class FaceNormals extends AbstractFaceAttribute {
    constructor() {
        super(...arguments);
        this.id = 2 /* normal */;
    }
    pull(attribute, face_vertices) {
        const [ids_0, ids_1, ids_2] = face_vertices.indices;
        face_normal.arrays = this.face_values;
        if (attribute.is_shared)
            pos1.arrays = pos2.arrays = pos3.arrays = attribute.shared_values;
        else
            [pos1.arrays, pos2.arrays, pos3.arrays] = attribute.unshared_values;
        for (let face_id = 0; face_id < this.face_values[0].length; face_id++) {
            face_normal.id = face_id;
            if (attribute.is_shared) {
                pos1.id = ids_0[face_id];
                pos2.id = ids_1[face_id];
                pos3.id = ids_2[face_id];
            }
            else
                pos1.id = pos2.id = pos3.id = face_id;
            pos1.to(pos2, dir1).crossedWith(pos1.to(pos3, dir2), dir3).normalized(face_normal);
        }
    }
}
export class FaceColors extends AbstractFaceAttribute {
    constructor() {
        super(...arguments);
        this.id = 4 /* color */;
    }
    generate() {
        randomize(this.face_values);
    }
}
class AbstractCollection {
    constructor() {
        this._validateParameters = () => (this._validate(this.count, 'Count') &&
            this._validate(this.included, 'included', 0b0001, 0b1111));
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
export class Faces extends AbstractCollection {
    constructor() {
        super(...arguments);
        this.positions = new FacePositions();
        this.normals = new FaceNormals();
        this.colors = new FaceColors();
        this.vertices = new FaceVertices();
    }
    init(allocators, count, included) {
        this.count = count;
        this.included = included;
        if (!this._validateParameters())
            throw `Invalid parameters! count: ${count} included: ${included}`;
        this.vertices.init(allocators.face_vertices, count);
        if (included & 1 /* position */)
            this.positions.init(allocators.vec3D, count);
        if (included & 2 /* normal */)
            this.normals.init(allocators.vec3D, count);
        if (included & 4 /* color */)
            this.colors.init(allocators.vec3D, count);
    }
}
export class Vertices extends AbstractCollection {
    constructor() {
        super(...arguments);
        this.positions = new VertexPositions();
        this.normals = new VertexNormals();
        this.colors = new VertexColors();
        this.uvs = new VertexUVs();
        this.faces = new VertexFaces();
        this._validateParameters = () => (this._validate(this.count, 'Count') &&
            this._validate(this.included, 'included', 0b0001, 0b1111) &&
            this._validate(this.shared, 'shared', 0b0000, 0b1111));
    }
    init(allocators, count, included, shared) {
        this.count = count;
        this.included = included;
        this.shared = shared;
        if (!this._validateParameters())
            throw `Invalid parameters! count: ${count} included: ${included}`;
        this.positions.init(allocators.vec3D, count, shared & 1 /* position */);
        if (included & 2 /* normal */)
            this.normals.init(allocators.vec3D, count, shared & 2 /* normal */);
        if (included & 4 /* color */)
            this.colors.init(allocators.vec3D, count, shared & 4 /* color */);
        if (included & 8 /* uv */)
            this.uvs.init(allocators.vec2D, count, shared & 8 /* uv */);
    }
}
const randomize = (values) => {
    // Assigned random values:
    for (const array of values)
        for (const index of array.keys())
            array[index] = Math.random();
};
// Temporary float arrays for computations:
const temp = float3(3);
const dir1 = new Direction3D(temp, 0);
const dir2 = new Direction3D(temp, 1);
const dir3 = new Direction3D(temp, 2);
const pos1 = new Position3D(temp);
const pos2 = new Position3D(temp);
const pos3 = new Position3D(temp);
const face_normal = new Direction3D(temp);
function* zip(...iterables) {
    let iterators = iterables.map(i => i[Symbol.iterator]());
    while (true) {
        let results = iterators.map(iter => iter.next());
        if (results.some(res => res.done))
            return;
        else
            yield results.map(res => res.value);
    }
}
const avg = (values) => {
    let sum = 0;
    for (const value of values)
        sum += value;
    return sum / values.length;
};
function* iter2(a, b, r = [0, a[0], b[0]]) {
    for (let i = 0; i < a.length; i++) {
        r[0] = i;
        r[1] = a[i];
        r[2] = b[i];
        yield r;
    }
}
function* iter3(a, b, c) {
    const result = [0, a[0], b[0], c[0]];
    for (let i = 0; i < a.length; i++) {
        result[0] = i;
        result[1] = a[i];
        result[2] = b[i];
        result[3] = c[i];
        yield result;
    }
}
//# sourceMappingURL=attribute.js.map