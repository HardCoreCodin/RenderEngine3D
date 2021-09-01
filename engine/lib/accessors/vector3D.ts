import {Accessor, Vector} from "./accessor.js";
import {VECTOR_3D_ALLOCATOR} from "../memory/allocators.js";
import {
    add_a_3D_vector_to_another_3D_vector_in_place,
    add_a_3D_vector_to_another_3D_vector_to_out,
    add_a_number_to_a_3D_vector_in_place,
    add_a_number_to_a_3D_vector_to_out,
    check_if_two_3D_vectors_are_equal,
    divide_a_3D_vector_by_a_number_in_place,
    divide_a_3D_vector_by_a_number_to_out,
    linearly_interpolate_from_a_3D_vector_to_another_3D_vector_to_out,
    multiply_a_3D_vector_by_a_number_in_place,
    multiply_a_3D_vector_by_a_number_to_out,
    multiply_a_3D_vector_by_another_3D_vector_in_place,
    multiply_a_3D_vector_by_another_3D_vector_to_out,
    subtract_a_3D_vector_from_another_3D_vector_in_place,
    subtract_a_3D_vector_from_another_3D_vector_to_out,
    subtract_a_number_from_a_3D_vector_in_place,
    subtract_a_number_from_a_3D_vector_to_out
} from "../math/vec3.js";
import {I3D, IVector3D} from "../_interfaces/vectors.js";

export default abstract class Vector3D<Other extends Accessor = Accessor>
    extends Vector<Other>
    implements IVector3D<Other>
{
    protected _getAllocator() {return VECTOR_3D_ALLOCATOR}

    set x(x: number) {this.array[0] = x}
    set y(y: number) {this.array[1] = y}
    set z(z: number) {this.array[2] = z}

    get x(): number {return this.array[0]}
    get y(): number {return this.array[1]}
    get z(): number {return this.array[2]}

    setTo(x: number, y: number, z: number): this {
        this.array[0] = x;
        this.array[1] = y;
        this.array[2] = z;
        return this;
    }

    setAllTo(value: number): this {
        this.array.fill(value);
        return this;
    }

    setFrom(other: Vector<Accessor & I3D>): this {
        this.array.set(other.array);
        return this;
    }

    equals(other: Vector<Accessor & I3D>): boolean {
        return check_if_two_3D_vectors_are_equal(this.array, other.array);
    }

    iadd(num: number): this;
    iadd(other: Other): this;
    iadd(other_or_num: Other|number): this{
        if (typeof other_or_num === "number") {
            if (other_or_num)
                add_a_number_to_a_3D_vector_in_place(this.array, other_or_num);
        } else
            add_a_3D_vector_to_another_3D_vector_in_place(this.array, other_or_num.array);

        return this;
    }

    add(num: number, out: this): this;
    add(other: Other, out: this): this;
    add(other_or_num: Other|number, out: this): this {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                add_a_number_to_a_3D_vector_to_out(this.array, other_or_num, out.array);
        } else
            add_a_3D_vector_to_another_3D_vector_to_out(this.array, other_or_num.array, out.array);

        return out;
    }

    isub(num: number): this;
    isub(other: Other): this;
    isub(other_or_num: Other|number): this{
        if (typeof other_or_num === "number") {
            if (other_or_num)
                subtract_a_number_from_a_3D_vector_in_place(this.array, other_or_num);
        } else {
            if (other_or_num.is(this))
                return this.setAllTo(0);

            subtract_a_3D_vector_from_another_3D_vector_in_place(this.array, other_or_num.array);
        }

        return this;
    }

    sub(num: number, out: this): this;
    sub(other: Other, out: this): this;
    sub(other_or_num: Other|number, out: this): this {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                subtract_a_number_from_a_3D_vector_to_out(this.array, other_or_num, out.array);
        } else {
            if (other_or_num.is(this))
                return out.setAllTo(0);

            subtract_a_3D_vector_from_another_3D_vector_to_out(this.array, other_or_num.array, other_or_num.array);
        }

        return out;
    }

    idiv(denominator: number): this {
        if (denominator === 0)
            throw `Division by zero!`;
        else if (denominator === 1)
            return this;

        divide_a_3D_vector_by_a_number_in_place(this.array, denominator);
        return this;
    }

    div(denominator: number, out: this): this {
        if (denominator === 0)
            throw `Division by zero!`;
        else if (denominator === 1)
            return out;
        else if (out.is(this))
            return this.idiv(denominator);

        divide_a_3D_vector_by_a_number_to_out(this.array, denominator, out.array);
        return out;
    }

    imul(num: number): this;
    imul(other: this): this;
    imul(other_or_num: this|number): this {
        if (typeof other_or_num === "number") {
            if (other_or_num) {
                if (other_or_num === 1)
                    return this;

                multiply_a_3D_vector_by_a_number_in_place(this.array, other_or_num);
            } else
                this.setAllTo(0);
        } else
            multiply_a_3D_vector_by_another_3D_vector_in_place(this.array, other_or_num.array);

        return this;
    }

    mul(num: number, out: this): this;
    mul(other: this, out: this): this;
    mul(other_or_num: this|number, out: this): this {
        if (typeof other_or_num === "number") {
            if (other_or_num) {
                if (other_or_num === 1)
                    return out;

                multiply_a_3D_vector_by_a_number_to_out(this.array, other_or_num, out.array);
            } else
                out.setAllTo(0);
        } else {
            if (out.is(this))
                return out.imul(other_or_num);

            multiply_a_3D_vector_by_another_3D_vector_to_out(this.array, other_or_num.array, out.array);
        }

        return out;
    }


    lerp(to: this, by: number, out: this): this {
        linearly_interpolate_from_a_3D_vector_to_another_3D_vector_to_out(this.array, to.array, by, out.array);
        return out;
    }
}