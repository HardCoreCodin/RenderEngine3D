import Matrix4x4 from "../../accessors/matrix4x4.js";
import {
    Direction2D,
    Direction3D,
    Direction4D
} from "../../accessors/direction.js";
import {
    TransformableVectorBuffer2D,
    TransformableVectorBuffer3D,
    TransformableVectorBuffer4D,
} from "./_base.js";
import {VectorConstructor} from "../../_interfaces/vectors.js";
import {
    _mulAllDir3Mat4, _mulAllPos3Mat4,
    _mulSomeDir3Mat4, _mulSomePos3Mat4,
    _norm2D,
    _norm3D,
    _norm4D
} from "../_core.js";
import {Positions3D, Positions4D} from "./positions.js";


export class Directions2D extends TransformableVectorBuffer2D<Direction2D> {
    protected _getVectorConstructor(): VectorConstructor<Direction2D> {
        return Direction2D
    }

    normalize(include?: Uint8Array[]): this {
        _norm2D(this.arrays, include);
        return this;
    }
}

export class Directions3D extends TransformableVectorBuffer3D<Direction3D> {
    protected _getVectorConstructor(): VectorConstructor<Direction3D> {
        return Direction3D
    }

    mul4(matrix: Matrix4x4, out: Directions4D|Directions3D|Positions4D|Positions3D, include?: Uint8Array[]): typeof out{
        if (include)
            _mulSomeDir3Mat4(this.arrays, matrix.arrays, matrix.id, include, out.arrays);
        else
            _mulAllDir3Mat4(this.arrays, matrix.arrays, matrix.id, out.arrays);

        return out;
    }

    mul4AsPos(matrix: Matrix4x4, out: Directions4D|Directions3D|Positions4D|Positions3D, include?: Uint8Array[]): typeof out{
        if (include)
            _mulSomePos3Mat4(this.arrays, matrix.arrays, matrix.id, include, out.arrays);
        else
            _mulAllPos3Mat4(this.arrays, matrix.arrays, matrix.id, out.arrays);

        return out;
    }

    normalize(include?: Uint8Array[]): this {
        _norm3D(this.arrays, include);
        return this;
    }
}

export class Directions4D extends TransformableVectorBuffer4D<Direction4D> {
    protected _getVectorConstructor(): VectorConstructor<Direction4D> {
        return Direction4D
    }

    normalize(include?: Uint8Array[]): this {
        _norm4D(this.arrays, include);
        return this;
    }
}