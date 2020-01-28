import {zip} from "../../../utils.js";
import {FaceInputs} from "../../../types.js";


const loadSharedVertices = (
    values: Float32Array[],
    inputs: number[][],

    input_indices_v1: number[],
    input_indices_v2: number[],
    input_indices_v3: number[],

    indices_v1: Indices,
    indices_v2: Indices,
    indices_v3: Indices,
): void => {
    for ([vertex_component_values, input_component_values] of zip(values, inputs)) {
        for ([index, input_index] of zip(indices_v1, input_indices_v1)) vertex_component_values[index] = input_component_values[input_index];
        for ([index, input_index] of zip(indices_v2, input_indices_v2)) vertex_component_values[index] = input_component_values[input_index];
        for ([index, input_index] of zip(indices_v3, input_indices_v3)) vertex_component_values[index] = input_component_values[input_index];
    }
};
const loadUnsharedVertices = (
    values: Float32Array[],
    inputs: number[][],

    input_indices_v1: number[],
    input_indices_v2: number[],
    input_indices_v3: number[],

    face_count: number
): void => {
    for ([vertex_component_values, input_component_values] of zip(values, inputs)) {
        offset = 0;
        for (face_index = 0; face_index < face_count; face_index++) {
            vertex_component_values[offset++] = input_component_values[input_indices_v1[face_index]];
            vertex_component_values[offset++] = input_component_values[input_indices_v2[face_index]];
            vertex_component_values[offset++] = input_component_values[input_indices_v3[face_index]];
        }
    }
};
export const loadVerticesSimple = (
    values: Float32Array[],
    inputs: number[][]
): void => {
    for ([vertex_component_values, input_component_values] of zip(values, inputs))
        vertex_component_values.set(input_component_values);
};
export const loadVertices = (
    values: Float32Array[],
    inputs: number[][],

    indices: Indices[],
    input_indices: FaceInputs,

    face_count: number,
    shared: boolean
): void => shared ?
    loadSharedVertices(values, inputs, input_indices[0], input_indices[1], input_indices[2], indices[0], indices[1], indices[2]) :
    loadUnsharedVertices(values, inputs, input_indices[0], input_indices[1], input_indices[2], face_count);


const pullSharedVertices = (
    values: Float32Array[],
    inputs: Float32Array[],
    indices: Indices[],
    face_count: number
): void => {
    // Average vertex-attribute values from their related face's attribute values:
    for ([vertex_component_values, face_component_values] of zip(values, inputs))
        for ([vertex_id, face_ids] of indices.entries()) {
            // For each component 'accumulate-in' the face-value of all the faces_vertices of this vertex:
            accumulated = 0;
            for (face_id of face_ids)
                accumulated += face_component_values[face_id];

            vertex_component_values[vertex_id] = accumulated / face_count;
        }
};
const pullUnsharedVertices = (
    values: Float32Array[],
    inputs: Float32Array[]
): void => {
    offset = 0;
    // Copy over face-attribute values to their respective vertex-attribute values:
    for ([vertex_component_values, face_component_values] of zip(values, inputs)) {
        vertex_component_values.set(face_component_values, offset++);
        vertex_component_values.set(face_component_values, offset++);
        vertex_component_values.set(face_component_values, offset++);
    }
};
export const pullVertices = (
    values: Float32Array[],
    inputs: Float32Array[],
    indices: Indices[],
    face_count: number,
    shared: boolean
): void => shared ?
    pullSharedVertices(values, inputs, indices, face_count) :
    pullUnsharedVertices(values, inputs);


const pullFaceWithSharedVertices = (
    values: Float32Array[],
    inputs: Float32Array[],

    indices_v1: Indices,
    indices_v2: Indices,
    indices_v3: Indices,

    face_count: number
): void => {
    for ([face_component_values, vertex_component_values] of zip(values, inputs))
        for (face_index = 0; face_index < face_count; face_index++)
            face_component_values[face_index] = (
                vertex_component_values[indices_v1[face_index]] +
                vertex_component_values[indices_v2[face_index]] +
                vertex_component_values[indices_v3[face_index]]
            ) / 3;
};

const pullFacesWithUnsharedVertices = (
    values: Float32Array[],
    inputs: Float32Array[],
    face_count: number
): void => {
    for (const [face_component, vertex_component] of zip(values, inputs))
        for (face_index = 0; face_index < face_count; face_index++)
            face_component[face_index] = (
                vertex_component[face_index] +
                vertex_component[face_index] +
                vertex_component[face_index]
            ) / 3;
};

export const pullFaces = (
    values: Float32Array[],
    inputs: Float32Array[],
    indices: Indices[],
    face_count: number,
    shared: boolean
): void => shared ?
    pullFaceWithSharedVertices(values, inputs, indices[0], indices[1], indices[2], face_count) :
    pullFacesWithUnsharedVertices(values, inputs, face_count);


type Indices = Uint8Array | Uint16Array | Uint32Array;
let face_ids: Indices;
let input_component_values: number[];
let vertex_component_values, face_component_values: Float32Array;
let face_id, vertex_id, face_index, offset, accumulated, input_index, index: number;
