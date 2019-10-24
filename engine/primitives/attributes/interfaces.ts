import {InputIndices, InputValues} from "../../types.js";
import {
    SharedVertexAttribute,
    SharedVertexColors,
    SharedVertexNormals,
    SharedVertexPositions,
    SharedVertexUVx
} from "./shared.js";
import {
    UnsharedVertexAttribute,
    UnsharedVertexColors,
    UnsharedVertexNormals,
    UnsharedVertexPositions,
    UnsharedVertexUVx
} from "./unshared.js";
import {FaceAttribute, FaceNormals} from "./face.js";

export interface IVertexInputAttribute {
    readonly values: InputValues;
    readonly indices: InputIndices
}

export type VertexDataAttribute = SharedVertexAttribute | UnsharedVertexAttribute;
export type VertexAttribute = VertexDataAttribute | IVertexInputAttribute;

export interface IVertex {
    position: VertexAttribute,
    normal: VertexAttribute | null,
    color: VertexAttribute | null,
    uv: VertexAttribute | null
}

export interface IVertexData extends IVertex {
    position: SharedVertexPositions | UnsharedVertexPositions,
    normal: SharedVertexNormals | UnsharedVertexNormals | null,
    color: SharedVertexColors | UnsharedVertexColors | null,
    uv: SharedVertexUVx | UnsharedVertexUVx | null
}

export interface IInputData extends IVertex {
    position: IVertexInputAttribute,
    normal: IVertexInputAttribute | null,
    color: IVertexInputAttribute | null,
    uv: IVertexInputAttribute | null
}

export interface IFaceData {
    normal: FaceNormals | null,
    position: FaceAttribute | null,
    color: FaceAttribute | null
}