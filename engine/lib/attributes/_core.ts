import {
    multiply_all_2D_vectors_by_a_2x2_matrix_in_place,
    multiply_all_2D_vectors_by_a_2x2_matrix_to_out,
    normalize_all_2D_directions_in_place,
    normalize_some_2D_directions_in_place
} from "../math/vec2.js";
import {
    multiply_all_3D_directions_by_a_4x4_matrix_to_out,
    multiply_all_3D_positions_by_a_4x4_matrix_to_out,
    multiply_all_3D_vectors_by_a_3x3_matrix_in_place,
    multiply_all_3D_vectors_by_a_3x3_matrix_to_out,
    multiply_some_3D_directions_by_a_4x4_matrix_to_out,
    multiply_some_3D_positions_by_a_4x4_matrix_to_out,
    normalize_all_3D_directions_in_place,
    normalize_some_3D_directions_in_place
} from "../math/vec3.js";
import {
    multiply_all_4D_vectors_by_a_4x4_matrix_in_place,
    multiply_all_4D_vectors_by_a_4x4_matrix_to_out,
    normalize_all_4D_directions_in_place,
    normalize_some_4D_directions_in_place
} from "../math/vec4.js";

let i: number;
const rand = Math.random;

export const _randomize2D = (
    array_1: Float32Array,
    array_2: Float32Array,
): void => {
    for (i = 0; i < array_1.length; i++) {
        array_1[i] = rand();
        array_2[i] = rand();
    }
};

export const _randomize3D = (
    array_1: Float32Array,
    array_2: Float32Array,
    array_3: Float32Array,
): void => {
    for (i = 0; i < array_1.length; i++) {
        array_1[i] = rand();
        array_2[i] = rand();
        array_3[i] = rand();
    }
};

export const _randomize4D = (
    array_1: Float32Array,
    array_2: Float32Array,
    array_3: Float32Array,
    array_4: Float32Array
): void => {
    for (i = 0; i < array_1.length; i++) {
        array_1[i] = rand();
        array_2[i] = rand();
        array_3[i] = rand();
        array_4[i] = rand();
    }
};

export const _norm2D = (
    arrays: Float32Array[],
    include?: Uint8Array[]
): void => include ?
    normalize_some_2D_directions_in_place(arrays[0], arrays[1], include) :
    normalize_all_2D_directions_in_place(arrays[0], arrays[1]);

export const _norm3D = (
    arrays: Float32Array[],
    include?: Uint8Array[]
): void => include ?
    normalize_some_3D_directions_in_place(arrays[0], arrays[1], arrays[2], include) :
    normalize_all_3D_directions_in_place(arrays[0], arrays[1], arrays[2]);

export const _norm4D = (
    arrays: Float32Array[],
    include?: Uint8Array[]
): void => include ?
    normalize_some_4D_directions_in_place(arrays[0], arrays[1], arrays[2], arrays[3], include) :
    normalize_all_4D_directions_in_place(arrays[0], arrays[1], arrays[2], arrays[3]);

export const _mulVec2Mat2IP = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number
): void => multiply_all_2D_vectors_by_a_2x2_matrix_in_place(
    this_arrays[0],
    this_arrays[1],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1],
    matrix_arrays[2], matrix_arrays[3]
);

export const _mulVec2Mat2 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    out_arrays: Float32Array[]
): void => multiply_all_2D_vectors_by_a_2x2_matrix_to_out(
    this_arrays[0],
    this_arrays[1],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1],
    matrix_arrays[2], matrix_arrays[3],

    out_arrays[0],
    out_arrays[1]
);

export const _mulVec3Mat3IP = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number
): void => multiply_all_3D_vectors_by_a_3x3_matrix_in_place(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2],
    matrix_arrays[3], matrix_arrays[4], matrix_arrays[5],
    matrix_arrays[6], matrix_arrays[7], matrix_arrays[8]
);

export const _mulVec3Mat3 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    out_arrays: Float32Array[]
): void => multiply_all_3D_vectors_by_a_3x3_matrix_to_out(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2],
    matrix_arrays[3], matrix_arrays[4], matrix_arrays[5],
    matrix_arrays[6], matrix_arrays[7], matrix_arrays[8],

    out_arrays[0],
    out_arrays[1],
    out_arrays[2]
);

export const _mulVec4Mat4IP = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number
): void => multiply_all_4D_vectors_by_a_4x4_matrix_in_place(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],
    this_arrays[3],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2], matrix_arrays[3],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6], matrix_arrays[7],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10], matrix_arrays[11],
    matrix_arrays[12], matrix_arrays[13], matrix_arrays[14], matrix_arrays[15]
);

export const _mulVec4Mat4 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    out_arrays: Float32Array[]
): void => multiply_all_4D_vectors_by_a_4x4_matrix_to_out(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],
    this_arrays[3],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2], matrix_arrays[3],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6], matrix_arrays[7],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10], matrix_arrays[11],
    matrix_arrays[12], matrix_arrays[13], matrix_arrays[14], matrix_arrays[15],

    out_arrays[0],
    out_arrays[1],
    out_arrays[2],
    out_arrays[3]
);

export const _mulAllDir3Mat4 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    out_arrays: Float32Array[]
): void => multiply_all_3D_directions_by_a_4x4_matrix_to_out(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2], matrix_arrays[3],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6], matrix_arrays[7],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10], matrix_arrays[11],
    matrix_arrays[12], matrix_arrays[13], matrix_arrays[14], matrix_arrays[15],

    out_arrays[0],
    out_arrays[1],
    out_arrays[2],
    out_arrays[3]
);

export const _mulSomeDir3Mat4 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    include: Uint8Array[],
    out_arrays: Float32Array[]
): void => multiply_some_3D_directions_by_a_4x4_matrix_to_out(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2], matrix_arrays[3],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6], matrix_arrays[7],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10], matrix_arrays[11],
    matrix_arrays[12], matrix_arrays[13], matrix_arrays[14], matrix_arrays[15],

    include,

    out_arrays[0],
    out_arrays[1],
    out_arrays[2],
    out_arrays[3]
);

export const _mulSomePos3Mat4 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    include: Uint8Array[],
    out_arrays: Float32Array[]
): void => multiply_some_3D_positions_by_a_4x4_matrix_to_out(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2], matrix_arrays[3],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6], matrix_arrays[7],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10], matrix_arrays[11],
    matrix_arrays[12], matrix_arrays[13], matrix_arrays[14], matrix_arrays[15],

    include,

    out_arrays[0],
    out_arrays[1],
    out_arrays[2],
    out_arrays[3]
);

export const _mulAllPos3Mat4 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    out_arrays: Float32Array[]
): void => multiply_all_3D_positions_by_a_4x4_matrix_to_out(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2], matrix_arrays[3],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6], matrix_arrays[7],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10], matrix_arrays[11],
    matrix_arrays[12], matrix_arrays[13], matrix_arrays[14], matrix_arrays[15],

    out_arrays[0],
    out_arrays[1],
    out_arrays[2],
    out_arrays[3]
);