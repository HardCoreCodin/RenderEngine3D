import {ATTRIBUTE} from "../../constants.js";
import {InputNormals} from "../geometry/inputs.js";
import {Matrix4x4} from "./matrix4x4.js";
import {TransformableVector2D} from "./vector2D.js";
import {TransformableVector3D} from "./vector3D.js";
import {TransformableVector4D} from "./vector4D.js";
import {
    VertexPositions2D,
    VertexPositions3D,
    VertexPositions4D
} from "./position.js";
import {
    Triangle,
    TransformableFaceAttributeBuffer2D,
    TransformableFaceAttributeBuffer3D,
    TransformableFaceAttributeBuffer4D,
    TransformableVertexAttributeBuffer2D,
    TransformableVertexAttributeBuffer3D,
    TransformableVertexAttributeBuffer4D
} from "./attributes.js";
import {
    compute_the_length_of_a_2D_direction,
    dot_a_2D_direction_with_another_2D_direction,
    negate_a_2D_direction_in_place, negate_a_2D_direction_to_out,
    normalize_a_2D_direction_in_place,
    normalize_a_2D_direction_to_out,
    reflect_a_2D_vector_around_a_2D_direction_in_place,
    reflect_a_2D_vector_around_a_2D_direction_to_out,
    square_the_length_of_a_2D_direction
} from "../math/vec2.js";
import {
    compute_the_length_of_a_3D_direction,
    cross_a_3D_direction_with_another_3D_direction_in_place,
    cross_a_3D_direction_with_another_3D_direction_to_out,
    dot_a_3D_direction_with_another_3D_direction, multiply_a_3D_direction_by_a_4x4_matrix_to_out,
    negate_a_3D_direction_in_place,
    negate_a_3D_direction_to_out,
    normalize_a_3D_direction_in_place,
    normalize_a_3D_direction_to_out,
    reflect_a_3D_vector_around_a_3D_direction_in_place,
    reflect_a_3D_vector_around_a_3D_direction_to_out,
    square_the_length_of_a_3D_direction
} from "../math/vec3.js";
import {
    compute_the_length_of_a_4D_direction,
    dot_a_4D_direction_with_another_4D_direction, negate_a_4D_direction_in_place, negate_a_4D_direction_to_out,
    normalize_a_4D_direction_in_place,
    normalize_a_4D_direction_to_out, reflect_a_4D_vector_around_a_4D_direction_in_place,
    reflect_a_4D_vector_around_a_4D_direction_to_out,
    square_the_length_of_a_4D_direction
} from "../math/vec4.js";
import {IDirection2D, IDirection3D, IDirection4D, VectorConstructor} from "../_interfaces/vectors.js";
import {AnyConstructor} from "../../types.js";
import {zip} from "../../utils.js";

let this_arrays,
    other_arrays,
    out_arrays: Float32Array[];


export class Direction2D extends TransformableVector2D implements IDirection2D
{
    copy(out: Direction2D = new Direction2D()): Direction2D {return out.setFrom(this)}

    get is_normalized(): boolean {
        return this.length_squared === 1;
    }

    dot(other: this): number {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return dot_a_2D_direction_with_another_2D_direction(
            this.id,
            this_arrays[0],
            this_arrays[1],

            other.id,
            other_arrays[0],
            other_arrays[1]
        )
    }

    get length(): number {
        this_arrays = this.arrays;

        return compute_the_length_of_a_2D_direction(
            this.id,
            this_arrays[0],
            this_arrays[1]
        )
    }

    get length_squared(): number {
        this_arrays = this.arrays;

        return square_the_length_of_a_2D_direction(
            this.id,
            this_arrays[0],
            this_arrays[1]
        )
    }

