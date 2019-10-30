import {ATTRIBUTE, DIM, FACE_TYPE} from "../constants.js";
import {
    FaceInputNum,
    FaceInputs,
    FaceInputStr,
    FaceValues,
    FaceVertices,
    SharedVertexValues,
    UnsharedVertexValues,
    Values,
    VertexFaces,
    VertexInputNum,
    VertexInputs,
    VertexInputStr
} from "../types.js";
import {float, float3, num2, num3, num4} from "../factories.js";
import {cross, subtract} from "../math/vec3.js";

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
        public readonly face_type: FACE_TYPE = FACE_TYPE.TRIANGLE
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
    public readonly is_shared: boolean;
    public readonly reorder: boolean = true;

    public shared_values: SharedVertexValues = null;
    public unshared_values: UnsharedVertexValues = null;

    constructor(length: number) {
        super();
        if (this.is_shared)
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

    load(input_attribute: InputAttributeType, face_vertices?: FaceVertices) : void {
        if (this.is_shared) {
            if (this.reorder) {
                let input_id, output_id: number;
                for (const [out_component, in_component] of zip(this.shared_values, input_attribute.vertices))
                    for (const [output_ids, input_ids] of zip(face_vertices, input_attribute.faces))
                        for ([output_id, input_id] of zip(output_ids, input_ids))
                            out_component[output_id] = in_component[input_id];
            } else
                for (const [out_component, in_component] of zip(this.shared_values, input_attribute.vertices))
                    out_component.set(in_component);
        } else {
            let face_index, vertex_index: number;
            for (const [out_components, indices] of zip(this.unshared_values, input_attribute.faces))
                for (const [out_component, in_component] of zip(out_components, input_attribute.vertices))
                    for ([face_index, vertex_index] of indices.entries())
                        out_component[face_index] = in_component[vertex_index];
        }
    }
}

abstract class AbstractPulledVertexAttribute<
    InputAttributeType extends InputAttribute,
    FaceAttributeType extends BaseFaceAttribute
    > extends AbstractLoadableVertexAttribute<InputAttributeType> {

    pull(face_attribute: FaceAttributeType, vertex_faces: VertexFaces) : void {
        if (this.is_shared) // Average vertex-attribute values from their related face's attribute values:
            for (const [vertex_component, face_component] of zip(this.shared_values, face_attribute.face_values))
                for (const [vertex_id, face_ids] of vertex_faces.entries()) {
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

abstract class AbstractFaceAttribute<VertexAttribute extends BaseVertexAttribute> extends BaseFaceAttribute {

    pull(vertex_attribute: VertexAttribute, face_vertices: FaceVertices): void {
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

class BaseVertexPositions extends AbstractLoadableVertexAttribute<InputPositions> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.position;
    public readonly reorder: boolean = false;
}

class BaseVertexNormals extends AbstractPulledVertexAttribute<InputNormals, FaceNormals> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;
}

class BaseVertexColors extends AbstractPulledVertexAttribute<InputColors, FaceColors> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.color;

    generate() {
        if (this.is_shared)
            randomize(this.shared_values);
        else
            for (const values of this.unshared_values)
                randomize(values);
    }
}

class BaseVertexUVs extends AbstractLoadableVertexAttribute<InputUVs> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;
    public readonly dim: DIM = DIM._2D;
}

export class InputPositions extends InputAttribute {public readonly id = ATTRIBUTE.position}
export class SharedVertexPositions extends BaseVertexPositions {public readonly is_shared = true}
export class UnsharedVertexPositions extends BaseVertexPositions {public readonly is_shared = false}

export class InputNormals extends InputAttribute {public readonly id = ATTRIBUTE.normal}
export class SharedVertexNormals extends BaseVertexNormals {public readonly is_shared = true}
export class UnsharedVertexNormals extends BaseVertexNormals {public readonly is_shared = false}

export class InputColors extends InputAttribute {public readonly id = ATTRIBUTE.color}
export class SharedVertexColors extends BaseVertexColors {public readonly is_shared = true}
export class UnsharedVertexColors extends BaseVertexColors {public readonly is_shared = false}

export class InputUVs extends InputAttribute {public readonly id = ATTRIBUTE.uv; public readonly dim = DIM._2D}
export class SharedVertexUVs extends BaseVertexUVs {public readonly is_shared = true}
export class UnsharedVertexUVs extends BaseVertexUVs {public readonly is_shared = false}

export type VertexPositions = SharedVertexPositions | UnsharedVertexPositions;
export type VertexNormals = SharedVertexNormals | UnsharedVertexNormals;
export type VertexColors = SharedVertexColors | UnsharedVertexColors;
export type VertexUVs = SharedVertexUVs | UnsharedVertexUVs;

export class FacePositions extends AbstractFaceAttribute<VertexPositions> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.position;
}

export class FaceNormals extends AbstractFaceAttribute<VertexPositions> {
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;

    pull(attribute: VertexPositions, face_vertices: FaceVertices) {
        const [out_x, out_y, out_z] = this.face_values;
        const [ids_0, ids_1, ids_2] =  face_vertices;
        let values_0, values_1, values_2;
        if (attribute.is_shared)
            values_0 = values_1 = values_2 = attribute.shared_values;
        else [
            values_0, values_1, values_2
        ] = face_vertices;
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

export class Faces {
    public readonly position: FacePositions = null;
    public readonly normal: FaceNormals = null;
    public readonly color: FaceColors = null;

    constructor(
        public readonly count: number,
        public readonly include_attributes: number,
    ) {
        if (include_attributes & ATTRIBUTE.position) this.position = new FacePositions(count);
        if (include_attributes & ATTRIBUTE.normal) this.normal = new FaceNormals(count);
        if (include_attributes & ATTRIBUTE.color) this.color = new FaceColors(count);
    }
}

export class Vertices {
    public readonly position: VertexPositions;
    public readonly normal: VertexNormals = null;
    public readonly color: VertexColors = null;
    public readonly uv: VertexUVs  = null;

    constructor(
        public readonly count: number,
        public readonly include_attributes: number,
        public readonly share_attributes: number
    ) {
        this.position = share_attributes & ATTRIBUTE.position ?
            new SharedVertexPositions(count) :
            new UnsharedVertexPositions(count);

        if (include_attributes & ATTRIBUTE.normal)
            this.normal = share_attributes & ATTRIBUTE.normal ?
                new SharedVertexNormals(count) :
                new UnsharedVertexNormals(count);

        if (include_attributes & ATTRIBUTE.color)
            this.color = share_attributes & ATTRIBUTE.color ?
                new SharedVertexColors(count) :
                new UnsharedVertexColors(count);

        if (include_attributes & ATTRIBUTE.uv)
            this.uv = share_attributes & ATTRIBUTE.uv ?
                new SharedVertexUVs(count) :
                new UnsharedVertexUVs(count);
    }
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