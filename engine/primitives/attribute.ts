import {ATTRIBUTE, DIM, VERTEX_NUM} from "../constants.js";
import {FaceVertices, UnsharedVertexValues, Values, VertexFaces} from "../types.js";
import {float, float3} from "../factories.js";
import {AttributeInputs, ColorInputs, NormalInputs, PositionInputs, UVInputs} from "./inputs.js";
import {cross, subtract} from "../math/vec3.js";

export class BaseAttribute {
    public readonly name: string;
    public readonly id: ATTRIBUTE;
    public readonly dim: DIM = DIM._3D;

    public readonly values: Values;
    public is_loaded: boolean = false;

    constructor(length: number) {
        this.values = float(length, this.dim)
    }

    protected _load(inputs: AttributeInputs): void {
        if (inputs === null)
            throw `${this.name}s could not be loaded, as there are no inputs!`;

        for (const [component_num, component_values] of this.values.entries())
            component_values.set(inputs.vertices[component_num]);

        this.is_loaded = true;
    }

    protected _generate(): void {
        randomize(this.values);

        this.is_loaded = true;
    }
}

export interface ILoad {
    load(...args: any[]): void;
}

export interface IGather {
    gatherFrom(...args: any[]): void;
}

export interface IGenerate {
    generate(...args: any[]): void;
}

export class BaseFaceAttribute extends BaseAttribute implements IGather {
    gatherFrom(
        vertex_attribute: SharedVertexPositions | UnsharedVertexPositions | SharedVertexColors | UnsharedVertexColors,
        face_vertices?: FaceVertices
    ): void {
        if (vertex_attribute.is_loaded) {
            const face_count = this.values[0].length;

            if (vertex_attribute instanceof BaseSharedVertexAttribute) {
                for (const [c, vertex] of vertex_attribute.values.entries()) {
                    for (let f = 0; f < face_count; f++)
                        this.values[c][f] = (
                            vertex[face_vertices[0][f]] +
                            vertex[face_vertices[1][f]] +
                            vertex[face_vertices[2][f]]
                        ) / 3;
                }
            } else {
                const [v0, v1, v2] = vertex_attribute.values;
                for (const [c, values] of this.values.entries())
                    for (let f = 0; f < face_count; f++)
                        values[f] = (v0[c][f] + v1[c][f] + v2[c][f]) / 3;
            }
        } else
            throw `Face ${this.name}s can not be pulled! Source attribute ${vertex_attribute.name} is not loaded!`;

        this.is_loaded = true;
    }
}

export class FacePositions extends BaseFaceAttribute {
    public readonly name: string = 'position';
    public readonly id: ATTRIBUTE = ATTRIBUTE.position;

    gatherFrom(attribute: VertexAttribute, face_vertices?: FaceVertices) {
        super.gatherFrom(attribute, face_vertices);
    }
}

export class FaceNormals extends BaseFaceAttribute {
    public readonly name: string = 'normal';
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;

    gatherFrom(attribute: SharedVertexPositions | UnsharedVertexPositions, face_vertices?: FaceVertices) {
        const [v0, v1, v2] = this.values;
        const face_count = v0.length;

        for (let face_id = 0; face_id < face_count; face_id++) {
            if (attribute instanceof SharedVertexPositions) {
                subtract(
                    attribute.values, face_vertices[1][face_id],
                    attribute.values, face_vertices[0][face_id],
                    temp, 0
                );
                subtract(
                    attribute.values, face_vertices[2][face_id],
                    attribute.values, face_vertices[0][face_id],
                    temp, 1
                );
            } else {
                subtract(
                    attribute.values[1], face_id,
                    attribute.values[0], face_id,
                    temp, 0
                );
                subtract(
                    attribute.values[2], face_id,
                    attribute.values[0], face_id,
                    temp, 1
                );
            }

            cross(
                temp, 0,
                temp, 1,
                temp, 2
            );

            v0[face_id] = temp[0][2];
            v1[face_id] = temp[1][2];
            v2[face_id] = temp[2][2];
        }

        this.is_loaded = true;
    }
}

export class FaceColors extends BaseFaceAttribute implements IGenerate {
    public readonly name: string = 'color';
    public readonly id: ATTRIBUTE = ATTRIBUTE.color;

    gatherFrom(attribute: SharedVertexColors | UnsharedVertexColors, face_vertices?: FaceVertices) {
        super.gatherFrom(attribute, face_vertices);
    }

    generate = (): void => this._generate();
}


export class BaseSharedVertexAttribute extends BaseAttribute {
    protected _load(inputs: AttributeInputs): void {
        if (inputs === null)
            throw `${this.name}s could not be loaded, as there are no inputs!`;

        // TODO: Implement...
        // if (input_vertex[0].length === this.vertex_count) {
        //     let face_id, input_id, vertex_num, component_num, data_id : number = 0;
        //     let input_values, input_ids: number[];
        //     for ([vertex_num, input_ids] of input_index.entries())
        //         data_index[vertex_num].set(input_ids);
        // }
    }

    protected _gatherFrom(face_attribute: FaceAttribute, vertex_faces: VertexFaces): void {
        if (face_attribute.is_loaded) {
            // Average vertex-attribute values from their related face's attribute values:
            for (const [vertex_id, face_ids] of vertex_faces.entries()) {
                // For each component 'accumulate-in' the face-value of all the faces of this vertex:
                for (const [c, values] of face_attribute.values.entries()) {
                    let accumulator = 0;

                    for (let f of face_ids)
                        accumulator += values[f];

                    this.values[c][vertex_id] += accumulator / face_ids.length;
                }
            }
        } else
            throw `Vertex ${this.name}s can not be gathered, as source face attribute has'nt been loaded!`;

        this.is_loaded = true;
    }
}

