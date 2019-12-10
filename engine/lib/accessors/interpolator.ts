import {Accessor} from "./accessor.js";
import {IAccessor} from "../_interfaces/accessors.js";
import {Float2, Float3} from "../../types.js";
import {IBarycentricInterpolator, ILinearInterpolator} from "../_interfaces/interpolators.js";
import {barycentricInterpolatorFunctions, linearInterpolatorFunctions} from "../math/interpolation.js";


export class LinearInterpolator<AccessorType extends IAccessor = IAccessor>
    extends Accessor
    implements ILinearInterpolator<AccessorType>
{
    readonly _ = linearInterpolatorFunctions;
    public arrays: Float2;

    _newOut(): this {
        return this._new();
    }

    setTo(from: number, to: number): this {
        this._.set_to(
            this.id, this.arrays,
            from, to
        );

        return this;
    }

    interpolate(from: AccessorType, to: AccessorType, out?: AccessorType): AccessorType {
        if (out) {
            this._.linearly_interpolate(
                this.id, this.arrays,
                from.id, from.arrays,
                to.id, to.arrays,
                out.id, out.arrays
            );

            return out;
        }

        this._.linearly_interpolate_in_place(
            this.id, this.arrays,
            from.id, from.arrays,
            to.id, to.arrays,
        );

        return from;
    }

    set t(t: number) {this.arrays[0][this.id] = t}
    get t(): number {return this.arrays[0][this.id]}

    set one_minus_t(one_minus_t: number) {this.arrays[1][this.id] = one_minus_t}
    get one_minus_t(): number {return this.arrays[1][this.id]}
}


export class BarycentricInterpolator<AccessorType extends IAccessor = IAccessor>
    extends Accessor
    implements IBarycentricInterpolator<AccessorType>
{
    readonly _ = barycentricInterpolatorFunctions;
    public arrays: Float3;

    _newOut(): this {
        return this._new();
    }

    setTo(w1: number, w2: number, w3: number): this {
        this._.set_to(
            this.id, this.arrays,
            w1, w2, w3
        );

        return this;
    }

    interpolate(from: AccessorType, to: AccessorType, out?: AccessorType): AccessorType {
        if (out) {
            this._.barycentric_interpolate(
                this.id, this.arrays,
                from.id, from.arrays,
                to.id, to.arrays,
                out.id, out.arrays
            );

            return out;
        }

        this._.barycentric_interpolate_in_place(
            this.id, this.arrays,
            from.id, from.arrays,
            to.id, to.arrays,
        );

        return from;
    }

    set w1(w1: number) {this.arrays[0][this.id] = w1}
    get w1(): number {return this.arrays[0][this.id]}

    set w2(w2: number) {this.arrays[1][this.id] = w2}
    get w2(): number {return this.arrays[1][this.id]}

    set w3(w3: number) {this.arrays[2][this.id] = w3}
    get w3(): number {return this.arrays[2][this.id]}
}