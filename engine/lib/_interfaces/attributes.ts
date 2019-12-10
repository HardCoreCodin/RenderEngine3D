import {ATTRIBUTE, DIM, FACE_TYPE} from "../../constants.js";
import {IBuffer, IFaceVertices, IVertexFaces} from "./buffers.js";
import {AnyConstructor, FaceInputNum, FaceInputs, FaceInputStr, VertexInputNum, VertexInputStr} from "../../types.js";
import {
    IColor,
    IDirection, IDirection3D, IDirection4D,
    IPosition,
    IPosition3D, IPosition4D,
    ITransformableVector,
    IUV,
    IVector,
} from "./vectors.js";
import {
    IDirectionAttribute3DFunctionSet,
    IDirectionAttribute4DFunctionSet,
    IPositionAttribute3DFunctionSet,
    ITransformableAttributeFunctionSet
} from "./functions.js";
import {IMatrix, IMatrix3x3, IMatrix4x4} from "./matrix.js";
import {IAccessor, IAccessorConstructor} from "./accessors.js";

export interface ITriangle<VectorType extends IVector> {
    vertices: [VectorType, VectorType, VectorType]
}

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
    AccessorType extends IAccessor,
    > extends IBuffer<Dim>
{
    current: AccessorType;
    attribute: Attribute;

    Vector: IAccessorConstructor<AccessorType>;
    [Symbol.iterator](): Generator<AccessorType>;
    setFrom(other: IAttribute<Attribute, DIM._2D|DIM._3D|DIM._4D, IVector>): this;
}

export interface ITransformableAttribute<
    Attribute extends ATTRIBUTE,
    Dim extends DIM,
    MatrixType extends IMatrix = IMatrix,
    VectorType extends ITransformableVector<MatrixType> = ITransformableVector<MatrixType>>
    extends IAttribute<Attribute, Dim, VectorType>
{
    _: ITransformableAttributeFunctionSet<Dim>;

    matmul(matrix: MatrixType, out?: this): this;
}

export interface IPositionAttribute<
    Dim extends DIM,
    MatrixType extends IMatrix = IMatrix,
    Position extends IPosition<Dim, MatrixType> = IPosition<Dim, MatrixType>>
    extends ITransformableAttribute<ATTRIBUTE.position, Dim, MatrixType, Position> {}

export interface INormalAttribute<
    Dim extends DIM,
    MatrixType extends IMatrix = IMatrix,
    Direction extends IDirection<Dim, MatrixType> = IDirection<Dim, MatrixType>>
    extends ITransformableAttribute<ATTRIBUTE.normal, Dim, MatrixType, Direction> {}

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
    readonly triangles: Generator<ITriangle<VectorType>>;
    current_triangle: ITriangle<VectorType>;
    Triangle: AnyConstructor<ITriangle<VectorType>>;
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

export interface IVertexPositions3D<
    MatrixType extends IMatrix3x3 = IMatrix3x3,
    Position extends IPosition3D = IPosition3D>
    extends IVertexPositions<DIM._3D, MatrixType, Position>
{
    _: IPositionAttribute3DFunctionSet;

    mat4mul(matrix: IMatrix4x4, out: IVertexPositions4D): IVertexPositions4D;
}

export interface IVertexPositions4D<
    MatrixType extends IMatrix4x4 = IMatrix4x4,
    Position extends IPosition4D = IPosition4D>
    extends IVertexPositions<DIM._4D, MatrixType, Position>
{}

export interface IVertexNormals<
    Dim extends DIM,
    MatrixType extends IMatrix = IMatrix,
    Direction extends IDirection<Dim, MatrixType> = IDirection<Dim, MatrixType>
    > extends
        INormalAttribute<Dim, MatrixType, Direction>,
        IPullableVertexAttribute<ATTRIBUTE.normal, ATTRIBUTE.position, Dim, Direction, IInputNormals> {}

export interface IVertexNormals3D<
    MatrixType extends IMatrix3x3 = IMatrix3x3,
    Direction extends IDirection3D = IDirection3D>
    extends IVertexNormals<DIM._3D, MatrixType, Direction>
{
    _: IDirectionAttribute3DFunctionSet;

    mat4mul(matrix: IMatrix4x4, out: IVertexNormals4D): IVertexNormals4D;
    normalize(): this;
}

export interface IVertexNormals4D<
    MatrixType extends IMatrix4x4 = IMatrix4x4,
    Direction extends IDirection4D = IDirection4D>
    extends IVertexNormals<DIM._4D, MatrixType, Direction>
{
    _: IDirectionAttribute4DFunctionSet;

    normalize(): this;
}

export interface IVertexColors<
    Dim extends DIM,
    Color extends IColor = IColor,
    FaceColors extends IFaceColors<Dim, Color> = IFaceColors<Dim, Color>>
    extends
        IColorAttribute<Dim, Color>,
        IPullableVertexAttribute<ATTRIBUTE.color, ATTRIBUTE.color, Dim, Color, IInputColors, FaceColors> {}

export interface IVertexUVs<
    Dim extends DIM,
    UV extends IUV = IUV>
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