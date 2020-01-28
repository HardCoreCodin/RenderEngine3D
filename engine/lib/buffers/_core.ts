import {
    multiply_all_2D_vectors_by_a_2x2_matrix_in_place,
    multiply_all_2D_vectors_by_a_2x2_matrix_to_out,
    multiply_some_2D_vectors_by_a_2x2_matrix_in_place,
    multiply_some_2D_vectors_by_a_2x2_matrix_to_out,
    normalize_all_2D_directions_in_place,
    normalize_some_2D_directions_in_place
} from "../math/vec2.js";
import {
    multiply_all_3D_directions_by_a_4x3_matrix_to_out4,
    multiply_all_3D_positions_by_a_3x4_matrix_in_place,
    multiply_all_3D_positions_by_a_3x4_matrix_to_out3,
    multiply_all_3D_positions_by_a_4x4_matrix_to_out4,
    multiply_all_3D_vectors_by_a_3x3_matrix_in_place,
    multiply_all_3D_vectors_by_a_3x3_matrix_to_out,
    multiply_some_3D_directions_by_a_4x3_matrix_to_out4,
    multiply_some_3D_positions_by_a_3x4_matrix_in_place,
    multiply_some_3D_positions_by_a_3x4_matrix_to_out3,
    multiply_some_3D_positions_by_a_4x4_matrix_to_out4,
    multiply_some_3D_vectors_by_a_3x3_matrix_in_place,
    multiply_some_3D_vectors_by_a_3x3_matrix_to_out,
    normalize_all_3D_directions_in_place,
    normalize_some_3D_directions_in_place
} from "../math/vec3.js";
import {
    multiply_all_4D_vectors_by_a_4x4_matrix_in_place,
    multiply_all_4D_vectors_by_a_4x4_matrix_to_out,
    multiply_some_4D_vectors_by_a_4x4_matrix_in_place,
    multiply_some_4D_vectors_by_a_4x4_matrix_to_out,
    normalize_all_4D_directions_in_place,
    normalize_some_4D_directions_in_place
} from "../math/vec4.js";

let i: number;
const rand = Math.random;

let array_1,
    array_2,
    array_3,
    array_4: Float32Array;

export const randomize2D = (arrays: Float32Array[]): void => {
    array_1 = arrays[0];
    array_2 = arrays[1];

    for (i = 0; i < array_1.length; i++) {
        array_1[i] = rand();
        array_2[i] = rand();
    }
};

export const randomize3D = (arrays: Float32Array[]): void => {
    array_1 = arrays[0];
    array_2 = arrays[1];
    array_3 = arrays[2];

    for (i = 0; i < array_1.length; i++) {
        array_1[i] = rand();
        array_2[i] = rand();
        array_3[i] = rand();
    }
};

export const randomize4D = (arrays: Float32Array[]): void => {
    array_1 = arrays[0];
    array_2 = arrays[1];
    array_3 = arrays[2];
    array_4 = arrays[3];

    for (i = 0; i < array_1.length; i++) {
        array_1[i] = rand();
        array_2[i] = rand();
        array_3[i] = rand();
        array_4[i] = rand();
    }
};

export const normalize2D = (
    arrays: Float32Array[],
    include?: Uint8Array[]
): void => include ?
    normalize_some_2D_directions_in_place(arrays[0], arrays[1], include) :
    normalize_all_2D_directions_in_place(arrays[0], arrays[1]);

export const normalize3D = (
    arrays: Float32Array[],
    include?: Uint8Array[]
): void => include ?
    normalize_some_3D_directions_in_place(arrays[0], arrays[1], arrays[2], include) :
    normalize_all_3D_directions_in_place(arrays[0], arrays[1], arrays[2]);

export const normalize4D = (
    arrays: Float32Array[],
    include?: Uint8Array[]
): void => include ?
    normalize_some_4D_directions_in_place(arrays[0], arrays[1], arrays[2], arrays[3], include) :
    normalize_all_4D_directions_in_place(arrays[0], arrays[1], arrays[2], arrays[3]);

