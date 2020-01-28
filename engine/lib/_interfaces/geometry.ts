import {INode3D, IScene} from "./nodes.js";
import {IMatrix4x4} from "./matrix.js";
import {IMaterial, IMeshCallback} from "./render.js";
import {IPosition3D, IPosition4D} from "./vectors.js";
import {IFaceVertices, IVertexFaces} from "./buffers.js";
import {
    FaceColors,
    FaceNormals,
    FacePositions,
    IMeshInputs,
    VertexColors,
    VertexNormals,
    VertexPositions,
    VertexUVs
} from "./attributes.js";
import {ATTRIBUTE, COLOR_SOURCING, NORMAL_SOURCING} from "../../constants.js";
import {FacePositions3D, VertexPositions3D, VertexPositions4D} from "../buffers/attributes/positions.js";
import Faces from "../geometry/faces.js";
import Vertices from "../geometry/vertices.js";
import {FaceNormals3D, VertexNormals3D} from "../buffers/attributes/normals.js";
import {FaceColors3D, VertexColors3D} from "../buffers/attributes/colors.js";
import {VertexUVs2D} from "../buffers/attributes/uvs.js";


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

export interface IMesh<
    VertexPositionsClass extends VertexPositions = VertexPositions3D,
    VertexNormalsClass extends VertexNormals = VertexNormals3D,
    VertexColorsClass extends VertexColors = VertexColors3D,
    VertexUVsClass extends VertexUVs = VertexUVs2D,
    FacePositionsClass extends FacePositions = FacePositions3D,
    FaceNormalsClass extends FaceNormals= FaceNormals3D,
    FaceColorsClass extends FaceColors = FaceColors3D> {
    faces: Faces<FacePositionsClass, FaceNormalsClass, FaceColorsClass>;
    vertices: Vertices<VertexPositionsClass, VertexNormalsClass, VertexColorsClass, VertexUVsClass>;

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

export interface IGeometry<
    Context extends RenderingContext = RenderingContext
    > extends INode3D {
    readonly id: number;
    readonly scene: IScene;
    readonly world_to_model: IMatrix4x4;

    is_rigid: boolean;
    is_renderable: boolean;

    mesh: IMesh;
    material: IMaterial<Context>;

    postWorldMatrixRefresh(): void;
}

