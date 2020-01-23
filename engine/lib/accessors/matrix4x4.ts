import {Matrix3x3} from "./matrix3x3.js";
import {Position3D} from "./position.js";
import {Direction3D} from "./direction.js";
import {RotationMatrix} from "./matrix.js";
import {Float32Allocator16D, MATRIX_4X4_ALLOCATOR} from "../memory/allocators.js";
import {
    add_a_4x4_matrix_to_another_4x4_matrix_in_place,
    add_a_4x4_matrix_to_another_4x4_matrix_to_out,
    add_a_number_to_a_4x4_matrix_in_place,
    add_a_number_to_a_4x4_matrix_to_out,
    check_if_a_4x4_matrix_is_the_identity_matrix,
    check_if_two_4x4_matrices_are_equal,
    divide_a_4x4_matrix_by_a_number_in_place,
    divide_a_4x4_matrix_by_a_number_to_out,
    invert_a_4x4_matrix_in_place,
    invert_a_4x4_matrix_to_out,
    multiply_a_4x4_matrix_by_a_number_in_place,
    multiply_a_4x4_matrix_by_a_number_to_out,
    multiply_a_4x4_matrix_by_another_4x4_matrix_in_place,
    multiply_a_4x4_matrix_by_another_4x4_matrix_to_out,
    rotate_a_4x4_matrix_around_x_in_place,
    rotate_a_4x4_matrix_around_x_to_out,
    rotate_a_4x4_matrix_around_y_in_place,
    rotate_a_4x4_matrix_around_y_to_out,
    rotate_a_4x4_matrix_around_z_in_place,
    rotate_a_4x4_matrix_around_z_to_out,
    set_a_4x4_matrix_from_another_4x4_matrix,
    set_a_4x4_matrix_to_a_rotation_around_x_in_place,
    set_a_4x4_matrix_to_a_rotation_around_y_in_place,
    set_a_4x4_matrix_to_a_rotation_around_z_in_place,
    set_a_4x4_matrix_to_the_identity_matrix,
    set_all_components_of_a_4x4_matrix_to_a_number,
    set_the_components_of_a_4x4_matrix,
    subtract_a_4x4_matrix_from_another_4x4_matrix_in_place,
    subtract_a_4x4_matrix_from_another_4x4_matrix_to_out,
    subtract_a_number_from_a_4x4_matrix_in_place,
    subtract_a_number_from_a_4x4_matrix_to_out,
    transpose_a_4x4_matrix_in_place,
    transpose_a_4x4_matrix_to_out
} from "../math/mat4.js";
import {IMatrix4x4} from "../_interfaces/matrix.js";
import {Float16} from "../../types.js";

let this_arrays,
    other_arrays,
    out_arrays: Float32Array[];

export class Matrix4x4 extends RotationMatrix implements IMatrix4x4 {
    protected _getAllocator(): Float32Allocator16D {return MATRIX_4X4_ALLOCATOR}

    readonly mat3: Matrix3x3;
    readonly translation: Position3D;
    readonly scale: Direction3D;

    readonly x_axis: Direction3D;
    readonly y_axis: Direction3D;
    readonly z_axis: Direction3D;

    constructor(id?: number, arrays?: Float16) {
        super(id, arrays);

        this.x_axis = new Direction3D(this.id, [this.arrays[0], this.arrays[1], this.arrays[2]]);
        this.y_axis = new Direction3D(this.id, [this.arrays[4], this.arrays[5], this.arrays[6]]);
        this.z_axis = new Direction3D(this.id, [this.arrays[8], this.arrays[9], this.arrays[10]]);

        this.translation = new Position3D(this.id, [this.arrays[12], this.arrays[13], this.arrays[14]]);
        this.scale = new Direction3D(this.id, [this.arrays[0], this.arrays[5], this.arrays[10]]);
        this.mat3 = new Matrix3x3(this.id, [
            this.arrays[0], this.arrays[1], this.arrays[2],
            this.arrays[4], this.arrays[5], this.arrays[6],
            this.arrays[8], this.arrays[9], this.arrays[10]
        ]);
    }

    set m11(m11: number) {this.arrays[0][this.id] = m11}
    set m12(m12: number) {this.arrays[1][this.id] = m12}
    set m13(m13: number) {this.arrays[2][this.id] = m13}
    set m14(m14: number) {this.arrays[3][this.id] = m14}

