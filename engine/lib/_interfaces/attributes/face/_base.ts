import {IVector} from "../../accessors/vector/_base.js";
import {IVertexAttribute} from "../vertex/_base.js";
import {IAttribute} from "../_base.js";
import {IFaceVertices} from "../../buffers/index.js";
import {DIM} from "../../../../constants.js";

export interface IFaceAttribute<
    Dim extends DIM,
    VectorType extends IVector = IVector,
    VertexAttributeType extends IVertexAttribute<Dim> = IVertexAttribute<Dim>>
    extends IAttribute<Dim, VectorType>
{
    pull(input: VertexAttributeType): void;
}

export type FaceAttributeConstructor<Dim extends DIM, FaceAttribute extends IFaceAttribute<Dim>> =
    new (_face_vertices: IFaceVertices) => FaceAttribute;
