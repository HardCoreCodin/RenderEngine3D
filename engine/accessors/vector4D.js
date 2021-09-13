import { Vector } from "./accessor.js";
import { add_a_4D_vector_to_another_4D_vector_in_place, add_a_4D_vector_to_another_4D_vector_to_out, add_a_number_to_a_4D_vector_in_place, add_a_number_to_a_4D_vector_to_out, check_if_two_4D_vectros_are_equal, divide_a_4D_vector_by_a_number_in_place, divide_a_4D_vector_by_a_number_to_out, linearly_interpolate_from_a_4D_vector_to_another_4D_vector_to_out, multiply_a_4D_vector_by_a_number_in_place, multiply_a_4D_vector_by_a_number_to_out, multiply_a_4D_vector_by_another_4D_vector_in_place, multiply_a_4D_vector_by_another_4D_vector_to_out, subtract_a_4D_vector_from_another_4D_vector_in_place, subtract_a_4D_vector_from_another_4D_vector_to_out, subtract_a_number_from_a_4D_vector_in_place, subtract_a_number_from_a_4D_vector_to_out } from "../core/math/vec4.js";
export default class Vector4D extends Vector {
    set x(x) { this.array[0] = x; if (this.on_change)
        this.on_change(this); }
    set y(y) { this.array[1] = y; if (this.on_change)
        this.on_change(this); }
    set z(z) { this.array[2] = z; if (this.on_change)
        this.on_change(this); }
    set w(w) { this.array[3] = w; if (this.on_change)
        this.on_change(this); }
    get x() { return this.array[0]; }
    get y() { return this.array[1]; }
    get z() { return this.array[2]; }
    get w() { return this.array[3]; }
    setTo(x, y, z, w) {
        this.array.set([x, y, z, w]);
        if (this.on_change)
            this.on_change(this);
        return this;
    }
    setAllTo(value) {
        this.array.fill(value);
        if (this.on_change)
            this.on_change(this);
        return this;
    }
    setFrom(other) {
        this.array.set(other.array);
        if (this.on_change)
            this.on_change(this);
        return this;
    }
    equals(other) {
        return check_if_two_4D_vectros_are_equal(this.array, other.array);
    }
    iadd(other_or_num) {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                add_a_number_to_a_4D_vector_in_place(this.array, other_or_num);
        }
        else {
            if (other_or_num.is(this))
                return this.setAllTo(0);
            add_a_4D_vector_to_another_4D_vector_in_place(this.array, other_or_num.array);
        }
        if (this.on_change)
            this.on_change(this);
        return this;
    }
    add(other_or_num, out) {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                add_a_number_to_a_4D_vector_to_out(this.array, other_or_num, out.array);
        }
        else {
            if (other_or_num.is(this))
                return out.setAllTo(0);
            add_a_4D_vector_to_another_4D_vector_to_out(this.array, other_or_num.array, out.array);
        }
        if (out.on_change)
            out.on_change(out);
        return out;
    }
    isub(other_or_num) {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                subtract_a_number_from_a_4D_vector_in_place(this.array, other_or_num);
        }
        else {
            if (other_or_num.is(this))
                return this.setAllTo(0);
            subtract_a_4D_vector_from_another_4D_vector_in_place(this.array, other_or_num.array);
        }
        if (this.on_change)
            this.on_change(this);
        return this;
    }
    sub(other_or_num, out) {
        if (typeof other_or_num === "number") {
            if (other_or_num)
                subtract_a_number_from_a_4D_vector_to_out(this.array, other_or_num, out.array);
        }
        else {
            if (other_or_num.is(this))
                return out.setAllTo(0);
            subtract_a_4D_vector_from_another_4D_vector_to_out(this.array, other_or_num.array, out.array);
        }
        if (out.on_change)
            out.on_change(out);
        return out;
    }
    idiv(denominator) {
        if (denominator === 0)
            throw `Division by zero!`;
        else if (denominator === 1)
            return this;
        divide_a_4D_vector_by_a_number_in_place(this.array, denominator);
        if (this.on_change)
            this.on_change(this);
        return this;
    }
    div(denominator, out) {
        if (denominator === 0)
            throw `Division by zero!`;
        else if (denominator === 1)
            return out;
        else if (out.is(this))
            return this.idiv(denominator);
        divide_a_4D_vector_by_a_number_to_out(this.array, denominator, out.array);
        if (out.on_change)
            out.on_change(out);
        return out;
    }
    imul(other_or_num) {
        if (typeof other_or_num === "number") {
            if (other_or_num) {
                if (other_or_num === 1)
                    return this;
                multiply_a_4D_vector_by_a_number_in_place(this.array, other_or_num);
            }
            else
                return this.setAllTo(0);
        }
        else
            multiply_a_4D_vector_by_another_4D_vector_in_place(this.array, other_or_num.array);
        if (this.on_change)
            this.on_change(this);
        return this;
    }
    mul(other_or_num, out) {
        if (typeof other_or_num === "number") {
            if (other_or_num) {
                if (other_or_num === 1)
                    return this;
                multiply_a_4D_vector_by_a_number_to_out(this.array, other_or_num, out.array);
            }
            else
                out.setAllTo(0);
        }
        else {
            if (out.is(this))
                return this.imul(other_or_num);
            multiply_a_4D_vector_by_another_4D_vector_to_out(this.array, other_or_num.array, out.array);
        }
        if (out.on_change)
            out.on_change(out);
        return out;
    }
    lerp(to, by, out) {
        linearly_interpolate_from_a_4D_vector_to_another_4D_vector_to_out(this.array, to.array, by, out.array);
        if (out.on_change)
            out.on_change(out);
        return out;
    }
}
//# sourceMappingURL=vector4D.js.map