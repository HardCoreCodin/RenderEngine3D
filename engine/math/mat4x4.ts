import {PRECISION_DIGITS} from "../constants.js";
import {Direction4D, Position4D} from "./vec4.js";
import {Matrix4x4Values} from "../types.js";
import {Matrix4x4Allocator} from "../allocators.js";
import {IMatrix4x4} from "./interfaces.js";


let t11, t12, t13, t14,
    t21, t22, t23, t24,
    t31, t32, t33, t34,
    t41, t42, t43, t44,

    sin,
    cos,
    out_id,
    this_id,
    other_id: number;

let a11, a12, a13, a14,
    a21, a22, a23, a24,
    a31, a32, a33, a34,
    a41, a42, a43, a44,

    b11, b12, b13, b14,
    b21, b22, b23, b24,
    b31, b32, b33, b34,
    b41, b42, b43, b44,

    o11, o12, o13, o14,
    o21, o22, o23, o24,
    o31, o32, o33, o34,
    o41, o42, o43, o44: Float32Array;

const set_to_identity = (a: number) : void => {
    a11[a] = a22[a] = a33[a] = a44[a] = 1;
    a12[a] = a13[a] = a14[a] =
    a22[a] = a23[a] = a24[a] =
    a31[a] = a32[a] = a34[a] =
    a41[a] = a42[a] = a43[a] = 0;
};

const invert = (a: number, o: number) : void => {
    o14[o] = a14[a];  o11[o] = a11[a];  o12[o] = a21[a];  o13[o] = a31[a];  o23[o] = a32[a];
    o24[o] = a24[a];  o22[o] = a22[a];  o21[o] = a12[a];  o31[o] = a13[a];  o32[o] = a23[a];
    o34[o] = a34[a];  o33[o] = a33[a];

    o41[o] = -(a41[a]*a11[a] + a42[a]*a12[a] + a43[a]*a13[a]);
    o42[o] = -(a41[a]*a21[a] + a42[a]*a22[a] + a43[a]*a23[a]);
    o43[o] = -(a41[a]*a31[a] + a42[a]*a32[a] + a43[a]*a33[a]);
    o44[o] = 1;
};

const invert_in_place = (a: number) : void => {
    // Store the rotation and translation portions of the matrix in temporary variables:
    t11 = a11[a];  t21 = a21[a];  t31 = a31[a];  t41 = a41[a];
    t12 = a12[a];  t22 = a22[a];  t32 = a32[a];  t42 = a42[a];
    t13 = a13[a];  t23 = a23[a];  t33 = a33[a];  t43 = a43[a];

    // Transpose the rotation portion of the matrix:
                   a21[a] = t12;  a31[a] = t13;
    a12[a] = t21;                 a32[a] = t23;
    a13[a] = t31;  a23[a] = t32;

    // Dot the translation portion of the matrix with the original rotation portion, and invert the results:
    a41[a] = -(t41*t11 + t42*t12 + t43*t13); // -Dot(original_translation, original_rotation_x)
    a42[a] = -(t41*t21 + t42*t22 + t43*t23); // -Dot(original_translation, original_rotation_y)
    a43[a] = -(t41*t31 + t42*t32 + t43*t33); // -Dot(original_translation, original_rotation_z)
    a44[a] = 1;
};

const transpose = (a: number, o: number) : void => {
    o11[o] = a11[a];  o21[o] = a12[a];  o31[o] = a13[a];  o41[o] = a14[a];
    o12[o] = a21[a];  o22[o] = a22[a];  o32[o] = a23[a];  o42[o] = a24[a];
    o13[o] = a31[a];  o23[o] = a32[a];  o33[o] = a33[a];  o43[o] = a34[a];
    o14[o] = a41[a];  o24[o] = a42[a];  o34[o] = a43[a];  o44[o] = a44[a];
};

