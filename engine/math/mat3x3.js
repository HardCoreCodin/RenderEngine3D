import { PRECISION_DIGITS } from "../constants.js";
import { Direction3D, Position3D } from "./vec3.js";
import { Matrix3x3Allocator } from "../allocators.js";
let t11, t12, t13, t21, t22, t23, t31, t32, t33, sin, cos, out_id, this_id, other_id;
let a11, a12, a13, a21, a22, a23, a31, a32, a33, b11, b12, b13, b21, b22, b23, b31, b32, b33, o11, o12, o13, o21, o22, o23, o31, o32, o33;
const set_to_identity = (a) => {
    a11[a] = a22[a] = a33[a] = 1;
    a12[a] = a13[a] = a22[a] = a23[a] = a31[a] = a32[a] = 0;
};
const invert = (a, o) => {
    o13[o] = a13[a];
    o11[o] = a11[a];
    o23[o] = a23[a];
    o22[o] = a22[a];
    // Transpose the rotation portion of the matrix: 
    o12[o] = a21[a];
    o21[o] = a12[a];
    o31[o] = -(a31[a] * a11[a] + a32[a] * a12[a]); // -Dot(original_translation, original_rotation_x)
    o32[o] = -(a31[a] * a21[a] + a32[a] * a22[a]); // -Dot(original_translation, original_rotation_y)
    o33[o] = 1;
};
const invert_in_place = (a) => {
    // Store the rotation and translation portions of the matrix in temporary variables:
    t11 = a11[a];
    t21 = a21[a];
    t31 = a31[a];
    t12 = a12[a];
    t22 = a22[a];
    t32 = a32[a];
    // Transpose the rotation portion of the matrix:
    a12[a] = t21[a];
    a21[a] = t12[a];
    // Dot the translation portion of the matrix with the original rotation portion, and invert the results:
    a31[a] = -(t31 * t11 + t32 * t12); // -Dot(original_translation, original_rotation_x)
    a32[a] = -(t31 * t21 + t32 * t22); // -Dot(original_translation, original_rotation_y)
    a33[a] = 1;
};
const transpose = (a, o) => {
    o11[o] = a11[a];
    o21[o] = a12[a];
    o31[o] = a13[a];
    o12[o] = a21[a];
    o22[o] = a22[a];
    o32[o] = a23[a];
    o13[o] = a31[a];
    o23[o] = a32[a];
    o33[o] = a33[a];
};
const transpose_in_place = (a) => {
    [
        a12[a], a13[a], a21[a], a23[a], a31[a], a32[a]
    ] = [
        a21[a], a31[a], a12[a], a32[a], a13[a], a23[a]
    ];
};
const equals = (a, b) => a11[a].toFixed(PRECISION_DIGITS) ===
    b11[b].toFixed(PRECISION_DIGITS) &&
    a12[a].toFixed(PRECISION_DIGITS) ===
        b12[b].toFixed(PRECISION_DIGITS) &&
    a13[a].toFixed(PRECISION_DIGITS) ===
        b13[b].toFixed(PRECISION_DIGITS) &&
    a21[a].toFixed(PRECISION_DIGITS) ===
        b21[b].toFixed(PRECISION_DIGITS) &&
    a22[a].toFixed(PRECISION_DIGITS) ===
        b22[b].toFixed(PRECISION_DIGITS) &&
    a23[a].toFixed(PRECISION_DIGITS) ===
        b23[b].toFixed(PRECISION_DIGITS) &&
    a31[a].toFixed(PRECISION_DIGITS) ===
        b31[b].toFixed(PRECISION_DIGITS) &&
    a32[a].toFixed(PRECISION_DIGITS) ===
        b32[b].toFixed(PRECISION_DIGITS) &&
    a33[a].toFixed(PRECISION_DIGITS) ===
        b33[b].toFixed(PRECISION_DIGITS);
