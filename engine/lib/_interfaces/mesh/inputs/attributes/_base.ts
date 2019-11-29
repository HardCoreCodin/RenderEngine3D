import {DIM, FACE_TYPE} from "../../../../../constants.js";
import {FaceInputNum, FaceInputs, FaceInputStr, VertexInputNum, VertexInputStr} from "../../../../../types.js";

export interface IInputAttribute {
    dim: DIM;
    face_type: FACE_TYPE;
    vertices?: number[][];
    faces_vertices?: FaceInputs;

    triangulate(): void;
    getValue(value: number | string, is_index: boolean): number;
    checkInputSize(input_size: number, is_index: boolean): void;
    pushVertex(vertex: VertexInputNum | VertexInputStr): void;
    pushFace(face: FaceInputNum | FaceInputStr): void;
}