const transpose_in_place = (a: number) : void => {[
    a12[a], a13[a], a14[a], a21[a], a23[a], a24[a], a31[a], a32[a], a34[a], a41[a], a42[a], a43[a]] = [
    a21[a], a31[a], a41[a], a12[a], a32[a], a42[a], a13[a], a23[a], a43[a], a14[a], a24[a], a34[a]]
};

const equals = (a: number, b: number) : boolean =>
    a11[a].toFixed(PRECISION_DIGITS) ===
    b11[b].toFixed(PRECISION_DIGITS) &&

    a12[a].toFixed(PRECISION_DIGITS) ===
    b12[b].toFixed(PRECISION_DIGITS) &&

    a13[a].toFixed(PRECISION_DIGITS) ===
    b13[b].toFixed(PRECISION_DIGITS) &&

    a14[a].toFixed(PRECISION_DIGITS) ===
    b14[b].toFixed(PRECISION_DIGITS) &&


    a21[a].toFixed(PRECISION_DIGITS) ===
    b21[b].toFixed(PRECISION_DIGITS) &&

    a22[a].toFixed(PRECISION_DIGITS) ===
    b22[b].toFixed(PRECISION_DIGITS) &&

    a23[a].toFixed(PRECISION_DIGITS) ===
    b23[b].toFixed(PRECISION_DIGITS) &&

    a24[a].toFixed(PRECISION_DIGITS) ===
    b24[b].toFixed(PRECISION_DIGITS) &&


    a31[a].toFixed(PRECISION_DIGITS) ===
    b31[b].toFixed(PRECISION_DIGITS) &&

    a32[a].toFixed(PRECISION_DIGITS) ===
    b32[b].toFixed(PRECISION_DIGITS) &&

    a33[a].toFixed(PRECISION_DIGITS) ===
    b33[b].toFixed(PRECISION_DIGITS) &&

    a34[a].toFixed(PRECISION_DIGITS) ===
    b34[b].toFixed(PRECISION_DIGITS) &&


    a41[a].toFixed(PRECISION_DIGITS) ===
    b41[b].toFixed(PRECISION_DIGITS) &&

    a42[a].toFixed(PRECISION_DIGITS) ===
    b42[b].toFixed(PRECISION_DIGITS) &&

    a43[a].toFixed(PRECISION_DIGITS) ===
    b43[b].toFixed(PRECISION_DIGITS) &&

    a44[a].toFixed(PRECISION_DIGITS) ===
    b44[b].toFixed(PRECISION_DIGITS);

const same = (a: number, b: number) : boolean => a === b &&
    (Object.is(a11, b11) || (Object.is(a11.buffer, b11.buffer) && a11.offset == b11.offset)) &&
    (Object.is(a12, b12) || (Object.is(a12.buffer, b12.buffer) && a12.offset == b12.offset)) &&
    (Object.is(a13, b13) || (Object.is(a13.buffer, b13.buffer) && a13.offset == b13.offset)) &&
    (Object.is(a14, b14) || (Object.is(a14.buffer, b14.buffer) && a14.offset == b14.offset)) &&

    (Object.is(a21, b21) || (Object.is(a21.buffer, b21.buffer) && a21.offset == b21.offset)) &&
    (Object.is(a22, b22) || (Object.is(a22.buffer, b22.buffer) && a22.offset == b22.offset)) &&
    (Object.is(a23, b23) || (Object.is(a23.buffer, b23.buffer) && a23.offset == b23.offset)) &&
    (Object.is(a24, b24) || (Object.is(a24.buffer, b24.buffer) && a24.offset == b24.offset)) &&

    (Object.is(a31, b31) || (Object.is(a31.buffer, b31.buffer) && a31.offset == b31.offset)) &&
    (Object.is(a32, b32) || (Object.is(a32.buffer, b32.buffer) && a32.offset == b32.offset)) &&
    (Object.is(a33, b33) || (Object.is(a33.buffer, b33.buffer) && a33.offset == b33.offset)) &&
    (Object.is(a34, b34) || (Object.is(a34.buffer, b34.buffer) && a34.offset == b34.offset)) &&

    (Object.is(a41, b41) || (Object.is(a41.buffer, b41.buffer) && a41.offset == b41.offset)) &&
    (Object.is(a42, b42) || (Object.is(a42.buffer, b42.buffer) && a42.offset == b42.offset)) &&
    (Object.is(a43, b43) || (Object.is(a43.buffer, b43.buffer) && a43.offset == b43.offset)) &&
    (Object.is(a44, b44) || (Object.is(a44.buffer, b44.buffer) && a44.offset == b44.offset));

