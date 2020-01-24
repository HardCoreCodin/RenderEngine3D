import Matrix2x2 from "./matrix2x2.js";
import {RotationMatrix} from "./matrix.js";
import {Direction3D} from "./direction.js";
import {Position2D, Position3D} from "./position.js";
import {Float32Allocator9D, MATRIX_3X3_ALLOCATOR} from "../memory/allocators.js";
import {
    add_a_3x3_matrix_to_another_3x3_matrix_in_place,
    add_a_3x3_matrix_to_another_3x3_matrix_to_out,
    add_a_number_to_a_3x3_matrix_in_place,
    add_a_number_to_a_3x3_matrix_to_out,
    check_if_a_3x3_matrix_is_the_identity_matrix,
    check_if_two_3x3_matrices_are_equal,
    divide_a_3x3_matrix_by_a_number_in_place,
    divide_a_3x3_matrix_by_a_number_to_out,
    invert_a_3x3_matrix_in_place,
    invert_a_3x3_matrix_to_out,
    multiply_a_3x3_matrix_by_a_number_in_place,
    multiply_a_3x3_matrix_by_a_number_to_out,
    multiply_a_3x3_matrix_by_another_3x3_matrix_in_place,
    multiply_a_3x3_matrix_by_another_3x3_matrix_to_out,
    rotate_a_3x3_matrix_around_x_in_place,
    rotate_a_3x3_matrix_around_x_to_out,
    rotate_a_3x3_matrix_around_y_in_place,
    rotate_a_3x3_matrix_around_y_to_out,
    rotate_a_3x3_matrix_around_z_in_place,
    rotate_a_3x3_matrix_around_z_to_out,
    set_a_3x3_matrix_from_another_3x3_matrix,
    set_a_3x3_matrix_to_a_cross_product_matrix_for_a_3D_direction_in_place,
    set_a_3x3_matrix_to_a_rotation_around_x_in_place,
    set_a_3x3_matrix_to_a_rotation_around_y_in_place,
    set_a_3x3_matrix_to_a_rotation_around_z_in_place,
    set_a_3x3_matrix_to_an_outer_product_matrix_for_two_3D_directions_in_place,
    set_a_3x3_matrix_to_the_identity_matrix,
    set_all_components_of_a_3x3_matrix_to_a_number,
    set_the_components_of_a_3x3_matrix,
    subtract_a_3x3_matrix_from_another_3x3_matrix_in_place,
    subtract_a_3x3_matrix_from_another_3x3_matrix_to_out,
    subtract_a_number_from_a_3x3_matrix_in_place,
    subtract_a_number_from_a_3x3_matrix_to_out,
    transpose_a_3x3_matrix_in_place,
    transpose_a_3x3_matrix_to_out
} from "../math/mat3.js";
import {Float9} from "../../types.js";
import {IMatrix3x3} from "../_interfaces/matrix.js";

let this_arrays,
    other_arrays,
    out_arrays: Float32Array[];

export default class Matrix3x3 extends RotationMatrix implements IMatrix3x3 {
    protected _getAllocator(): Float32Allocator9D {
        return MATRIX_3X3_ALLOCATOR;
    }

    readonly mat2: Matrix2x2;
    readonly translation2D: Position2D;
    readonly translation: Position3D;
    readonly scale: Direction3D;
    readonly x_axis: Direction3D;
    readonly y_axis: Direction3D;
    readonly z_axis: Direction3D;

    arrays: Float9;

