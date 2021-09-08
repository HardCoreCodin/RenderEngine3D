import {Vector} from "../accessors/accessor.js";
import Vector2D from "../accessors/vector2D.js";
import Vector3D from "../accessors/vector3D.js";
import Vector4D from "../accessors/vector4D.js";

import Matrix2x2 from "../accessors/matrix2x2.js";
import Matrix3x3 from "../accessors/matrix3x3.js";
import Matrix4x4 from "../accessors/matrix4x4.js";

import Buffer from "../core/memory/buffers.js";
import {UV2D, UV3D} from "../accessors/uv.js";
import {Color3D, Color4D} from "../accessors/color.js";
import {Position2D, Position3D, Position4D} from "../accessors/position.js";
import {Direction2D, Direction3D, Direction4D} from "../accessors/direction.js";
import {VectorConstructor} from "../core/_interfaces/vectors.js";

import {
    VECTOR_2D_ALLOCATOR,
    VECTOR_3D_ALLOCATOR,
    VECTOR_4D_ALLOCATOR
} from "../core/memory/allocators.js";
import {
    multiply_all_2D_vectors_by_a_2x2_matrix_in_place,
    multiply_all_2D_vectors_by_a_2x2_matrix_to_out,
    multiply_some_2D_vectors_by_a_2x2_matrix_in_place,
    multiply_some_2D_vectors_by_a_2x2_matrix_to_out,
    normalize_all_2D_directions_in_place,
    normalize_some_2D_directions_in_place
} from "../core/math/vec2.js";
import {
    multiply_all_3D_directions_by_a_4x4_matrix_in_place,
    multiply_all_3D_directions_by_a_4x4_matrix_to_out3,
    multiply_all_3D_directions_by_a_4x4_matrix_to_out4,
    multiply_all_3D_positions_by_a_4x4_matrix_in_place,
    multiply_all_3D_positions_by_a_4x4_matrix_to_out3,
    multiply_all_3D_positions_by_a_4x4_matrix_to_out4,
    multiply_all_3D_vectors_by_a_3x3_matrix_in_place,
    multiply_all_3D_vectors_by_a_3x3_matrix_to_out,
    multiply_some_3D_directions_by_a_4x4_matrix_in_place,
    multiply_some_3D_directions_by_a_4x4_matrix_to_out3,
    multiply_some_3D_directions_by_a_4x4_matrix_to_out4,
    multiply_some_3D_positions_by_a_4x4_matrix_in_place,
    multiply_some_3D_positions_by_a_4x4_matrix_to_out3,
    multiply_some_3D_positions_by_a_4x4_matrix_to_out4,
    multiply_some_3D_vectors_by_a_3x3_matrix_in_place,
    multiply_some_3D_vectors_by_a_3x3_matrix_to_out,
    normalize_all_3D_directions_in_place,
    normalize_some_3D_directions_in_place
} from "../core/math/vec3.js";
import {
    multiply_all_4D_vectors_by_a_4x4_matrix_in_place,
    multiply_all_4D_vectors_by_a_4x4_matrix_to_out,
    multiply_some_4D_vectors_by_a_4x4_matrix_in_place,
    multiply_some_4D_vectors_by_a_4x4_matrix_to_out,
    normalize_all_4D_directions_in_place,
    normalize_some_4D_directions_in_place
} from "../core/math/vec4.js";


export abstract class VectorBuffer<VectorType extends Vector> extends Buffer<Float32Array> {
    current: VectorType;

    constructor(protected readonly Vector: VectorConstructor<VectorType>) {super()}

    init(length: number, array?: Float32Array, arrays?: Float32Array[]): this {
        super.init(length, array, arrays);
        this._post_init();
        return this;
    }

    protected _post_init(): void {
        this.current = new this.Vector(this.arrays[0]);
    }

    * [Symbol.iterator](): Generator<VectorType> {
        for (const array of this.arrays) {
            this.current.array = array;
            yield this.current;
        }
    }

    setFrom<OtherVectorType extends Vector>(other: VectorBuffer<OtherVectorType>): this {
        this.array.set(other.array);
        return this;
    }

    protected _randomize(): void {
        for (let i = 0; i < this.array.length; i++)
            this.array[i] = Math.random();
    }
}


export class VectorBuffer2D<VectorType extends Vector2D>
    extends VectorBuffer<VectorType>
{
    protected  _getAllocator() {return VECTOR_2D_ALLOCATOR}
}
export class VectorBuffer3D<VectorType extends Vector3D>
    extends VectorBuffer<VectorType>
{
    protected  _getAllocator() {return VECTOR_3D_ALLOCATOR}
}
export class VectorBuffer4D<VectorType extends Vector4D>
    extends VectorBuffer<VectorType>
{
    protected  _getAllocator() {return VECTOR_4D_ALLOCATOR}
}

export class UVs2D extends VectorBuffer2D<UV2D> {constructor() {super(UV2D)}}
export class UVs3D extends VectorBuffer3D<UV3D> {constructor() {super(UV3D)}}