const is_identity = (a: number) : boolean =>
    a11[a] === 1  &&  a21[a] === 0  &&  a31[a] === 0  &&  a41[a] === 0 &&
    a12[a] === 0  &&  a22[a] === 1  &&  a32[a] === 0  &&  a42[a] === 0 &&
    a13[a] === 0  &&  a23[a] === 0  &&  a33[a] === 1  &&  a43[a] === 0 &&
    a14[a] === 0  &&  a24[a] === 0  &&  a34[a] === 0  &&  a44[a] === 1;

const add = (a: number, b: number, o: number) : void => {
    o11[o] = a11[a] + b11[b];  o21[o] = a21[a] + b21[b];  o31[o] = a31[a] + b31[b];  o41[o] = a41[a] + b41[b];
    o12[o] = a12[a] + b12[b];  o22[o] = a22[a] + b22[b];  o32[o] = a32[a] + b32[b];  o42[o] = a42[a] + b42[b];
    o13[o] = a13[a] + b13[b];  o23[o] = a23[a] + b23[b];  o33[o] = a33[a] + b33[b];  o43[o] = a43[a] + b43[b];
    o14[o] = a14[a] + b14[b];  o24[o] = a24[a] + b24[b];  o34[o] = a34[a] + b34[b];  o44[o] = a44[a] + b44[b];
};

const add_in_place = (a: number, b: number) : void => {
    a11[a] += b11[b];  a21[a] += b21[b];  a31[a] += b31[b];  a41[a] += b41[b];
    a12[a] += b12[b];  a22[a] += b22[b];  a32[a] += b32[b];  a42[a] += b42[b];
    a13[a] += b13[b];  a23[a] += b23[b];  a33[a] += b33[b];  a43[a] += b43[b];
    a14[a] += b14[b];  a24[a] += b24[b];  a34[a] += b34[b];  a44[a] += b44[b];
};

const subtract = (a: number, b: number, o: number) : void => {
    o11[o] = a11[a] - b11[b];  o21[o] = a21[a] - b21[b];  o31[o] = a31[a] - b31[b];  o41[o] = a41[a] - b41[b];
    o12[o] = a12[a] - b12[b];  o22[o] = a22[a] - b22[b];  o32[o] = a32[a] - b32[b];  o42[o] = a42[a] - b42[b];
    o13[o] = a13[a] - b13[b];  o23[o] = a23[a] - b23[b];  o33[o] = a33[a] - b33[b];  o43[o] = a43[a] - b43[b];
    o14[o] = a14[a] - b14[b];  o24[o] = a24[a] - b24[b];  o34[o] = a34[a] - b34[b];  o44[o] = a44[a] - b44[b];
};

const subtract_in_place = (a: number, b: number) : void => {
    a11[a] -= b11[b];  a21[a] -= b21[b];  a31[a] -= b31[b];  a41[a] -= b41[b];
    a12[a] -= b12[b];  a22[a] -= b22[b];  a32[a] -= b32[b];  a42[a] -= b42[b];
    a13[a] -= b13[b];  a23[a] -= b23[b];  a33[a] -= b33[b];  a43[a] -= b43[b];
    a14[a] -= b14[b];  a24[a] -= b24[b];  a34[a] -= b34[b];  a44[a] -= b44[b];
};

