import {ATTRIBUTE, DIM, FACE_TYPE} from "../constants.js";
import {
    FaceInputNum,
    FaceInputs,
    FaceInputStr,
    FaceValues,
    FaceVerticesValues,
    IntArray,
    NumArrays,
    SharedVertexValues,
    UnsharedVertexValues,
    Values,
    VertexFacesValues,
    VertexInputNum,
    VertexInputs,
    VertexInputStr
} from "../types.js";
import {float, float3, num2, num3, num4} from "../factories.js";
import {cross, subtract} from "../math/vec3.js";

export class FaceVertices {
    public values: FaceVerticesValues = [null, null, null];

    constructor(input_positions: InputPositions = null) {
        if (input_positions)
            this.load(input_positions);
    }

    load(input_positions: InputPositions) {
        const face_count: number = input_positions.faces[0].length;
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
    private _temp_array: NumArrays = [];
    private _buffer: IntArray = null;

    public values: VertexFacesValues = [];

    constructor(vertex_count: number = 0, face_vertices: FaceVertices = null) {
        if (vertex_count && face_vertices)
            this.load(vertex_count, face_vertices);
    }

    load(vertex_count: number, face_vertices: FaceVertices) {
        this._temp_array.length = vertex_count;
        for (let i = 0; i < vertex_count; i++)
            this._temp_array[i] = [];

        let vertex_id, face_id, relations: number = 0;
        for (const face_vertex_ids of face_vertices.values) {
            for ([face_id, vertex_id] of face_vertex_ids.entries()) {
                this._temp_array[vertex_id].push(face_id);
                relations++
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
    public readonly id: ATTRIBUTE;
    public readonly name: string;
    public readonly dim: DIM = DIM._3D;

    constructor() {
        switch (this.id) {
            case ATTRIBUTE.position: this.name = 'position'; break;
            case ATTRIBUTE.normal: this.name = 'normal'; break;
            case ATTRIBUTE.color: this.name = 'color'; break;
            case ATTRIBUTE.uv: this.name = 'uv'; break;
            default:
                throw `Invalid attribute id ${this.id}! `+
                'Only supports position, normal, color or uv.';
        }
    }
}

export class InputAttribute extends Attribute {
    public readonly vertices: VertexInputs;
    public readonly faces: FaceInputs;

    constructor(
        public face_type: FACE_TYPE = FACE_TYPE.TRIANGLE
    ) {
        super();

        switch (this.face_type) {
            case FACE_TYPE.TRIANGLE: this.faces = num3(); break;
            case FACE_TYPE.QUAD: this.faces = num4(); break;
            default:
                throw `Invalid face type ${this.face_type}! Only supports triangles and quads.`;
        }
        switch (this.dim) {
            case DIM._2D: this.vertices = num2(); break;
            case DIM._3D: this.vertices = num3(); break;
            default:
                throw `Invalid vertex dimension ${this.dim}! Only supports 2D or 3D.`;
        }
    }

    private getValue(value: number | string, is_index: boolean): number {
        let error: string;
        if (typeof value === "number") {
            if (Number.isFinite(value)) {
                if (is_index) {
                    if (Number.isInteger(value))
                        return value;
                    else
                        error = `${value} is not an integer`
                } else
                    return value;
            } else
                error = `${value} is not a finite number`;
        } else if (typeof value === "string")
            return this.getValue(+value, is_index);
        else
            error = `Got ${typeof value} ${value} instead or a number or a string`;

        throw `Invalid ${this.name} ${is_index ? 'index' : 'value'}! ${error}`;
    }

    private checkInputSize(input_size: number, is_index: boolean) {
        const required_size = is_index ? this.face_type : this.dim;
        if (input_size !== required_size)
            throw `Invalid ${this.name} ${
                is_index ? 'indices' : 'values'
            } input! Got ${input_size} ${
                is_index ? 'vertices per face' : 'dimensions'
            } instead of ${required_size}`;
    }

    pushVertex(vertex: VertexInputNum | VertexInputStr) {
        this.checkInputSize(vertex.length, false);
        for (const [component_num, component_value] of vertex.entries())
            this.vertices[component_num].push(this.getValue(component_value, false));
    }

    pushFace(face: FaceInputNum | FaceInputStr) {
        this.checkInputSize(face.length, true);
        for (const [vertex_num, vertex_index] of face.entries())
            this.faces[vertex_num].push(this.getValue(vertex_index, true));
    }
}

class BaseVertexAttribute extends Attribute {
    public shared_values: SharedVertexValues = null;
    public unshared_values: UnsharedVertexValues = null;

    constructor(
        public readonly length: number,
        public readonly is_shared: boolean | number = true,
    ) {
        super();
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

abstract class AbstractLoadableVertexAttribute<InputAttributeType extends InputAttribute> extends BaseVertexAttribute {
    protected _loadShared(input_attribute: InputAttributeType, face_vertices: FaceVertices) : void {
        let input_id, output_id: number;
        for (const [out_component, in_component] of zip(this.shared_values, input_attribute.vertices))
            for (const [output_ids, input_ids] of zip(face_vertices, input_attribute.faces))
                for ([output_id, input_id] of zip(output_ids, input_ids))
                    out_component[output_id] = in_component[input_id];
    }

    protected _loadUnShared(input_attribute: InputAttributeType) : void {
        let face_index, vertex_index: number;
        for (const [out_components, indices] of zip(this.unshared_values, input_attribute.faces))
            for (const [out_component, in_component] of zip(out_components, input_attribute.vertices))
                for ([face_index, vertex_index] of indices.entries())
                    out_component[face_index] = in_component[vertex_index];
    }

    load(input_attribute: InputAttributeType, face_vertices: FaceVertices) : void {
        if (this.is_shared)
            this._loadShared(input_attribute, face_vertices);
        else
            this._loadUnShared(input_attribute);
    }
}

abstract class AbstractPulledVertexAttribute<
    InputAttributeType extends InputAttribute,
    FaceAttributeType extends BaseFaceAttribute
    > extends AbstractLoadableVertexAttribute<InputAttributeType> {

    pull(face_attribute: FaceAttributeType, vertex_faces: VertexFaces) : void {
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
    public face_values: FaceValues = null;

    constructor(length: number) {
        super();
        this.face_values = float(length, this.dim);
    }
}

abstract class AbstractFaceAttribute<VertexAttributeType extends BaseVertexAttribute> extends BaseFaceAttribute {

    pull(vertex_attribute: VertexAttributeType, face_vertices: FaceVertices): void {
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

class VertexPositions extends AbstractLoadableVertexAttribute<InputPositions> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.position;

    protected _loadShared(input_attribute: InputPositions) : void {
        for (const [out_component, in_component] of zip(this.shared_values, input_attribute.vertices))
            out_component.set(in_component);
    }
}

class VertexNormals extends AbstractPulledVertexAttribute<InputNormals, FaceNormals> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;
}

class VertexColors extends AbstractPulledVertexAttribute<InputColors, FaceColors> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.color;

    generate() {
        if (this.is_shared)
            randomize(this.shared_values);
        else
            for (const values of this.unshared_values)
                randomize(values);
    }
}

class VertexUVs extends AbstractLoadableVertexAttribute<InputUVs> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;
    public readonly dim: DIM = DIM._2D;
}

export class InputPositions extends InputAttribute {public readonly id = ATTRIBUTE.position}
export class InputNormals extends InputAttribute {public readonly id = ATTRIBUTE.normal}
export class InputColors extends InputAttribute {public readonly id = ATTRIBUTE.color}
export class InputUVs extends InputAttribute {public readonly id = ATTRIBUTE.uv; public readonly dim = DIM._2D}

export class FacePositions extends AbstractFaceAttribute<VertexPositions> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.position;
}

export class FaceNormals extends AbstractFaceAttribute<VertexPositions> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;

    pull(attribute: VertexPositions, face_vertices: FaceVertices) {
        const [out_x, out_y, out_z] = this.face_values;
        const [ids_0, ids_1, ids_2] =  face_vertices.values;
        let values_0, values_1, values_2;
        if (attribute.is_shared)
            values_0 = values_1 = values_2 = attribute.shared_values;
        else [
            values_0, values_1, values_2
        ] = face_vertices.values;
        let id_0, id_1, id_2: number;

        for (let face_id = 0; face_id < out_x.length; face_id++) {
            if (attribute.is_shared) {
                id_0 = ids_0[face_id];
                id_1 = ids_1[face_id];
                id_2 = ids_2[face_id];
            } else
                id_0 = id_1 = id_2 = face_id;

            subtract(values_1, id_1, values_0, id_0, temp, 0);
            subtract(values_2, id_2, values_0, id_0, temp, 1);
            cross(temp, 0, temp, 1, temp, 2);

            out_x[face_id] = temp[0][2];
            out_y[face_id] = temp[1][2];
            out_z[face_id] = temp[2][2];
        }
    }
}

export class FaceColors extends AbstractFaceAttribute<VertexColors> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.color;

    generate() {
        randomize(this.face_values);
    }
}

export type FaceAttribute = FacePositions | FaceNormals | FaceColors;
export type VertexAttribute = VertexPositions | VertexNormals | VertexColors | VertexUVs;

abstract class AbstractCollection<
    PositionAttributeType extends Attribute,
    NormalAttributeType extends Attribute,
    ColorAttributeType extends Attribute,
    > {
    public position: PositionAttributeType = null;
    public normal: NormalAttributeType = null;
    public color: ColorAttributeType = null;

    public count: number;
    public included: number;

    protected _validate(value: number, name: string,  min: number = 0, max: number = Number.MAX_SAFE_INTEGER) : boolean {
        if (Number.isInteger(value)) {
            if (Number.isFinite(value)) {
                if (value > min) {
                    if (value < max) {
                        return true;
                    } console.debug(`${name} has to be a smaller than ${max} - got ${value}`)
                } console.debug(`${name} has to be a greater than ${min} - got ${value}`)
            } else console.debug(`${name} has to be a finite number - got ${value}`);
        } else console.debug(`${name} has to be an integer - got ${value}`);

        return false;
    }

    protected _validateParameters = () : boolean => (
        this._validate(this.count, 'Count') &&
        this._validate(this.included, 'included', 0b0001, 0b1111)
    );
}

export class Faces extends AbstractCollection<FacePositions, FaceNormals, FaceColors> {
    constructor(count?: number, included?: number) {
        super();

        if (count !== undefined)
            this.init(count, included);
    }

    init(count: number, included: number) {
        this.count = count;
        this.included = included;

        if (!this._validateParameters())
            throw `Invalid parameters! count: ${count} included: ${included}`;

        if (included & ATTRIBUTE.position) this.position = new FacePositions(count);
        if (included & ATTRIBUTE.normal) this.normal = new FaceNormals(count);
        if (included & ATTRIBUTE.color) this.color = new FaceColors(count);
    }
}

export class Vertices extends AbstractCollection<VertexPositions, VertexNormals, VertexColors> {
    public uv: VertexUVs  = null;
    public shared: number;

    constructor(count?: number, included?: number, shared?: number) {
        super();

        if (count !== undefined)
            this.init(count, included, shared);
    }

    init(count: number, included: number, shared: number) {
        this.count = count;
        this.included = included;
        this.shared = shared;

        if (!this._validateParameters())
            throw `Invalid parameters! count: ${count} included: ${included}`;

        this.position = new VertexPositions(count, shared & ATTRIBUTE.position);
        if (included & ATTRIBUTE.normal) this.normal = new VertexNormals(count, shared & ATTRIBUTE.normal);
        if (included & ATTRIBUTE.color) this.color = new VertexColors(count, shared & ATTRIBUTE.color);
        if (included & ATTRIBUTE.uv) this.uv = new VertexUVs(count, shared & ATTRIBUTE.uv);
    }

    protected _validateParameters = () : boolean => (
        this._validate(this.count, 'Count') &&
        this._validate(this.included, 'included', 0b0001, 0b1111) &&
        this._validate(this.shared, 'shared', 0b0000, 0b1111)
    );
}

const randomize = (values: Values): void => {
    // Assigned random values:
    for (const array of values)
        for (const index of array.keys())
            array[index] = Math.random();
};

// Temporary float arrays for computations:
const temp = float3(3);

function *zip (...iterables){
    let iterators = iterables.map(i => i[Symbol.iterator]());
    while (true) {
        let results = iterators.map(iter => iter.next());
        if (results.some(res => res.done))
            return;
        else
            yield results.map(res => res.value);
    }
}

const avg = (values: number[]) : number => {
    let sum = 0;
    for (const value of values) sum += value;
    return sum / values.length;
};