const same = (a, b) => a === b &&
    (Object.is(a11, b11) || (Object.is(a11.buffer, b11.buffer) && a11.offset == b11.offset)) &&
    (Object.is(a12, b12) || (Object.is(a12.buffer, b12.buffer) && a12.offset == b12.offset)) &&
    (Object.is(a13, b13) || (Object.is(a13.buffer, b13.buffer) && a13.offset == b13.offset)) &&
    (Object.is(a21, b21) || (Object.is(a21.buffer, b21.buffer) && a21.offset == b21.offset)) &&
    (Object.is(a22, b22) || (Object.is(a22.buffer, b22.buffer) && a22.offset == b22.offset)) &&
    (Object.is(a23, b23) || (Object.is(a23.buffer, b23.buffer) && a23.offset == b23.offset)) &&
    (Object.is(a31, b31) || (Object.is(a31.buffer, b31.buffer) && a31.offset == b31.offset)) &&
    (Object.is(a32, b32) || (Object.is(a32.buffer, b32.buffer) && a32.offset == b32.offset)) &&
    (Object.is(a33, b33) || (Object.is(a33.buffer, b33.buffer) && a33.offset == b33.offset));
const is_identity = (a) => a11[a] === 1 && a21[a] === 0 && a31[a] === 0 &&
    a12[a] === 0 && a22[a] === 1 && a32[a] === 0 &&
    a13[a] === 0 && a23[a] === 0 && a33[a] === 1;