const divide = (a: number, o: number, n: number) : void => {
    o11[o] = a11[a] / n;  o21[o] = a21[a] / n;  o31[o] = a31[a] / n;  o41[o] = a41[a] / n;
    o12[o] = a12[a] / n;  o22[o] = a22[a] / n;  o32[o] = a32[a] / n;  o42[o] = a42[a] / n;
    o13[o] = a13[a] / n;  o23[o] = a23[a] / n;  o33[o] = a33[a] / n;  o43[o] = a43[a] / n;
    o14[o] = a14[a] / n;  o24[o] = a24[a] / n;  o34[o] = a34[a] / n;  o44[o] = a44[a] / n;
};

const divide_in_place = (a: number, n: number) : void => {
    a11[a] /= n;  a21[a] /= n;  a31[a] /= n;  a41[a] /= n;
    a12[a] /= n;  a22[a] /= n;  a32[a] /= n;  a42[a] /= n;
    a13[a] /= n;  a23[a] /= n;  a33[a] /= n;  a43[a] /= n;
    a14[a] /= n;  a24[a] /= n;  a34[a] /= n;  a44[a] /= n;
};

const scale = (a: number, o: number, n: number) : void => {
    o11[o] = a11[a] * n;  o21[o] = a21[a] * n;  o31[o] = a31[a] * n;  o41[o] = a41[a] * n;
    o12[o] = a12[a] * n;  o22[o] = a22[a] * n;  o32[o] = a32[a] * n;  o42[o] = a42[a] * n;
    o13[o] = a13[a] * n;  o23[o] = a23[a] * n;  o33[o] = a33[a] * n;  o43[o] = a43[a] * n;
    o14[o] = a14[a] * n;  o24[o] = a24[a] * n;  o34[o] = a34[a] * n;  o44[o] = a44[a] * n;
};

const scale_in_place = (a: number, n: number) : void => {
    a11[a] *= n;  a21[a] *= n;  a31[a] *= n;  a41[a] *= n;
    a12[a] *= n;  a22[a] *= n;  a32[a] *= n;  a42[a] *= n;
    a13[a] *= n;  a23[a] *= n;  a33[a] *= n;  a43[a] *= n;
    a14[a] *= n;  a24[a] *= n;  a34[a] *= n;  a44[a] *= n;
};

const multiply = (a: number, b: number, o: number) : void => {
    o11[o] = a11[a]*b11[b] + a12[a]*b21[b] + a13[a]*b31[b] + a14[a]*b41[b]; // Row 1 | Column 1
    o12[o] = a11[a]*b12[b] + a12[a]*b22[b] + a13[a]*b32[b] + a14[a]*b42[b]; // Row 1 | Column 2
    o13[o] = a11[a]*b13[b] + a12[a]*b23[b] + a13[a]*b33[b] + a14[a]*b43[b]; // Row 1 | Column 3
    o14[o] = a11[a]*b14[b] + a12[a]*b24[b] + a13[a]*b34[b] + a14[a]*b44[b]; // Row 1 | Column 4

    o21[o] = a21[a]*b11[b] + a22[a]*b21[b] + a23[a]*b31[b] + a24[a]*b41[b]; // Row 2 | Column 1
    o22[o] = a21[a]*b12[b] + a22[a]*b22[b] + a23[a]*b32[b] + a24[a]*b42[b]; // Row 2 | Column 2
    o23[o] = a21[a]*b13[b] + a22[a]*b23[b] + a23[a]*b33[b] + a24[a]*b43[b]; // Row 2 | Column 3
    o24[o] = a21[a]*b14[b] + a22[a]*b24[b] + a23[a]*b34[b] + a24[a]*b44[b]; // Row 2 | Column 4

    o31[o] = a31[a]*b11[b] + a32[a]*b21[b] + a33[a]*b31[b] + a34[a]*b41[b]; // Row 3 | Column 1
    o32[o] = a31[a]*b12[b] + a32[a]*b22[b] + a33[a]*b32[b] + a34[a]*b42[b]; // Row 3 | Column 2
    o33[o] = a31[a]*b13[b] + a32[a]*b23[b] + a33[a]*b33[b] + a34[a]*b43[b]; // Row 3 | Column 3
    o34[o] = a31[a]*b14[b] + a32[a]*b24[b] + a33[a]*b34[b] + a34[a]*b44[b]; // Row 3 | Column 4

    o41[o] = a41[a]*b11[b] + a42[a]*b21[b] + a43[a]*b31[b] + a44[a]*b41[b]; // Row 4 | Column 1
    o42[o] = a41[a]*b12[b] + a42[a]*b22[b] + a43[a]*b32[b] + a44[a]*b42[b]; // Row 4 | Column 2
    o43[o] = a41[a]*b13[b] + a42[a]*b23[b] + a43[a]*b33[b] + a44[a]*b43[b]; // Row 4 | Column 3
    o44[o] = a41[a]*b14[b] + a42[a]*b24[b] + a43[a]*b34[b] + a44[a]*b44[b]; // Row 4 | Column 4
};

