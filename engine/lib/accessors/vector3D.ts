import {Accessor, Vector} from "./accessor.js";
import {VECTOR_3D_ALLOCATOR} from "../memory/allocators.js";
import {
    add_a_3D_vector_to_another_3D_vector_in_place,
    add_a_3D_vector_to_another_3D_vector_to_out,
    add_a_number_to_a_3D_vector_in_place,
    add_a_number_to_a_3D_vector_to_out,
    check_if_two_3D_vectrs_are_equal,
    divide_a_3D_vector_by_a_number_in_place,
    divide_a_3D_vector_by_a_number_to_out,
    linearly_interpolate_from_a_3D_vectors_to_another_3D_vector_to_out,
    multiply_a_3D_vector_by_a_number_in_place,
    multiply_a_3D_vector_by_a_number_to_out,
    multiply_a_3D_vector_by_another_3D_vector_in_place,
    multiply_a_3D_vector_by_another_3D_vector_to_out,
    set_a_3D_vector_from_another_3D_vector,
    set_all_components_of_a_3D_vector_to_a_number,
    set_the_components_of_a_3D_vector,
    subtract_a_3D_vector_from_another_3D_vector_in_place,
    subtract_a_3D_vector_from_another_3D_vector_to_out,
    subtract_a_number_from_a_3D_vector_in_place,
    subtract_a_number_from_a_3D_vector_to_out
} from "../math/vec3.js";
import {I3D, IVector3D} from "../_interfaces/vectors.js";

let this_arrays,
    other_arrays,
    out_arrays: Float32Array[];

