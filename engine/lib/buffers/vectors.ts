import {Vector} from "../accessors/accessor.js";
import Vector2D from "../accessors/vector2D.js";
import Vector3D from "../accessors/vector3D.js";
import Vector4D from "../accessors/vector4D.js";

import Matrix2x2 from "../accessors/matrix2x2.js";
import Matrix3x3 from "../accessors/matrix3x3.js";
import Matrix4x4 from "../accessors/matrix4x4.js";

import {FloatBuffer} from "../memory/buffers.js";
import {UV2D, UV3D} from "../accessors/uv.js";
import {Color3D, Color4D} from "../accessors/color.js";
import {Position2D, Position3D, Position4D} from "../accessors/position.js";
import {Direction2D, Direction3D, Direction4D} from "../accessors/direction.js";

import {IAllocator} from "../_interfaces/allocators.js";
import {VectorConstructor} from "../_interfaces/vectors.js";
import {VECTOR_2D_ALLOCATOR, VECTOR_3D_ALLOCATOR, VECTOR_4D_ALLOCATOR} from "../memory/allocators.js";

import {zip} from "../../utils.js";
import {
    multiply_2D_vectors_by_a_2x2_matrix_in_place,
    multiply_2D_vectors_by_a_2x2_matrix_to_out,
    multiply_3D_directions_by_a_4x4_matrix_in_place,
    multiply_3D_directions_by_a_4x4_matrix_to_out,
    multiply_3D_positions_by_a_4x4_matrix_in_place,
    multiply_3D_positions_by_a_4x4_matrix_to_out,
    multiply_3D_vectors_by_a_3x3_matrix_in_place,
    multiply_3D_vectors_by_a_3x3_matrix_to_out,
    multiply_4D_vectors_by_a_4x4_matrix_in_place,
    multiply_4D_vectors_by_a_4x4_matrix_to_out,
    normalize2D,
    normalize3D,
    normalize4D
} from "./_core.js";


export class VectorBuffer<VectorType extends Vector> extends FloatBuffer {
    current: VectorType;

    constructor(
        protected readonly Vector: VectorConstructor<VectorType>,
        allocator: IAllocator<Float32Array>
    ) {
        super(allocator);
    }

    init(length: number, arrays?: Float32Array[]): this {
        super.init(length, arrays);
        this._post_init();
        return this;
    }

    protected _post_init(): void {
        this.current = new this.Vector(0, this.arrays);
    }

    * [Symbol.iterator](): Generator<VectorType> {
        for (let id = 0; id < this._length; id++) {
            this.current.id = id;
            yield this.current;
        }
    }

    setFrom<OtherVectorType extends Vector>(other: VectorBuffer<OtherVectorType>): this {
        for (const [this_array, other_array] of zip(this.arrays, other.arrays))
            this_array.set(other_array);

        return this;
    }
}


export class VectorBuffer2D<VectorType extends Vector2D>
    extends VectorBuffer<VectorType>
{
    constructor(Vector: VectorConstructor<VectorType>) {super(Vector, VECTOR_2D_ALLOCATOR)}
}
export class VectorBuffer3D<VectorType extends Vector3D>
    extends VectorBuffer<VectorType>
{
    constructor(Vector: VectorConstructor<VectorType>) {super(Vector, VECTOR_3D_ALLOCATOR)}
}
export class VectorBuffer4D<VectorType extends Vector4D>
    extends VectorBuffer<VectorType>
{
    constructor(Vector: VectorConstructor<VectorType>) {super(Vector, VECTOR_4D_ALLOCATOR)}
}

export class UVs2D extends VectorBuffer2D<UV2D> {constructor() {super(UV2D)}}
export class UVs3D extends VectorBuffer3D<UV3D> {constructor() {super(UV3D)}}


export class Colors3D extends VectorBuffer3D<Color3D> {constructor() {super(Color3D)}}
export class Colors4D extends VectorBuffer4D<Color4D> {constructor() {super(Color4D)}}


export class Directions2D extends VectorBuffer2D<Direction2D> {
    constructor() {super(Direction2D)}

    normalize(include?: Uint8Array[]): this {
        normalize2D(this.arrays, include);
        return this;
    }

    mul(matrix: Matrix2x2, out: this, include?: Uint8Array[]): this {
        multiply_2D_vectors_by_a_2x2_matrix_to_out(
            this.arrays,
            matrix.arrays,
            matrix.id,
            out.arrays,
            include
        );

        return out;
    }

    imul(matrix: Matrix2x2, include?: Uint8Array[]): this {
        multiply_2D_vectors_by_a_2x2_matrix_in_place(
            this.arrays,
            matrix.arrays,
            matrix.id,
            include
        );

        return this;
    }
}
export class Directions3D extends VectorBuffer3D<Direction3D> {
    constructor() {super(Direction3D)}

    normalize(include?: Uint8Array[]): this {
        normalize3D(this.arrays, include);
        return this;
    }