const multiply_in_place = (a: number, b: number) : void => {
    t11 = a11[a];  t21 = a21[a];  t31 = a31[a];  t41 = a41[a];
    t12 = a12[a];  t22 = a22[a];  t32 = a32[a];  t42 = a42[a];
    t13 = a13[a];  t23 = a23[a];  t33 = a33[a];  t43 = a43[a];
    t14 = a14[a];  t24 = a24[a];  t34 = a34[a];  t44 = a44[a];

    a11[a] = t11*b11[b] + t12*b21[b] + t13*b31[b] + t14*b41[b]; // Row 1 | Column 1
    a12[a] = t11*b12[b] + t12*b22[b] + t13*b32[b] + t14*b42[b]; // Row 1 | Column 2
    a13[a] = t11*b13[b] + t12*b23[b] + t13*b33[b] + t14*b43[b]; // Row 1 | Column 3
    a14[a] = t11*b14[b] + t12*b24[b] + t13*b34[b] + t14*b44[b]; // Row 1 | Column 4

    a21[a] = t21*b11[b] + t22*b21[b] + t23*b31[b] + t24*b41[b]; // Row 2 | Column 1
    a22[a] = t21*b12[b] + t22*b22[b] + t23*b32[b] + t24*b42[b]; // Row 2 | Column 2
    a23[a] = t21*b13[b] + t22*b23[b] + t23*b33[b] + t24*b43[b]; // Row 2 | Column 3
    a24[a] = t21*b14[b] + t22*b24[b] + t23*b34[b] + t24*b44[b]; // Row 2 | Column 4

    a31[a] = t31*b11[b] + t32*b21[b] + t33*b31[b] + t34*b41[b]; // Row 3 | Column 1
    a32[a] = t31*b12[b] + t32*b22[b] + t33*b32[b] + t34*b42[b]; // Row 3 | Column 2
    a33[a] = t31*b13[b] + t32*b23[b] + t33*b33[b] + t34*b43[b]; // Row 3 | Column 3
    a34[a] = t31*b14[b] + t32*b24[b] + t33*b34[b] + t34*b44[b]; // Row 3 | Column 4

    a41[a] = t41*b11[b] + t42*b21[b] + t43*b31[b] + t44*b41[b]; // Row 4 | Column 1
    a42[a] = t41*b12[b] + t42*b22[b] + t43*b32[b] + t44*b42[b]; // Row 4 | Column 2
    a43[a] = t41*b13[b] + t42*b23[b] + t43*b33[b] + t44*b43[b]; // Row 4 | Column 3
    a44[a] = t41*b14[b] + t42*b24[b] + t43*b34[b] + t44*b44[b]; // Row 4 | Column 4
};

const set_rotation_around_x = (a: number, cos: number, sin: number) : void => {
    a33[a] = a22[a] = cos;
    a23[a] = sin;
    a32[a] = -sin;
};

