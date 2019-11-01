import { IntArray } from "../types.js";
import { float, float3, num2, num3, num4 } from "../factories.js";
import { cross, normalize, subtract } from "../math/vec3.js";
export class FaceVertices {
    constructor(input_positions = null) {
        this.values = [null, null, null];
        if (input_positions)
            this.load(input_positions);
    }
    load(input_positions) {
        const face_count = input_positions.faces[0].length;
        for (const [i, buffer] of this.values.entries()) {
            if (buffer === null || buffer.length !== face_count)
                this.values[i] = new IntArray(face_count);
        }
        this.values[0].set(input_positions.faces[0]);
        this.values[1].set(input_positions.faces[1]);
        this.values[2].set(input_positions.faces[2]);
    }
}
export class VertexFaces {
    constructor(vertex_count = 0, face_vertices = null) {
        this._temp_array = [];
        this._buffer = null;
        this.values = [];
        if (vertex_count && face_vertices)
            this.load(vertex_count, face_vertices);
    }
    load(vertex_count, face_vertices) {
        this._temp_array.length = vertex_count;
        for (let i = 0; i < vertex_count; i++)
            this._temp_array[i] = [];
        let vertex_id, face_id, relations = 0;
        for (const face_vertex_ids of face_vertices.values) {
            for ([face_id, vertex_id] of face_vertex_ids.entries()) {
                this._temp_array[vertex_id].push(face_id);
                relations++;
            }
        }
        this.values.length = vertex_count;
        if (this._buffer === null || this._buffer.length !== relations)
            this._buffer = new Uint32Array(relations);
        let offset = 0;
        for (const [i, array] of this._temp_array.entries()) {
            this.values[i] = this._buffer.subarray(offset, array.length);
            this.values[i].set(array);
            offset += array.length;
        }
    }
}
export class Attribute {
    constructor() {
        this.dim = 3 /* _3D */;
        switch (this.id) {
            case 1 /* position */:
                this.name = 'position';
                break;
            case 2 /* normal */:
                this.name = 'normal';
                break;
            case 4 /* color */:
                this.name = 'color';
                break;
            case 8 /* uv */:
                this.name = 'uv';
                break;
            default:
                throw `Invalid attribute id ${this.id}! ` +
                    'Only supports position, normal, color or uv.';
        }
    }
}
export class InputAttribute extends Attribute {
    constructor(face_type = 3 /* TRIANGLE */, vertices = null, faces = null) {
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
        throw `Invalid ${this.name} ${is_index ? 'index' : 'value'}! ${error}`;
    }
    checkInputSize(input_size, is_index) {
        const required_size = is_index ? this.face_type : this.dim;
        if (input_size !== required_size)
            throw `Invalid ${this.name} ${is_index ? 'indices' : 'values'} input! Got ${input_size} ${is_index ? 'vertices per face' : 'dimensions'} instead of ${required_size}`;
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
    constructor(length, is_shared = true) {
        super();
        this.length = length;
        this.is_shared = is_shared;
        this.shared_values = null;
        this.unshared_values = null;
        if (!!is_shared)
            this.shared_values = float(length, this.dim);
        else
            this.unshared_values = [
                float(length, this.dim),
                float(length, this.dim),
                float(length, this.dim)
            ];
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
                for (const [vertex_id, face_ids] of vertex_faces.values.entries()) {
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
    constructor(length) {
        super();
        this.face_values = null;
        this.face_values = float(length, this.dim);
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
        const [ids_0, ids_1, ids_2] = face_vertices.values;
        let values_0, values_1, values_2;
        if (attribute.is_shared)
            values_0 = values_1 = values_2 = attribute.shared_values;
        else
            [
                values_0, values_1, values_2
            ] = face_vertices.values;
        let id_0, id_1, id_2;
        for (let face_id = 0; face_id < this.face_values[0].length; face_id++) {
            if (attribute.is_shared) {
                id_0 = ids_0[face_id];
                id_1 = ids_1[face_id];
                id_2 = ids_2[face_id];
            }
            else
                id_0 = id_1 = id_2 = face_id;
            subtract(values_1, id_1, values_0, id_0, temp, 0);
            subtract(values_2, id_2, values_0, id_0, temp, 1);
            cross(temp, 0, temp, 1, temp, 2);
            normalize(temp, 2, this.face_values, face_id);
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
        this.position = null;
        this.normal = null;
        this.color = null;
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
    constructor(count, included) {
        super();
        if (count !== undefined)
            this.init(count, included);
    }
    init(count, included) {
        this.count = count;
        this.included = included;
        if (!this._validateParameters())
            throw `Invalid parameters! count: ${count} included: ${included}`;
        if (included & 1 /* position */)
            this.position = new FacePositions(count);
        if (included & 2 /* normal */)
            this.normal = new FaceNormals(count);
        if (included & 4 /* color */)
            this.color = new FaceColors(count);
    }
}
export class Vertices extends AbstractCollection {
    constructor(count, included, shared) {
        super();
        this.uv = null;
        this._validateParameters = () => (this._validate(this.count, 'Count') &&
            this._validate(this.included, 'included', 0b0001, 0b1111) &&
            this._validate(this.shared, 'shared', 0b0000, 0b1111));
        if (count !== undefined)
            this.init(count, included, shared);
    }
    init(count, included, shared) {
        this.count = count;
        this.included = included;
        this.shared = shared;
        if (!this._validateParameters())
            throw `Invalid parameters! count: ${count} included: ${included}`;
        this.position = new VertexPositions(count, shared & 1 /* position */);
        if (included & 2 /* normal */)
            this.normal = new VertexNormals(count, shared & 2 /* normal */);
        if (included & 4 /* color */)
            this.color = new VertexColors(count, shared & 4 /* color */);
        if (included & 8 /* uv */)
            this.uv = new VertexUVs(count, shared & 8 /* uv */);
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
//# sourceMappingURL=attribute.js.map