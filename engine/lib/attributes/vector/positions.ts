import Matrix4x4 from "../../accessors/matrix4x4.js";
import {
    Position2D,
    Position3D,
    Position4D
} from "../../accessors/position.js";
import {
    TransformableVectorBuffer2D,
    TransformableVectorBuffer3D,
    TransformableVectorBuffer4D,
} from "./_base.js";
import {VectorConstructor} from "../../_interfaces/vectors.js";
import {
    _mulAllDir3Mat4,
    _mulAllPos3Mat4, _mulSomeDir3Mat4,
    _mulSomePos3Mat4
} from "../_core.js";
import {Directions3D, Directions4D} from "./directions.js";


export class Positions2D extends TransformableVectorBuffer2D<Position2D> {
    protected _getVectorConstructor(): VectorConstructor<Position2D> {
        return Position2D
    }
}

export class Positions3D extends TransformableVectorBuffer3D<Position3D> {
    protected _getVectorConstructor(): VectorConstructor<Position3D> {
        return Position3D
    }

    mul4(matrix: Matrix4x4, out: Positions4D|Positions3D|Directions4D|Directions3D, include?: Uint8Array[]): typeof out{
        if (include)
            _mulSomePos3Mat4(this.arrays, matrix.arrays, matrix.id, include, out.arrays);
        else
            _mulAllPos3Mat4(this.arrays, matrix.arrays, matrix.id, out.arrays);

        return out;
    }

    mul4AsDir(matrix: Matrix4x4, out: Directions4D|Directions3D|Positions4D|Positions3D, include?: Uint8Array[]): typeof out{
        if (include)
            _mulSomeDir3Mat4(this.arrays, matrix.arrays, matrix.id, include, out.arrays);
        else
            _mulAllDir3Mat4(this.arrays, matrix.arrays, matrix.id, out.arrays);

        return out;
    }
}

export class Positions4D extends TransformableVectorBuffer4D<Position4D> {
    protected _getVectorConstructor(): VectorConstructor<Position4D> {
        return Position4D
    }

    protected _post_init(): void {
        super._post_init();
        this.arrays[3].fill(1);
    }
}