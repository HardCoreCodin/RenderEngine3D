import {zip} from "../../../utils.js";

let face_id, face_index, offset, accumulated, in_index, out_index: number;

export const _loadSaredSimple = (
    this_arrays: Float32Array[],
    input_arrays: number[][]
): void => {
    for (const [array, input_array] of zip(this_arrays, input_arrays))
        array.set(input_array);

    if (this_arrays.length === 4 &&
        input_arrays.length === 3)
        this_arrays[3].fill(1);
};
export const _loadShared = (
    this_arrays: Float32Array[],
    input_vertices: number[][],
    input_indices_v1: number[],
    input_indices_v2: number[],
    input_indices_v3: number[],
    indices_v1: Uint8Array | Uint16Array | Uint32Array,
    indices_v2: Uint8Array | Uint16Array | Uint32Array,
    indices_v3: Uint8Array | Uint16Array | Uint32Array,
): void => {
    for (const [in_component, out_component] of zip(input_vertices, this_arrays)) {
        for ([in_index, out_index] of zip(input_indices_v1, indices_v1)) out_component[out_index] = in_component[in_index];
        for ([in_index, out_index] of zip(input_indices_v2, indices_v2)) out_component[out_index] = in_component[in_index];
        for ([in_index, out_index] of zip(input_indices_v3, indices_v3)) out_component[out_index] = in_component[in_index];
    }
};
export const _loadUnshared = (
    this_arrays: Float32Array[],
    input_vertices: number[][],
    input_indices_v1: number[],
    input_indices_v2: number[],
    input_indices_v3: number[],
    face_count: number
): void => {
    for (const [in_component, out_component] of zip(input_vertices, this_arrays)) {
        offset = 0;
        for (face_index = 0; face_index < face_count; face_index++) {
            out_component[offset] = in_component[input_indices_v1[face_index]];
            out_component[offset + 1] = in_component[input_indices_v2[face_index]];
            out_component[offset + 2] = in_component[input_indices_v3[face_index]];
            offset += 3;
        }
    }
};
export const _pullShared = (
    this_arrays: Float32Array[],
    input_arrays: Float32Array[],
    face_count: number,
    indices: (Uint8Array | Uint16Array | Uint32Array)[]
): void => {
    // Average vertex-attribute values from their related face's attribute values:
    for (const [vertex_component, face_component] of zip(this_arrays, input_arrays))
        for (const [vertex_id, face_ids] of indices.entries()) {
            // For each component 'accumulate-in' the face-value of all the faces_vertices of this vertex:
            accumulated = 0;
            for (face_id of face_ids)
                accumulated += face_component[face_id];

            vertex_component[vertex_id] = accumulated / face_count;
        }
};
export const _pullUnshared = (
    this_arrays: Float32Array[],
    input_arrays: Float32Array[],
    face_count: number
): void => {
    // Copy over face-attribute values to their respective vertex-attribute values:
    for (const [vertex_component, face_ccomponent] of zip(this_arrays, input_arrays)) {
        vertex_component.set(face_ccomponent, 0);
        vertex_component.set(face_ccomponent, face_count);
        vertex_component.set(face_ccomponent, face_count + face_count);
    }
};