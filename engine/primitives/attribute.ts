import {ATTRIBUTE, DIM, FACE_TYPE} from "../constants.js";
import {
    FaceInputNum,
    FaceInputs,
    FaceInputStr,
    FaceValues,
    FaceVertices,
    UnsharedVertexValues,
    Values,
    VertexFaces,
    VertexInputNum,
    VertexInputs,
    VertexInputStr
} from "../types.js";
import {float, float3, num2, num3, num4} from "../factories.js";
import {cross, subtract} from "../math/vec3.js";
import {zip} from "../utils.js";

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

export class DataAttribute extends Attribute {
    public readonly values: Values | FaceValues;
    public is_loaded: boolean = false;

    constructor(length: number) {
        super();
        if (length)
            this.values = float(length, this.dim)
    }

    protected _load(vertices: VertexInputs, faces: FaceInputs) : void {
        for (const [out_component, in_component] of zip(this.values, vertices))
            out_component.set(in_component);
    }

    protected _generate() : void {
        randomize(this.values);
    }

    protected _gatherFrom(face_values: FaceValues, vertex_faces: VertexFaces) : void {
        throw `Not implemented!`;
    }
}

export class SharedVertexAttribute extends DataAttribute {
    protected _load(vertices: VertexInputs, faces: FaceInputs): void {

        // TODO: Implement...
        // if (input_vertex[0].length === this.vertex_count) {
        //     let face_id, input_id, vertex_num, component_num, data_id : number = 0;
        //     let input_values, input_ids: number[];
        //     for ([vertex_num, input_ids] of input_index.entries())
        //         data_index[vertex_num].set(input_ids);
        // }
    }

    protected _gatherFrom(face_values: FaceValues, vertex_faces: VertexFaces): void {
        // Average vertex-attribute values from their related face's attribute values:
        let accumulator: number;
        for (const [vertex_id, face_ids] of vertex_faces.entries()) {
            // For each component 'accumulate-in' the face-value of all the faces of this vertex:
            for (const [component, values] of face_values.entries()) {
                accumulator = 0;

                for (let face_id of face_ids)
                    accumulator += values[face_id];

                this.values[component][vertex_id] += accumulator / face_ids.length;
            }
        }
    }
}

export class UnsharedVertexAttribute extends DataAttribute {
    public readonly unshared_values: UnsharedVertexValues;
    public is_loaded: boolean = false;

    constructor(length: number) {
        super(0);
        this.unshared_values = [
            float(length, this.dim),
            float(length, this.dim),
            float(length, this.dim)
        ];
    }

    protected _load(vertices: VertexInputs, faces: FaceInputs) : void {
        let face_index, vertex_index: number;
        for (const [out_components, indices] of zip(this.unshared_values, faces))
            for (const [out_component, in_component] of zip(out_components, vertices))
                for ([face_index, vertex_index] of indices.entries())
                    out_component[face_index] = in_component[vertex_index];
    }

    protected _generate(): void {
        for (const values of this.unshared_values)
            randomize(values);
    }

    protected _gatherFrom(face_values: FaceValues, vertex_faces: VertexFaces) : void {
        // Copy over face-attribute values to their respective vertex-attribute values:
        for (const vertex_components of this.unshared_values)
            for (const [vertex_component, face_component] of zip(vertex_components, face_values))
                vertex_component.set(face_component);
    }
}

type Constructor<T = {}> = new (...args: any[]) => T;
function createIDedMixin(id: ATTRIBUTE, dim: DIM = DIM._3D) {
    function IDedMixin<TBase extends Constructor>(Base: TBase) {
        return class extends Base {
            public readonly id: ATTRIBUTE = id;
            public readonly dim: DIM = dim;
        }
    }

    return IDedMixin;
}
const Position = createIDedMixin(ATTRIBUTE.position);
const Normal = createIDedMixin(ATTRIBUTE.normal);
const Color = createIDedMixin(ATTRIBUTE.color);
const UV = createIDedMixin(ATTRIBUTE.uv, DIM._2D);

type DataAttributeConstructor = new (...args: any[]) => DataAttribute;
function createLoadedMixin<InputAttributeType extends InputAttribute>() {
    function LoadedMixin<TBase extends DataAttributeConstructor>(Base: TBase) {
        return class extends Base {
            load(inputs: InputAttributeType) : void {
                if (inputs === null)
                    throw `${this.name}s could not be loaded, as there are no inputs!`;

                super._load(inputs.vertices, inputs.faces);

                this.is_loaded = true;
            }
        }
    }

    return LoadedMixin;
}
const LoadedPositions = createLoadedMixin<InputPositions>();
const LoadedNormals = createLoadedMixin<InputNormals>();
const LoadedColors = createLoadedMixin<InputColors>();
const LoadedUVs = createLoadedMixin<InputUVs>();

