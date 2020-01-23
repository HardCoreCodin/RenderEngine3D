import {zip} from "../../../utils.js";
import {_norm3D, _norm4D} from "../_core.js";
import {ATTRIBUTE} from "../../../constants.js";
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
import {VectorConstructor} from "../../_interfaces/vectors.js";


export class FaceNormals3D
    extends TransformableFaceAttributeBuffer3D<Direction3D,
        Direction4D,
        FaceNormals4D> {
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
}

export class FaceNormals4D
    extends TransformableFaceAttributeBuffer4D<Direction4D> {
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