export class Colors3D extends VectorBuffer3D<Color3D> {constructor() {super(Color3D)}}
export class Colors4D extends VectorBuffer4D<Color4D> {constructor() {super(Color4D)}}


export class Directions2D extends VectorBuffer2D<Direction2D> {
    constructor() {super(Direction2D)}

    normalize(include?: Uint8Array, start: number = 0, end: number = this.arrays.length): this {
        if (include)
            normalize_some_2D_directions_in_place(this.arrays, include, start, end);
        else
            normalize_all_2D_directions_in_place(this.arrays, start, end);
        return this;
    }

    mul(matrix: Matrix2x2, out: this, include?: Uint8Array, start: number = 0, end: number = this.arrays.length): this {
        if (include)
            multiply_some_2D_vectors_by_a_2x2_matrix_to_out(this.arrays, matrix.array, include, out.arrays, start, end);
        else
            multiply_all_2D_vectors_by_a_2x2_matrix_to_out(this.arrays, matrix.array, out.arrays, start, end);

        return out;
    }

    imul(matrix: Matrix2x2, include?: Uint8Array, start: number = 0, end: number = this.arrays.length): this {
        if (include)
            multiply_some_2D_vectors_by_a_2x2_matrix_in_place(this.arrays, matrix.array, include, start, end);
        else
            multiply_all_2D_vectors_by_a_2x2_matrix_in_place(this.arrays, matrix.array, start, end);

        return this;
    }
}
export class Directions3D extends VectorBuffer3D<Direction3D> {
    constructor() {super(Direction3D)}

    normalize(include?: Uint8Array, start: number = 0, end: number = this.arrays.length): this {
        if (include)
            normalize_some_3D_directions_in_place(this.arrays, include, start, end);
        else
            normalize_all_3D_directions_in_place(this.arrays, start, end);
        return this;
    }

    mul<OutVector extends Direction3D|Direction4D|Position3D|Position4D,
        Out extends VectorBuffer<OutVector>>
    (
        matrix: Matrix3x3|Matrix4x4,
        out: Out,
        include?: Uint8Array,
        start: number = 0,
        end: number = this.arrays.length
    ): typeof out {
        if (matrix instanceof Matrix3x3) {
            if (include)
                multiply_some_3D_vectors_by_a_3x3_matrix_to_out(this.arrays, matrix.array, include, out.arrays, start, end);
            else
                multiply_all_3D_vectors_by_a_3x3_matrix_to_out(this.arrays, matrix.array, out.arrays, start, end);
        } else {
            if (out.allocator.dim === 3) {
                if (include)
                    multiply_some_3D_directions_by_a_4x4_matrix_to_out3(this.arrays, matrix.array, include, out.arrays, start, end);
                else
                    multiply_all_3D_directions_by_a_4x4_matrix_to_out3(this.arrays, matrix.array, out.arrays, start, end);
            } else {
                if (include)
                    multiply_some_3D_directions_by_a_4x4_matrix_to_out4(this.arrays, matrix.array, include, out.arrays, start, end);
                else
                    multiply_all_3D_directions_by_a_4x4_matrix_to_out4(this.arrays, matrix.array, out.arrays, start, end);
            }
        }

        return out;
    }

    imul(
        matrix: Matrix3x3|Matrix4x4,
        include?: Uint8Array,
        start: number = 0,
        end: number = this.arrays.length
    ) : this {
        if (matrix instanceof Matrix3x3) {
            if (include)
                multiply_some_3D_vectors_by_a_3x3_matrix_in_place(this.arrays, matrix.array, include, start, end);
            else
                multiply_all_3D_vectors_by_a_3x3_matrix_in_place(this.arrays, matrix.array, start, end);
        } else {
            if (include)
                multiply_some_3D_directions_by_a_4x4_matrix_in_place(this.arrays, matrix.array, include, start, end);
            else
                multiply_all_3D_directions_by_a_4x4_matrix_in_place(this.arrays, matrix.array, start, end);
        }

        return this;
    }
}
export class Directions4D extends VectorBuffer4D<Direction4D> {
    constructor() {super(Direction4D)}

    normalize(include?: Uint8Array, start: number = 0, end: number = this.arrays.length): this {
        if (include)
            normalize_some_4D_directions_in_place(this.arrays, include, start, end);
        else
            normalize_all_4D_directions_in_place(this.arrays, start, end);
        return this;
    }

    mul(matrix: Matrix4x4, out: this, include?: Uint8Array, start: number = 0, end: number = this.arrays.length): this {
        if (include)
            multiply_some_4D_vectors_by_a_4x4_matrix_to_out(this.arrays, matrix.array, include, out.arrays, start, end);
        else
            multiply_all_4D_vectors_by_a_4x4_matrix_to_out(this.arrays, matrix.array, out.arrays, start, end);

        return out;
    }