const set_rotation_around_y = (a: number, cos: number, sin: number) : void => {
    a11[a] = a33[a] = cos;
    a13[a] = sin;
    a31[a] = -sin;
};

const set_rotation_around_z = (a: number, cos: number, sin: number) : void => {
    a11[a] = a22[a] = cos;
    a12[a] = sin;
    a21[a] = -sin;
};


export default class Matrix4x4 implements IMatrix4x4 {
    public id: number;

    readonly m11: Float32Array; readonly m21: Float32Array; readonly m31: Float32Array; readonly m41: Float32Array;
    readonly m12: Float32Array; readonly m22: Float32Array; readonly m32: Float32Array; readonly m42: Float32Array;
    readonly m13: Float32Array; readonly m23: Float32Array; readonly m33: Float32Array; readonly m43: Float32Array;
    readonly m14: Float32Array; readonly m24: Float32Array; readonly m34: Float32Array; readonly m44: Float32Array;

    readonly i: Direction4D;
    readonly j: Direction4D;
    readonly k: Direction4D;
    readonly t: Position4D;

    constructor(arrays: Matrix4x4Values, id: number = 0) {
        if (id < 0)
            throw `ID must be positive integer, got ${id}`;

        this.id = id;

        [
            this.m11, this.m12, this.m13, this.m14,
            this.m21, this.m22, this.m23, this.m24,
            this.m31, this.m32, this.m33, this.m34,
            this.m41, this.m42, this.m43, this.m44,
        ] = arrays;

        this.i = new Direction4D([this.m11, this.m12, this.m13, this.m14], id);
        this.j = new Direction4D([this.m21, this.m22, this.m23, this.m24], id);
        this.k = new Direction4D([this.m31, this.m32, this.m33, this.m34], id);
        this.t = new Position4D([this.m41, this.m42, this.m43, this.m44], id);
    }

    get is_identity() : boolean {
        set_a(this);
        return is_identity(this.id);
    }

    readonly setToIdentity = () : this => {
        set_a(this);
        set_to_identity(this.id);

        return this;
    };

    readonly transpose = () : this => {
        set_a(this);
        transpose_in_place(this.id);

        return this;
    };

    readonly transposed = (out: this) : this => {
        set_a(this);
        set_o(out);

        transpose(this.id, out.id);

        return out;
    };

    readonly invert = () : this => {
        set_a(this);
        invert_in_place(this.id);

        return this;
    };

    readonly inverted = (out: this) : this => {
        set_a(this);
        set_o(out);

        invert(this.id, out.id);

        return this;
    };

    readonly copyTo = (out: this) : this => {
        this_id = this.id;
        out_id = out.id;

        out.m11[out_id] = this.m11[this_id];  out.m21[out_id] = this.m21[this_id];
        out.m12[out_id] = this.m12[this_id];  out.m22[out_id] = this.m22[this_id];
        out.m13[out_id] = this.m13[this_id];  out.m23[out_id] = this.m23[this_id];
        out.m14[out_id] = this.m14[this_id];  out.m24[out_id] = this.m24[this_id];

        out.m31[out_id] = this.m31[this_id];  out.m41[out_id] = this.m41[this_id];
        out.m32[out_id] = this.m32[this_id];  out.m42[out_id] = this.m42[this_id];
        out.m33[out_id] = this.m33[this_id];  out.m43[out_id] = this.m43[this_id];
        out.m34[out_id] = this.m34[this_id];  out.m44[out_id] = this.m44[this_id];

        return out;
    };

    readonly setFromOther = (other: this) : this => {
        this_id = this.id;
        other_id = other.id;

        other.m11[other_id] = this.m11[this_id];  other.m21[other_id] = this.m21[this_id];
        other.m12[other_id] = this.m12[this_id];  other.m22[other_id] = this.m22[this_id];
        other.m13[other_id] = this.m13[this_id];  other.m23[other_id] = this.m23[this_id];
        other.m14[other_id] = this.m14[this_id];  other.m24[other_id] = this.m24[this_id];

        other.m31[other_id] = this.m31[this_id];  other.m41[other_id] = this.m41[this_id];
        other.m32[other_id] = this.m32[this_id];  other.m42[other_id] = this.m42[this_id];
        other.m33[other_id] = this.m33[this_id];  other.m43[other_id] = this.m43[this_id];
        other.m34[other_id] = this.m34[this_id];  other.m44[other_id] = this.m44[this_id];

        return this;
    };

