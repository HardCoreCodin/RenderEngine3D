import {ATTRIBUTE, DIM} from "../../constants.js";
import {UV2D, UV3D} from "../accessors/uv.js";
import {InputUVs} from "./inputs.js";
import {IVertexUVs} from "../_interfaces/attributes.js";
import {VECTOR_2D_ALLOCATOR, VECTOR_3D_ALLOCATOR} from "../memory/allocators.js";
import {LoadableVertexAttribute, Triangle} from "./attributes.js";

class UVTriangle<VectorType extends UV2D|UV3D> extends Triangle<VectorType> {}
class UVTriangle2D extends UVTriangle<UV2D> {}
class UVTriangle3D extends UVTriangle<UV3D> {}


export class VertexUVs2D
    extends LoadableVertexAttribute<ATTRIBUTE.uv, DIM._2D, UV2D, UVTriangle2D, InputUVs>
    implements IVertexUVs<DIM._2D, UV2D> {
    readonly attribute = ATTRIBUTE.uv;

    readonly dim = DIM._2D;
    readonly Vector = UV2D;
    readonly Triangle = UVTriangle2D;
    readonly allocator = VECTOR_2D_ALLOCATOR;

    homogenize(out?: VertexUVs3D): VertexUVs3D {
        if (out) out.setFrom(this);
        else out = new VertexUVs3D(this.face_vertices, this._is_shared, this.face_count, [
            this.arrays[0],
            this.arrays[1],
            new Float32Array(this.length)
        ]);

        out.arrays[2].fill(1);

        return out;
    }

}

export class VertexUVs3D
    extends LoadableVertexAttribute<ATTRIBUTE.uv, DIM._3D, UV3D, UVTriangle3D, InputUVs>
    implements IVertexUVs<DIM._3D, UV3D> {
    readonly attribute = ATTRIBUTE.uv;

    readonly dim = DIM._3D;
    readonly Vector = UV3D;
    readonly Triangle = UVTriangle3D;
    readonly allocator = VECTOR_3D_ALLOCATOR;
}