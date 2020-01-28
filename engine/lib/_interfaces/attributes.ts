import Matrix from "../accessors/matrix.js";
import {Vector} from "../accessors/accessor.js";
import {Triangle} from "../buffers/attributes/_base.js";
import {ATTRIBUTE, DIM, FACE_TYPE} from "../../constants.js";
import {InputAttribute} from "../geometry/inputs.js";
import {FaceInputNum, FaceInputs, FaceInputStr, VertexInputNum, VertexInputStr} from "../../types.js";
import {IFaceVertices} from "./buffers.js";
import {UV2D, UV3D} from "../accessors/uv.js";
import {Color3D, Color4D} from "../accessors/color.js";
import {Position2D, Position3D, Position4D} from "../accessors/position.js";
import {Direction2D, Direction3D, Direction4D} from "../accessors/direction.js";

export interface IInputAttribute<Attribute extends ATTRIBUTE> {
    dim: DIM;
    attribute: Attribute;
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

export interface IInputPositions extends IInputAttribute<ATTRIBUTE.position> {attribute: ATTRIBUTE.position}
export interface IInputNormals extends IInputAttribute<ATTRIBUTE.normal> {attribute: ATTRIBUTE.normal}
export interface IInputColors extends IInputAttribute<ATTRIBUTE.color> {attribute: ATTRIBUTE.color}
export interface IInputUVs extends IInputAttribute<ATTRIBUTE.uv> {attribute: ATTRIBUTE.uv}

export interface IMeshInputs {
    face_type: FACE_TYPE;
    readonly included: ATTRIBUTE;
    readonly position: IInputPositions;
    readonly normal: IInputNormals;
    readonly color: IInputColors;
    readonly uv: IInputUVs;

    sanitize(): this;
}
export interface ITriangle<VectorType extends Vector> {
    a: VectorType;
    b: VectorType;
    c: VectorType;
}

export interface IVertexAttribute<VectorType extends Vector, Attribute extends ATTRIBUTE>
{
    attribute: Attribute;
    current_triangle: Triangle<VectorType>;

    readonly vertex_count: number;
    readonly face_vertices: IFaceVertices;
    readonly face_count: number;

    readonly is_shared: boolean;
    readonly triangles: Generator<Triangle<VectorType>>;

    autoInit(arrays?: Float32Array[]): this;
    load<Inputs extends InputAttribute<Attribute> = InputAttribute<Attribute>>(inputs: Inputs): this;
}

export interface IMulVertexAttribute<VectorType extends Vector, Attribute extends ATTRIBUTE>
    extends IVertexAttribute<VectorType, Attribute>
{
    mul(matrix: Matrix, out: this, include?: Uint8Array[]): this;
    imul(matrix: Matrix, include?: Uint8Array[]): this;
}

export type VertexPositions = IMulVertexAttribute<Position2D | Position3D | Position4D, ATTRIBUTE.position>;
export type VertexPositionsConstructor<VertexPositionsClass extends VertexPositions> = new (
    vertex_count: number,
    face_vertices: IFaceVertices,
    is_shared?: number | boolean,
    face_count?: number
) => VertexPositionsClass;
export type VertexNormals = IMulVertexAttribute<Direction3D | Direction4D, ATTRIBUTE.normal>;
export type VertexNormalsConstructor<VertexNormalsClass extends VertexNormals> = new (
    vertex_count: number,
    face_vertices: IFaceVertices,
    is_shared?: number | boolean,
    face_count?: number
) => VertexNormalsClass;
export type VertexColors = IVertexAttribute<Color3D | Color4D, ATTRIBUTE.color>;
export type VertexColorsConstructor<VertexColorsClass extends VertexColors> = new (
    vertex_count: number,
    face_vertices: IFaceVertices,
    is_shared?: number | boolean,
    face_count?: number
) => VertexColorsClass;
export type VertexUVs = IVertexAttribute<UV2D | UV3D, ATTRIBUTE.uv>;
export type VertexUVsConstructor<VertexUVsClass extends VertexUVs> = new (
    vertex_count: number,
    face_vertices: IFaceVertices,
    is_shared?: number | boolean,
    face_count?: number
) => VertexUVsClass;

export interface IFaceAttribute<
    VectorType extends Vector,
    Attribute extends ATTRIBUTE,
    PullVectorType extends Vector = VectorType,
    PullAttribute extends ATTRIBUTE = Attribute> {
    attribute: Attribute;
    readonly face_vertices: IFaceVertices;
    readonly face_count: number;

    autoInit(arrays?: Float32Array[]): this;

    pull(inputs: IVertexAttribute<PullVectorType, PullAttribute>): this;
}

export interface IMulFaceAttribute<
    VectorType extends Vector,
    Attribute extends ATTRIBUTE,
    PullVectorType extends Vector = VectorType,
    PullAttribute extends ATTRIBUTE = Attribute>
    extends IFaceAttribute<VectorType, Attribute, PullVectorType, PullAttribute>
{
    mul(matrix: Matrix, out: this, include?: Uint8Array[]): this;
    imul(matrix: Matrix, include?: Uint8Array[]): this;
}

export type FacePositions = IMulFaceAttribute<Position2D | Position3D | Position4D, ATTRIBUTE.position>;
export type FacePositionsConstructor<FacePositionsClass extends FacePositions> = new (
    face_vertices: IFaceVertices,
    face_count?: number
) => FacePositionsClass;

export type FaceNormals = IMulFaceAttribute<Direction3D | Direction4D, ATTRIBUTE.normal, Position3D | Position4D, ATTRIBUTE.position>;
export type FaceNormalsConstructor<FaceNormalsClass extends FaceNormals> = new (
    face_vertices: IFaceVertices,
    face_count?: number
) => FaceNormalsClass;
export type FaceColors = IFaceAttribute<Color3D | Color4D, ATTRIBUTE.color>;
export type FaceColorsConstructor<FaceColorsClass extends FaceColors> = new (
    face_vertices: IFaceVertices,
    face_count?: number
) => FaceColorsClass;