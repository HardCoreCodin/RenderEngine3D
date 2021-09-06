import { Vector } from "./accessor.js";
import { VECTOR_2D_ALLOCATOR } from "../memory/allocators.js";
import { add_a_2D_vector_to_another_2D_vector_in_place, add_a_2D_vector_to_another_2D_vector_to_out, add_a_number_to_a_2D_vector_in_place, add_a_number_to_a_2D_vector_to_out, check_if_two_2D_vectrs_are_equal, divide_a_2D_vector_by_a_number_in_place, divide_a_2D_vector_by_a_number_to_out, linearly_interpolate_from_a_2D_vectors_to_another_2D_vector_to_out, multiply_a_2D_vector_by_a_number_in_place, multiply_a_2D_vector_by_a_number_to_out, multiply_a_2D_vector_by_another_2D_vector_in_place, multiply_a_2D_vector_by_another_2D_vector_to_out, subtract_a_2D_vector_from_another_2D_vector_in_place, subtract_a_2D_vector_from_another_2D_vector_to_out, subtract_a_number_from_a_2D_vector_in_place, subtract_a_number_from_a_2D_vector_to_out } from "../math/vec2.js";
export default class Vector2D extends Vector {
    _getAllocator() { return VECTOR_2D_ALLOCATOR; }
    set x(x) { this.array[0] = x; }
    set y(y) { this.array[1] = y; }
    get x() { return this.array[0]; }
    get y() { return this.array[1]; }
    setTo(x, y) {
        this.array[0] = x;
        this.array[1] = y;
        return this;
    }
    setAllTo(value) {
        this.array.fill(value);
        return this;
    }
    setFrom(other) {
        this.array.set(other.array);
        return this;
    }
    equals(other) {
        return check_if_two_2D_vectrs_are_equal(this.array, other.array);
    }
    iadd(other_or_num) {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                add_a_number_to_a_2D_vector_in_place(this.array, other_or_num);
        }
        else
            add_a_2D_vector_to_another_2D_vector_in_place(this.array, other_or_num.array);
        return this;
    }
    add(other_or_num, out) {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                add_a_number_to_a_2D_vector_to_out(this.array, other_or_num, out.array);
        }
        else
            add_a_2D_vector_to_another_2D_vector_to_out(this.array, other_or_num.array, out.array);
        return out;
    }
    isub(other_or_num) {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                subtract_a_number_from_a_2D_vector_in_place(this.array, other_or_num);
        }
        else {
            if (other_or_num.is(this))
                return this.setAllTo(0);
            subtract_a_2D_vector_from_another_2D_vector_in_place(this.array, other_or_num.array);
        }
        return this;
    }
    sub(other_or_num, out) {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                subtract_a_number_from_a_2D_vector_to_out(this.array, other_or_num, out.array);
        }
        else {
            if (other_or_num.is(this))
                return out.setAllTo(0);
            subtract_a_2D_vector_from_another_2D_vector_to_out(this.array, other_or_num.array, out.array);
        }
        return out;
    }
    idiv(denominator) {
        if (denominator === 0)
            throw `Division by zero!`;
        else if (denominator === 1)
            return this;
        divide_a_2D_vector_by_a_number_in_place(this.array, denominator);
        return this;
    }
    div(denominator, out) {
        if (denominator === 0)
            throw `Division by zero!`;
        else if (denominator === 1)
            return out;
        else if (out.is(this))
            return this.idiv(denominator);
        divide_a_2D_vector_by_a_number_to_out(this.array, denominator, out.array);
        return out;
    }
    imul(other_or_num) {
        if (typeof other_or_num === "number") {
            if (other_or_num) {
                if (other_or_num === 1)
                    return this;
                multiply_a_2D_vector_by_a_number_in_place(this.array, other_or_num);
            }
            else
                this.setAllTo(0);
        }
        else
            multiply_a_2D_vector_by_another_2D_vector_in_place(this.array, other_or_num.array);
        return this;
    }
    mul(other_or_num, out) {
        if (typeof other_or_num === "number") {
            if (other_or_num) {
                if (other_or_num === 1)
                    return out;
                multiply_a_2D_vector_by_a_number_to_out(this.array, other_or_num, out.array);
            }
            else
                out.setAllTo(0);
        }
        else {
            if (out.is(this))
                return this.imul(other_or_num);
            multiply_a_2D_vector_by_another_2D_vector_to_out(this.array, other_or_num.array, out.array);
        }
        return out;
    }
    lerp(to, by, out) {
        linearly_interpolate_from_a_2D_vectors_to_another_2D_vector_to_out(this.array, to.array, by, out.array);
        return out;
    }
}
//# sourceMappingURL=vector2D.js.map