// 2D:
// ===
// All
// ===
const _mulAllVec2Mat2IP = (
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
const _mulAllVec2Mat2Out2 = (
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
// SOME:
// =====
const _mulSomeVec2Mat2IP = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    include: Uint8Array[]
): void => multiply_some_2D_vectors_by_a_2x2_matrix_in_place(
    this_arrays[0],
    this_arrays[1],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1],
    matrix_arrays[2], matrix_arrays[3],

    include
);
const _mulSomeVec2Mat2Out2 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    include: Uint8Array[],
    out_arrays: Float32Array[]
): void => multiply_some_2D_vectors_by_a_2x2_matrix_to_out(
    this_arrays[0],
    this_arrays[1],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1],
    matrix_arrays[2], matrix_arrays[3],

    include,

    out_arrays[0],
    out_arrays[1]
);

// 3D:
// ====
// ALL 3D:
// =======
const _mulAllVec3Mat3IP = (
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
const _mulAllVec3Mat3Out = (
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
// ALL 3D DIR:
// ===========
const _mulAllDir3Mat4IP = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number
): void => multiply_all_3D_vectors_by_a_3x3_matrix_in_place(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10]
);
const _mulAllDir3Mat4Out3 = (
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
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10],

    out_arrays[0],
    out_arrays[1],
    out_arrays[2]
);
const _mulAllDir3Mat4Out4 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    out_arrays: Float32Array[]
): void => multiply_all_3D_directions_by_a_4x3_matrix_to_out4(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2], matrix_arrays[3],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6], matrix_arrays[7],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10], matrix_arrays[11],

    out_arrays[0],
    out_arrays[1],
    out_arrays[2],
    out_arrays[3]
);
// All 3D POS:
// ===========
const _mulAllPos3Mat4IP = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number
): void => multiply_all_3D_positions_by_a_3x4_matrix_in_place(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10],
    matrix_arrays[12], matrix_arrays[13], matrix_arrays[14],
);
const _mulAllPos3Mat4Out3 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    out_arrays: Float32Array[]
): void => multiply_all_3D_positions_by_a_3x4_matrix_to_out3(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10],
    matrix_arrays[12], matrix_arrays[13], matrix_arrays[14],

    out_arrays[0],
    out_arrays[1],
    out_arrays[2]
);
const _mulAllPos3Mat4Out4 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    out_arrays: Float32Array[]
): void => multiply_all_3D_positions_by_a_4x4_matrix_to_out4(
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
// SOME 3D:
// ========
const _mulSomeVec3Mat3IP = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    include: Uint8Array[]
): void => multiply_some_3D_vectors_by_a_3x3_matrix_in_place(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2],
    matrix_arrays[3], matrix_arrays[4], matrix_arrays[5],
    matrix_arrays[6], matrix_arrays[7], matrix_arrays[8],

    include
);
const _mulSomeVec3Mat3Out = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    include: Uint8Array[],
    out_arrays: Float32Array[]
): void => multiply_some_3D_vectors_by_a_3x3_matrix_to_out(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2],
    matrix_arrays[3], matrix_arrays[4], matrix_arrays[5],
    matrix_arrays[6], matrix_arrays[7], matrix_arrays[8],

    include,

    out_arrays[0],
    out_arrays[1],
    out_arrays[2]
);
// SOME 3D DIR:
// ============
const _mulSomeDir3Mat4IP = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    include: Uint8Array[]
): void => multiply_some_3D_vectors_by_a_3x3_matrix_in_place(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10],

    include
);
const _mulSomeDir3Mat4Out3 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    include: Uint8Array[],
    out_arrays: Float32Array[],
): void => multiply_some_3D_vectors_by_a_3x3_matrix_to_out(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10],

    include,

    out_arrays[0],
    out_arrays[1],
    out_arrays[2]
);
const _mulSomeDir3Mat4Out4 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    include: Uint8Array[],
    out_arrays: Float32Array[]
): void => multiply_some_3D_directions_by_a_4x3_matrix_to_out4(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2], matrix_arrays[3],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6], matrix_arrays[7],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10], matrix_arrays[11],

    include,

    out_arrays[0],
    out_arrays[1],
    out_arrays[2],
    out_arrays[3]
);
// SOME 3D POS:
// ============
const _mulSomePos3Mat4IP = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    include: Uint8Array[]
): void => multiply_some_3D_positions_by_a_3x4_matrix_in_place(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10],
    matrix_arrays[12], matrix_arrays[13], matrix_arrays[14],

    include
);
const _mulSomePos3Mat4Out3 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    include: Uint8Array[],
    out_arrays: Float32Array[]
): void => multiply_some_3D_positions_by_a_3x4_matrix_to_out3(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10],
    matrix_arrays[12], matrix_arrays[13], matrix_arrays[14],

    include,

    out_arrays[0],
    out_arrays[1],
    out_arrays[2]
);
const _mulSomePos3Mat4Out4 = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    include: Uint8Array[],
    out_arrays: Float32Array[]
): void => multiply_some_3D_positions_by_a_4x4_matrix_to_out4(
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

// 4D:
// ===
// ALL:
// ====
const _mulAllVec4Mat4IP = (
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
const _mulAllVec4Mat4Out = (
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
// SOME:
// =====
const _mulSomeVec4Mat4IP = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    include: Uint8Array[]
): void => multiply_some_4D_vectors_by_a_4x4_matrix_in_place(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],
    this_arrays[3],

    include,

    matrix_id,
    matrix_arrays[0], matrix_arrays[1], matrix_arrays[2], matrix_arrays[3],
    matrix_arrays[4], matrix_arrays[5], matrix_arrays[6], matrix_arrays[7],
    matrix_arrays[8], matrix_arrays[9], matrix_arrays[10], matrix_arrays[11],
    matrix_arrays[12], matrix_arrays[13], matrix_arrays[14], matrix_arrays[15]
);
const _mulSomeVec4Mat4Out = (
    this_arrays: Float32Array[],
    matrix_arrays: Float32Array[],
    matrix_id: number,
    include: Uint8Array[],
    out_arrays: Float32Array[]
): void => multiply_some_4D_vectors_by_a_4x4_matrix_to_out(
    this_arrays[0],
    this_arrays[1],
    this_arrays[2],
    this_arrays[3],

    include,

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

export const multiply_2D_vectors_by_a_2x2_matrix_in_place = (
    vectors: Float32Array[],
    matrix: Float32Array[],
    matrix_id: number,
    include?: Uint8Array[]
) => include ?
    _mulSomeVec2Mat2IP(vectors, matrix, matrix_id, include) :
    _mulAllVec2Mat2IP(vectors, matrix, matrix_id);
export const multiply_2D_vectors_by_a_2x2_matrix_to_out = (
    vectors: Float32Array[],
    matrix: Float32Array[],
    matrix_id: number,
    out: Float32Array[],
    include?: Uint8Array[]
) => include ?
    _mulSomeVec2Mat2Out2(vectors, matrix, matrix_id, include, out) :
    _mulAllVec2Mat2Out2(vectors, matrix, matrix_id, out);

export const multiply_3D_vectors_by_a_3x3_matrix_in_place = (
    vectors: Float32Array[],
    matrix: Float32Array[],
    matrix_id: number,
    include?: Uint8Array[]
) => include ?
    _mulSomeVec3Mat3IP(vectors, matrix, matrix_id, include) :
    _mulAllVec3Mat3IP(vectors, matrix, matrix_id);
export const multiply_3D_vectors_by_a_3x3_matrix_to_out = (
    vectors: Float32Array[],
    matrix: Float32Array[],
    matrix_id: number,
    out: Float32Array[],
    include?: Uint8Array[]
) => include ?
    _mulSomeVec3Mat3Out(vectors, matrix, matrix_id, include, out) :
    _mulAllVec3Mat3Out(vectors, matrix, matrix_id, out);

export const multiply_4D_vectors_by_a_4x4_matrix_in_place = (
    vectors: Float32Array[],
    matrix: Float32Array[],
    matrix_id: number,
    include?: Uint8Array[]
) => include ?
    _mulSomeVec4Mat4IP(vectors, matrix, matrix_id, include) :
    _mulAllVec4Mat4IP(vectors, matrix, matrix_id);
export const multiply_4D_vectors_by_a_4x4_matrix_to_out = (
    vectors: Float32Array[],
    matrix: Float32Array[],
    matrix_id: number,
    out: Float32Array[],
    include?: Uint8Array[]
) => include ?
    _mulSomeVec4Mat4Out(vectors, matrix, matrix_id, include, out) :
    _mulAllVec4Mat4Out(vectors, matrix, matrix_id, out);


export const multiply_3D_positions_by_a_4x4_matrix_in_place = (
    vectors: Float32Array[],
    matrix: Float32Array[],
    matrix_id: number,
    include?: Uint8Array[]
) => include ?
    _mulSomePos3Mat4IP(vectors, matrix, matrix_id, include) :
    _mulAllPos3Mat4IP(vectors, matrix, matrix_id);
export const multiply_3D_positions_by_a_4x4_matrix_to_out = (
    vectors: Float32Array[],
    matrix: Float32Array[],
    matrix_id: number,
    out: Float32Array[],
    include?: Uint8Array[]
) => out.length === 3 ? (
    include ?
        _mulSomePos3Mat4Out3(vectors, matrix, matrix_id, include, out) :
        _mulAllPos3Mat4Out3(vectors, matrix, matrix_id, out)
) : (
    include ?
        _mulSomePos3Mat4Out4(vectors, matrix, matrix_id, include, out) :
        _mulAllPos3Mat4Out4(vectors, matrix, matrix_id, out)
);

export const multiply_3D_directions_by_a_4x4_matrix_in_place = (
    vectors: Float32Array[],
    matrix: Float32Array[],
    matrix_id: number,
    include?: Uint8Array[]
) => include ?
    _mulSomeDir3Mat4IP(vectors, matrix, matrix_id, include) :
    _mulAllDir3Mat4IP(vectors, matrix, matrix_id);
export const multiply_3D_directions_by_a_4x4_matrix_to_out = (
    vectors: Float32Array[],
    matrix: Float32Array[],
    matrix_id: number,
    out: Float32Array[],
    include?: Uint8Array[]
) => out.length === 3 ? (
    include ?
        _mulSomeDir3Mat4Out3(vectors, matrix, matrix_id, include, out) :
        _mulAllDir3Mat4Out3(vectors, matrix, matrix_id, out)
) : (
    include ?
        _mulSomeDir3Mat4Out4(vectors, matrix, matrix_id, include, out) :
        _mulAllDir3Mat4Out4(vectors, matrix, matrix_id, out)
);


//
//
// const _mulAllIP = (
//     vectors: Float32Array[],
//     is_position: boolean,
//
//     matrix: Float32Array[],
//     matrix_id: number
// ) => {
//     switch (matrix.length) {
//         // Matrix2x2
//         case 4:
//             // Vector2D
//             if (vectors.length === 2)
//                 return _mulAllVec2Mat2IP(vectors, matrix, matrix_id);
//
//             throw 'A 2x2 matrix can only be multiplied by a 2D vector(!)';
//
//         // Matrix3x3
//         case 9:
//             // Vector3D
//             if (vectors.length === 3)
//                 return _mulAllVec3Mat3IP(vectors, matrix, matrix_id);
//
//             throw 'A 3x3 matrix can only be multiplied by a 3D vector(!)';
//
//         // Matrix4x4
//         case 16:
//             switch (vectors.length) {
//
//                 // Vector4D
//                 case 4:
//                     return _mulAllVec4Mat4IP(vectors, matrix, matrix_id);
//
//                 // Vector3D
//                 case 3:
//
//                     // Position3D or Direction3D
//                     return is_position ?
//                         _mulAllPos3Mat4IP(vectors, matrix, matrix_id) :
//                         _mulAllDir3Mat4IP(vectors, matrix, matrix_id);
//
//                 default:
//                     throw 'A 4x4 matrix can only be multiplied by a 3D vector with either a 3D or a 4D output vector(!)';
//             }
//
//         default:
//             throw 'Vectors can only be multiplied by 2x2, 3x3 or 4x4 matrices(!)';
//     }
// };
//
// const _mulSomeIP = (
//     vectors: Float32Array[],
//     is_position: boolean,
//
//     matrix: Float32Array[],
//     matrix_id: number,
//
//     include: Uint8Array[]
// ) => {
//     switch (matrix.length) {
//         // Matrix2x2
//         case 4:
//             // Vector2D
//             if (vectors.length === 2)
//                 return _mulSomeVec2Mat2IP(vectors, matrix, matrix_id, include);
//
//             throw 'A 2x2 matrix can only be multiplied by a 2D vector(!)';
//
//         // Matrix3x3
//         case 9:
//             // Vector3D
//             if (vectors.length === 3)
//                 return _mulSomeVec3Mat3IP(vectors, matrix, matrix_id, include);
//
//             throw 'A 3x3 matrix can only be multiplied by a 3D vector(!)';
//
//         // Matrix4x4
//         case 16:
//             switch (vectors.length) {
//
//                 // Vector4D
//                 case 4:
//                     return _mulSomeVec4Mat4IP(vectors, matrix, matrix_id, include);
//
//                 // Vector3D
//                 case 3:
//
//                     // Position3D or Direction3D
//                     return is_position ?
//                         _mulSomePos3Mat4IP(vectors, matrix, matrix_id, include) :
//                         _mulSomeDir3Mat4IP(vectors, matrix, matrix_id, include);
//
//                 default:
//                     throw 'A 4x4 matrix can only be multiplied by a 3D vector with either a 3D or a 4D output vector(!)';
//             }
//
//         default:
//             throw 'Vectors can only be multiplied by 2x2, 3x3 or 4x4 matrices(!)';
//     }
// };
//
// const _mulAllOut = (
//     vectors: Float32Array[],
//     is_position: boolean,
//
//     matrix: Float32Array[],
//     matrix_id: number,
//
//     out: Float32Array[]
// ) => {
//     switch (matrix.length) {
//         // Matrix2x2
//         case 4:
//             // Vector2D
//             if (vectors.length === 2)
//                 return _mulAllVec2Mat2Out2(vectors, matrix, matrix_id, out);
//
//             throw 'A 2x2 matrix can only be multiplied by a 2D vector(!)';
//
//         // Matrix3x3
//         case 9:
//             // Vector3D
//             if (vectors.length === 3)
//                 return _mulAllVec3Mat3Out(vectors, matrix, matrix_id, out);
//
//             throw 'A 3x3 matrix can only be multiplied by a 3D vector(!)';
//
//         // Matrix4x4
//         case 16:
//             switch (vectors.length) {
//
//                 // Vector4D
//                 case 4:
//                     return _mulAllVec4Mat4Out(vectors, matrix, matrix_id, out);
//
//                 // Vector3D
//                 case 3:
//
//                     switch (out.length) {
//                         case 3:
//                             // Position3D or Direction3D
//                             return is_position ?
//                                 _mulAllPos3Mat4Out3(vectors, matrix, matrix_id, out) :
//                                 _mulAllDir3Mat4Out3(vectors, matrix, matrix_id, out);
//                         case 4:
//                             // Position4D or Direction4D
//                             return is_position ?
//                                 _mulAllPos3Mat4Out4(vectors, matrix, matrix_id, out) :
//                                 _mulAllDir3Mat4Out4(vectors, matrix, matrix_id, out);
//
//                         default:
//                             throw 'A 4x4 matrix can only be multiplied by a 3D vector with either a 3D or a 4D output vector(!)';
//                     }
//
//                 default:
//                     throw 'A 4x4 matrix can only be multiplied by a 3D vector with either a 3D or a 4D output vector(!)';
//             }
//
//         default:
//             throw 'Vectors can only be multiplied by 2x2, 3x3 or 4x4 matrices(!)';
//     }
// };
//
// const _mulSomeOut = (
//     vectors: Float32Array[],
//     is_position: boolean,
//
//     matrix: Float32Array[],
//     matrix_id: number,
//
//     include: Uint8Array[],
//
//     out: Float32Array[]
// ) => {
//     switch (matrix.length) {
//         // Matrix2x2
//         case 4:
//             // Vector2D
//             if (vectors.length === 2)
//                 return _mulSomeVec2Mat2Out2(vectors, matrix, matrix_id, include, out);
//
//             throw 'A 2x2 matrix can only be multiplied by a 2D vector(!)';
//
//         // Matrix3x3
//         case 9:
//             // Vector3D
//             if (vectors.length === 3)
//                 return _mulSomeVec3Mat3Out(vectors, matrix, matrix_id, include, out);
//
//             throw 'A 3x3 matrix can only be multiplied by a 3D vector(!)';
//
//         // Matrix4x4
//         case 16:
//             switch (vectors.length) {
//
//                 // Vector4D
//                 case 4:
//                     return _mulSomeVec4Mat4Out(vectors, matrix, matrix_id, include, out);
//
//                 // Vector3D
//                 case 3:
//
//                     switch (out.length) {
//                         case 3:
//                             // Position3D or Direction3D
//                             return is_position ?
//                                 _mulSomePos3Mat4Out3(vectors, matrix, matrix_id, include, out) :
//                                 _mulSomeDir3Mat4Out3(vectors, matrix, matrix_id, include, out);
//                         case 4:
//                             // Position4D or Direction4D
//                             return is_position ?
//                                 _mulSomePos3Mat4Out4(vectors, matrix, matrix_id, include, out) :
//                                 _mulSomeDir3Mat4Out4(vectors, matrix, matrix_id, include, out);
//
//                         default:
//                             throw 'A 4x4 matrix can only be multiplied by a 3D vector with either a 3D or a 4D output vector(!)';
//                     }
//
//                 default:
//                     throw 'A 4x4 matrix can only be multiplied by a 3D vector with either a 3D or a 4D output vector(!)';
//             }
//
//         default:
//             throw 'Vectors can only be multiplied by 2x2, 3x3 or 4x4 matrices(!)';
//     }
// };
//
// export const multiply_vectors_by_a_matrix_to_out = (
//     vectors: Float32Array[],
//     is_position: boolean,
//
//     matrix: Float32Array[],
//     matrix_id: number,
//
//     out: Float32Array[],
//     include?: Uint8Array[]
// ) => include ?
//     _mulSomeIP(vectors, is_position, matrix, matrix_id, include) :
//     _mulAllIP(vectors, is_position, matrix, matrix_id);
//
// export const multiply_vectors_by_a_matrix_in_place = (
//     vectors: Float32Array[],
//     is_position: boolean,
//
//     matrix: Float32Array[],
//     matrix_id: number,
//
//     include?: Uint8Array[]
// ) => include ?
//         _mulSomeIP(vectors, is_position, matrix, matrix_id, include) :
//         _mulAllIP(vectors, is_position, matrix, matrix_id);