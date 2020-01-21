import {ATTRIBUTE, DIM, FACE_TYPE} from "../../constants.js";
import {IMatrix, IMatrix3x3, IMatrix4x4} from "./matrix.js";
import {IAccessor, IAccessorConstructor} from "./accessors.js";
import {IBuffer, IFaceVertices, IVertexFaces} from "./buffers.js";
import {AnyConstructor, FaceInputNum, FaceInputs, FaceInputStr, VertexInputNum, VertexInputStr} from "../../types.js";
import {
    IColor,
    IColor3D,
    IColor4D,
    IDirection3D,
    IDirection4D,
    IPosition3D,
    IPosition4D,
    ITransformableVector,
    IUV,
    IUV2D,
    IUV3D,
    IVector,
} from "./vectors.js";
import {Matrix3x3} from "../accessors/matrix3x3.js";
import {Position3D} from "../accessors/position.js";
import {Matrix4x4} from "../accessors/matrix4x4.js";
import {VertexPositions3D, VertexPositions4D} from "../geometry/positions.js";
import {VertexNormals4D} from "../geometry/normals.js";

export interface ITriangle<VectorType extends IVector> {
    vertices: [VectorType, VectorType, VectorType]
}

export interface IInputAttribute {
    dim: DIM;
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

export interface IInputPositions extends IInputAttribute {id: ATTRIBUTE.position}
export interface IInputNormals extends IInputAttribute {id: ATTRIBUTE.normal}
export interface IInputColors extends IInputAttribute {id: ATTRIBUTE.color}
export interface IInputUVs extends IInputAttribute {id: ATTRIBUTE.uv}

export interface IAttribute<AccessorType extends IAccessor = IAccessor> extends IBuffer
{
    readonly face_vertices: IFaceVertices,
    readonly face_count: number,
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
    matmul(matrix: MatrixType, out?: this): this;
}

export interface IPositionAttribute<MatrixType extends IMatrix = IMatrix>
    extends ITransformableAttribute<MatrixType> {}

export interface INormalAttribute<MatrixType extends IMatrix = IMatrix>
    extends ITransformableAttribute<MatrixType> {}

export interface IColorAttribute<Color extends IColor = IColor>
    extends IAttribute<Color> {}

export interface IVertexAttribute<VectorType extends IVector = IVector>
    extends IAttribute<VectorType>
{
    readonly vertex_count: number,
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
    load(input: InputAttributeType): this;
}

export interface IPullableVertexAttribute<
    VectorType extends IVector = IVector,
    InputAttributeType extends IInputAttribute = IInputAttribute,
    FaceAttributeType extends IFaceAttribute = IFaceAttribute>
    extends IVertexAttribute<VectorType>
{
    pull(input: FaceAttributeType, vertex_faces: IVertexFaces): void;
}

export interface IVertexPositions3D
    extends ILoadableVertexAttribute
{
    matmul(matrix: Matrix3x3, out: VertexPositions3D): VertexPositions3D;
    mat4mul(matrix: Matrix4x4, out: VertexPositions4D): VertexPositions4D;
}

export interface IVertexPositions4D
    extends ILoadableVertexAttribute
{
    matmul(matrix: Matrix4x4, out: VertexPositions4D): VertexPositions4D;
}

export interface IVertexNormals<MatrixType extends IMatrix = IMatrix> extends
        INormalAttribute<MatrixType, Direction>,
        IPullableVertexAttribute<Direction, IInputNormals> {}

export interface IVertexNormals3D<
    MatrixType extends IMatrix3x3 = IMatrix3x3,
    Direction extends IDirection3D = IDirection3D>
    extends IVertexNormals<MatrixType, Direction>
{
    mat4mul(matrix: Matrix4x4, out: VertexNormals4D): VertexNormals4D;
    normalize(): this;
}

export interface IVertexNormals4D<
    MatrixType extends IMatrix4x4 = IMatrix4x4,
    Direction extends IDirection4D = IDirection4D>
    extends IVertexNormals<MatrixType, Direction>
{
    normalize(): this;
}

export interface IVertexColors<
    Color extends IColor = IColor,
    FaceColors extends IFaceColors<Color> = IFaceColors<Color>>
    extends
        IColorAttribute<Color>,
        IPullableVertexAttribute<Color, IInputColors, FaceColors> {}

export interface IVertexColors3D extends IVertexColors<IColor3D> {}
export interface IVertexColors4D extends IVertexColors<IColor4D> {}

export interface IVertexUVs<UV extends IUV = IUV>
    extends ILoadableVertexAttribute<UV, IInputUVs> {}

export interface IVertexUVs2D extends IVertexUVs<IUV2D> {}
export interface IVertexUVs3D extends IVertexUVs<IUV3D> {}

export interface IFaceAttribute<
    VectorType extends IVector = IVector,
    VertexAttributeType extends IVertexAttribute = IVertexAttribute>
    extends IAttribute<VectorType>
{
    pull(input: VertexAttributeType): void;
}

export interface IFacePositions<
    MatrixType extends IMatrix = IMatrix,
    VertexPositions extends IVertexPositions<MatrixType, Position> = IVertexPositions<MatrixType, Position>>
    extends
        IPositionAttribute<MatrixType, Position>,
        IFaceAttribute<Position, VertexPositions> {}

export interface IFacePositions3D extends IFacePositions<IMatrix3x3, IPosition3D, IVertexPositions3D> {}
export interface IFacePositions4D extends IFacePositions<IMatrix4x4, IPosition4D, IVertexPositions4D> {}

export interface IFaceNormals<
    MatrixType extends IMatrix = IMatrix,
    VertexPositions extends IVertexPositions<MatrixType, IPosition<MatrixType>> = IVertexPositions<MatrixType, IPosition<MatrixType>>>
    extends INormalAttribute<MatrixType, Direction>, IFaceAttribute<Direction, VertexPositions> {}

export interface IFaceNormals3D extends IFaceNormals<IMatrix3x3, IDirection3D, IVertexPositions3D> {}
export interface IFaceNormals4D extends IFaceNormals<IMatrix4x4, IDirection4D, IVertexPositions4D> {}

export interface IFaceColors<Color extends IColor = IColor>
    extends IColorAttribute<Color>, IFaceAttribute<Color>{}

export interface IFaceColors3D extends IFaceColors<IColor3D> {}
export interface IFaceColors4D extends IFaceColors<IColor4D> {}

export interface IVertices {
    positions: IVertexPositions;
    normals: IVertexNormals | null;
    colors: IVertexColors | null;
    uvs: IVertexUVs | null;