    mul<OutVector extends Direction3D|Direction4D|Position3D|Position4D,
        Out extends VectorBuffer<OutVector>>
    (
        matrix: Matrix3x3|Matrix4x4,
        out: Out,
        as_positions: boolean = false,
        include?: Uint8Array[]
    ): typeof out {
        if (matrix instanceof Matrix3x3)
            multiply_3D_vectors_by_a_3x3_matrix_to_out(
                this.arrays,
                matrix.arrays,
                matrix.id,
                out.arrays,
                include
            );
        else if (as_positions)
            multiply_3D_positions_by_a_4x4_matrix_to_out(
                this.arrays,
                matrix.arrays,
                matrix.id,
                out.arrays,
                include
            );
        else
            multiply_3D_directions_by_a_4x4_matrix_to_out(
                this.arrays,
                matrix.arrays,
                matrix.id,
                out.arrays,
                include
            );

        return out;
    }

    imul(matrix: Matrix3x3|Matrix4x4, as_positions: boolean = false, include?: Uint8Array[]): this {
        if (matrix instanceof Matrix3x3)
            multiply_3D_vectors_by_a_3x3_matrix_in_place(
                this.arrays,
                matrix.arrays,
                matrix.id,
                include
            );
        else if (as_positions)
            multiply_3D_positions_by_a_4x4_matrix_in_place(
                this.arrays,
                matrix.arrays,
                matrix.id,
                include
            );
        else
            multiply_3D_directions_by_a_4x4_matrix_in_place(
                this.arrays,
                matrix.arrays,
                matrix.id,
                include
            );

        return this;
    }
}
export class Directions4D extends VectorBuffer4D<Direction4D> {
    constructor() {super(Direction4D)}

    normalize(include?: Uint8Array[]): this {
        normalize4D(this.arrays, include);
        return this;
    }

    mul(matrix: Matrix4x4, out: this, include?: Uint8Array[]): this {
        multiply_4D_vectors_by_a_4x4_matrix_to_out(
            this.arrays,
            matrix.arrays,
            matrix.id,
            out.arrays,
            include
        );

        return out;
    }

    imul(matrix: Matrix4x4, include?: Uint8Array[]): this {
        multiply_4D_vectors_by_a_4x4_matrix_in_place(
            this.arrays,
            matrix.arrays,
            matrix.id,
            include
        );

        return this;
    }
}


export class Positions2D extends VectorBuffer2D<Position2D> {
    constructor() {super(Position2D)}

    mul(matrix: Matrix2x2, out: this, include?: Uint8Array[]): this {
        multiply_2D_vectors_by_a_2x2_matrix_to_out(
            this.arrays,
            matrix.arrays,
            matrix.id,
            out.arrays,
            include
        );

        return out;
    }

    imul(matrix: Matrix2x2, include?: Uint8Array[]): this {
        multiply_2D_vectors_by_a_2x2_matrix_in_place(
            this.arrays,
            matrix.arrays,
            matrix.id,
            include
        );

        return this;
    }
}
export class Positions3D extends VectorBuffer3D<Position3D> {
    constructor() {super(Position3D)}

    mul<OutVector extends Position3D|Position4D, Out extends VectorBuffer<OutVector>>(
        matrix: Matrix3x3|Matrix4x4,
        out: Out,
        include?: Uint8Array[]
    ): typeof out {
        if (matrix instanceof Matrix3x3)
            multiply_3D_vectors_by_a_3x3_matrix_to_out(
                this.arrays,
                matrix.arrays,
                matrix.id,
                out.arrays,
                include
            );
        else
            multiply_3D_positions_by_a_4x4_matrix_to_out(
                this.arrays,
                matrix.arrays,
                matrix.id,
                out.arrays,
                include
            );

        return out;
    }

    imul(matrix: Matrix3x3|Matrix4x4, include?: Uint8Array[]): this {
        if (matrix instanceof Matrix3x3)
            multiply_3D_vectors_by_a_3x3_matrix_in_place(
                this.arrays,
                matrix.arrays,
                matrix.id,
                include
            );
        else
            multiply_3D_positions_by_a_4x4_matrix_in_place(
                this.arrays,
                matrix.arrays,
                matrix.id,
                include
            );

        return this;
    }
}
export class Positions4D extends VectorBuffer4D<Position4D> {
    constructor() {super(Position4D)}

    protected _post_init(): void {
        super._post_init();
        this.arrays[3].fill(1);
    }

    mul(matrix: Matrix4x4, out: this, include?: Uint8Array[]): this {
        multiply_4D_vectors_by_a_4x4_matrix_to_out(
            this.arrays,
            matrix.arrays,
            matrix.id,
            out.arrays,
            include
        );

        return out;
    }

    imul(matrix: Matrix4x4, include?: Uint8Array[]): this {
        multiply_4D_vectors_by_a_4x4_matrix_in_place(
            this.arrays,
            matrix.arrays,
            matrix.id,
            include
        );

        return this;
    }
}