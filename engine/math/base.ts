import {f_b, f_v, ff_b, ff_v, fff_v, FloatArrays, fnn_v, MatrixValues, VectorValues} from "../types.js";

abstract class AbstractBase {
    protected constructor(
        public id: number,
        public arrays: FloatArrays
    ){}
}

export default class Base implements AbstractBase {
    protected _dim: number;
    protected _equals: ff_b;

    constructor(
        public arrays: VectorValues | MatrixValues,
        public id: number = 0
    ) {
        if (id < 0) throw `ID must be positive integer, got ${id}`;
        if (arrays.length !== this._dim) throw `Data must be an array of length ${this._dim}! Got ${arrays.length}`;
    }

    copyTo(out: this) : this {
        for (const [dim, array] of this.arrays.entries())
            out.arrays[dim][out.id] = array[this.id];

        return out;
    }

    equals(other: this) : boolean {
        if (Object.is(other, this))
            return true;

        if (!Object.is(this.constructor, other.constructor))
            return false;

        return this._equals(
            this.arrays,
            this.id,

            other.arrays,
            other.id
        );
    }

    setFromOther(other: this) : this {
        for (const [dim, array] of other.arrays.entries())
            this.arrays[dim][this.id] = array[other.id];

        return this;
    }

    setTo(...values: number[]) : this {
        for (let [dim, value] of values.entries())
            this.arrays[dim][this.id] = value;

        return this;
    }
}


export class BaseMatrix extends Base {
    public arrays: MatrixValues;

    protected _is_identity: f_b;
    protected _set_identity: f_v;

    protected _transpose: ff_v;
    protected _transpose_in_place: f_v;

    protected _inverse: ff_v;
    protected _inverse_in_place: f_v;

    protected _multiply : fff_v;
    protected _multiply_in_place : ff_v;

    get is_identity() : boolean {
        return this._is_identity(
            this.arrays,
            this.id
        );
    }

    setToIdentity() : this {
        this._set_identity(
            this.arrays,
            this.id
        );

        return this;
    }

    transposed(out: this) : this {
        this._transpose(
            this.arrays,
            this.id,

            out.arrays,
            out.id
        );

        return out;
    }

    transpose() : this {
        this._transpose_in_place(
            this.arrays,
            this.id
        );

        return this;
    }

    invert(out: this) : this {
        this._inverse(
            this.arrays,
            this.id,

            out.arrays,
            out.id
        );

        return out;
    }

    inverted() : this {
        this._inverse_in_place(
            this.arrays,
            this.id
        );

        return this;
    }

    mul(other: this) : this {
        this._multiply_in_place(
            this.arrays,
            this.id,

            other.arrays,
            other.id
        );

        return this;
    }

    times(other: this, out: this) : this {
        this._multiply(
            this.arrays,
            this.id,

            other.arrays,
            other.id,

            out.arrays,
            out.id
        );

        return out;
    }
}

export class BaseRotationMatrix extends BaseMatrix {
    protected _set_rotation_around_x: fnn_v;
    protected _set_rotation_around_y: fnn_v;
    protected _set_rotation_around_z: fnn_v;

    setRotationAroundX(angle, reset=true) : this {
        if (reset) this._set_identity(this.arrays, this.id);
        setSinCos(angle);
        this._set_rotation_around_x(this.arrays, this.id, cos, sin);

        return this;
    }

    setRotationAroundY(angle: number, reset=false) : this {
        if (reset) this._set_identity(this.arrays, this.id);
        setSinCos(angle);
        this._set_rotation_around_y(this.arrays, this.id, cos, sin);

        return this;
    }

    setRotationAroundZ(angle: number, reset=false) : this {
        if (reset) this._set_identity(this.arrays, this.id);
        setSinCos(angle);
        this._set_rotation_around_z(this.arrays, this.id, cos, sin);

        return this;
    }
}


let sin, cos;
function setSinCos(angle: number) {
    sin = Math.sin(angle);
    cos = Math.cos(angle);
}

export type BaseConstructor<Abstract = AbstractBase> = new(arrays: VectorValues | MatrixValues, id?: number) => Abstract;
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