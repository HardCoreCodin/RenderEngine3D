import {ATTRIBUTE, DIM, FACE_TYPE} from "../../constants.js";
import {IBuffer, IFaceVertices, IVertexFaces} from "./buffers.js";
import {FaceInputNum, FaceInputs, FaceInputStr, VertexInputNum, VertexInputStr} from "../../types.js";
import {IColor, IDirection, IPosition, ITransformableVector, IUV, IVector, VectorConstructor} from "./vectors.js";
import {ITransformableAttributeFunctionSet} from "./functions.js";
import {Matrix3x3} from "../accessors/matrix.js";
import {IMatrix} from "./matrix.js";
import {Attribute} from "../geometry/attributes.js";


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

export interface IInputPositions extends IInputAttribute {id: ATTRIBUTE.position}
export interface IInputNormals extends IInputAttribute {id: ATTRIBUTE.normal}
export interface IInputColors extends IInputAttribute {id: ATTRIBUTE.color}
export interface IInputUVs extends IInputAttribute {id: ATTRIBUTE.uv}

export interface IAttribute<
    Attribute extends ATTRIBUTE,
    Dim extends DIM,
    VectorType extends IVector,
    > extends IBuffer<Dim>
{
    current: VectorType;
    attribute: Attribute;

    Vector: VectorConstructor<VectorType>;
    [Symbol.iterator](): Generator<VectorType>;
    setFrom(other: IAttribute<Attribute, DIM._2D|DIM._3D|DIM._4D, IVector>);
}

export interface ITransformableAttribute<
    Attribute extends ATTRIBUTE,
    Dim extends DIM,
    MatrixType extends IMatrix = IMatrix,
    VectorType extends ITransformableVector<MatrixType> = ITransformableVector<MatrixType>,
    OutAttribute extends IAttribute<Attribute, Dim, VectorType> = IAttribute<Attribute, Dim, VectorType>>
    extends IAttribute<Attribute, Dim, VectorType>
{
    _: ITransformableAttributeFunctionSet<Dim>;

    imatmul(matrix: MatrixType): void;
    matmul(matrix: MatrixType, out: OutAttribute): void;
}

export interface IPositionAttribute<
    Dim extends DIM,
    MatrixType extends IMatrix = IMatrix,
    Position extends IPosition<Dim, MatrixType> = IPosition<Dim, MatrixType>>
    extends ITransformableAttribute<
        ATTRIBUTE.position,
        Dim, MatrixType,
        Position,
        IAttribute<ATTRIBUTE.position, Dim, Position>> {}

export interface INormalAttribute<
    Dim extends DIM,
    MatrixType extends IMatrix = IMatrix,
    Direction extends IDirection<Dim, MatrixType> = IDirection<Dim, MatrixType>>
    extends ITransformableAttribute<
        ATTRIBUTE.normal,
        Dim,
        MatrixType,
        Direction,
        IAttribute<ATTRIBUTE.normal, Dim, Direction>> {}

export interface IColorAttribute<
    Dim extends DIM,
    Color extends IColor = IColor>
    extends IAttribute<ATTRIBUTE.color, Dim, Color> {}

export interface IVertexAttribute<
    Attribute extends ATTRIBUTE,
    Dim extends DIM,
    VectorType extends IVector = IVector>
    extends IAttribute<Attribute, Dim, VectorType>
{
    readonly is_shared: boolean;
    faces(): Generator<[VectorType, VectorType, VectorType]>;
}

export interface ILoadableVertexAttribute<
    Attribute extends ATTRIBUTE,
    Dim extends DIM,
    VectorType extends IVector = IVector,
    InputAttributeType extends IInputAttribute = IInputAttribute>
    extends IVertexAttribute<Attribute, Dim, VectorType>
{
    load(input: InputAttributeType): void;
}

export interface IPullableVertexAttribute<
    Attribute extends ATTRIBUTE,
    PulledAttribute extends ATTRIBUTE,
    Dim extends DIM,
    VectorType extends IVector = IVector,
    InputAttributeType extends IInputAttribute = IInputAttribute,
    FaceAttributeType extends IFaceAttribute<Attribute, PulledAttribute, Dim> = IFaceAttribute<Attribute, PulledAttribute, Dim>>
    extends IVertexAttribute<Attribute, Dim, VectorType>
{
    pull(input: FaceAttributeType, vertex_faces: IVertexFaces): void;
}

export interface IVertexPositions<
    Dim extends DIM,
    MatrixType extends IMatrix = IMatrix,
    Position extends IPosition<Dim, MatrixType> = IPosition<Dim, MatrixType>
    > extends
        IPositionAttribute<Dim, MatrixType, Position>,
        ILoadableVertexAttribute<ATTRIBUTE.position, Dim, Position> {}

export interface IVertexNormals<
    Dim extends DIM,
    MatrixType extends IMatrix = IMatrix,
    Direction extends IDirection<Dim, MatrixType> = IDirection<Dim, MatrixType>
    > extends
        INormalAttribute<Dim, MatrixType, Direction>,
        IPullableVertexAttribute<ATTRIBUTE.normal, ATTRIBUTE.position, Dim, Direction, IInputNormals> {}

export interface IVertexColors<
    Dim extends DIM,
    Color extends IColor = IColor,
    FaceColors extends IFaceColors<Dim, Color> = IFaceColors<Dim, Color>>
    extends
        IColorAttribute<Dim, Color>,
        IPullableVertexAttribute<ATTRIBUTE.color, ATTRIBUTE.color, Dim, Color, IInputColors, FaceColors> {}

