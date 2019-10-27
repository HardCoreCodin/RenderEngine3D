import {ATTRIBUTE, DIM, VERTEX_NUM} from "../../constants.js";
import {UnsharedVertexValues, VertexFaces} from "../../types.js";
import {averageFacesToSharedVertices, distributeFacesToUnsharedVertices, randomize} from "./generate.js";
import {
    AttributeInputs,
    ColorInputs,
    NormalInputs,
    PositionInputs,
    UVInputs
} from "./input.js";
import {BaseAttribute, IGather, IGenerate, ILoad} from "./base.js";
import {FaceAttribute, FaceColors, FaceNormals} from "./face.js";
import {float} from "../../factories.js";

export class BaseSharedVertexAttribute extends BaseAttribute {
    protected _load(inputs: AttributeInputs) : void {
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

    protected _gatherFrom(face_attribute: FaceAttribute, vertex_faces: VertexFaces) : void {
        if (face_attribute.is_loaded)
            averageFacesToSharedVertices(
                face_attribute.values,
                this.values,
                vertex_faces
            );
        else
            throw `Vertex ${this.name}s can not be gathered, as source face attribute has'nt been loaded!`;

        this.is_loaded = true;
    }
}

export class SharedVertexPositions extends BaseSharedVertexAttribute implements ILoad {
    public readonly id: ATTRIBUTE = ATTRIBUTE.position;
    public readonly name: string = 'position';

    load = (inputs: PositionInputs) : void => super._load(inputs);
}

export class SharedVertexNormals extends BaseSharedVertexAttribute implements ILoad, IGather {
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;
    public readonly name: string = 'normal';

    load = (inputs: NormalInputs) : void => this._load(inputs);
    gatherFrom = (face_attribute: FaceNormals, vertex_faces: VertexFaces) : void =>
        this._gatherFrom(face_attribute, vertex_faces);
}

export class SharedVertexColors extends BaseSharedVertexAttribute implements ILoad, IGather, IGenerate {
    public readonly id: ATTRIBUTE = ATTRIBUTE.color;
    public readonly name: string = 'color';

    load = (inputs: ColorInputs) : void => this._load(inputs);
    generate = () : void => this._generate();
    gatherFrom = (face_attribute: FaceColors, vertex_faces: VertexFaces) : void =>
        this._gatherFrom(face_attribute, vertex_faces);
}

export class SharedVertexUVs extends BaseSharedVertexAttribute implements ILoad {
    public readonly id: ATTRIBUTE = ATTRIBUTE.uv;
    public readonly name: string = 'uv';

    load = (inputs: UVInputs) : void => this._load(inputs);
}

// Unshared:
///////////

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

    private _setFaceVertexValues(vertex_num: VERTEX_NUM, inputs: AttributeInputs) : void {
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

    protected _generate() : void {
        for (const values of this.values)
            randomize(values);

        this.is_loaded = true;
    }

    protected _gatherFrom(face_attribute: FaceAttribute) : void {
        if (face_attribute.is_loaded)
            distributeFacesToUnsharedVertices(
                face_attribute.values,
                this.values
            );
        else
            throw `Vertex ${this.name}s can not be gathered, as source face attribute has'nt been loaded!`;

        this.is_loaded = true;
    }
}

export class UnsharedVertexPositions extends BaseUnsharedVertexAttribute implements ILoad {
    public readonly id: ATTRIBUTE = ATTRIBUTE.position;
    public readonly name: string = 'position';

    load = (inputs: PositionInputs) : void => this._load(inputs);
}

export class UnsharedVertexNormals extends BaseUnsharedVertexAttribute implements ILoad, IGather {
    public readonly id: ATTRIBUTE = ATTRIBUTE.normal;
    public readonly name: string = 'normal';

    load = (inputs: NormalInputs) : void => this._load(inputs);
    gatherFrom = (face_attribute: FaceNormals, vertex_faces: VertexFaces) : void =>
        this._gatherFrom(face_attribute);
}

export class UnsharedVertexColors extends BaseUnsharedVertexAttribute implements ILoad, IGather, IGenerate {
    public readonly id: ATTRIBUTE = ATTRIBUTE.color;
    public readonly name: string = 'color';

    load = (inputs: ColorInputs) : void => this._load(inputs);
    generate = () : void => this._generate();
    gatherFrom = (face_attribute: FaceColors, vertex_faces: VertexFaces) : void =>
        this._gatherFrom(face_attribute);
}

export class UnsharedVertexUVs extends BaseUnsharedVertexAttribute implements ILoad {
    public readonly id: ATTRIBUTE = ATTRIBUTE.uv;
    public readonly name: string = 'uv';

    load = (inputs: UVInputs) : void => this._load(inputs);
}


export type SharedVertexAttribute = (
    SharedVertexPositions |
    SharedVertexNormals |
    SharedVertexColors |
    SharedVertexUVs
    );

export type UnsharedVertexAttribute = (
    UnsharedVertexPositions |
    UnsharedVertexNormals |
    UnsharedVertexColors |
    UnsharedVertexUVs
    );

export type VertexAttribute = SharedVertexAttribute | UnsharedVertexAttribute;