    set m21(m21: number) {this.arrays[4][this.id] = m21}
    set m22(m22: number) {this.arrays[5][this.id] = m22}
    set m23(m23: number) {this.arrays[6][this.id] = m23}
    set m24(m24: number) {this.arrays[7][this.id] = m24}

    set m31(m31: number) {this.arrays[8][this.id] = m31}
    set m32(m32: number) {this.arrays[9][this.id] = m32}
    set m33(m33: number) {this.arrays[10][this.id] = m33}
    set m34(m34: number) {this.arrays[11][this.id] = m34}

    set m41(m41: number) {this.arrays[12][this.id] = m41}
    set m42(m42: number) {this.arrays[13][this.id] = m42}
    set m43(m43: number) {this.arrays[14][this.id] = m43}
    set m44(m44: number) {this.arrays[15][this.id] = m44}

    get m11(): number {return this.arrays[0][this.id]}
    get m12(): number {return this.arrays[1][this.id]}
    get m13(): number {return this.arrays[2][this.id]}
    get m14(): number {return this.arrays[3][this.id]}

    get m21(): number {return this.arrays[4][this.id]}
    get m22(): number {return this.arrays[5][this.id]}
    get m23(): number {return this.arrays[6][this.id]}
    get m24(): number {return this.arrays[7][this.id]}

    get m31(): number {return this.arrays[8][this.id]}
    get m32(): number {return this.arrays[9][this.id]}
    get m33(): number {return this.arrays[10][this.id]}
    get m34(): number {return this.arrays[11][this.id]}

    get m41(): number {return this.arrays[12][this.id]}
    get m42(): number {return this.arrays[13][this.id]}
    get m43(): number {return this.arrays[14][this.id]}
    get m44(): number {return this.arrays[15][this.id]}

    setTo(
        m11: number, m12: number, m13: number, m14: number,
        m21: number, m22: number, m23: number, m24: number,
        m31: number, m32: number, m33: number, m34: number,
        m41: number, m42: number, m43: number, m44: number
    ): this {
        this_arrays = this.arrays;

        set_the_components_of_a_4x4_matrix(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        );

        return this;
    }

