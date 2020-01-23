import {zip} from "../../../utils.js";

let face_index: number;

export const _pullSharedFace = (
    this_arrays: Float32Array[],
    input_arrays: Float32Array[],
    indices_1: Uint8Array | Uint16Array | Uint32Array,
    indices_2: Uint8Array | Uint16Array | Uint32Array,
    indices_3: Uint8Array | Uint16Array | Uint32Array,
    face_count: number
): void => {
    for (const [face_component, vertex_component] of zip(this_arrays, input_arrays))
        for (face_index = 0; face_index < face_count; face_index++)
            face_component[face_index] = (
                vertex_component[indices_1[face_index]] +
                vertex_component[indices_2[face_index]] +
                vertex_component[indices_3[face_index]]
            ) / 3;

    if (this_arrays.length === 4 &&
        input_arrays.length === 3)
        this_arrays[3].fill(1);
};

export const _pullUnsharedFace = (
    this_arrays: Float32Array[],
    input_arrays: Float32Array[],
    face_count: number
): void => {
    for (const [face_component, vertex_component] of zip(this_arrays, input_arrays))
        for (face_index = 0; face_index < face_count; face_index++)
            face_component[face_index] = (
                vertex_component[face_index] +
                vertex_component[face_index] +
                vertex_component[face_index]
            ) / 3;

    if (this_arrays.length === 4 &&
        input_arrays.length === 3)
        this_arrays[3].fill(1);
};