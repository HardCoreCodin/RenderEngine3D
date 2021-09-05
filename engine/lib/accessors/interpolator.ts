// import {Accessor} from "./accessor.js";
// import {IAccessor} from "../_interfaces/accessors.js";
// // import {Float2, Float3} from "../../types.js";
// import {ILinearInterpolator} from "../_interfaces/interpolators.js";
// import {VECTOR_2D_ALLOCATOR} from "../memory/allocators.js";
// import {I2D} from "../_interfaces/vectors.js";
// import {check_if_two_2D_vectrs_are_equal} from "../math/vec2.js";
// // import {barycentricInterpolatorFunctions, linearInterpolatorFunctions} from "../math/rendering/interpolation.js";
// // import {IBarycentricInterpolatorFunctionSet, ILinearInterpolatorFunctionSet} from "../_interfaces/functions.js";
// //
// //
// export class LinearInterpolator<Other extends Accessor = Accessor>
//     extends Accessor
//     implements ILinearInterpolator<Other>
// {
//     protected _getAllocator() {return VECTOR_2D_ALLOCATOR}
//
//     copy(out: LinearInterpolator = new LinearInterpolator()): LinearInterpolator {return out.setFrom(this)}
//
//     setTo(t: number, one_minus_t: number): this {
//         this.array[0] = t;
//         this.array[1] = one_minus_t;
//         return this;
//     }
//
//     setAllTo(value: number): this {
//         this.array.fill(value);
//         return this;
//     }
//
//     setFrom(other: LinearInterpolator): this {
//         this.array.set(other.array);
//         return this;
//     }
//
//     equals(other: LinearInterpolator): boolean {
//         return check_if_two_2D_vectrs_are_equal(this.array, other.array);
//     }
//
//     interpolate(from: Other, to: Other, out?: Other): Other {
//         if (out) {
//             this._.linearly_interpolate(
//                 this.id, this.array,
//                 from.id, from.array,
//                 to.id, to.array,
//                 out.id, out.array
//             );
//
//             return out;
//         }
//
//         this._.linearly_interpolate_in_place(
//             this.id, this.array,
//             from.id, from.array,
//             to.id, to.array,
//         );
//
//         return from;
//     }
//
//     set t(t: number) {this.array[0] = t}
//     get t(): number {return this.array[0]}
//
//     set one_minus_t(one_minus_t: number) {this.array[1] = one_minus_t}
//     get one_minus_t(): number {return this.array[1]}
// }
// //
// //
// // export class BarycentricInterpolator<AccessorType extends IAccessor = IAccessor> extends Accessor
// //     implements IBarycentricInterpolator<AccessorType>
// // {
// //     readonly _: IBarycentricInterpolatorFunctionSet;
// //     protected _getFunctionSet(): IBarycentricInterpolatorFunctionSet {return barycentricInterpolatorFunctions}
// //
// //     public array: Float3;
// //
// //     setTo(w1: number, w2: number, w3: number): this {
// //         this._.set_to(
// //             this.id, this.array,
// //             w1, w2, w3
// //         );
// //
// //         return this;
// //     }
// //
// //     interpolate(from: AccessorType, to: AccessorType, out?: AccessorType): AccessorType {
// //         if (out) {
// //             this._.barycentric_interpolate(
// //                 this.id, this.array,
// //                 from.id, from.array,
// //                 to.id, to.array,
// //                 out.id, out.array
// //             );
// //
// //             return out;
// //         }
// //
// //         this._.barycentric_interpolate_in_place(
// //             this.id, this.array,
// //             from.id, from.array,
// //             to.id, to.array,
// //         );
// //
// //         return from;
// //     }
// //
// //     set w1(w1: number) {this.array[0][this.id] = w1}
// //     get w1(): number {return this.array[0][this.id]}
// //
// //     set w2(w2: number) {this.array[1][this.id] = w2}
// //     get w2(): number {return this.array[1][this.id]}
// //
// //     set w3(w3: number) {this.array[2][this.id] = w3}
// //     get w3(): number {return this.array[2][this.id]}
// // }