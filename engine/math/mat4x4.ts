import {PRECISION_DIGITS} from "../constants.js";
import {Direction4D, Position4D} from "./vec4.js";


let m11, m12, m13, m14,
    m21, m22, m23, m24,
    m31, m32, m33, m34,
    m41, m42, m43, m44,

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
    m11 = a11[a];  m21 = a21[a];  m31 = a31[a];  m41 = a41[a];
    m12 = a12[a];  m22 = a22[a];  m32 = a32[a];  m42 = a42[a];
    m13 = a13[a];  m23 = a23[a];  m33 = a33[a];  m43 = a43[a];

    // Transpose the rotation portion of the matrix:
                   a21[a] = m12;  a31[a] = m13;
    a12[a] = m21;                 a32[a] = m23;
    a13[a] = m31;  a23[a] = m32;

    // Dot the translation portion of the matrix with the original rotation portion, and invert the results:
    a41[a] = -(m41*m11 + m42*m12 + m43*m13); // -Dot(original_translation, original_rotation_x)
    a42[a] = -(m41*m21 + m42*m22 + m43*m23); // -Dot(original_translation, original_rotation_y)
    a43[a] = -(m41*m31 + m42*m32 + m43*m33); // -Dot(original_translation, original_rotation_z)
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
    m11 = a11[a];  m21 = a21[a];  m31 = a31[a];  m41 = a41[a];
    m12 = a12[a];  m22 = a22[a];  m32 = a32[a];  m42 = a42[a];
    m13 = a13[a];  m23 = a23[a];  m33 = a33[a];  m43 = a43[a];
    m14 = a14[a];  m24 = a24[a];  m34 = a34[a];  m44 = a44[a];

    a11[a] = m11*b11[b] + m12*b21[b] + m13*b31[b] + m14*b41[b]; // Row 1 | Column 1
    a12[a] = m11*b12[b] + m12*b22[b] + m13*b32[b] + m14*b42[b]; // Row 1 | Column 2
    a13[a] = m11*b13[b] + m12*b23[b] + m13*b33[b] + m14*b43[b]; // Row 1 | Column 3
    a14[a] = m11*b14[b] + m12*b24[b] + m13*b34[b] + m14*b44[b]; // Row 1 | Column 4

    a21[a] = m21*b11[b] + m22*b21[b] + m23*b31[b] + m24*b41[b]; // Row 2 | Column 1
    a22[a] = m21*b12[b] + m22*b22[b] + m23*b32[b] + m24*b42[b]; // Row 2 | Column 2
    a23[a] = m21*b13[b] + m22*b23[b] + m23*b33[b] + m24*b43[b]; // Row 2 | Column 3
    a24[a] = m21*b14[b] + m22*b24[b] + m23*b34[b] + m24*b44[b]; // Row 2 | Column 4

    a31[a] = m31*b11[b] + m32*b21[b] + m33*b31[b] + m34*b41[b]; // Row 3 | Column 1
    a32[a] = m31*b12[b] + m32*b22[b] + m33*b32[b] + m34*b42[b]; // Row 3 | Column 2
    a33[a] = m31*b13[b] + m32*b23[b] + m33*b33[b] + m34*b43[b]; // Row 3 | Column 3
    a34[a] = m31*b14[b] + m32*b24[b] + m33*b34[b] + m34*b44[b]; // Row 3 | Column 4

    a41[a] = m41*b11[b] + m42*b21[b] + m43*b31[b] + m44*b41[b]; // Row 4 | Column 1
    a42[a] = m41*b12[b] + m42*b22[b] + m43*b32[b] + m44*b42[b]; // Row 4 | Column 2
    a43[a] = m41*b13[b] + m42*b23[b] + m43*b33[b] + m44*b43[b]; // Row 4 | Column 3
    a44[a] = m41*b14[b] + m42*b24[b] + m43*b34[b] + m44*b44[b]; // Row 4 | Column 4
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


