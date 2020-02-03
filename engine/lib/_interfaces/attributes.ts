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
import {Direction3D, Direction4D} from "../accessors/direction.js";

export interface IInputAttribute<Attribute extends ATTRIBUTE> {
    vertices: number[][];
    faces_vertices: FaceInputs;

    readonly dim: DIM;
    readonly attribute: Attribute;
    readonly face_type: FACE_TYPE;
    readonly face_count: number;
    readonly vertex_count: number;

    triangulate(): void;
    pushVertex(vertex: VertexInputNum | VertexInputStr): void;
    pushFace(face: FaceInputNum | FaceInputStr): void;
}

export interface IInputPositions extends IInputAttribute<ATTRIBUTE.position> {attribute: ATTRIBUTE.position}
export interface IInputNormals extends IInputAttribute<ATTRIBUTE.normal> {attribute: ATTRIBUTE.normal}
export interface IInputColors extends IInputAttribute<ATTRIBUTE.color> {attribute: ATTRIBUTE.color}
export interface IInputUVs extends IInputAttribute<ATTRIBUTE.uv> {attribute: ATTRIBUTE.uv}

export interface IMeshInputs {
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

    autoInit(vertex_count: number, face_vertices: IFaceVertices, is_shared?: boolean | number): this;
    load<Inputs extends InputAttribute<Attribute> = InputAttribute<Attribute>>(inputs: Inputs): this;
}

export interface IMulVertexAttribute<VectorType extends Vector, Attribute extends ATTRIBUTE>
    extends IVertexAttribute<VectorType, Attribute>
{
    mul(matrix: Matrix, out: this, include?: Uint8Array[]): this;
    imul(matrix: Matrix, include?: Uint8Array[]): this;
}

export type VertexPositions<Position extends Position2D | Position3D | Position4D> = IMulVertexAttribute<Position, ATTRIBUTE.position>;
export type VertexPositionsConstructor<
    Position extends Position2D | Position3D | Position4D,
    VertexPositionsClass extends VertexPositions<Position>
    > = new (
    vertex_count: number,
    face_vertices: IFaceVertices,
    is_shared?: number | boolean,
    face_count?: number
) => VertexPositionsClass;
export type VertexNormals<Direction extends Direction3D | Direction4D> = IMulVertexAttribute<Direction, ATTRIBUTE.normal>;
export type VertexNormalsConstructor<
    Direction extends Direction3D | Direction4D,
    VertexNormalsClass extends VertexNormals<Direction>
    > = new (
    vertex_count: number,
    face_vertices: IFaceVertices,
    is_shared?: number | boolean,
    face_count?: number
) => VertexNormalsClass;
export type VertexColors<Color extends Color3D | Color4D> = IVertexAttribute<Color, ATTRIBUTE.color>;
export type VertexColorsConstructor<
    Color extends Color3D | Color4D,
    VertexColorsClass extends VertexColors<Color>
    > = new (
    vertex_count: number,
    face_vertices: IFaceVertices,
    is_shared?: number | boolean,
    face_count?: number
) => VertexColorsClass;
export type VertexUVs<UV extends UV2D | UV3D> = IVertexAttribute<UV, ATTRIBUTE.uv>;
export type VertexUVsConstructor<
    UV extends UV2D | UV3D,
    VertexUVsClass extends VertexUVs<UV>
    > = new (
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

    autoInit(face_vertices: IFaceVertices): this;

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

export type FacePositions<Position extends Position2D | Position3D | Position4D> = IMulFaceAttribute<Position, ATTRIBUTE.position>;
export type FacePositionsConstructor<
    Position extends Position2D | Position3D | Position4D,
    FacePositionsClass extends FacePositions<Position>
    > = new (
    face_vertices: IFaceVertices,
    face_count?: number
) => FacePositionsClass;

export type FaceNormals<
    Direction extends Direction3D | Direction4D,
    Position extends Position3D | Position4D
    > = IMulFaceAttribute<Direction, ATTRIBUTE.normal, Position, ATTRIBUTE.position>;
export type FaceNormalsConstructor<
    Direction extends Direction3D | Direction4D,
    Position extends Position3D | Position4D,
    FaceNormalsClass extends FaceNormals<Direction, Position>
    > = new (
    face_vertices: IFaceVertices,
    face_count?: number
) => FaceNormalsClass;
export type FaceColors<Color extends Color3D | Color4D> = IFaceAttribute<Color, ATTRIBUTE.color>;
export type FaceColorsConstructor<Color extends Color3D | Color4D, FaceColorsClass extends FaceColors<Color>> = new (
    face_vertices: IFaceVertices,
    face_count?: number
) => FaceColorsClass;