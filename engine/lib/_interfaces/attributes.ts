import {ATTRIBUTE, DIM, FACE_TYPE} from "../../constants.js";
import {FaceInputNum, FaceInputs, FaceInputStr, VertexInputNum, VertexInputStr} from "../../types.js";

export interface IInputAttribute {
    dim: DIM;
    face_type: FACE_TYPE;
    vertices?: number[][];
    faces_vertices?: FaceInputs;

    readonly face_count: number;
    readonly vertex_count: number;

    triangulate(): void;
    getValue(value: number | string, is_index: boolean): number;
    checkInputSize(input_size: number, is_index: boolean): void;
    pushVertex(vertex: VertexInputNum | VertexInputStr): void;
    pushFace(face: FaceInputNum | FaceInputStr): void;
}

export interface IInputPositions extends IInputAttribute {id: ATTRIBUTE.position}
export interface IInputNormals extends IInputAttribute {id: ATTRIBUTE.normal}
export interface IInputColors extends IInputAttribute {id: ATTRIBUTE.color}
export interface IInputUVs extends IInputAttribute {id: ATTRIBUTE.uv}

export interface IMeshInputs {
    face_type: FACE_TYPE;
    readonly included: ATTRIBUTE;
    readonly position: IInputPositions;
    readonly normal: IInputNormals;
    readonly color: IInputColors;
    readonly uv: IInputUVs;

    sanitize(): this;
}