export class Matrix4x4 {
    constructor(
        readonly _11: Float32Array,
        readonly _12: Float32Array,
        readonly _13: Float32Array,
        readonly _14: Float32Array,

        readonly _21: Float32Array,
        readonly _22: Float32Array,
        readonly _23: Float32Array,
        readonly _24: Float32Array,

        readonly _31: Float32Array,
        readonly _32: Float32Array,
        readonly _33: Float32Array,
        readonly _34: Float32Array,

        readonly _41: Float32Array,
        readonly _42: Float32Array,
        readonly _43: Float32Array,
        readonly _44: Float32Array,

        public id: number = 0,

        public i: Direction4D = new Direction4D(_11, _12, _13, _14, id),
        public j: Direction4D = new Direction4D(_21, _22, _23, _24, id),
        public k: Direction4D = new Direction4D(_31, _32, _33, _34, id),
        public t: Position4D = new Position4D(_41, _42, _43, _44, id)

        // public readonly arrays: readonly [
        //     Float32Array, Float32Array, Float32Array, Float32Array,
        //     Float32Array, Float32Array, Float32Array, Float32Array,
        //     Float32Array, Float32Array, Float32Array, Float32Array,
        //     Float32Array, Float32Array, Float32Array, Float32Array,
        // ] = [
        //     m11, m12, m13, m14,
        //     m21, m22, m23, m24,
        //     m31, m32, m33, m34,
        //     m41, m42, m43, m44,
        // ],
    ) {
        if (id < 0) throw `ID must be positive integer, got ${id}`;
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

        out._11[out_id] = this._11[this_id];  out._21[out_id] = this._21[this_id];
        out._12[out_id] = this._12[this_id];  out._22[out_id] = this._22[this_id];
        out._13[out_id] = this._13[this_id];  out._23[out_id] = this._23[this_id];
        out._14[out_id] = this._14[this_id];  out._24[out_id] = this._24[this_id];

        out._31[out_id] = this._31[this_id];  out._41[out_id] = this._41[this_id];
        out._32[out_id] = this._32[this_id];  out._42[out_id] = this._42[this_id];
        out._33[out_id] = this._33[this_id];  out._43[out_id] = this._43[this_id];
        out._34[out_id] = this._34[this_id];  out._44[out_id] = this._44[this_id];

        return out;
    };

    readonly setFromOther = (other: this) : this => {
        this_id = this.id;
        other_id = other.id;

        other._11[other_id] = this._11[this_id];  other._21[other_id] = this._21[this_id];
        other._12[other_id] = this._12[this_id];  other._22[other_id] = this._22[this_id];
        other._13[other_id] = this._13[this_id];  other._23[other_id] = this._23[this_id];
        other._14[other_id] = this._14[this_id];  other._24[other_id] = this._24[this_id];

        other._31[other_id] = this._31[this_id];  other._41[other_id] = this._41[this_id];
        other._32[other_id] = this._32[this_id];  other._42[other_id] = this._42[this_id];
        other._33[other_id] = this._33[this_id];  other._43[other_id] = this._43[this_id];
        other._34[other_id] = this._34[this_id];  other._44[other_id] = this._44[this_id];

        return this;
    };

    readonly setTo = (
        m11: number, m12: number, m13: number, m14: number,
        m21: number, m22: number, m23: number, m24: number,
        m31: number, m32: number, m33: number, m34: number,
        m41: number, m42: number, m43: number, m44: number,
    ) : this => {
        this_id = this.id;

        this._11[this_id] = m11;  this._21[this_id] = m21;  this._31[this_id] = m31;  this._41[this_id] = m41;
        this._12[this_id] = m12;  this._22[this_id] = m22;  this._32[this_id] = m32;  this._42[this_id] = m42;
        this._13[this_id] = m13;  this._23[this_id] = m23;  this._33[this_id] = m33;  this._43[this_id] = m43;
        this._14[this_id] = m14;  this._24[this_id] = m24;  this._34[this_id] = m34;  this._44[this_id] = m44;

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

            out._11[out_id] = out._21[out_id] = out._31[out_id] = out._41[out_id] =
            out._12[out_id] = out._22[out_id] = out._32[out_id] = out._42[out_id] =
            out._13[out_id] = out._23[out_id] = out._33[out_id] = out._43[out_id] =
            out._14[out_id] = out._24[out_id] = out._34[out_id] = out._44[out_id] = 0;
            
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
    a11 = a._11;  a21 = a._21;  a31 = a._31;  a41 = a._41;
    a12 = a._12;  a22 = a._22;  a32 = a._32;  a42 = a._42;
    a13 = a._13;  a23 = a._23;  a33 = a._33;  a43 = a._43;
    a14 = a._14;  a24 = a._24;  a34 = a._34;  a44 = a._44;
};

const set_b = (b: Matrix4x4) : void => {
    b11 = b._11;  b21 = b._21;  b31 = b._31;  b41 = b._41;
    b12 = b._12;  b22 = b._22;  b32 = b._32;  b42 = b._42;
    b13 = b._13;  b23 = b._23;  b33 = b._33;  b43 = b._43;
    b14 = b._14;  b24 = b._24;  b34 = b._34;  b44 = b._44;
};

const set_o = (o: Matrix4x4) : void => {
    o11 = o._11;  o21 = o._21;  o31 = o._31;  o41 = o._41;
    o12 = o._12;  o22 = o._22;  o32 = o._32;  o42 = o._42;
    o13 = o._13;  o23 = o._23;  o33 = o._33;  o43 = o._43;
    o14 = o._14;  o24 = o._24;  o34 = o._34;  o44 = o._44;
};

const set_m = (m: Matrix4x4) : void => {
    m11 = m._11;  m21 = m._21;  m31 = m._31;  m41 = m._41;
    m12 = m._12;  m22 = m._22;  m32 = m._32;  m42 = m._42;
    m13 = m._13;  m23 = m._23;  m33 = m._33;  m43 = m._43;
    m14 = m._14;  m24 = m._24;  m34 = m._34;  m44 = m._44;
};

const set_sin_cos = (angle: number) => {
    sin = Math.sin(angle);
    cos = Math.cos(angle);
};