    imul(matrix: Matrix4x4, include?: Uint8Array, start: number = 0, end: number = this.arrays.length): this {
        if (include)
            multiply_some_4D_vectors_by_a_4x4_matrix_in_place(this.arrays, matrix.array, include, start, end);
        else
            multiply_all_4D_vectors_by_a_4x4_matrix_in_place(this.arrays, matrix.array, start, end);

        return this;
    }
}


export class Positions2D extends VectorBuffer2D<Position2D> {
    constructor() {super(Position2D)}

    mul(matrix: Matrix2x2, out: this, include?: Uint8Array, start: number = 0, end: number = this.arrays.length): this {
        if (include)
            multiply_some_2D_vectors_by_a_2x2_matrix_to_out(this.arrays, matrix.array, include, out.arrays, start, end);
        else
            multiply_all_2D_vectors_by_a_2x2_matrix_to_out(this.arrays, matrix.array, out.arrays, start, end);

        return out;
    }

    imul(matrix: Matrix2x2, include?: Uint8Array, start: number = 0, end: number = this.arrays.length): this {
        if (include)
            multiply_some_2D_vectors_by_a_2x2_matrix_in_place(this.arrays, matrix.array, include, start, end);
        else
            multiply_all_2D_vectors_by_a_2x2_matrix_in_place(this.arrays, matrix.array, start, end);

        return this;
    }
}
export class Positions3D extends VectorBuffer3D<Position3D> {
    constructor() {super(Position3D)}

    mul<OutVector extends Position3D|Position4D, Out extends VectorBuffer<OutVector>>(
        matrix: Matrix3x3|Matrix4x4,
        out: Out,
        include?: Uint8Array,
        start: number = 0,
        end: number = this.arrays.length
    ): typeof out {
        if (matrix instanceof Matrix3x3) {
            if (include)
                multiply_some_3D_vectors_by_a_3x3_matrix_to_out(this.arrays, matrix.array, include, out.arrays, start, end);
            else
                multiply_all_3D_vectors_by_a_3x3_matrix_to_out(this.arrays, matrix.array, out.arrays, start, end);
        } else {
            if (out.allocator.dim === 3) {
                if (include)
                    multiply_some_3D_positions_by_a_4x4_matrix_to_out3(this.arrays, matrix.array, include, out.arrays, start, end);
                else
                    multiply_all_3D_positions_by_a_4x4_matrix_to_out3(this.arrays, matrix.array, out.arrays, start, end)
            } else {
                if (include)
                    multiply_some_3D_positions_by_a_4x4_matrix_to_out4(this.arrays, matrix.array, include, out.arrays, start, end);
                else
                    multiply_all_3D_positions_by_a_4x4_matrix_to_out4(this.arrays, matrix.array, out.arrays, start, end)
            }
        }

        return out;
    }

    imul(matrix: Matrix3x3|Matrix4x4, include?: Uint8Array, start: number = 0, end: number = this.arrays.length): this {
        if (matrix instanceof Matrix3x3) {
            if (include)
                multiply_some_3D_vectors_by_a_3x3_matrix_in_place(this.arrays, matrix.array, include, start, end);
            else
                multiply_all_3D_vectors_by_a_3x3_matrix_in_place(this.arrays, matrix.array, start, end);
        } else {
            if (include)
                multiply_some_3D_positions_by_a_4x4_matrix_in_place(this.arrays, matrix.array, include, start, end);
            else
                multiply_all_3D_positions_by_a_4x4_matrix_in_place(this.arrays, matrix.array, start, end);
        }

        return this;
    }
}
export class Positions4D extends VectorBuffer4D<Position4D> {
    constructor() {super(Position4D)}

    protected _post_init(): void {
        super._post_init();
        this.arrays[3].fill(1);
    }

    mul(matrix: Matrix4x4, out: this, include?: Uint8Array, start: number = 0, end: number = this.arrays.length): this {
        if (include)
            multiply_some_4D_vectors_by_a_4x4_matrix_to_out(this.arrays, matrix.array, include, out.arrays, start, end);
        else
            multiply_all_4D_vectors_by_a_4x4_matrix_to_out(this.arrays, matrix.array, out.arrays, start, end);

        return out;
    }

    imul(matrix: Matrix3x3|Matrix4x4, include?: Uint8Array, start: number = 0, end: number = this.arrays.length): this {
        if (matrix instanceof Matrix3x3) {
            if (include)
                multiply_some_3D_vectors_by_a_3x3_matrix_in_place(this.arrays, matrix.array, include, start, end);
            else
                multiply_all_3D_vectors_by_a_3x3_matrix_in_place(this.arrays, matrix.array, start, end);
        } else {
            if (include)
                multiply_some_4D_vectors_by_a_4x4_matrix_in_place(this.arrays, matrix.array, include, start, end);
            else
                multiply_all_4D_vectors_by_a_4x4_matrix_in_place(this.arrays, matrix.array, start, end);
        }

        return this;
    }
}