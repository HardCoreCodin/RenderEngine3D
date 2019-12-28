import {ATTRIBUTE} from "../../constants.js";
import {InputUVs} from "./inputs.js";
import {UV2D, UV3D} from "../accessors/uv.js";
import {LoadableVertexAttribute, Triangle} from "./attributes.js";
import {VECTOR_2D_ALLOCATOR, VECTOR_3D_ALLOCATOR} from "../memory/allocators.js";
import {IVertexUVs} from "../_interfaces/attributes.js";

class UVTriangle<VectorType extends UV2D|UV3D> extends Triangle<VectorType> {}
class UVTriangle2D extends UVTriangle<UV2D> {}
class UVTriangle3D extends UVTriangle<UV3D> {}


export class VertexUVs2D
    extends LoadableVertexAttribute<UV2D, UVTriangle2D, InputUVs>
    implements IVertexUVs<UV2D>
{
    readonly attribute = ATTRIBUTE.uv;
    readonly Vector = UV2D;
    readonly Triangle = UVTriangle2D;
    readonly allocator = VECTOR_2D_ALLOCATOR;
}

export class VertexUVs3D
    extends LoadableVertexAttribute<UV3D, UVTriangle3D, InputUVs>
    implements IVertexUVs<UV3D>
{
    readonly attribute = ATTRIBUTE.uv;
    readonly Vector = UV3D;
    readonly Triangle = UVTriangle3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;
}