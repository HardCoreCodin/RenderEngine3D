import {zip} from "../../../utils.js";
import {ATTRIBUTE} from "../../../constants.js";
import {Matrix4x4} from "../../accessors/matrix4x4.js";
import {
    Direction3D,
    Direction4D
} from "../../accessors/direction.js";
import {
    VertexPositions3D,
    VertexPositions4D
} from "../vertex/positions.js";
import {
    TransformableFaceAttributeBuffer3D,
    TransformableFaceAttributeBuffer4D
} from "./_base.js";
import {
    _mulAllDir3Mat4,
    _mulSomeDir3Mat4,
    _norm3D,
    _norm4D
} from "../_core.js";
import {VectorConstructor} from "../../_interfaces/vectors.js";


export class FaceNormals3D extends TransformableFaceAttributeBuffer3D<Direction3D>
{
    readonly attribute: ATTRIBUTE.normal;

    protected _getVectorConstructor(): VectorConstructor<Direction3D> {
        return Direction3D;
    }

    pull(vertex_positions: VertexPositions3D) {
        for (const [face_normal, triangle] of zip(this, vertex_positions.triangles))
            triangle.computeNormal(face_normal);
    }

    normalize(include?: Uint8Array[]): this {
        _norm3D(this.arrays, include);
        return this;
    }

    mul4(matrix: Matrix4x4, out: FaceNormals4D, include?: Uint8Array[]): FaceNormals4D {
        if (include)
            _mulSomeDir3Mat4(this.arrays, matrix.arrays, matrix.id, include, out.arrays);
        else
            _mulAllDir3Mat4(this.arrays, matrix.arrays, matrix.id, out.arrays);

        return out;
    }
}

export class FaceNormals4D extends TransformableFaceAttributeBuffer4D<Direction4D>
{
    readonly attribute: ATTRIBUTE.normal;

    protected _getVectorConstructor(): VectorConstructor<Direction4D> {
        return Direction4D
    }

    pull(vertex_positions: VertexPositions4D) {
        for (const [face_normal, triangle] of zip(this, vertex_positions.triangles))
            triangle.computeNormal(face_normal);
    }

    normalize(include?: Uint8Array[]): this {
        _norm4D(this.arrays, include);
        return this;
    }
}