    normalize(out?: this): this {
        this_arrays = this.arrays;

        if (out && !out.is(this)) {
            out_arrays = out.arrays;

            normalize_a_2D_direction_to_out(
                this.id,
                this_arrays[0],
                this_arrays[1],

                out.id,
                out_arrays[0],
                out_arrays[1]
            );

            return out;
        }

        normalize_a_2D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1]
        );

        return this;
    }

    reflect(other: this, out?: this): this {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        if (out && !out.is(this)) {
            out_arrays = out.arrays;

            reflect_a_2D_vector_around_a_2D_direction_to_out(
                this.id,
                this_arrays[0],
                this_arrays[1],

                other.id,
                other_arrays[0],
                other_arrays[1],

                out.id,
                out_arrays[0],
                out_arrays[1]
            );

            return out;
        }

        reflect_a_2D_vector_around_a_2D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],

            other.id,
            other_arrays[0],
            other_arrays[1]
        );

        return this;
    }

    negate(out?: this): this {
        this_arrays = this.arrays;

        if (out && !out.is(this)) {
            out_arrays = out.arrays;

            negate_a_2D_direction_to_out(
                this.id,
                this_arrays[0],
                this_arrays[1],

                out.id,
                out_arrays[0],
                out_arrays[1]
            );

            return out;
        }

        negate_a_2D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1]
        );

        return this;
    }

    get xx(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[0]])}
    get xy(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[1]])}

    get yx(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[0]])}
    get yy(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[1]])}
}

export class Direction3D extends TransformableVector3D implements IDirection3D
{
    copy(out: Direction3D = new Direction3D()): Direction3D {return out.setFrom(this)}

    get is_normalized(): boolean {
        return this.length_squared === 1;
    }