export default abstract class Vector3D<Other extends Accessor = Accessor>
    extends Vector<Other>
    implements IVector3D<Other>
{
    protected _getAllocator() {return VECTOR_3D_ALLOCATOR}

    set x(x: number) {this.arrays[0][this.id] = x}
    set y(y: number) {this.arrays[1][this.id] = y}
    set z(z: number) {this.arrays[2][this.id] = z}

    get x(): number {return this.arrays[0][this.id]}
    get y(): number {return this.arrays[1][this.id]}
    get z(): number {return this.arrays[2][this.id]}

    setTo(x: number, y: number, z: number): this {
        this_arrays = this.arrays;

        set_the_components_of_a_3D_vector(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            x, y, z
        );

        return this;
    }

    setAllTo(value: number): this {
        this_arrays = this.arrays;

        set_all_components_of_a_3D_vector_to_a_number(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            value
        );

        return this;
    }

    setFrom(other: Vector<Accessor & I3D>): this {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        set_a_3D_vector_from_another_3D_vector(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],
        );

        return this;
    }

    equals(other: Vector<Accessor & I3D>): boolean {
        this_arrays = this.arrays;
        other_arrays = other.arrays;

        return check_if_two_3D_vectrs_are_equal(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            other.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],
        );
    }

    iadd(num: number): this;
    iadd(other: Other): this;
    iadd(other_or_num: Other|number): this{
        this_arrays = this.arrays;

        if (typeof other_or_num === "number") {
            if (other_or_num)
                add_a_number_to_a_3D_vector_in_place(
                    this.id,
                    this_arrays[0],
                    this_arrays[1],
                    this_arrays[2],

                    other_or_num
                );
        } else {
            other_arrays = other_or_num.arrays;

            add_a_3D_vector_to_another_3D_vector_in_place(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                other_or_num.id,
                other_arrays[0],
                other_arrays[1],
                other_arrays[2],
            );
        }

        return this;
    }

    add(num: number, out: this): this;
    add(other: Other, out: this): this;
    add(other_or_num: Other|number, out: this): this {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        if (typeof other_or_num === "number") {
            if (other_or_num)
                add_a_number_to_a_3D_vector_to_out(
                    this.id,
                    this_arrays[0],
                    this_arrays[1],
                    this_arrays[2],

                    other_or_num,

                    out.id,
                    out_arrays[0],
                    out_arrays[1],
                    out_arrays[2]
                );
        } else {
            other_arrays = other_or_num.arrays;

            add_a_3D_vector_to_another_3D_vector_to_out(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                other_or_num.id,
                other_arrays[0],
                other_arrays[1],
                other_arrays[2],

                out.id,
                out_arrays[0],
                out_arrays[1],
                out_arrays[2],
            );
        }

        return out;
    }

    isub(num: number): this;
    isub(other: Other): this;
    isub(other_or_num: Other|number): this{
        this_arrays = this.arrays;

        if (typeof other_or_num === "number") {
            if (other_or_num)
                subtract_a_number_from_a_3D_vector_in_place(
                    this.id,
                    this_arrays[0],
                    this_arrays[1],
                    this_arrays[2],

                    other_or_num
                );
        } else {
            if (other_or_num.is(this))
                return this.setAllTo(0);

            other_arrays = other_or_num.arrays;

            subtract_a_3D_vector_from_another_3D_vector_in_place(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                other_or_num.id,
                other_arrays[0],
                other_arrays[1],
                other_arrays[2],
            );
        }

        return this;
    }

    sub(num: number, out: this): this;
    sub(other: Other, out: this): this;
    sub(other_or_num: Other|number, out: this): this {
        this_arrays = this.arrays;
        out_arrays = out.arrays;

        if (typeof other_or_num === "number") {
            if (other_or_num)
                subtract_a_number_from_a_3D_vector_to_out(
                    this.id,
                    this_arrays[0],
                    this_arrays[1],
                    this_arrays[2],

                    other_or_num,

                    out.id,
                    out_arrays[0],
                    out_arrays[1],
                    out_arrays[2]
            );
        } else {
            if (other_or_num.is(this))
                return out.setAllTo(0);

            other_arrays = other_or_num.arrays;

            subtract_a_3D_vector_from_another_3D_vector_to_out(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                other_or_num.id,
                other_arrays[0],
                other_arrays[1],
                other_arrays[2],

                other_or_num.id,
                other_arrays[0],
                other_arrays[1],
                other_arrays[2],
            );
        }

        return out;
    }

    idiv(denominator: number): this {
        if (denominator === 0)
            throw `Division by zero!`;
        else if (denominator === 1)
            return this;

        this_arrays = this.arrays;

        divide_a_3D_vector_by_a_number_in_place(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            denominator
        );

        return this;
    }

    div(denominator: number, out: this): this {
        if (denominator === 0)
            throw `Division by zero!`;
        else if (denominator === 1)
            return out;
        else if (out.is(this))
            return this.idiv(denominator);

        this_arrays = this.arrays;
        out_arrays = out.arrays;

        divide_a_3D_vector_by_a_number_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            denominator,

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2]
        );

        return out;
    }

    imul(num: number): this;
    imul(other: this): this;
    imul(other_or_num: this|number): this {
        if (typeof other_or_num === "number") {
            if (other_or_num) {
                if (other_or_num === 1)
                    return this;

                this_arrays = this.arrays;

                multiply_a_3D_vector_by_a_number_in_place(
                    this.id,
                    this_arrays[0],
                    this_arrays[1],
                    this_arrays[2],

                    other_or_num
                );
            } else
                this.setAllTo(0);
        } else {
            this_arrays = this.arrays;
            other_arrays = other_or_num.arrays;

            multiply_a_3D_vector_by_another_3D_vector_in_place(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                other_or_num.id,
                other_arrays[0],
                other_arrays[1],
                other_arrays[2],
            );
        }

        return this;
    }

    mul(num: number, out: this): this;
    mul(other: this, out: this): this;
    mul(other_or_num: this|number, out: this): this {
        if (typeof other_or_num === "number") {
            if (other_or_num) {
                if (other_or_num === 1)
                    return out;

                this_arrays = this.arrays;
                out_arrays = out.arrays;

                multiply_a_3D_vector_by_a_number_to_out(
                    this.id,
                    this_arrays[0],
                    this_arrays[1],
                    this_arrays[2],

                    other_or_num,

                    out.id,
                    out_arrays[0],
                    out_arrays[1],
                    out_arrays[2]
                );
            } else
                this.setAllTo(0);
        } else {
            if (out.is(this))
                return this.imul(other_or_num);

            this_arrays = this.arrays;
            other_arrays = other_or_num.arrays;

            multiply_a_3D_vector_by_another_3D_vector_to_out(
                this.id,
                this_arrays[0],
                this_arrays[1],
                this_arrays[2],

                other_or_num.id,
                other_arrays[0],
                other_arrays[1],
                other_arrays[2],

                out.id,
                out_arrays[0],
                out_arrays[1],
                out_arrays[2]
            );
        }

        return out;
    }


    lerp(to: this, by: number, out: this): this {
        this_arrays = this.arrays;
        out_arrays = out.arrays;
        other_arrays = to.arrays;

        linearly_interpolate_from_a_3D_vectors_to_another_3D_vector_to_out(
            this.id,
            this_arrays[0],
            this_arrays[1],
            this_arrays[2],

            to.id,
            other_arrays[0],
            other_arrays[1],
            other_arrays[2],

            by,

            out.id,
            out_arrays[0],
            out_arrays[1],
            out_arrays[2]
        );

        return out;
    }
}