export interface IVertexUVs<
    Dim extends DIM,
    UV extends IUV>
    extends ILoadableVertexAttribute<ATTRIBUTE.uv, Dim, UV, IInputUVs> {}

export interface IFaceAttribute<
    Attribute extends ATTRIBUTE,
    PullAttribute extends ATTRIBUTE,
    Dim extends DIM,
    VectorType extends IVector = IVector,
    VertexAttributeType extends IVertexAttribute<PullAttribute, Dim> = IVertexAttribute<PullAttribute, Dim>>
    extends IAttribute<Attribute, Dim, VectorType>
{
    pull(input: VertexAttributeType): void;
}

export interface IFacePositions<
    Dim extends DIM,
    MatrixType extends IMatrix = IMatrix,
    Position extends IPosition<Dim, MatrixType> = IPosition<Dim, MatrixType>,
    VertexPositions extends IVertexPositions<Dim, MatrixType, Position> = IVertexPositions<Dim, MatrixType, Position>>
    extends
        IPositionAttribute<Dim, MatrixType, Position>,
        IFaceAttribute<ATTRIBUTE.position, ATTRIBUTE.position, Dim, Position, VertexPositions> {}


export interface IFaceNormals<
    Dim extends DIM,
    MatrixType extends IMatrix = IMatrix,
    Direction extends IDirection<Dim, MatrixType> = IDirection<Dim, MatrixType>,
    VertexPositions extends IVertexPositions<Dim, MatrixType, IPosition<Dim, MatrixType>> = IVertexPositions<Dim, MatrixType, IPosition<Dim, MatrixType>>>
    extends
        INormalAttribute<Dim, MatrixType, Direction>,
        IFaceAttribute<ATTRIBUTE.normal, ATTRIBUTE.position, Dim, Direction, VertexPositions> {}

export interface IFaceColors<
    Dim extends DIM,
    Color extends IColor = IColor>
    extends
        IColorAttribute<Dim, Color>,
        IFaceAttribute<ATTRIBUTE.color, ATTRIBUTE.color, Dim, Color> {}

export type VertexAttributeConstructor<
    Attribute extends ATTRIBUTE,
    Dim extends DIM,
    VertexAttribute extends IVertexAttribute<Attribute, Dim>> = new (
        _face_vertices: IFaceVertices,
        is_shared?: number | boolean,
        _face_count?: number
    ) => VertexAttribute;

export type IVertexPositionsConstructor<
    Dim extends DIM,
    MatrixType extends IMatrix = IMatrix,
    Position extends IPosition<Dim, MatrixType> = IPosition<Dim, MatrixType>
    > = VertexAttributeConstructor<ATTRIBUTE.position, Dim, IVertexPositions<Dim, MatrixType, Position>>;

export type IVertexNormalsConstructor<
    Dim extends DIM,
    MatrixType extends IMatrix = IMatrix,
    Direction extends IDirection<Dim, MatrixType> = IDirection<Dim, MatrixType>
    > = VertexAttributeConstructor<ATTRIBUTE.normal, Dim, IVertexNormals<Dim, MatrixType, Direction>>;

export type IVertexColorsConstructor<
    Dim extends DIM,
    Color extends IColor = IColor
    > = VertexAttributeConstructor<ATTRIBUTE.color, Dim, IVertexColors<Dim, Color>>;

export type IVertexUVsConstructor<
    Dim extends DIM,
    UV extends IUV = IUV
    > = VertexAttributeConstructor<ATTRIBUTE.uv, Dim, IVertexUVs<Dim, UV>>;

export type FaceAttributeConstructor<
    Attribute extends ATTRIBUTE,
    PulledAttribute extends ATTRIBUTE,
    Dim extends DIM,
    FaceAttribute extends IFaceAttribute<Attribute, PulledAttribute, Dim>
    > = new (_face_vertices: IFaceVertices) => FaceAttribute;

export type IFacePositionsConstructor<
    Dim extends DIM,
    MatrixType extends IMatrix = IMatrix,
    Position extends IPosition<Dim, MatrixType> = IPosition<Dim, MatrixType>,
    VertexPositions extends IVertexPositions<Dim, MatrixType, Position> = IVertexPositions<Dim, MatrixType, Position>
    > = FaceAttributeConstructor<ATTRIBUTE.position, ATTRIBUTE.position, Dim, IFacePositions<Dim, MatrixType, Position, VertexPositions>>;

export type IFaceNormalsConstructor<
    Dim extends DIM,
    MatrixType extends IMatrix = IMatrix,
    Direction extends IDirection<Dim, MatrixType> = IDirection<Dim, MatrixType>,
    VertexPositions extends IVertexPositions<Dim, MatrixType, IPosition<Dim, MatrixType>> = IVertexPositions<Dim, MatrixType, IPosition<Dim, MatrixType>>
    > = FaceAttributeConstructor<ATTRIBUTE.normal, ATTRIBUTE.position, Dim, IFaceNormals<Dim, MatrixType, Direction, VertexPositions>>;

export type IFaceColorsConstructor<
    Dim extends DIM,
    Color extends IColor = IColor,
    VertexColors extends IVertexColors<Dim, Color> = IVertexColors<Dim, Color>
    > = FaceAttributeConstructor<ATTRIBUTE.color, ATTRIBUTE.color, Dim, IFaceColors<Dim, Color>>;