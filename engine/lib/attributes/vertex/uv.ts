import {LoadableVertexAttribute} from "./_base.js";
import {ATTRIBUTE, DIM} from "../../../constants.js";
import {UV2D, UV3D} from "../../accessors/vector/uv.js";
import {IVertexUVs} from "../../_interfaces/attributes/vertex/uv.js";
import {VECTOR_3D_ALLOCATOR, VECTOR_2D_ALLOCATOR} from "../../allocators/float.js";
import {InputUVs} from "../../mesh/inputs.js";

export class VertexUVs2D extends LoadableVertexAttribute<DIM._2D, UV2D, InputUVs>
    implements IVertexUVs<DIM._2D, UV2D>
{
    readonly attribute = ATTRIBUTE.uv;

    readonly dim = DIM._2D;
    readonly Vector = UV2D;
    readonly allocator = VECTOR_2D_ALLOCATOR;
}

export class VertexUVs3D extends LoadableVertexAttribute<DIM._3D, UV3D, InputUVs>
    implements IVertexUVs<DIM._3D, UV3D>
{
    readonly attribute = ATTRIBUTE.uv;

    readonly dim = DIM._3D;
    readonly Vector = UV3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;
}