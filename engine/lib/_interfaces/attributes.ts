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

export interface IAttribute<AccessorType extends IAccessor = IAccessor> extends IBuffer
{
    current: AccessorType;
    Vector: IAccessorConstructor<AccessorType>;
    [Symbol.iterator](): Generator<AccessorType>;
    setFrom(other: IAttribute<IVector>): this;
}

export interface ITransformableAttribute<
    MatrixType extends IMatrix = IMatrix,
    VectorType extends ITransformableVector<MatrixType> = ITransformableVector<MatrixType>>
    extends IAttribute<VectorType>
{
    _: ITransformableAttributeFunctionSet;

    matmul(matrix: MatrixType, out?: this): this;
}

export interface IPositionAttribute<
    MatrixType extends IMatrix = IMatrix,
    Position extends IPosition<MatrixType> = IPosition<MatrixType>>
    extends ITransformableAttribute<MatrixType, Position> {}

export interface INormalAttribute<
    MatrixType extends IMatrix = IMatrix,
    Direction extends IDirection<MatrixType> = IDirection<MatrixType>>
    extends ITransformableAttribute<MatrixType, Direction> {}

export interface IColorAttribute<Color extends IColor = IColor>
    extends IAttribute<Color> {}

export interface IVertexAttribute<VectorType extends IVector = IVector>
    extends IAttribute<VectorType>
{
    readonly is_shared: boolean;
    readonly triangles: Generator<ITriangle<VectorType>>;
    current_triangle: ITriangle<VectorType>;
    Triangle: AnyConstructor<ITriangle<VectorType>>;
}

export interface ILoadableVertexAttribute<
    VectorType extends IVector = IVector,
    InputAttributeType extends IInputAttribute = IInputAttribute>
    extends IVertexAttribute<VectorType>
{
    load(input: InputAttributeType): void;
}

export interface IPullableVertexAttribute<
    VectorType extends IVector = IVector,
    InputAttributeType extends IInputAttribute = IInputAttribute,
    FaceAttributeType extends IFaceAttribute = IFaceAttribute>
    extends IVertexAttribute<VectorType>
{
    pull(input: FaceAttributeType, vertex_faces: IVertexFaces): void;
}

export interface IVertexPositions<
    MatrixType extends IMatrix = IMatrix,
    Position extends IPosition<MatrixType> = IPosition<MatrixType>
    > extends
        IPositionAttribute<MatrixType, Position>,
        ILoadableVertexAttribute<Position> {}

export interface IVertexPositions3D<
    MatrixType extends IMatrix3x3 = IMatrix3x3,
    Position extends IPosition3D = IPosition3D>
    extends IVertexPositions<MatrixType, Position>
{
    _: IPositionAttribute3DFunctionSet;

    mat4mul(matrix: IMatrix4x4, out: IVertexPositions4D): IVertexPositions4D;
}

export interface IVertexPositions4D<
    MatrixType extends IMatrix4x4 = IMatrix4x4,
    Position extends IPosition4D = IPosition4D>
    extends IVertexPositions<MatrixType, Position>
{}

export interface IVertexNormals<
    MatrixType extends IMatrix = IMatrix,
    Direction extends IDirection<MatrixType> = IDirection<MatrixType>
    > extends
        INormalAttribute<MatrixType, Direction>,
        IPullableVertexAttribute<Direction, IInputNormals> {}

export interface IVertexNormals3D<
    MatrixType extends IMatrix3x3 = IMatrix3x3,
    Direction extends IDirection3D = IDirection3D>
    extends IVertexNormals<MatrixType, Direction>
{
    _: IDirectionAttribute3DFunctionSet;

    mat4mul(matrix: IMatrix4x4, out: IVertexNormals4D): IVertexNormals4D;
    normalize(): this;
}

export interface IVertexNormals4D<
    MatrixType extends IMatrix4x4 = IMatrix4x4,
    Direction extends IDirection4D = IDirection4D>
    extends IVertexNormals<MatrixType, Direction>
{
    _: IDirectionAttribute4DFunctionSet;

    normalize(): this;
}