const add = (a, b, o) => {
    o11[o] = a11[a] + b11[b];
    o21[o] = a21[a] + b21[b];
    o31[o] = a31[a] + b31[b];
    o12[o] = a12[a] + b12[b];
    o22[o] = a22[a] + b22[b];
    o32[o] = a32[a] + b32[b];
    o13[o] = a13[a] + b13[b];
    o23[o] = a23[a] + b23[b];
    o33[o] = a33[a] + b33[b];
};
const add_in_place = (a, b) => {
    a11[a] += b11[b];
    a21[a] += b21[b];
    a31[a] += b31[b];
    a12[a] += b12[b];
    a22[a] += b22[b];
    a32[a] += b32[b];
    a13[a] += b13[b];
    a23[a] += b23[b];
    a33[a] += b33[b];
};
const subtract = (a, b, o) => {
    o11[o] = a11[a] - b11[b];
    o21[o] = a21[a] - b21[b];
    o31[o] = a31[a] - b31[b];
    o12[o] = a12[a] - b12[b];
    o22[o] = a22[a] - b22[b];
    o32[o] = a32[a] - b32[b];
    o13[o] = a13[a] - b13[b];
    o23[o] = a23[a] - b23[b];
    o33[o] = a33[a] - b33[b];
};
const subtract_in_place = (a, b) => {
    a11[a] -= b11[b];
    a21[a] -= b21[b];
    a31[a] -= b31[b];
    a12[a] -= b12[b];
    a22[a] -= b22[b];
    a32[a] -= b32[b];
    a13[a] -= b13[b];
    a23[a] -= b23[b];
    a33[a] -= b33[b];
};
const divide = (a, o, n) => {
    o11[o] = a11[a] / n;
    o21[o] = a21[a] / n;
    o31[o] = a31[a] / n;
    o12[o] = a12[a] / n;
    o22[o] = a22[a] / n;
    o32[o] = a32[a] / n;
    o13[o] = a13[a] / n;
    o23[o] = a23[a] / n;
    o33[o] = a33[a] / n;
};
const divide_in_place = (a, n) => {
    a11[a] /= n;
    a21[a] /= n;
    a31[a] /= n;
    a12[a] /= n;
    a22[a] /= n;
    a32[a] /= n;
    a13[a] /= n;
    a23[a] /= n;
    a33[a] /= n;
};
const scale = (a, o, n) => {
    o11[o] = a11[a] * n;
    o21[o] = a21[a] * n;
    o31[o] = a31[a] * n;
    o12[o] = a12[a] * n;
    o22[o] = a22[a] * n;
    o32[o] = a32[a] * n;
    o13[o] = a13[a] * n;
    o23[o] = a23[a] * n;
    o33[o] = a33[a] * n;
};
const scale_in_place = (a, n) => {
    a11[a] *= n;
    a21[a] *= n;
    a31[a] *= n;
    a12[a] *= n;
    a22[a] *= n;
    a32[a] *= n;
    a13[a] *= n;
    a23[a] *= n;
    a33[a] *= n;
};
const multiply = (a, b, o) => {
    o11[o] = a11[a] * b11[b] + a12[a] * b21[b] + a13[a] * b31[b]; // Row 1 | Column 1
    o12[o] = a11[a] * b12[b] + a12[a] * b22[b] + a13[a] * b32[b]; // Row 1 | Column 2
    o13[o] = a11[a] * b13[b] + a12[a] * b23[b] + a13[a] * b33[b]; // Row 1 | Column 3
    o21[o] = a21[a] * b11[b] + a22[a] * b21[b] + a23[a] * b31[b]; // Row 2 | Column 1
    o22[o] = a21[a] * b12[b] + a22[a] * b22[b] + a23[a] * b32[b]; // Row 2 | Column 2
    o23[o] = a21[a] * b13[b] + a22[a] * b23[b] + a23[a] * b33[b]; // Row 2 | Column 3
    o31[o] = a31[a] * b11[b] + a32[a] * b21[b] + a33[a] * b31[b]; // Row 3 | Column 1
    o32[o] = a31[a] * b12[b] + a32[a] * b22[b] + a33[a] * b32[b]; // Row 3 | Column 2
    o33[o] = a31[a] * b13[b] + a32[a] * b23[b] + a33[a] * b33[b]; // Row 3 | Column 3
};
const multiply_in_place = (a, b) => {
    t11 = a11[a];
    t21 = a21[a];
    t31 = a31[a];
    t12 = a12[a];
    t22 = a22[a];
    t32 = a32[a];
    t13 = a13[a];
    t23 = a23[a];
    t33 = a33[a];
    a11[a] = t11 * b11[b] + t12 * b21[b] + t13 * b31[b]; // Row 1 | Column 1
    a12[a] = t11 * b12[b] + t12 * b22[b] + t13 * b32[b]; // Row 1 | Column 2
    a13[a] = t11 * b13[b] + t12 * b23[b] + t13 * b33[b]; // Row 1 | Column 3
    a21[a] = t21 * b11[b] + t22 * b21[b] + t23 * b31[b]; // Row 2 | Column 1
    a22[a] = t21 * b12[b] + t22 * b22[b] + t23 * b32[b]; // Row 2 | Column 2
    a23[a] = t21 * b13[b] + t22 * b23[b] + t23 * b33[b]; // Row 2 | Column 3
    a31[a] = t31 * b11[b] + t32 * b21[b] + t33 * b31[b]; // Row 3 | Column 1
    a32[a] = t31 * b12[b] + t32 * b22[b] + t33 * b32[b]; // Row 3 | Column 2
    a33[a] = t31 * b13[b] + t32 * b23[b] + t33 * b33[b]; // Row 3 | Column 3
};
const set_rotation_around_x = (a, cos, sin) => {
    a33[a] = a22[a] = cos;
    a23[a] = sin;
    a32[a] = -sin;
};
const set_rotation_around_y = (a, cos, sin) => {
    a11[a] = a33[a] = cos;
    a13[a] = sin;
    a31[a] = -sin;
};
const set_rotation_around_z = (a, cos, sin) => {
    a11[a] = a22[a] = cos;
    a12[a] = sin;
    a21[a] = -sin;
};
export default class Matrix3x3 {
    constructor(arrays, id = 0) {
        this.setToIdentity = () => {
            set_a(this);
            set_to_identity(this.id);
            return this;
        };
        this.transpose = () => {
            set_a(this);
            transpose_in_place(this.id);
            return this;
        };
        this.transposed = (out) => {
            set_a(this);
            set_o(out);
            transpose(this.id, out.id);
            return out;
        };
        this.invert = () => {
            set_a(this);
            invert_in_place(this.id);
            return this;
        };
        this.inverted = (out) => {
            set_a(this);
            set_o(out);
            invert(this.id, out.id);
            return this;
        };
        this.copyTo = (out) => {
            this_id = this.id;
            out_id = out.id;
            out.m11[out_id] = this.m11[this_id];
            out.m21[out_id] = this.m21[this_id];
            out.m31[out_id] = this.m31[this_id];
            out.m12[out_id] = this.m12[this_id];
            out.m22[out_id] = this.m22[this_id];
            out.m32[out_id] = this.m32[this_id];
            out.m13[out_id] = this.m13[this_id];
            out.m23[out_id] = this.m23[this_id];
            out.m33[out_id] = this.m33[this_id];
            return out;
        };
        this.setFromOther = (other) => {
            this_id = this.id;
            other_id = other.id;
            other.m11[other_id] = this.m11[this_id];
            other.m12[other_id] = this.m12[this_id];
            other.m13[other_id] = this.m13[this_id];
            other.m21[other_id] = this.m21[this_id];
            other.m22[other_id] = this.m22[this_id];
            other.m23[other_id] = this.m23[this_id];
            other.m31[other_id] = this.m31[this_id];
            other.m32[other_id] = this.m32[this_id];
            other.m33[other_id] = this.m33[this_id];
            return this;
        };
        this.setTo = (m11, m12, m13, m21, m22, m23, m31, m32, m33) => {
            this_id = this.id;
            this.m11[this_id] = m11;
            this.m21[this_id] = m21;
            this.m31[this_id] = m31;
            this.m12[this_id] = m12;
            this.m22[this_id] = m22;
            this.m32[this_id] = m32;
            this.m13[this_id] = m13;
            this.m23[this_id] = m23;
            this.m33[this_id] = m33;
            return this;
        };
        this.isSameAs = (other) => {
            set_a(this);
            set_b(other);
            return same(this.id, other.id);
        };
        this.equals = (other) => {
            set_a(this);
            set_b(other);
            if (same(this.id, other.id))
                return true;
            return equals(this.id, other.id);
        };
        this.add = (other) => {
            set_a(this);
            set_b(other);
            add_in_place(this.id, other.id);
            return this;
        };
        this.sub = (other) => {
            set_a(this);
            set_b(other);
            subtract_in_place(this.id, other.id);
            return this;
        };
        this.div = (by) => {
            set_a(this);
            divide_in_place(this.id, by);
            return this;
        };
        this.mul = (factor_or_matrix) => {
            set_a(this);
            if (typeof factor_or_matrix === 'number')
                scale_in_place(this.id, factor_or_matrix);
            else {
                set_m(factor_or_matrix);
                multiply_in_place(this.id, factor_or_matrix.id);
            }
            return this;
        };
        this.plus = (other, out) => {
            if (this.isSameAs(out))
                return out.add(other);
            set_a(this);
            set_b(other);
            set_o(out);
            add(this.id, other.id, out.id);
            return out;
        };
        this.minus = (other, out) => {
            if (this.isSameAs(other) || this.equals(other)) {
                out_id = out.id;
                out.m11[out_id] = out.m21[out_id] = out.m31[out_id] =
                    out.m12[out_id] = out.m22[out_id] = out.m32[out_id] =
                        out.m13[out_id] = out.m23[out_id] = out.m33[out_id] = 0;
                return out;
            }
            if (this.isSameAs(out))
                return out.sub(other);
            set_a(this);
            set_b(other);
            set_o(out);
            subtract(this.id, other.id, out.id);
            return out;
        };
        this.over = (by, out) => {
            if (this.isSameAs(out))
                return out.div(by);
            set_a(this);
            set_o(out);
            divide(this.id, out.id, by);
            return out;
        };
        this.times = (factor_or_matrix, out) => {
            if (this.isSameAs(out))
                return out.mul(factor_or_matrix);
            set_a(this);
            set_o(out);
            if (typeof factor_or_matrix === 'number')
                scale(this.id, out.id, factor_or_matrix);
            else {
                set_m(factor_or_matrix);
                multiply(this.id, factor_or_matrix.id, out.id);
            }
            return out;
        };
        if (id < 0)
            throw `ID must be positive integer, got ${id}`;
        this.id = id;
        [
            this.m11, this.m12, this.m13,
            this.m21, this.m22, this.m23,
            this.m31, this.m32, this.m33,
        ] = arrays;
        this.i = new Direction3D([this.m11, this.m12, this.m13], id);
        this.j = new Direction3D([this.m21, this.m22, this.m23], id);
        this.k = new Direction3D([this.m31, this.m32, this.m33], id);
        this.t = new Position3D([this.m31, this.m32, this.m33], id);
    }
    get is_identity() {
        set_a(this);
        return is_identity(this.id);
    }
    setRotationAroundX(angle, reset = true) {
        if (reset) {
            set_a(this);
            set_to_identity(this.id);
        }
        set_sin_cos(angle);
        set_rotation_around_x(this.id, cos, sin);
        return this;
    }
    setRotationAroundY(angle, reset = false) {
        if (reset) {
            set_a(this);
            set_to_identity(this.id);
        }
        set_sin_cos(angle);
        set_rotation_around_y(this.id, cos, sin);
        return this;
    }
    setRotationAroundZ(angle, reset = false) {
        if (reset) {
            set_a(this);
            set_to_identity(this.id);
        }
        set_sin_cos(angle);
        set_rotation_around_z(this.id, cos, sin);
        return this;
    }
}
const set_a = (a) => {
    a11 = a.m11;
    a21 = a.m21;
    a31 = a.m31;
    a12 = a.m12;
    a22 = a.m22;
    a32 = a.m32;
    a13 = a.m13;
    a23 = a.m23;
    a33 = a.m33;
};
const set_b = (b) => {
    b11 = b.m11;
    b21 = b.m21;
    b31 = b.m31;
    b12 = b.m12;
    b22 = b.m22;
    b32 = b.m32;
    b13 = b.m13;
    b23 = b.m23;
    b33 = b.m33;
};
const set_o = (o) => {
    o11 = o.m11;
    o21 = o.m21;
    o31 = o.m31;
    o12 = o.m12;
    o22 = o.m22;
    o32 = o.m32;
    o13 = o.m13;
    o23 = o.m23;
    o33 = o.m33;
};
const set_m = (m) => {
    t11 = m.m11;
    t21 = m.m21;
    t31 = m.m31;
    t12 = m.m12;
    t22 = m.m22;
    t32 = m.m32;
    t13 = m.m13;
    t23 = m.m23;
    t33 = m.m33;
};
const set_sin_cos = (angle) => {
    sin = Math.sin(angle);
    cos = Math.cos(angle);
};
export const defaultMatrix3x3Allocator = new Matrix3x3Allocator(16);
export function mat3x3(numberOrAllocator, m12, m13, m21, m22, m23, m31, m32, m33, allocator) {
    allocator = numberOrAllocator instanceof Matrix3x3Allocator ? numberOrAllocator : allocator || defaultMatrix3x3Allocator;
    const result = new Matrix3x3(allocator.allocate(), allocator.current);
    if (typeof numberOrAllocator === 'number')
        result.setTo(numberOrAllocator, m12, m13, m21, m22, m23, m31, m32, m33);
    return result;
}
//# sourceMappingURL=mat3x3.js.map