function createGatheredMixin<FaceAttributeType extends FaceAttribute>() {
    function GatheredMixin<TBase extends DataAttributeConstructor>(Base: TBase) {
        return class extends Base {
            gatherFrom(face_attribute: FaceAttributeType, vertex_faces: VertexFaces) : void {
                if (!face_attribute.is_loaded)
                    throw `Vertex ${this.name}s can not be gathered! `+
                    'Source face attribute has not been loaded';

                this._gatherFrom(face_attribute.values, vertex_faces);

                this.is_loaded = true;
            }
        }
    }

    return GatheredMixin;
}
const GatheredNormals = createGatheredMixin<FaceNormals>();
const GatheredColors = createGatheredMixin<FaceColors>();

function createGenerated<FaceAttributeType extends FaceAttribute>() {
    function GatheredMixin<TBase extends DataAttributeConstructor>(Base: TBase) {
        return class extends Base {
            generate = () : void => {
                this._generate();

                this.is_loaded = true;
            }
        }
    }

    return GatheredMixin;
}
const GeneratedColors = createGenerated<FaceColors>();

export class InputPositions extends Position(InputAttribute) {}
export class SharedVertexPositions extends LoadedPositions(Position(SharedVertexAttribute)) {}
export class UnsharedVertexPositions extends LoadedPositions(Position(UnsharedVertexAttribute)) {}

export class InputNormals extends Normal(InputAttribute) {}
export class SharedVertexNormals extends GatheredNormals(LoadedNormals(Normal(SharedVertexAttribute))) {}
export class UnsharedVertexNormals extends GatheredNormals(LoadedNormals(Normal(UnsharedVertexAttribute))) {}

export class InputColors extends Color(InputAttribute) {}
export class SharedVertexColors extends GeneratedColors(GatheredColors(LoadedColors(Color(SharedVertexAttribute)))) {}
export class UnsharedVertexColors extends GeneratedColors(GatheredColors(LoadedColors(Color(UnsharedVertexAttribute)))) {}

export class InputUVs extends UV(InputAttribute) {}
export class SharedVertexUVs extends LoadedUVs(UV(SharedVertexAttribute)) {}
export class UnsharedVertexUVs extends LoadedUVs(UV(UnsharedVertexAttribute)) {}

export type VertexPositions = SharedVertexPositions | UnsharedVertexPositions;
export type VertexNormals = SharedVertexNormals | UnsharedVertexNormals;
export type VertexColors = SharedVertexColors | UnsharedVertexColors;
export type VertexUVs = SharedVertexUVs | UnsharedVertexUVs;

export class FaceAttribute extends DataAttribute implements IGather {
    public readonly values: FaceValues;

    gatherFrom(vertex_attribute: VertexPositions | VertexColors, face_vertices: FaceVertices): void {
        if (vertex_attribute.is_loaded) {
            const face_count = this.values[0].length;

            if (vertex_attribute instanceof SharedVertexAttribute) {
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

export class FacePositions extends Position(FaceAttribute) {
    gatherFrom(vertex_attribute: VertexPositions | VertexColors, face_vertices: FaceVertices) {
        super.gatherFrom(vertex_attribute, face_vertices);
    }
}

export class FaceNormals extends FaceAttribute {
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;

    gatherFrom(attribute: SharedVertexPositions | UnsharedVertexPositions, face_vertices: FaceVertices) {
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
                    attribute.unshared_values[1], face_id,
                    attribute.unshared_values[0], face_id,
                    temp, 0
                );
                subtract(
                    attribute.unshared_values[2], face_id,
                    attribute.unshared_values[0], face_id,
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

export class FaceColors extends FaceAttribute implements IGenerate {
    public readonly id: ATTRIBUTE = ATTRIBUTE.color;

    gatherFrom(attribute: SharedVertexColors | UnsharedVertexColors, face_vertices?: FaceVertices) {
        super.gatherFrom(attribute, face_vertices);
    }

    generate = (): void => this._generate();
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

interface ILoad {load(...args: any[]): void}
interface IGather {gatherFrom(...args: any[]): void}
interface IGenerate {generate(...args: any[]): void}