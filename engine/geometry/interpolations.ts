// import {ATTRIBUTE, DIM} from "../../constants.js";
// import {FACE_AREAS_ALLOCATOR, VECTOR_2D_ALLOCATOR, VECTOR_3D_ALLOCATOR} from "../memory/allocators.js";
// import {BarycentricInterpolator, LinearInterpolator} from "../accessors/interpolator.js";
// import {Attribute} from "./attributes.js";
// import {barycentricInterpolatorAttributeFunctions, linearInterpolatorAttributeFunctions} from "../math/rendering/interpolation.js";
// import {IBuffer} from "../_interfaces/buffers.js";
// import {Arrays} from "../_interfaces/functions.js";
// import {FromToIndicesInt16, FromToIndicesInt32, FromToIndicesInt8} from "./indices.js";
// import {Int2} from "../../types.js";
// import {FloatBuffer} from "../memory/buffers.js";
//
//
// export abstract class LinearInterpolatorAttribute<
//     Dim extends DIM,
//     IterpolatedAttribute extends IBuffer<Dim> = IBuffer<Dim>>
//     extends Attribute<ATTRIBUTE.interpolator, DIM._2D, LinearInterpolator>
// {
//     readonly attribute = ATTRIBUTE.interpolator;
//     _ = linearInterpolatorAttributeFunctions;
//     dim = DIM._2D as DIM._2D;
//     allocator = VECTOR_2D_ALLOCATOR;
//     readonly Vector = LinearInterpolator;
//
//     interpolateAll(
//         from: IterpolatedAttribute,
//         to: IterpolatedAttribute = from,
//         out: IterpolatedAttribute = from
//     ): IterpolatedAttribute
//     {
//         if (Object.is(out, from)) {
//             this._.linearly_interpolate_in_place_all(
//                 this.array,
//                 from.array as Arrays,
//                 to.array as Arrays,
//             );
//         } else {
//             this._.linearly_interpolate_all(
//                 this.array,
//                 from.array as Arrays,
//                 to.array as Arrays,
//                 out.array as Arrays
//             );
//         }
//
//         return out;
//     }
//
//     interpolateSome(
//         flags: Uint8Array,
//         from_to_indices: FromToIndicesInt8|FromToIndicesInt16|FromToIndicesInt32,
//         from: IterpolatedAttribute,
//         to: IterpolatedAttribute = from,
//         out: IterpolatedAttribute = from
//     ): IterpolatedAttribute
//     {
//         if (Object.is(out, from)) {
//             this._.linearly_interpolate_in_place_some(
//                 flags,
//                 from_to_indices.array as Int2,
//                 this.array,
//                 from.array as Arrays,
//                 to.array as Arrays,
//             );
//         } else {
//             this._.linearly_interpolate_some(
//                 flags,
//                 from_to_indices.array as Int2,
//                 this.array,
//                 from.array as Arrays,
//                 to.array as Arrays,
//                 out.array as Arrays
//             );
//         }
//
//         return out;
//     }
// }
//
// export class LinearInterpolator2D extends LinearInterpolatorAttribute<DIM._2D> {}
// export class LinearInterpolator3D extends LinearInterpolatorAttribute<DIM._3D> {}
// export class LinearInterpolator4D extends LinearInterpolatorAttribute<DIM._4D> {}
//
//
// export class BarycentricInterpolatorAttribute<
//     Dim extends DIM,
//     IterpolatedAttribute extends IBuffer<Dim> = IBuffer<Dim>>
//     extends Attribute<ATTRIBUTE.barycentric, DIM._3D, BarycentricInterpolator>
// {
//     readonly attribute = ATTRIBUTE.barycentric;
//     _ = barycentricInterpolatorAttributeFunctions;
//     readonly Vector = BarycentricInterpolator;
//     dim = DIM._3D as DIM._3D;
//     allocator = VECTOR_3D_ALLOCATOR;
//
//     interpolate(
//         from: IterpolatedAttribute,
//         to: IterpolatedAttribute,
//         out?: IterpolatedAttribute
//     ): IterpolatedAttribute
//     {
//         if (out) {
//             this._.barycentric_interpolate_all(
//                 this.array,
//                 from.array as Arrays,
//                 to.array as Arrays,
//                 out.array as Arrays
//             );
//
//             return out;
//         }
//
//         this._.barycentric_interpolate_in_place_all(
//             this.array,
//             from.array as Arrays,
//             to.array as Arrays,
//         );
//
//         return from;
//     }
// }
//
// export class BarycentricInterpolator2D extends BarycentricInterpolatorAttribute<DIM._2D> {}
// export class BarycentricInterpolator3D extends BarycentricInterpolatorAttribute<DIM._3D> {}
// export class BarycentricInterpolator4D extends BarycentricInterpolatorAttribute<DIM._4D> {}
//
//
// export class FaceAreas extends FloatBuffer<DIM._3D>
// {
//     readonly dim = DIM._3D as DIM._3D;
//     readonly allocator = FACE_AREAS_ALLOCATOR;
// }