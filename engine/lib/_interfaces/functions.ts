import {Float16, Float2, Float3, Float4, Float9, Tuple} from "../../types.js";
import {FloatNAllocator} from "../memory/allocators.js";
import {DIM} from "../../constants.js";

export type Arrays = Float2 | Float3 | Float4 | Float9 | Float16;

export interface IFunctionSet
{
    allocator: FloatNAllocator;

    set_to(a: number, []: Arrays, ...values: number[]): void;
    set_all_to(a: number, []: Arrays, value: number): void;
    set_from(a: number, []: Arrays, o: number, []: Arrays): void;

    equals(a: number, []: Arrays, b: number, []: Arrays): boolean;
}

export interface IMathFunctionSet
    extends IFunctionSet
{
    add(a: number, []: Arrays, b: number, []: Arrays, o: number, []: Arrays): void;
    add_in_place(a: number, []: Arrays, b: number, []: Arrays): void;

    subtract(a: number, []: Arrays, b: number, []: Arrays, o: number, []: Arrays): void;
    subtract_in_place(a: number, []: Arrays, b: number, []: Arrays): void;

    multiply(a: number, []: Arrays, m: number, []: Arrays, o: number, []: Arrays): void;
    multiply_in_place(a: number, []: Arrays, m: number, []: Arrays): void;

    divide(a: number, []: Arrays, b: number, o: number, []: Arrays): void;
    divide_in_place(a: number, []: Arrays, b: number): void;

    scale(a: number, []: Arrays, b: number, o: number, []: Arrays): void;
    scale_in_place(a: number, []: Arrays, b: number): void;

    invert(a: number, []: Arrays, b: number, []: Arrays): void;
    invert_in_place(a: number, []: Arrays): void;
}

export interface IMatrixFunctionSet
    extends IMathFunctionSet
{
    is_identity(a: number, []: Arrays): boolean;
    set_to_identity(a: number, []: Arrays): void;

    transpose(a: number, []: Arrays, o: number, []: Arrays): void;
    transpose_in_place(a: number, []: Arrays): void;
}

export interface IMatrix2x2FunctionSet
    extends IMatrixFunctionSet
{
    set_rotation(a: number, []: Arrays, cos: number, sin: number): void;
}

export interface IMatrixRotationFunctionSet
    extends IMatrixFunctionSet
{
    set_rotation_around_x(a: number, []: Arrays, cos: number, sin: number): void;
    set_rotation_around_y(a: number, []: Arrays, cos: number, sin: number): void;
    set_rotation_around_z(a: number, []: Arrays, cos: number, sin: number): void;
}

export interface IVectorFunctionSet
    extends IMathFunctionSet
{
    lerp(a: number, []: Arrays, b: number, []: Arrays, o: number, []: Arrays, t: number): void;
}

export interface ITransformableVectorFunctionSet
    extends IVectorFunctionSet
{
    matrix_multiply(a: number, []: Arrays, m: number, []: Arrays, o: number, []: Arrays): void;
    matrix_multiply_in_place(a: number, []: Arrays, m: number, []: Arrays): void;
}

export interface ITransformableAttributeFunctionSet<Dim extends DIM>
{
    matrix_multiply_all(
        []: Tuple<Float32Array, Dim>,
        m: number, []: Arrays,
        []: Tuple<Float32Array, Dim>
    ): void;

    matrix_multiply_in_place_all(
        []: Tuple<Float32Array, Dim>,
        m: number, []: Arrays
    ): void;
}

export interface IPositionAttribute3DFunctionSet
    extends ITransformableAttributeFunctionSet<DIM._3D>
{
    matrix_multiply_all_positions_by_mat4([]: Float3, m: number, []: Float16, []: Float4): void;
}

export interface IDirectionAttribute3DFunctionSet
    extends ITransformableAttributeFunctionSet<DIM._3D>
{
    matrix_multiply_all_directions_by_mat4([]: Float3, m: number, []: Float16, []: Float4): void;
    normalize_all_in_place([]: Float3): void;
}

export interface IDirectionAttribute4DFunctionSet
    extends ITransformableAttributeFunctionSet<DIM._4D>
{
    normalize_all_in_place([]: Float4): void;
}

// export interface IPositionAttribute4DFunctionSet
//     extends ITransformableAttributeFunctionSet<DIM._4D>
// {
//     in_view_all([Xa, Ya, Za, Wa]: Float4, mask?: Uint8Array): boolean;
//     in_view_any([Xa, Ya, Za, Wa]: Float4): boolean;
//     in_view_tri(
//         x1: number, y1: number, z1: number, w1: number,
//         x2: number, y2: number, z2: number, w2: number,
//         x3: number, y3: number, z3: number, w3: number
//     ): boolean;
//
//     to_ndc_all([]: Arrays, []: Arrays, mask?: Uint8Array): void;
//     to_ndc_all_in_place([]: Arrays, mask?: Uint8Array): void;
// }

export interface IPositionFunctionSet
    extends ITransformableVectorFunctionSet
{
    distance(a: number, []: Arrays, o: number, []: Arrays);
    distance_squared(a: number, []: Arrays, o: number, []: Arrays);
}

export interface IPosition3DFunctionSet
    extends IPositionFunctionSet
{
    matrix_multiply_position_by_mat4(a: number, []: Arrays, m: number, []: Arrays, o: number, []: Arrays): void;
}

// export interface IPosition4DFunctionSet
//     extends IPositionFunctionSet
// {
//     in_view(
//         x: number,
//         y: number,
//         z: number,
//         w: number,
//
//         n: number,
//         f: number
//     ) : boolean;
//
//     to_ndc(a: number, []: Arrays, o: number, []: Arrays): void;
//     to_ndc_in_place(a: number, []: Arrays): void;
// }

export interface IDirectionFunctionSet
    extends ITransformableVectorFunctionSet
{
    length(a: number, []: Arrays): number;
    length_squared(a: number, []: Arrays): number;

    normalize(a: number, []: Arrays, o: number, []: Arrays): void;
    normalize_in_place(a: number, []: Arrays): void;

    dot(a: number, []: Arrays, b: number, []: Arrays): number;
}

export interface ICrossDirectionFunctionSet
    extends IDirectionFunctionSet
{
    cross(a: number, []: Arrays, b: number, []: Arrays, o: number, []: Arrays): void;
    cross_in_place(a: number, []: Arrays, b: number, []: Arrays): void;
}

export interface IDirection3DFunctionSet
    extends ICrossDirectionFunctionSet
{
    matrix_multiply_direction_by_mat4(a: number, []: Arrays, m: number, []: Arrays, o: number, []: Arrays): void;
}