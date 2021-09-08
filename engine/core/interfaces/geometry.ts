import Faces from "../../geometry/faces.js";
import Vertices from "../../geometry/vertices.js";
import {IMeshCallback} from "./render.js";
import {IPosition3D, IPosition4D} from "./vectors.js";
import {IFaceVertices, IVertexFaces} from "./buffers.js";
import {IMeshInputs} from "./attributes.js";
import {ATTRIBUTE, COLOR_SOURCING, NORMAL_SOURCING} from "../constants.js";
import {VertexPositions3D, VertexPositions4D} from "../../buffers/attributes/positions.js";


export interface IMeshOptions {
    readonly face_attributes: number;
    readonly vertex_attributes: number;

    share: ATTRIBUTE;
    normal: NORMAL_SOURCING;
    color: COLOR_SOURCING;
    include_uvs: boolean;
    generate_face_positions: boolean;

    sanitize(inputs: IMeshInputs): void;
}

export interface IBounds {
    vertex_positions: VertexPositions3D|VertexPositions4D;
    min: IPosition3D | IPosition4D;
    max: IPosition3D | IPosition4D;

    load(source_positions: VertexPositions3D|VertexPositions4D): void;
}

export interface IBounds3D extends IBounds {
    readonly vertex_positions: VertexPositions3D;
    readonly min: IPosition3D;
    readonly max: IPosition3D;
}

export interface IBounds4D extends IBounds {
    readonly vertex_positions: VertexPositions4D;
    readonly min: IPosition4D;
    readonly max: IPosition4D;
}

export interface IMesh
{
    faces: Faces;
    vertices: Vertices;

    readonly face_count: number;
    readonly vertex_count: number;
    readonly vertex_faces: IVertexFaces;
    readonly face_vertices: IFaceVertices;
    readonly on_mesh_loaded: Set<IMeshCallback>;

    bbox: IBounds3D;
    inputs: IMeshInputs;
    options: IMeshOptions;

    load(): this;
}