    dot(other: this): number {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return dot_a_3D_direction_with_another_3D_direction(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2]
        )
    }

    get length(): number {
        this_arrays = this.arrays;

        return compute_the_length_of_a_3D_direction(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2]
        )
    }

    get length_squared(): number {
        this_arrays = this.arrays;

        return square_the_length_of_a_3D_direction(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2]
        )
    }

    normalize(out?: this): this {
        this_arrays = this.arrays;

        if (out && !out.is(this)) {
            out_arrays = out.arrays;

            normalize_a_3D_direction_to_out(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                out.id,
                out_arrays[0],
                out_arrays[1],
                out_arrays[2]
            );

            return out;
        }

        normalize_a_3D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2]
        );

        return this;
    }

    reflect(other: this, out?: this): this {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        if (out && !out.is(this)) {
            out_arrays = out.arrays;

            reflect_a_3D_vector_around_a_3D_direction_to_out(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                other.id,
                other_arrays[0],
                other_arrays[1],
                other_arrays[2],

                out.id,
                out_arrays[0],
                out_arrays[1],
                out_arrays[2]
            );

            return out;
        }

        reflect_a_3D_vector_around_a_3D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2]
        );

        return this;
    }

    negate(out?: this): this {
        this_arrays = this.arrays;

        if (out && !out.is(this)) {
            out_arrays = out.arrays;

            negate_a_3D_direction_to_out(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                out.id,
                out_arrays[0],
                out_arrays[1],
                out_arrays[2]
            );

            return out;
        }

        negate_a_3D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2]
        );

        return this;
    }


    cross(other: Direction3D, out?: this): this {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        if (out && !out.is(this)) {
            out_arrays = out.arrays;

            cross_a_3D_direction_with_another_3D_direction_to_out(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                other.id,
                other_arrays[0],
                other_arrays[1],
                other_arrays[2],

                out.id,
                out_arrays[0],
                out_arrays[1],
                out_arrays[2]
            );

            return out;
        }

        cross_a_3D_direction_with_another_3D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2]
        );

        return this;
    };

    mat4mul(matrix: Matrix4x4, out: Direction4D): Direction4D {
        this_arrays = this.arrays;
        other_arrays = matrix.arrays;
        out_arrays = out.arrays;

        multiply_a_3D_direction_by_a_4x4_matrix_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            matrix.id,
            other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
            other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[7],
            other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
            other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15],

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2],
            out_arrays[3]
        );

        return out;
    }

    get xx(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[0]])}
    get xy(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[1]])}
    get xz(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[2]])}

    get yx(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[0]])}
    get yy(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[1]])}
    get yz(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[2]])}

    get zx(): Direction2D {return new Direction2D(this.id, [this.arrays[2], this.arrays[0]])}
    get zy(): Direction2D {return new Direction2D(this.id, [this.arrays[2], this.arrays[1]])}
    get zz(): Direction2D {return new Direction2D(this.id, [this.arrays[2], this.arrays[2]])}

    get xxx(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[0]])}
    get xxy(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[1]])}
    get xxz(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[2]])}
    get xyx(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[0]])}
    get xyy(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[1]])}
    get xyz(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]])}
    get xzx(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[0]])}
    get xzy(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[1]])}
    get xzz(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[2]])}

    get yxx(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[0]])}
    get yxy(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[1]])}
    get yxz(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[2]])}
    get yyx(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[0]])}
    get yyy(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[1]])}
    get yyz(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[2]])}
    get yzx(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[0]])}
    get yzy(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[1]])}
    get yzz(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[2]])}

    get zxx(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[0]])}
    get zxy(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[1]])}
    get zxz(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[2]])}
    get zyx(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[0]])}
    get zyy(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[1]])}
    get zyz(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[2]])}
    get zzx(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[0]])}
    get zzy(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[1]])}
    get zzz(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[2]])}

    set xy(other: Direction2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}
    set xz(other: Direction2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set yx(other: Direction2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set yz(other: Direction2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set zx(other: Direction2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set zy(other: Direction2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}

    set xyz(other: Direction3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set xzy(other: Direction3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set yxz(other: Direction3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set yzx(other: Direction3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
    set zxy(other: Direction3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set zyx(other: Direction3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
}

export class Direction4D extends TransformableVector4D implements IDirection4D
{
    copy(out: Direction4D = new Direction4D()): Direction4D {return out.setFrom(this)}

    get is_normalized(): boolean {
        return this.length_squared === 1;
    }

    dot(other: this): number {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return dot_a_4D_direction_with_another_4D_direction(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],
            other_arrays[3]
        )
    }

    get length(): number {
        this_arrays = this.arrays;

        return compute_the_length_of_a_4D_direction(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3]
        )
    }

    get length_squared(): number {
        this_arrays = this.arrays;

        return square_the_length_of_a_4D_direction(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3]
        )
    }

    normalize(out?: this): this {
        this_arrays = this.arrays;

        if (out && !out.is(this)) {
            out_arrays = out.arrays;

            normalize_a_4D_direction_to_out(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],
                this_arrays[3],

                out.id,
                out_arrays[0],
                out_arrays[1],
                out_arrays[2],
                out_arrays[3]
            );

            return out;
        }

        normalize_a_4D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3]
        );

        return this;
    }

    reflect(other: this, out?: this): this {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        if (out && !out.is(this)) {
            out_arrays = out.arrays;

            reflect_a_4D_vector_around_a_4D_direction_to_out(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],
                this_arrays[3],

                other.id,
                other_arrays[0],
                other_arrays[1],
                other_arrays[2],
                other_arrays[3],

                out.id,
                out_arrays[0],
                out_arrays[1],
                out_arrays[2],
                out_arrays[3]
            );

            return out;
        }

        reflect_a_4D_vector_around_a_4D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],
            other_arrays[3]
        );

        return this;
    }

    negate(out?: this): this {
        this_arrays = this.arrays;

        if (out && !out.is(this)) {
            out_arrays = out.arrays;

            negate_a_4D_direction_to_out(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],
                this_arrays[3],

                out.id,
                out_arrays[0],
                out_arrays[1],
                out_arrays[2],
                out_arrays[3]
            );

            return out;
        }

        negate_a_4D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],
            this_arrays[3]
        );

        return this;
    }

    cross(other: Direction4D, out?: this): this {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        if (out && !out.is(this)) {
            out_arrays = out.arrays;

            cross_a_3D_direction_with_another_3D_direction_to_out(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                other.id,
                other_arrays[0],
                other_arrays[1],
                other_arrays[2],

                out.id,
                out_arrays[0],
                out_arrays[1],
                out_arrays[2]
            );

            return out;
        }

        cross_a_3D_direction_with_another_3D_direction_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2]
        );

        return this;
    };

    get xx(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[0]])}
    get xy(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[1]])}
    get xz(): Direction2D {return new Direction2D(this.id, [this.arrays[0], this.arrays[2]])}

    get yx(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[0]])}
    get yy(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[1]])}
    get yz(): Direction2D {return new Direction2D(this.id, [this.arrays[1], this.arrays[2]])}

    get zx(): Direction2D {return new Direction2D(this.id, [this.arrays[2], this.arrays[0]])}
    get zy(): Direction2D {return new Direction2D(this.id, [this.arrays[2], this.arrays[1]])}
    get zz(): Direction2D {return new Direction2D(this.id, [this.arrays[2], this.arrays[2]])}

    get xxx(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[0]])}
    get xxy(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[1]])}
    get xxz(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[0], this.arrays[2]])}
    get xyx(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[0]])}
    get xyy(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[1]])}
    get xyz(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]])}
    get xzx(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[0]])}
    get xzy(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[1]])}
    get xzz(): Direction3D {return new Direction3D(this.id, [this.arrays[0], this.arrays[2], this.arrays[2]])}

    get yxx(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[0]])}
    get yxy(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[1]])}
    get yxz(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[0], this.arrays[2]])}
    get yyx(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[0]])}
    get yyy(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[1]])}
    get yyz(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[1], this.arrays[2]])}
    get yzx(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[0]])}
    get yzy(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[1]])}
    get yzz(): Direction3D {return new Direction3D(this.id, [this.arrays[1], this.arrays[2], this.arrays[2]])}

    get zxx(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[0]])}
    get zxy(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[1]])}
    get zxz(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[0], this.arrays[2]])}
    get zyx(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[0]])}
    get zyy(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[1]])}
    get zyz(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[1], this.arrays[2]])}
    get zzx(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[0]])}
    get zzy(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[1]])}
    get zzz(): Direction3D {return new Direction3D(this.id, [this.arrays[2], this.arrays[2], this.arrays[2]])}

    set xy(other: Direction2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}
    set xz(other: Direction2D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set yx(other: Direction2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set yz(other: Direction2D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]}
    set zx(other: Direction2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]}
    set zy(other: Direction2D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]}

    set xyz(other: Direction3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set xzy(other: Direction3D) {this.arrays[0][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set yxz(other: Direction3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[2][this.id] = other.arrays[2][other.id]}
    set yzx(other: Direction3D) {this.arrays[1][this.id] = other.arrays[0][other.id]; this.arrays[2][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
    set zxy(other: Direction3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[0][this.id] = other.arrays[1][other.id]; this.arrays[1][this.id] = other.arrays[2][other.id]}
    set zyx(other: Direction3D) {this.arrays[2][this.id] = other.arrays[0][other.id]; this.arrays[1][this.id] = other.arrays[1][other.id]; this.arrays[0][this.id] = other.arrays[2][other.id]}
}

export const dir2 = (
    x: number = 0,
    y: number = x
): Direction2D => new Direction2D().setTo(x, y);

export const dir3 = (
    x: number = 0,
    y: number = x,
    z: number = x
): Direction3D => new Direction3D().setTo(x, y, z);

export const dir4 = (
    x: number = 0,
    y: number = x,
    z: number = x,
    w: number = x
): Direction4D => new Direction4D().setTo(x, y, z, w);


// Attribute Buffers:

export class DirectionTriangle3D extends Triangle<Direction3D> {}
export class DirectionTriangle4D extends Triangle<Direction4D> {}

export class VertexNormals3D
    extends TransformableVertexAttributeBuffer3D<Direction3D,
        DirectionTriangle3D,
        Direction4D,
        DirectionTriangle4D,
        VertexNormals4D> {
    readonly attribute: ATTRIBUTE.normal;

    protected _getTriangleConstructor(): AnyConstructor<DirectionTriangle3D> {
        return DirectionTriangle3D
    }

    protected _getVectorConstructor(): VectorConstructor<Direction3D> {
        return Direction3D
    }

    load(input_attribute: InputNormals): this {
        return this._load(input_attribute.vertices, true)
    }
}

export class VertexNormals4D
    extends TransformableVertexAttributeBuffer4D<Direction4D, DirectionTriangle4D> {
    readonly attribute: ATTRIBUTE.normal;

    protected _getTriangleConstructor(): AnyConstructor<DirectionTriangle4D> {
        return DirectionTriangle4D
    }

    protected _getVectorConstructor(): VectorConstructor<Direction4D> {
        return Direction4D
    }

    load(input_attribute: InputNormals): this {
        return this._load(input_attribute.vertices, true)
    }
}

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
}