    get is_identity(): boolean {
        this_arrays = this.arrays;

        return check_if_a_4x4_matrix_is_the_identity_matrix(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15]
        );
    }

    copy(out: Matrix4x4 = new Matrix4x4()): Matrix4x4 {
        return out.setFrom(this);
    }

    setToIdentity(): this {
        this_arrays = this.arrays;

        set_a_4x4_matrix_to_the_identity_matrix(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15]
        );

        return this;
    }

    setAllTo(value: number): this {
        this_arrays = this.arrays;

        set_all_components_of_a_4x4_matrix_to_a_number(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            value
        );

        return this;
    }

    setFrom(other: Matrix4x4): Matrix4x4 {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        set_a_4x4_matrix_from_another_4x4_matrix(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            other.id,
            other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
            other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[7],
            other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
            other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15],

        );

        return this;
    }

    equals(other: Matrix4x4): boolean {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return check_if_two_4x4_matrices_are_equal(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            other.id,
            other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
            other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[7],
            other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
            other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15]
        );
    }

    protected _add_number_in_place(num: number): void {
        this_arrays = this.arrays;

        add_a_number_to_a_4x4_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            num
        );
    }

    protected _add_other_in_place(other: Matrix4x4): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        add_a_4x4_matrix_to_another_4x4_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            other.id,
            other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
            other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[7],
            other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
            other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15],
        );
    }

    protected _add_number_to_out(num: number, out: Matrix4x4): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        add_a_number_to_a_4x4_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            num,

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2], out_arrays[3],
            out_arrays[4], out_arrays[5], out_arrays[6], out_arrays[7],
            out_arrays[8], out_arrays[9], out_arrays[10], out_arrays[11],
            out_arrays[12], out_arrays[13], out_arrays[14], out_arrays[15]
        );
    }

    protected _add_other_to_out(other: Matrix4x4, out: Matrix4x4): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        add_a_4x4_matrix_to_another_4x4_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            other.id,
            other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
            other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[7],
            other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
            other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15],

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2], out_arrays[3],
            out_arrays[4], out_arrays[5], out_arrays[6], out_arrays[7],
            out_arrays[8], out_arrays[9], out_arrays[10], out_arrays[11],
            out_arrays[12], out_arrays[13], out_arrays[14], out_arrays[15]
        );
    }

    protected _sub_number_in_place(num: number): void {
        this_arrays = this.arrays;

        subtract_a_number_from_a_4x4_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            num
        );
    }

    protected _sub_other_in_place(other: Matrix4x4): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        subtract_a_4x4_matrix_from_another_4x4_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            other.id,
            other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
            other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[7],
            other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
            other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15]
        );
    }

    protected _sub_number_to_out(num: number, out: Matrix4x4): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        subtract_a_number_from_a_4x4_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            num,

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2], out_arrays[3],
            out_arrays[4], out_arrays[5], out_arrays[6], out_arrays[7],
            out_arrays[8], out_arrays[9], out_arrays[10], out_arrays[11],
            out_arrays[12], out_arrays[13], out_arrays[14], out_arrays[15]
        );
    }

    protected _sub_other_to_out(other: Matrix4x4, out: Matrix4x4): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        subtract_a_4x4_matrix_from_another_4x4_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            other.id,
            other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
            other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[7],
            other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
            other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15],

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2], out_arrays[3],
            out_arrays[4], out_arrays[5], out_arrays[6], out_arrays[7],
            out_arrays[8], out_arrays[9], out_arrays[10], out_arrays[11],
            out_arrays[12], out_arrays[13], out_arrays[14], out_arrays[15]
        );
    }

    protected _mul_number_in_place(num: number): void {
        this_arrays = this.arrays;

        multiply_a_4x4_matrix_by_a_number_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            num
        );
    }

    protected _mul_other_in_place(other: this): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        multiply_a_4x4_matrix_by_another_4x4_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            other.id,
            other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
            other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[7],
            other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
            other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15]
        );
    }

    protected _mul_number_to_out(num: number, out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        multiply_a_4x4_matrix_by_a_number_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            num,

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2], out_arrays[3],
            out_arrays[4], out_arrays[5], out_arrays[6], out_arrays[7],
            out_arrays[8], out_arrays[9], out_arrays[10], out_arrays[11],
            out_arrays[12], out_arrays[13], out_arrays[14], out_arrays[15]
        );
    }

    protected _mul_other_to_out(other: this, out: this): void {
        this_arrays = this.arrays;
        other_arrays = other.arrays;
        out_arrays = out.arrays;

        multiply_a_4x4_matrix_by_another_4x4_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            other.id,
            other_arrays[0], other_arrays[1], other_arrays[2], other_arrays[3],
            other_arrays[4], other_arrays[5], other_arrays[6], other_arrays[7],
            other_arrays[8], other_arrays[9], other_arrays[10], other_arrays[11],
            other_arrays[12], other_arrays[13], other_arrays[14], other_arrays[15],

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2], out_arrays[3],
            out_arrays[4], out_arrays[5], out_arrays[6], out_arrays[7],
            out_arrays[8], out_arrays[9], out_arrays[10], out_arrays[11],
            out_arrays[12], out_arrays[13], out_arrays[14], out_arrays[15]
        );
    }

    protected _div_number_in_place(num: number): void {
        this_arrays = this.arrays;

        divide_a_4x4_matrix_by_a_number_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            num
        );
    }

    protected _div_number_to_out(num: number, out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        divide_a_4x4_matrix_by_a_number_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            num,

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2], out_arrays[3],
            out_arrays[4], out_arrays[5], out_arrays[6], out_arrays[7],
            out_arrays[8], out_arrays[9], out_arrays[10], out_arrays[11],
            out_arrays[12], out_arrays[13], out_arrays[14], out_arrays[15]
        );
    }


    protected _transpose_to_out(out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        transpose_a_4x4_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2], out_arrays[3],
            out_arrays[4], out_arrays[5], out_arrays[6], out_arrays[7],
            out_arrays[8], out_arrays[9], out_arrays[10], out_arrays[11],
            out_arrays[12], out_arrays[13], out_arrays[14], out_arrays[15]
        );
    }

    protected _transpose_in_place(): void {
        this_arrays = this.arrays;

        transpose_a_4x4_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15]
        );
    }

    protected _invert_to_out(out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        invert_a_4x4_matrix_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2], out_arrays[3],
            out_arrays[4], out_arrays[5], out_arrays[6], out_arrays[7],
            out_arrays[8], out_arrays[9], out_arrays[10], out_arrays[11],
            out_arrays[12], out_arrays[13], out_arrays[14], out_arrays[15]
        );
    }

    protected _invert_in_place(): void {
        this_arrays = this.arrays;

        invert_a_4x4_matrix_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15]
        );
    }

    protected _set_rotation_around_x(sin: number, cos: number): void {
        this_arrays = this.arrays;

        set_a_4x4_matrix_to_a_rotation_around_x_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            sin, cos
        );
    }

    protected _set_rotation_around_y(sin: number, cos: number): void {
        this_arrays = this.arrays;

        set_a_4x4_matrix_to_a_rotation_around_y_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            sin, cos
        );
    }

    protected _set_rotation_around_z(sin: number, cos: number): void {
        this_arrays = this.arrays;

        set_a_4x4_matrix_to_a_rotation_around_z_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            sin, cos
        );
    }

    protected _rotate_around_x_in_place(sin: number, cos: number): void {
        this_arrays = this.arrays;

        rotate_a_4x4_matrix_around_x_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            sin, cos
        );
    }

    protected _rotate_around_y_in_place(sin: number, cos: number): void {
        this_arrays = this.arrays;

        rotate_a_4x4_matrix_around_y_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            sin, cos
        );
    }

    protected _rotate_around_z_in_place(sin: number, cos: number): void {
        this_arrays = this.arrays;

        rotate_a_4x4_matrix_around_z_in_place(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            sin, cos
        );
    }

    protected _rotate_around_x_to_out(sin: number, cos: number, out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        rotate_a_4x4_matrix_around_x_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            sin, cos,

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2], out_arrays[3],
            out_arrays[4], out_arrays[5], out_arrays[6], out_arrays[7],
            out_arrays[8], out_arrays[9], out_arrays[10], out_arrays[11],
            out_arrays[12], out_arrays[13], out_arrays[14], out_arrays[15]
        );
    }

    protected _rotate_around_y_to_out(sin: number, cos: number, out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        rotate_a_4x4_matrix_around_y_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            sin, cos,

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2], out_arrays[3],
            out_arrays[4], out_arrays[5], out_arrays[6], out_arrays[7],
            out_arrays[8], out_arrays[9], out_arrays[10], out_arrays[11],
            out_arrays[12], out_arrays[13], out_arrays[14], out_arrays[15]
        );
    }

    protected _rotate_around_z_to_out(sin: number, cos: number, out: this): void {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        rotate_a_4x4_matrix_around_z_to_out(
            this.id,
            this_arrays[0], this_arrays[1], this_arrays[2], this_arrays[3],
            this_arrays[4], this_arrays[5], this_arrays[6], this_arrays[7],
            this_arrays[8], this_arrays[9], this_arrays[10], this_arrays[11],
            this_arrays[12], this_arrays[13], this_arrays[14], this_arrays[15],

            sin, cos,

            out.id,
            out_arrays[0], out_arrays[1], out_arrays[2], out_arrays[3],
            out_arrays[4], out_arrays[5], out_arrays[6], out_arrays[7],
            out_arrays[8], out_arrays[9], out_arrays[10], out_arrays[11],
            out_arrays[12], out_arrays[13], out_arrays[14], out_arrays[15]
        );
    }

    toString(): string {
        const a = this.arrays;
        const i = this.id;
        return `
${a[0][i]} ${a[1][i]} ${a[2][i]} ${a[3][i]}
${a[4][i]} ${a[5][i]} ${a[6][i]} ${a[7][i]}
${a[8][i]} ${a[9][i]} ${a[10][i]} ${a[11][i]}
${a[12][i]} ${a[13][i]} ${a[14][i]} ${a[15][i]}`;
    }
}

export const mat4 = (
    m11: number = 0, m12: number = m11, m13: number = m11, m14: number = m11,
    m21: number = m11, m22: number = m11, m23: number = m11, m24: number = m11,
    m31: number = m11, m32: number = m11, m33: number = m11, m34: number = m11,
    m41: number = m11, m42: number = m11, m43: number = m11, m44: number = m11
): Matrix4x4 => new Matrix4x4().setTo(
    m11, m12, m13, m14,
    m21, m22, m23, m24,
    m31, m32, m33, m34,
    m41, m42, m43, m44
);