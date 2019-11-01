class AbstractBase {
    constructor(id, arrays) {
        this.id = id;
        this.arrays = arrays;
    }
}
export default class Base {
    constructor(id, arrays) {
        this.id = id;
        this.arrays = arrays;
        if (id < 0)
            throw `ID must be positive integer, got ${id}`;
        if (arrays.length !== this._dim)
            throw `Data must be an array of length ${this._dim}! Got ${arrays.length}`;
    }
    copyTo(out) {
        for (const [dim, array] of this.arrays.entries())
            out.arrays[dim][out.id] = array[this.id];
        return out;
    }
    equals(other) {
        if (Object.is(other, this))
            return true;
        if (!Object.is(this.constructor, other.constructor))
            return false;
        return this._equals(this.arrays, this.id, other.arrays, other.id);
    }
    setFromOther(other) {
        for (const [dim, array] of other.arrays.entries())
            this.arrays[dim][this.id] = array[other.id];
        return this;
    }
    setTo(...values) {
        for (let [dim, value] of values.entries())
            this.arrays[dim][this.id] = value;
        return this;
    }
}
export class BaseMatrix extends Base {
    get is_identity() {
        return this._is_identity(this.arrays, this.id);
    }
    transposed(out) {
        this._transpose(this.arrays, this.id, out.arrays, out.id);
        return out;
    }
    transpose() {
        this._transpose_in_place(this.arrays, this.id);
        return this;
    }
    invert(out) {
        this._inverse(this.arrays, this.id, out.arrays, out.id);
        return out;
    }
    inverted() {
        this._inverse_in_place(this.arrays, this.id);
        return this;
    }
    mul(other) {
        this._multiply_in_place(this.arrays, this.id, other.arrays, other.id);
        return this;
    }
    times(other, out) {
        this._multiply(this.arrays, this.id, other.arrays, other.id, out.arrays, out.id);
        return out;
    }
    setToIdentity() {
        this._set_to_identity(this.arrays, this.id);
        return this;
    }
}
export class BaseRotationMatrix extends BaseMatrix {
    setRotationAroundX(angle, reset = true) {
        if (reset)
            this._set_to_identity(this.arrays, this.id);
        setSinCos(angle);
        this._set_rotation_around_x(this.arrays, this.id, cos, sin);
        return this;
    }
    setRotationAroundY(angle, reset = false) {
        if (reset)
            this._set_to_identity(this.arrays, this.id);
        setSinCos(angle);
        this._set_rotation_around_y(this.arrays, this.id, cos, sin);
        return this;
    }
    setRotationAroundZ(angle, reset = false) {
        if (reset)
            this._set_to_identity(this.arrays, this.id);
        setSinCos(angle);
        this._set_rotation_around_z(this.arrays, this.id, cos, sin);
        return this;
    }
}
export class BaseVector extends Base {
    lerp(to, by, out) {
        this._linearly_interpolate(this.arrays, this.id, to.arrays, to.id, by, out.arrays, out.id);
        return out;
    }
    add(other) {
        this._add_in_place(this.arrays, this.id, other.arrays, other.id);
        return this;
    }
    sub(other) {
        this._subtract_in_place(this.arrays, this.id, other.arrays, other.id);
        return this;
    }
    div(denominator) {
        this._divide_in_place(this.arrays, this.id, denominator);
        return this;
    }
    mul(factor_or_matrix) {
        if (typeof factor_or_matrix === 'number')
            this._scale_in_place(this.arrays, this.id, factor_or_matrix);
        else
            this._multiply_in_place(this.arrays, this.id, factor_or_matrix.arrays, factor_or_matrix.id);
        return this;
    }
    plus(other, out) {
        this._add(this.arrays, this.id, other.arrays, other.id, out.arrays, out.id);
        return out;
    }
    minus(other, out) {
        this._subtract(this.arrays, this.id, other.arrays, other.id, out.arrays, out.id);
        return out;
    }
    over(denominator, out) {
        this._divide(this.arrays, this.id, denominator, out.arrays, out.id);
        return out;
    }
    times(factor_or_matrix, out) {
        if (typeof factor_or_matrix === 'number')
            this._scale(this.arrays, this.id, factor_or_matrix, out.arrays, out.id);
        else
            this._multiply(this.arrays, this.id, factor_or_matrix.arrays, factor_or_matrix.id, out.arrays, out.id);
        return out;
    }
}
export class BaseColor extends BaseVector {
    setGreyScale(color) {
        for (const array of this.arrays)
            array[this.id] = color;
        return this;
    }
}
export class BaseColor3D extends BaseColor {
    constructor() {
        super(...arguments);
        this._dim = 3;
    }
    set r(r) { this.arrays[0][this.id] = r; }
    set g(g) { this.arrays[1][this.id] = g; }
    set b(b) { this.arrays[2][this.id] = b; }
    get r() { return this.arrays[0][this.id]; }
    get g() { return this.arrays[1][this.id]; }
    get b() { return this.arrays[2][this.id]; }
}
export class BaseColor4D extends BaseColor3D {
    constructor() {
        super(...arguments);
        this._dim = 4;
    }
    set a(a) { this.arrays[3][this.id] = a; }
    get a() { return this.arrays[3][this.id]; }
}
export class BaseDirection extends BaseVector {
    get length() {
        return this._length(this.arrays, this.id);
    }
    dot(other) {
        return this._dot(this.arrays, this.id, other.arrays, other.id);
    }
    normalize() {
        this._normalize_in_place(this.arrays, this.id);
        return this;
    }
    normalized(out) {
        this._normalize(this.arrays, this.id, out.arrays, out.id);
        return out;
    }
}
export class BasePosition extends BaseVector {
    to(other, out) {
        this._subtract(other.arrays, other.id, this.arrays, this.id, out.arrays, out.id);
        return out;
    }
}
export const UV_Mixin = (BaseClass) => class extends BaseClass {
    constructor() {
        super(...arguments);
        this._dim = 2;
    }
    set u(u) { this.arrays[0][this.id] = u; }
    set v(v) { this.arrays[1][this.id] = v; }
    get u() { return this.arrays[0][this.id]; }
    get v() { return this.arrays[1][this.id]; }
};
export const UVW_Mixin = (BaseClass) => class extends UV_Mixin(BaseClass) {
    constructor() {
        super(...arguments);
        this._dim = 3;
    }
    set w(w) { this.arrays[2][this.id] = w; }
    get w() { return this.arrays[2][this.id]; }
};
export const XY_Mixin = (BaseClass) => class extends BaseClass {
    constructor() {
        super(...arguments);
        this._dim = 2;
    }
    set x(x) { this.arrays[0][this.id] = x; }
    set y(y) { this.arrays[1][this.id] = y; }
    get x() { return this.arrays[0][this.id]; }
    get y() { return this.arrays[1][this.id]; }
};
export const XYZ_Mixin = (BaseClass) => class extends XY_Mixin(BaseClass) {
    constructor() {
        super(...arguments);
        this._dim = 3;
    }
    set z(z) { this.arrays[2][this.id] = z; }
    get z() { return this.arrays[2][this.id]; }
};
export const XYZW_Mixin = (BaseClass) => class extends XYZ_Mixin(BaseClass) {
    constructor() {
        super(...arguments);
        this._dim = 4;
    }
    set w(w) { this.arrays[3][this.id] = w; }
    get w() { return this.arrays[3][this.id]; }
};
export class BaseDirectionCrossed extends BaseDirection {
    cross(other) {
        this._cross_in_place(this.arrays, this.id, other.arrays, other.id);
        return this;
    }
    crossedWith(other, out) {
        this._cross(this.arrays, this.id, other.arrays, other.id, out.arrays, out.id);
        return out;
    }
}
export class BaseDirection2D extends XY_Mixin(BaseDirection) {
}
export class BaseDirection3D extends XYZ_Mixin(BaseDirectionCrossed) {
}
export class BaseDirection4D extends XYZW_Mixin(BaseDirectionCrossed) {
}
export class BasePosition2D extends XY_Mixin(BasePosition) {
}
export class BasePosition3D extends XYZ_Mixin(BasePosition) {
}
export class BasePosition4D extends XYZW_Mixin(BasePosition) {
}
export class BaseUV2D extends UV_Mixin(BasePosition2D) {
}
export class BaseUV3D extends UVW_Mixin(BasePosition3D) {
}
let sin, cos;
function setSinCos(angle) {
    sin = Math.sin(angle);
    cos = Math.cos(angle);
}
// export type MatrixConstructor = BaseConstructor<BaseMatrix>;
// export type AnyFunction<A = any> = (...input: any[]) => A
// export type AnyConstructor<A = object> = new (...input: any[]) => A
// export type Mixin<T extends AnyFunction> = InstanceType<ReturnType<T>>
//
//
// // mixin function
// export const MyMixin =
//     <T extends AnyConstructor<AlreadyImplements & BaseClass>>(base : T) =>
//
// // internal mixin class
//     class MyMixin extends base {
//         someProperty : string = 'initialValue'
//
//         someMethodFromAlreadyImplementsMixin (arg : number) {
//             const res = super.someMethodFromAlreadyImplementsMixin(arg)
//             // ...
//             return res + 1
//         }
//
//         someMethodToBeImplementedInTheConsumingClass () : number {
//             throw new Error('Abstract method called')
//         }
//
//         someNewMethod () {
//             if (this.someMethodToBeImplementedInTheConsumingClass() === 42) {
//                 this.methodFromTheBaseClass()
//             }
//         }
//     }
//
// // the "instance type" of this mixin
// export type MyMixin = Mixin<typeof MyMixin>
// // or, alternatively (see the Recursive types problem section below for details)
// export interface MyMixin extends Mixin<typeof MyMixin> {}
//
// // "minimal" class builder
// export const BuildMinimalMyMixin =
//     (base : typeof BaseClass = BaseClass) : AnyConstructor<MyMixin> =>
//         AlreadyImplements(
//             base
//         )
//
// export class MinimalMyMixin extends BuildMinimalMyMixin() {}
// // or, alternatively
// export const MinimalMyMixin = BuildMinimalMyMixin()
// export type MinimalMyMixin = InstanceType<typeof MinimalMyMixin>
//
// export class Position extends Vector {
//     to(other: this, out: Direction) : Direction {
//         this._subtract(
//             other.arrays, other.id,
//             this.arrays, this.id,
//             out.arrays, out.id
//         );
//
//         return out;
//     }
// }
// export class Direction extends Vector {
//     protected _dot: ff_n;
//     protected _length: f_n;
//
//     protected _normalize : ff_v;
//     protected _normalize_in_place : f_v;
//
//     protected _cross : fff_v;
//     protected _cross_in_place : lr_v;
//
//     get length() : number {
//         return this._length(this.arrays, this.id);
//     }
//
//     dot(other: this) : number {
//         return this._dot(
//             this.arrays, this.id,
//             other.arrays, other.id
//         );
//     }
//
//     normalize() : this {
//         this._normalize_in_place(this.arrays, this.id);
//
//         return this;
//     }
//
//     normalized(out: this) : this {
//         this._normalize(
//             this.arrays, this.id,
//             out.arrays, out.id
//         );
//
//         return out;
//     }
//
//     cross(other: this) : this {
//         this._cross_in_place(
//             this.arrays, this.id,
//             other.arrays, other.id
//         );
//
//         return this;
//     }
//
//     crossedWith(other: this, out: this) : this {
//         this._cross(
//             this.arrays, this.id,
//             other.arrays, other.id,
//             out.arrays, out.id
//         );
//
//         return out;
//     }
// }
// export class Matrix {
//     protected _dim: number;
//
//     constructor(
//         public arrays: Float32Array
//     ) {
//         if (arrays.length !== this._dim) throw `arrays must be an array of length ${this._dim}! Got ${arrays.length}`
//     }
//
//     copyTo(out: this) : this {
//         out.arrays.set(this.arrays);
//         return out;
//     }
//
//     equals(other: this) : boolean {
//         if (Object.is(other, this) ||
//             Object.is(other.arrays, this.arrays) ||
//             Object.is(other.arrays.buffer, this.arrays.buffer))
//             return true;
//
//         if (!Object.is(this.constructor, other.constructor))
//             return false;
//
//         for (const [dim, value] of this.arrays.entries())
//             if (value.toFixed(PRECISION_DIGITS) !==
//                 other.arrays[dim].toFixed(PRECISION_DIGITS))
//                 return false;
//
//         return true;
//     }
//
//     setFromOther(other: this) : this {
//         this.arrays.set(other.arrays);
//
//         return this;
//     }
//
//     setTo(...values: number[]) : this {
//         this.arrays.set(values);
//
//         return this;
//     }
//
//     protected _is_identity: m_b;
//     protected _set_to_identity: m_v;
//     protected _set_rotation_around_x: mnb_v;
//     protected _set_rotation_around_y: mnb_v;
//     protected _set_rotation_around_z: mnb_v;
//
//     protected _transpose: mm_v;
//     protected _transpose_in_place: m_v;
//
//     protected _multiply : mmm_v;
//     protected _multiply_in_place : mm_v;
//
//     get is_identity() : boolean {
//         return this._is_identity(this.arrays);
//     }
//
//     transposed(out: this) : this {
//         this._transpose(
//             this.arrays,
//             out.arrays
//         );
//
//         return out;
//     }
//
//     transpose() : this {
//         this._transpose_in_place(this.arrays);
//
//         return this;
//     }
//
//     mul(other: this) : this {
//         this._multiply_in_place(
//             this.arrays,
//             other.arrays
//         );
//
//         return this;
//     }
//
//     times(other: this, out: this) : this {
//         this._multiply(
//             this.arrays,
//             other.arrays,
//             out.arrays
//         );
//
//         return out;
//     }
//
//     setToIdentity() : this {
//         this._set_to_identity(this.arrays);
//
//         return this;
//     }
//
//     setRotationAroundX(angle=0, reset=true) : this {
//         this._set_rotation_around_x(this.arrays, angle, reset);
//
//         return this;
//     }
//
//     setRotationAroundY(angle: number, reset=false) : this {
//         this._set_rotation_around_y(this.arrays, angle, reset);
//
//         return this;
//     }
//
//     setRotationAroundZ(angle: number, reset=false) : this {
//         this._set_rotation_around_z(this.arrays, angle, reset);
//
//         return this;
//     }
// }
//# sourceMappingURL=base.js.map