    readonly setTo = (
        m11: number, m12: number, m13: number, m14: number,
        m21: number, m22: number, m23: number, m24: number,
        m31: number, m32: number, m33: number, m34: number,
        m41: number, m42: number, m43: number, m44: number,
    ) : this => {
        this_id = this.id;

        this.m11[this_id] = m11;  this.m21[this_id] = m21;  this.m31[this_id] = m31;  this.m41[this_id] = m41;
        this.m12[this_id] = m12;  this.m22[this_id] = m22;  this.m32[this_id] = m32;  this.m42[this_id] = m42;
        this.m13[this_id] = m13;  this.m23[this_id] = m23;  this.m33[this_id] = m33;  this.m43[this_id] = m43;
        this.m14[this_id] = m14;  this.m24[this_id] = m24;  this.m34[this_id] = m34;  this.m44[this_id] = m44;

        return this;
    };

    readonly isSameAs = (other: this) : boolean => {
        set_a(this);
        set_b(other);

        return same(this.id, other.id);
    };

    readonly equals = (other: this) : boolean => {
        set_a(this);
        set_b(other);

        if (same(this.id, other.id))
            return true;

        return equals(this.id, other.id);
    };

    readonly add = (other: this) : this => {
        set_a(this);
        set_b(other);

        add_in_place(this.id, other.id);

        return this;
    };

    readonly sub = (other: this) : this => {
        set_a(this);
        set_b(other);

        subtract_in_place(this.id, other.id);

        return this;
    };

    readonly div = (by: number) : this => {
        set_a(this);

        divide_in_place(this.id, by);

        return this;
    };

    readonly mul = (factor_or_matrix: number | Matrix4x4) : this => {
        set_a(this);

        if (typeof factor_or_matrix === 'number')
            scale_in_place(this.id, factor_or_matrix);
        else {
            set_m(factor_or_matrix);

            multiply_in_place(this.id, factor_or_matrix.id);
        }

        return this;
    };

    readonly plus = (other: this, out: this) : this => {
        if (this.isSameAs(out))
            return out.add(other);

        set_a(this);
        set_b(other);
        set_o(out);

        add(this.id, other.id, out.id);

        return out;
    };

