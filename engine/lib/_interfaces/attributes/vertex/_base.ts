import {IVector} from "../../accessors/vector/_base.js";
import {IAttribute} from "../_base.js";
import {IFaceAttribute} from "../face/_base.js";
import {IInputAttribute} from "../../mesh/inputs/attributes/_base.js";
import {IFaceVertices, IVertexFaces} from "../../buffers/index.js";
import {DIM} from "../../../../constants.js";

export interface IVertexAttribute<Dim extends DIM, VectorType extends IVector = IVector>
    extends IAttribute<Dim, VectorType> {
    readonly is_shared: boolean;

    faces(): Generator<[VectorType, VectorType, VectorType]>;
}

export interface ILoadableVertexAttribute<
    Dim extends DIM,
    VectorType extends IVector,
    InputAttributeType extends IInputAttribute>
    extends IVertexAttribute<Dim, VectorType>
{
    load(input: InputAttributeType): void;
}

export interface IPulledVertexAttribute<
    Dim extends DIM,
    VectorType extends IVector,
    InputAttributeType extends IInputAttribute,
    FaceAttributeType extends IFaceAttribute<Dim>>
    extends IVertexAttribute<Dim, VectorType>
{
    pull(input: FaceAttributeType, vertex_faces: IVertexFaces): void;
}

export type VertexAttributeConstructor<Dim extends DIM, VertexAttribute extends IVertexAttribute<Dim>> =
    new (_face_vertices: IFaceVertices, is_shared?: number|boolean, _face_count?: number) => VertexAttribute;