    init(
        indices: IFaceVertices,
        include: ATTRIBUTE,
        share: ATTRIBUTE,
        count: number,

        positions?: IVertexPositions,
        normals?: IVertexNormals,
        colors?: IVertexColors,
        uvs?: IVertexUVs,
    ): void;
}

export interface IVertices3D extends IVertices {
    positions: IVertexPositions3D;
    normals: IVertexNormals3D;
    colors: IVertexColors3D;
    uvs: IVertexUVs2D;
}

export interface IVertices4D extends IVertices {
    positions: IVertexPositions4D;
    normals: IVertexNormals4D;
    colors: IVertexColors4D;
    uvs: IVertexUVs3D;

    mul(matrix: IMatrix4x4, out?: this): this;
}

export interface IFaces {
    positions: IFacePositions | null;
    normals: IFaceNormals | null;
    colors: IFaceColors | null;

    init(
        face_vertices: IFaceVertices,
        include: ATTRIBUTE,

        positions?: IFacePositions,
        normals?: IFaceNormals,
        colors?: IFaceColors
    ): void;
}

export interface IFaces3D extends IFaces {
    positions: IFacePositions3D;
    normals: IFaceNormals3D;
    colors: IFaceColors3D;

    matmul(matrix: IMatrix3x3, out?: this): this;
    mat4mul(matrix: IMatrix4x4, out: IFaces4D): IFaces4D;
}

export interface IFaces4D extends IFaces {
    positions: IFacePositions4D;
    normals: IFaceNormals4D;
    colors: IFaceColors4D;

    matmul(matrix: IMatrix4x4, out?: this): this;
}

export interface IMeshInputs {
    face_type: FACE_TYPE;
    readonly included: ATTRIBUTE;
    readonly position: IInputPositions;
    readonly normal: IInputNormals;
    readonly color: IInputColors;
    readonly uv: IInputUVs;

    sanitize(): this;
}