    readonly minus = (other: this, out: this) : this => {
        if (this.isSameAs(other) || this.equals(other)) {
            out_id = out.id;

            out.m11[out_id] = out.m21[out_id] = out.m31[out_id] = out.m41[out_id] =
            out.m12[out_id] = out.m22[out_id] = out.m32[out_id] = out.m42[out_id] =
            out.m13[out_id] = out.m23[out_id] = out.m33[out_id] = out.m43[out_id] =
            out.m14[out_id] = out.m24[out_id] = out.m34[out_id] = out.m44[out_id] = 0;
            
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

    readonly over = (by: number, out: this) : this => {
        if (this.isSameAs(out))
            return out.div(by);

        set_a(this);
        set_o(out);

        divide(this.id, out.id, by);

        return out;
    };

    readonly times = (factor_or_matrix: number | Matrix4x4, out: this) : this => {
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

    setRotationAroundX(angle, reset=true) : this {
        if (reset) {
            set_a(this);
            set_to_identity(this.id);
        }

        set_sin_cos(angle);

        set_rotation_around_x(this.id, cos, sin);

        return this;
    }

    setRotationAroundY(angle: number, reset=false) : this {
        if (reset) {
            set_a(this);
            set_to_identity(this.id);
        }

        set_sin_cos(angle);

        set_rotation_around_y(this.id, cos, sin);

        return this;
    }

    setRotationAroundZ(angle: number, reset=false) : this {
        if (reset) {
            set_a(this);
            set_to_identity(this.id);
        }

        set_sin_cos(angle);

        set_rotation_around_z(this.id, cos, sin);

        return this;
    }
}

const set_a = (a: Matrix4x4) : void => {
    a11 = a.m11;  a21 = a.m21;  a31 = a.m31;  a41 = a.m41;
    a12 = a.m12;  a22 = a.m22;  a32 = a.m32;  a42 = a.m42;
    a13 = a.m13;  a23 = a.m23;  a33 = a.m33;  a43 = a.m43;
    a14 = a.m14;  a24 = a.m24;  a34 = a.m34;  a44 = a.m44;
};

const set_b = (b: Matrix4x4) : void => {
    b11 = b.m11;  b21 = b.m21;  b31 = b.m31;  b41 = b.m41;
    b12 = b.m12;  b22 = b.m22;  b32 = b.m32;  b42 = b.m42;
    b13 = b.m13;  b23 = b.m23;  b33 = b.m33;  b43 = b.m43;
    b14 = b.m14;  b24 = b.m24;  b34 = b.m34;  b44 = b.m44;
};

const set_o = (o: Matrix4x4) : void => {
    o11 = o.m11;  o21 = o.m21;  o31 = o.m31;  o41 = o.m41;
    o12 = o.m12;  o22 = o.m22;  o32 = o.m32;  o42 = o.m42;
    o13 = o.m13;  o23 = o.m23;  o33 = o.m33;  o43 = o.m43;
    o14 = o.m14;  o24 = o.m24;  o34 = o.m34;  o44 = o.m44;
};

const set_m = (m: Matrix4x4) : void => {
    t11 = m.m11;  t21 = m.m21;  t31 = m.m31;  t41 = m.m41;
    t12 = m.m12;  t22 = m.m22;  t32 = m.m32;  t42 = m.m42;
    t13 = m.m13;  t23 = m.m23;  t33 = m.m33;  t43 = m.m43;
    t14 = m.m14;  t24 = m.m24;  t34 = m.m34;  t44 = m.m44;
};

const set_sin_cos = (angle: number) => {
    sin = Math.sin(angle);
    cos = Math.cos(angle);
};

export const defaultMatrix4x4Allocator = new Matrix4x4Allocator(16);

export function mat4x4() : Matrix4x4;
export function mat4x4(allocator: Matrix4x4Allocator) : Matrix4x4;
export function mat4x4(m11: number, m12: number, m13: number, m14: number,
                       m21: number, m22: number, m23: number, m24: number,
                       m31: number, m32: number, m33: number, m34: number,
                       m41: number, m42: number, m43: number, m44: number) : Matrix4x4;
export function mat4x4(m11: number, m12: number, m13: number, m14: number,
                       m21: number, m22: number, m23: number, m24: number,
                       m31: number, m32: number, m33: number, m34: number,
                       m41: number, m42: number, m43: number, m44: number,
                       allocator: Matrix4x4Allocator) : Matrix4x4;
export function mat4x4(
    numberOrAllocator?: number | Matrix4x4Allocator, m12?: number, m13?: number, m14?: number,
    m21?: number, m22?: number, m23?: number, m24?: number,
    m31?: number, m32?: number, m33?: number, m34?: number,
    m41?: number, m42?: number, m43?: number, m44?: number,
    allocator?: Matrix4x4Allocator
) : Matrix4x4 {
    allocator = numberOrAllocator instanceof Matrix4x4Allocator ? numberOrAllocator : allocator || defaultMatrix4x4Allocator;
    const result = new Matrix4x4(allocator.allocate(), allocator.current);
    if (typeof numberOrAllocator === 'number') result.setTo(
        numberOrAllocator, m12, m13, m14,
        m21, m22, m23, m24,
        m31, m32, m33, m34,
        m41, m42, m43, m44
    );
    return result;
}