import {Vector} from "../accessors/accessor.js";
import {Triangle} from "../buffers/attributes/_base.js";
import {ATTRIBUTE, DIM, FACE_TYPE} from "../../constants.js";
import {InputAttribute} from "../geometry/inputs.js";
import {FaceInputNum, FaceInputs, FaceInputStr, VertexInputNum, VertexInputStr} from "../../types.js";
import {IFaceVertices} from "./buffers.js";
import Matrix4x4 from "../accessors/matrix4x4.js";
import {
    multiply_4D_vectors_by_a_4x4_matrix_in_place,
    multiply_4D_vectors_by_a_4x4_matrix_to_out
} from "../buffers/_core.js";
import Matrix from "../accessors/matrix.js";

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