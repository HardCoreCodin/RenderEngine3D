import {ATTRIBUTE} from "../../../constants.js";
import {Matrix4x4} from "../../accessors/matrix4x4.js";
import {
    Position2D,
    Position3D,
    Position4D
} from "../../accessors/position.js";
import {
    VertexPositions2D,
    VertexPositions3D,
    VertexPositions4D
} from "../vertex/positions.js";
import {VectorConstructor} from "../../_interfaces/vectors.js";
import {
    TransformableFaceAttributeBuffer2D,
    TransformableFaceAttributeBuffer3D,
    TransformableFaceAttributeBuffer4D
} from "./_base.js";
import {
    _mulAllPos3Mat4,
    _mulSomePos3Mat4
} from "../_core.js";


export class FacePositions2D
    extends TransformableFaceAttributeBuffer2D<Position2D> {
    readonly attribute: ATTRIBUTE.position;

    protected _getVectorConstructor(): VectorConstructor<Position2D> {
        return Position2D
    }

    pull(input: VertexPositions2D): this {
        this._pull(input.arrays, input.is_shared);
        return this;
    }
}

export class FacePositions3D extends TransformableFaceAttributeBuffer3D<Position3D>
{
    readonly attribute: ATTRIBUTE.position;

    protected _getVectorConstructor(): VectorConstructor<Position3D> {
        return Position3D;
    }

    pull(input: VertexPositions3D): this {
        this._pull(input.arrays, input.is_shared);
        return this;
    }

    mul4(matrix: Matrix4x4, out: FacePositions4D, include?: Uint8Array[]): FacePositions4D {
        if (include)
            _mulSomePos3Mat4(this.arrays, matrix.arrays, matrix.id, include, out.arrays);
        else
            _mulAllPos3Mat4(this.arrays, matrix.arrays, matrix.id, out.arrays);

        return out;
    }
}

export class FacePositions4D extends TransformableFaceAttributeBuffer4D<Position4D>
{
    readonly attribute: ATTRIBUTE.position;

    protected _getVectorConstructor(): VectorConstructor<Position4D> {
        return Position4D
    }

    protected _post_init(): void {
        super._post_init();
        this.arrays[3].fill(1);
    }

    pull(input: VertexPositions4D): this {
        this._pull(input.arrays, input.is_shared);
        return this;
    }
}