export interface IVertexColors<
    Color extends IColor = IColor,
    FaceColors extends IFaceColors<Color> = IFaceColors<Color>>
    extends
        IColorAttribute<Color>,
        IPullableVertexAttribute<Color, IInputColors, FaceColors> {}

export interface IVertexUVs<UV extends IUV = IUV>
    extends ILoadableVertexAttribute<UV, IInputUVs>
{}

export interface IFaceAttribute<
    VectorType extends IVector = IVector,
    VertexAttributeType extends IVertexAttribute = IVertexAttribute>
    extends IAttribute<VectorType>
{
    pull(input: VertexAttributeType): void;
}

export interface IFacePositions<
    MatrixType extends IMatrix = IMatrix,
    Position extends IPosition<MatrixType> = IPosition<MatrixType>,
    VertexPositions extends IVertexPositions<MatrixType, Position> = IVertexPositions<MatrixType, Position>>
    extends
        IPositionAttribute<MatrixType, Position>,
        IFaceAttribute<Position, VertexPositions> {}


export interface IFaceNormals<
    MatrixType extends IMatrix = IMatrix,
    Direction extends IDirection<MatrixType> = IDirection<MatrixType>,
    VertexPositions extends IVertexPositions<MatrixType, IPosition<MatrixType>> = IVertexPositions<MatrixType, IPosition<MatrixType>>>
    extends INormalAttribute<MatrixType, Direction>, IFaceAttribute<Direction, VertexPositions>
{}

export interface IFaceColors<Color extends IColor = IColor>
    extends IColorAttribute<Color>, IFaceAttribute<Color>
{}

export type VertexAttributeConstructor<VertexAttribute extends IVertexAttribute> = new (
        _face_vertices: IFaceVertices,
        is_shared?: number | boolean,
        _face_count?: number
    ) => VertexAttribute;

export type IVertexPositionsConstructor<
    MatrixType extends IMatrix = IMatrix,
    Position extends IPosition<MatrixType> = IPosition<MatrixType>
    > = VertexAttributeConstructor<IVertexPositions<MatrixType, Position>>;

export type IVertexNormalsConstructor<
    MatrixType extends IMatrix = IMatrix,
    Direction extends IDirection<MatrixType> = IDirection<MatrixType>
    > = VertexAttributeConstructor<IVertexNormals<MatrixType, Direction>>;

export type IVertexColorsConstructor<Color extends IColor = IColor> = VertexAttributeConstructor<IVertexColors<Color>>;
export type IVertexUVsConstructor<UV extends IUV = IUV> = VertexAttributeConstructor<IVertexUVs<UV>>;
export type FaceAttributeConstructor<FaceAttribute extends IFaceAttribute> = new (_face_vertices: IFaceVertices) => FaceAttribute;

export type IFacePositionsConstructor<
    MatrixType extends IMatrix = IMatrix,
    Position extends IPosition<MatrixType> = IPosition<MatrixType>,
    VertexPositions extends IVertexPositions<MatrixType, Position> = IVertexPositions<MatrixType, Position>
    > = FaceAttributeConstructor<IFacePositions<MatrixType, Position, VertexPositions>>;

export type IFaceNormalsConstructor<
    MatrixType extends IMatrix = IMatrix,
    Direction extends IDirection<MatrixType> = IDirection<MatrixType>,
    VertexPositions extends IVertexPositions<MatrixType, IPosition<MatrixType>> = IVertexPositions<MatrixType, IPosition<MatrixType>>> = FaceAttributeConstructor<IFaceNormals<MatrixType, Direction, VertexPositions>>;

export type IFaceColorsConstructor<
    Color extends IColor = IColor,
    VertexColors extends IVertexColors<Color> = IVertexColors<Color>
    > = FaceAttributeConstructor<IFaceColors<Color>>;