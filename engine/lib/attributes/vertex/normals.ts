import Matrix4x4 from "../../accessors/matrix4x4.js";
import {ATTRIBUTE} from "../../../constants.js";
import {InputNormals} from "../../geometry/inputs.js";
import {
    Direction3D,
    Direction4D
} from "../../accessors/direction.js";
import {
    FaceNormals3D,
    FaceNormals4D
} from "../face/normals.js";
import {
    Triangle,
    TransformableVertexAttributeBuffer3D,
    TransformableVertexAttributeBuffer4D
} from "./_base.js";
import {AnyConstructor} from "../../../types.js";
import {VectorConstructor} from "../../_interfaces/vectors.js";
import {_mulAllDir3Mat4, _mulSomeDir3Mat4, _norm3D, _norm4D} from "../_core.js";
import {IVertexFaces} from "../../_interfaces/buffers.js";


export class NormalTriangle3D extends Triangle<Direction3D> {}
export class NormalTriangle4D extends Triangle<Direction4D> {}


export class VertexNormals3D extends TransformableVertexAttributeBuffer3D<Direction3D, NormalTriangle3D> {
    readonly attribute: ATTRIBUTE.normal;

    protected _getTriangleConstructor(): AnyConstructor<NormalTriangle3D> {
        return NormalTriangle3D
    }

    protected _getVectorConstructor(): VectorConstructor<Direction3D> {
        return Direction3D
    }

    load(input_attribute: InputNormals): this {
        return this._load(input_attribute.vertices, true)
    }

    pull(input: FaceNormals3D, vertex_faces: IVertexFaces): void {
        this._pull(input.arrays, vertex_faces);
    }

    mul4(matrix: Matrix4x4, out: VertexNormals4D, include?: Uint8Array[]): VertexNormals4D {
        if (include)
            _mulSomeDir3Mat4(this.arrays, matrix.arrays, matrix.id, include, out.arrays);
        else
            _mulAllDir3Mat4(this.arrays, matrix.arrays, matrix.id, out.arrays);

        return out;
    }

    normalize(include?: Uint8Array[]): this {
        _norm3D(this.arrays, include);
        return this;
    }
}

export class VertexNormals4D
    extends TransformableVertexAttributeBuffer4D<Direction4D, NormalTriangle4D>
{
    readonly attribute: ATTRIBUTE.normal;

    protected _getTriangleConstructor(): AnyConstructor<NormalTriangle4D> {
        return NormalTriangle4D
    }

    protected _getVectorConstructor(): VectorConstructor<Direction4D> {
        return Direction4D
    }

    load(input_attribute: InputNormals): this {
        return this._load(input_attribute.vertices, true)
    }

    pull(input: FaceNormals4D, vertex_faces: IVertexFaces): void {
        this._pull(input.arrays, vertex_faces);
    }

    normalize(include?: Uint8Array[]): this {
        _norm4D(this.arrays, include);
        return this;
    }
}