export class SharedVertexPositions extends BaseSharedVertexAttribute implements ILoad {
    public readonly id: ATTRIBUTE = ATTRIBUTE.position;
    public readonly name: string = 'position';

    load = (inputs: PositionInputs): void => super._load(inputs);
}

export class SharedVertexNormals extends BaseSharedVertexAttribute implements ILoad, IGather {
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;
    public readonly name: string = 'normal';

    load = (inputs: NormalInputs): void => this._load(inputs);
    gatherFrom = (face_attribute: FaceNormals, vertex_faces: VertexFaces): void =>
        this._gatherFrom(face_attribute, vertex_faces);
}

export class SharedVertexColors extends BaseSharedVertexAttribute implements ILoad, IGather, IGenerate {
    public readonly id: ATTRIBUTE = ATTRIBUTE.color;
    public readonly name: string = 'color';

    load = (inputs: ColorInputs): void => this._load(inputs);
    generate = (): void => this._generate();
    gatherFrom = (face_attribute: FaceColors, vertex_faces: VertexFaces): void =>
        this._gatherFrom(face_attribute, vertex_faces);
}

export class SharedVertexUVs extends BaseSharedVertexAttribute implements ILoad {
    public readonly id: ATTRIBUTE = ATTRIBUTE.uv;
    public readonly name: string = 'uv';

    load = (inputs: UVInputs): void => this._load(inputs);
}

export class BaseUnsharedVertexAttribute {
    public readonly name: string;
    public readonly id: ATTRIBUTE;
    public readonly dim: DIM = DIM._3D;

    public readonly values: UnsharedVertexValues;
    public is_loaded: boolean = false;

    constructor(length: number) {
        this.values = [
            float(length, this.dim),
            float(length, this.dim),
            float(length, this.dim)
        ];
    }

    private _setFaceVertexValues(vertex_num: VERTEX_NUM, inputs: AttributeInputs): void {
        let face_id, vertex_id: number;
        for (const [component_num, input_values] of inputs.vertices.entries())
            for ([face_id, vertex_id] of inputs.faces[vertex_num].entries())
                this.values[vertex_num][component_num][face_id] = input_values[vertex_id];
    }

    protected _load(inputs: AttributeInputs): void {
        if (inputs === null)
            throw `${this.name}s could not be loaded, as there are no inputs!`;

        this._setFaceVertexValues(0, inputs);
        this._setFaceVertexValues(1, inputs);
        this._setFaceVertexValues(2, inputs);

        this.is_loaded = true;
    }

    protected _generate(): void {
        for (const values of this.values)
            randomize(values);

        this.is_loaded = true;
    }

    protected _gatherFrom(face_attribute: FaceAttribute): void {
        if (face_attribute.is_loaded) {
            const face_values = face_attribute.values;
            const face_count = face_values[0].length;

            // Copy over face-attribute values to their respective vertex-attribute values:
            for (const vertex_components of this.values)
                for (const [c, vertex] of vertex_components.entries())
                    for (let f = 0; f < face_count; f++)
                        vertex[f] = face_values[c][f];
        } else
            throw `Vertex ${this.name}s can not be gathered, as source face attribute has'nt been loaded!`;

        this.is_loaded = true;
    }
}

export class UnsharedVertexPositions extends BaseUnsharedVertexAttribute implements ILoad {
    public readonly id: ATTRIBUTE = ATTRIBUTE.position;
    public readonly name: string = 'position';

    load = (inputs: PositionInputs): void => this._load(inputs);
}

export class UnsharedVertexNormals extends BaseUnsharedVertexAttribute implements ILoad, IGather {
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;
    public readonly name: string = 'normal';

    load = (inputs: NormalInputs): void => this._load(inputs);
    gatherFrom = (face_attribute: FaceNormals, vertex_faces: VertexFaces): void =>
        this._gatherFrom(face_attribute);
}

export class UnsharedVertexColors extends BaseUnsharedVertexAttribute implements ILoad, IGather, IGenerate {
    public readonly id: ATTRIBUTE = ATTRIBUTE.color;
    public readonly name: string = 'color';

    load = (inputs: ColorInputs): void => this._load(inputs);
    generate = (): void => this._generate();
    gatherFrom = (face_attribute: FaceColors, vertex_faces: VertexFaces): void =>
        this._gatherFrom(face_attribute);
}

export class UnsharedVertexUVs extends BaseUnsharedVertexAttribute implements ILoad {
    public readonly id: ATTRIBUTE = ATTRIBUTE.uv;
    public readonly name: string = 'uv';

    load = (inputs: UVInputs): void => this._load(inputs);
}

export class Faces {
    public readonly position: FacePositions | null;
    public readonly normal: FaceNormals | null;
    public readonly color: FaceColors | null;

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
    public readonly position: SharedVertexPositions | UnsharedVertexPositions;
    public readonly normal: SharedVertexNormals | UnsharedVertexNormals | null;
    public readonly color: SharedVertexColors | UnsharedVertexColors | null;
    public readonly uv: SharedVertexUVs | UnsharedVertexUVs | null;

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

type SharedVertexAttribute =
    SharedVertexPositions |
    SharedVertexNormals |
    SharedVertexColors |
    SharedVertexUVs;
type UnsharedVertexAttribute =
    UnsharedVertexPositions |
    UnsharedVertexNormals |
    UnsharedVertexColors |
    UnsharedVertexUVs;
type VertexAttribute = SharedVertexAttribute | UnsharedVertexAttribute;
type FaceAttribute = FacePositions | FaceNormals | FaceColors;