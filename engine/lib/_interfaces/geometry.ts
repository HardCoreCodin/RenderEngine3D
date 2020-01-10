import {INode3D, IScene} from "./nodes.js";
import {IMatrix4x4} from "./matrix.js";
import {IMaterial} from "./render.js";
import {IPosition3D, IPosition4D} from "./vectors.js";
import {IFaceVertices, IVertexFaces} from "./buffers.js";
import {IFaces3D, IMeshInputs, IVertexPositions3D, IVertexPositions4D, IVertices3D} from "./attributes.js";
import {ATTRIBUTE, COLOR_SOURCING, NORMAL_SOURCING} from "../../constants.js";


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
    vertex_positions: IVertexPositions3D | IVertexPositions4D;
    min: IPosition3D | IPosition4D;
    max: IPosition3D | IPosition4D;

    load(source_positions: IVertexPositions3D | IVertexPositions4D): void;
}

export interface IBounds3D extends IBounds {
    readonly vertex_positions: IVertexPositions3D;
    readonly min: IPosition3D;
    readonly max: IPosition3D;
}

export interface IBounds4D extends IBounds {
    readonly vertex_positions: IVertexPositions4D;
    readonly min: IPosition4D;
    readonly max: IPosition4D;
}

export interface IMesh {
    readonly face_count: number;
    readonly vertex_count: number;
    readonly vertex_faces: IVertexFaces;
    readonly face_vertices: IFaceVertices;
    readonly vertex_arrays: Float32Array[];

    bbox: IBounds3D;
    inputs: IMeshInputs;
    options: IMeshOptions;

    load(): this;
}

export interface IGeometry extends INode3D {
    readonly id: number;
    readonly scene: IScene;
    readonly world_to_model: IMatrix4x4;

    is_rigid: boolean;
    is_renderable: boolean;

    mesh: IMesh;
    material: IMaterial;

    postWorldMatrixRefresh(): void;
}