    constructor(id?: number, arrays?: Float9) {
        super(id, arrays);

        this.mat2 = new Matrix2x2(this.id, [
            this.arrays[0], this.arrays[1],
            this.arrays[3], this.arrays[4],
        ]);
        this.translation2D = new Position2D(this.id, [this.arrays[6], this.arrays[7]]);
        this.translation = new Position3D(this.id, [this.arrays[6], this.arrays[7], this.arrays[8]]);
        this.scale = new Direction3D(this.id, [this.arrays[0], this.arrays[4], this.arrays[8]]);

        this.x_axis = new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]]);
        this.y_axis = new Direction3D(this.id, [this.arrays[3], this.arrays[4], this.arrays[5]]);
        this.z_axis = new Direction3D(this.id, [this.arrays[6], this.arrays[7], this.arrays[8]]);
    }

    get m11(): number {return this.arrays[0][this.id]}
    get m12(): number {return this.arrays[1][this.id]}
    get m13(): number {return this.arrays[2][this.id]}

    get m21(): number {return this.arrays[3][this.id]}
    get m22(): number {return this.arrays[4][this.id]}
    get m23(): number {return this.arrays[5][this.id]}

    get m31(): number {return this.arrays[6][this.id]}
    get m32(): number {return this.arrays[7][this.id]}
    get m33(): number {return this.arrays[8][this.id]}


    set m11(m11: number) {this.arrays[0][this.id] = m11}
    set m12(m12: number) {this.arrays[1][this.id] = m12}
    set m13(m13: number) {this.arrays[2][this.id] = m13}

    set m21(m21: number) {this.arrays[3][this.id] = m21}
    set m22(m22: number) {this.arrays[4][this.id] = m22}
    set m23(m23: number) {this.arrays[5][this.id] = m23}

    set m31(m31: number) {this.arrays[6][this.id] = m31}
    set m32(m32: number) {this.arrays[7][this.id] = m32}
    set m33(m33: number) {this.arrays[8][this.id] = m33}

    setTo(
        m11: number, m12: number, m13: number,
        m21: number, m22: number, m23: number,
        m31: number, m32: number, m33: number
    ): this {
        this_arrays = this.arrays;

        set_the_components_of_a_3x3_matrix(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            m11, m12, m13,
            m21, m22, m23,
            m31, m32, m33
        );

        return this;
    }

    get is_identity(): boolean {
        this_arrays = this.arrays;

        return check_if_a_3x3_matrix_is_the_identity_matrix(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],
        );
    }

    copy(out: Matrix3x3 = new Matrix3x3()): Matrix3x3 {
        return out.setFrom(this);
    }

    setToIdentity(): this {
        this_arrays = this.arrays;

        set_a_3x3_matrix_to_the_identity_matrix(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],
        );

        return this;
    }

    setAllTo(value: number): this {
        this_arrays = this.arrays;

        set_all_components_of_a_3x3_matrix_to_a_number(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            value
        );

        return this;
    }

    setFrom(other: Matrix3x3): Matrix3x3 {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        set_a_3x3_matrix_from_another_3x3_matrix(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            other.id,
            other_arrays[0], other_arrays[1], other_arrays[2],
            other_arrays[3], other_arrays[4], other_arrays[5],
            other_arrays[6], other_arrays[7], other_arrays[8]
        );

        return this;
    }

    equals(other: Matrix3x3): boolean {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return check_if_two_3x3_matrices_are_equal(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            other.id,
            other_arrays[0], other_arrays[1], other_arrays[2],
            other_arrays[3], other_arrays[4], other_arrays[5],
            other_arrays[6], other_arrays[7], other_arrays[8]
        );
    }

    setToCrossProductOf(direction: Direction3D): this {
        this_arrays = this.arrays;
        other_arrays = direction.arrays;

        set_a_3x3_matrix_to_a_cross_product_matrix_for_a_3D_direction_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            direction.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2]
        );

        return this;
    }

    setToOuterProductOf(direction_a: Direction3D, direction_b: Direction3D): this {
        this_arrays = this.arrays;
        out_arrays = direction_b.arrays;
        other_arrays = direction_a.arrays;

        set_a_3x3_matrix_to_an_outer_product_matrix_for_two_3D_directions_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            direction_a.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],

            direction_b.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2],
        );

        return this;
    }

    translate2DBy(x: number, y: number = 0, out?: this): this {
        this_arrays = this.mat2.x_axis.arrays;

        if (out && !out.is(this)) {
            out_arrays = out.mat2.x_axis.arrays;

            if (x) out_arrays[0][out.id] = x + this_arrays[0][this.id];
            if (y) out_arrays[1][out.id] = y + this_arrays[1][this.id];

            return out;
        }

        if (x) this_arrays[0][this.id] += x;
        if (y) this_arrays[1][this.id] += y;

        return this;
    }

    protected _add_number_in_place(num: number): void {
        this_arrays = this.arrays;

        add_a_number_to_a_3x3_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            num
        );
    }

    protected _add_other_in_place(other: Matrix3x3): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        add_a_3x3_matrix_to_another_3x3_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            other.id,
            other_arrays[0], other_arrays[1], other_arrays[2],
            other_arrays[3], other_arrays[4], other_arrays[5],
            other_arrays[6], other_arrays[7], other_arrays[8]
        );
    }

    protected _add_number_to_out(num: number, out: Matrix3x3): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        add_a_number_to_a_3x3_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            num,

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2],
            out_arrays[3], out_arrays[4], out_arrays[5],
            out_arrays[6], out_arrays[7], out_arrays[8]
        );
    }

    protected _add_other_to_out(other: Matrix3x3, out: Matrix3x3): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        add_a_3x3_matrix_to_another_3x3_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            other.id,
            other_arrays[0], other_arrays[1], other_arrays[2],
            other_arrays[3], other_arrays[4], other_arrays[5],
            other_arrays[6], other_arrays[7], other_arrays[8],

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2],
            out_arrays[3], out_arrays[4], out_arrays[5],
            out_arrays[6], out_arrays[7], out_arrays[8]
        );
    }

    protected _sub_number_in_place(num: number): void {
        this_arrays = this.arrays;

        subtract_a_number_from_a_3x3_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            num
        );
    }

    protected _sub_other_in_place(other: Matrix3x3): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        subtract_a_3x3_matrix_from_another_3x3_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            other.id,
            other_arrays[0], other_arrays[1], other_arrays[2],
            other_arrays[3], other_arrays[4], other_arrays[5],
            other_arrays[6], other_arrays[7], other_arrays[8]
        );
    }

    protected _sub_number_to_out(num: number, out: Matrix3x3): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        subtract_a_number_from_a_3x3_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            num,

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2],
            out_arrays[3], out_arrays[4], out_arrays[5],
            out_arrays[6], out_arrays[7], out_arrays[8]
        );
    }

    protected _sub_other_to_out(other: Matrix3x3, out: Matrix3x3): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        subtract_a_3x3_matrix_from_another_3x3_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            other.id,
            other_arrays[0], other_arrays[1], other_arrays[2],
            other_arrays[3], other_arrays[4], other_arrays[5],
            other_arrays[6], other_arrays[7], other_arrays[8],

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2],
            out_arrays[3], out_arrays[4], out_arrays[5],
            out_arrays[6], out_arrays[7], out_arrays[8]
        );
    }

    protected _mul_number_in_place(num: number): void {
        this_arrays = this.arrays;

        multiply_a_3x3_matrix_by_a_number_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            num
        );
    }

    protected _mul_other_in_place(other: this): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        multiply_a_3x3_matrix_by_another_3x3_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            other.id,
            other_arrays[0], other_arrays[1], other_arrays[2],
            other_arrays[3], other_arrays[4], other_arrays[5],
            other_arrays[6], other_arrays[7], other_arrays[8]
        );
    }

    protected _mul_number_to_out(num: number, out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        multiply_a_3x3_matrix_by_a_number_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            num,

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2],
            out_arrays[3], out_arrays[4], out_arrays[5],
            out_arrays[6], out_arrays[7], out_arrays[8]
        );
    }

    protected _mul_other_to_out(other: this, out: this): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        multiply_a_3x3_matrix_by_another_3x3_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            other.id,
            other_arrays[0], other_arrays[1], other_arrays[2],
            other_arrays[3], other_arrays[4], other_arrays[5],
            other_arrays[6], other_arrays[7], other_arrays[8],

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2],
            out_arrays[3], out_arrays[4], out_arrays[5],
            out_arrays[6], out_arrays[7], out_arrays[8]
        );
    }

    protected _div_number_in_place(num: number): void {
        this_arrays = this.arrays;

        divide_a_3x3_matrix_by_a_number_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            num
        );
    }

    protected _div_number_to_out(num: number, out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        divide_a_3x3_matrix_by_a_number_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            num,

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2],
            out_arrays[3], out_arrays[4], out_arrays[5],
            out_arrays[6], out_arrays[7], out_arrays[8]
        );
    }


    protected _transpose_to_out(out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        transpose_a_3x3_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2],
            out_arrays[3], out_arrays[4], out_arrays[5],
            out_arrays[6], out_arrays[7], out_arrays[8]
        );
    }

    protected _transpose_in_place(): void {
        this_arrays = this.arrays;

        transpose_a_3x3_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8]
        );
    }

    protected _invert_to_out(out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        invert_a_3x3_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2],
            out_arrays[3], out_arrays[4], out_arrays[5],
            out_arrays[6], out_arrays[7], out_arrays[8]
        );
    }

    protected _invert_in_place(): void {
        this_arrays = this.arrays;

        invert_a_3x3_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],
        );
    }

    protected _set_rotation_around_x(sin: number, cos: number): void {
        this_arrays = this.arrays;

        set_a_3x3_matrix_to_a_rotation_around_x_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            sin, cos
        );
    }

    protected _set_rotation_around_y(sin: number, cos: number): void {
        this_arrays = this.arrays;

        set_a_3x3_matrix_to_a_rotation_around_y_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            sin, cos
        );
    }

    protected _set_rotation_around_z(sin: number, cos: number): void {
        this_arrays = this.arrays;

        set_a_3x3_matrix_to_a_rotation_around_z_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            sin, cos
        );
    }

    protected _rotate_around_x_in_place(sin: number, cos: number): void {
        this_arrays = this.arrays;

        rotate_a_3x3_matrix_around_x_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            sin, cos
        );
    }

    protected _rotate_around_y_in_place(sin: number, cos: number): void {
        this_arrays = this.arrays;

        rotate_a_3x3_matrix_around_y_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            sin, cos
        );
    }

    protected _rotate_around_z_in_place(sin: number, cos: number): void {
        this_arrays = this.arrays;

        rotate_a_3x3_matrix_around_z_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            sin, cos
        );
    }

    protected _rotate_around_x_to_out(sin: number, cos: number, out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        rotate_a_3x3_matrix_around_x_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            sin, cos,

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2],
            out_arrays[3], out_arrays[4], out_arrays[5],
            out_arrays[6], out_arrays[7], out_arrays[8],
        );
    }

    protected _rotate_around_y_to_out(sin: number, cos: number, out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        rotate_a_3x3_matrix_around_y_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            sin, cos,

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2],
            out_arrays[3], out_arrays[4], out_arrays[5],
            out_arrays[6], out_arrays[7], out_arrays[8],
        );
    }

    protected _rotate_around_z_to_out(sin: number, cos: number, out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        rotate_a_3x3_matrix_around_z_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2],
            this_arrays[3], this_arrays[4], this_arrays[5],
            this_arrays[6], this_arrays[7], this_arrays[8],

            sin, cos,

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2],
            out_arrays[3], out_arrays[4], out_arrays[5],
            out_arrays[6], out_arrays[7], out_arrays[8],
        );
    }
}

export const mat3 = (
    m11: number = 0, m12: number = m11, m13: number = m11,
    m21: number = m11, m22: number = m11, m23: number = m11,
    m31: number = m11, m32: number = m11, m33: number = m11,
): Matrix3x3 => new Matrix3x3().setTo(
    m11, m12, m13,
    m21, m22, m23,
    m31, m32, m33
);