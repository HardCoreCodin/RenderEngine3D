import {ATTRIBUTE} from "../../constants.js";
import {InputUVs} from "./inputs.js";
import {UV2D, UV3D} from "../accessors/uv.js";
import {LoadableVertexAttribute, Triangle} from "./attributes.js";
import {
    Float32Allocator2D,
    Float32Allocator3D,
    VECTOR_2D_ALLOCATOR,
    VECTOR_3D_ALLOCATOR
} from "../memory/allocators.js";
import {IVertexUVs} from "../_interfaces/attributes.js";
import {IAccessorConstructor} from "../_interfaces/accessors.js";
import {AnyConstructor} from "../../types.js";

class UVTriangle2D extends Triangle<UV2D> {}
class UVTriangle3D extends Triangle<UV3D> {}


export class VertexUVs2D
    extends LoadableVertexAttribute<UV2D, UVTriangle2D, InputUVs>
    implements IVertexUVs<UV2D>
{
    readonly attribute = ATTRIBUTE.uv;
    protected _getTriangleConstructor(): AnyConstructor<UVTriangle2D> {return UVTriangle2D}
    protected _getAllocator(): Float32Allocator2D {return VECTOR_2D_ALLOCATOR}
    protected _getVectorConstructor(): IAccessorConstructor<UV2D> {return UV2D}
}

export class VertexUVs3D
    extends LoadableVertexAttribute<UV3D, UVTriangle3D, InputUVs>
    implements IVertexUVs<UV3D>
{
    readonly attribute = ATTRIBUTE.uv;
    protected _getTriangleConstructor(): AnyConstructor<UVTriangle3D> {return UVTriangle3D}
    protected _getVectorConstructor(): IAccessorConstructor<UV3D> {return UV3D}
    protected _getAllocator(): Float32Allocator3D {return VECTOR_3D_ALLOCATOR}
}