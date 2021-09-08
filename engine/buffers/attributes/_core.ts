import {zip} from "../../core/utils.js";

type Indices = Uint8Array | Uint16Array | Uint32Array;

export const loadSharedVertices = (
    input_vertices: number[][],
    input_faces: number[][],
    output_vertices: Float32Array[],
    output_faces: Indices[],
): void => {
    for (const [input_face, output_face] of zip(input_faces, output_faces))
        for (const [input_vertex, output_vertex] of zip(input_face, output_face))
            output_vertices[output_vertex].set(input_vertices[input_vertex]);
};

export const loadUnsharedVertices = (
    input_vertices: number[][],
    input_faces: number[][],
    output_vertices: Float32Array[]
): void => {
    let output_vertex = 0;
    for (const input_face of input_faces)
        for (const input_vertex of input_face)
            output_vertices[output_vertex++].set(input_vertices[input_vertex]);
};

export const loadVerticesSimple = (
    input_vertices: number[][],
    output_vertices: Float32Array[]
): void => {
    for (const [input_vertex, output_vertex] of zip(input_vertices, output_vertices))
        output_vertex.set(input_vertex);
};

export const pullSharedVertices = (
    faces: Float32Array[],
    vertices: Float32Array[],
    vertex_face_ids: Indices[]
): void => {
    let accumulated, face_id, vertex_id: number;
    // For each component 'accumulate-in' the face-value of all the faces_vertices of this vertex:
    for (let component_index = 0; component_index < faces[0].length; component_index++) {
        vertex_id = 0;

        // Average vertex-attribute values from their related face's attribute values:
        for (const face_ids of vertex_face_ids) {
            accumulated = 0;
            for (face_id of face_ids) accumulated += faces[face_id][component_index];

            vertices[vertex_id++][component_index] = accumulated / face_ids.length;
        }
    }
};

export const pullUnsharedVertices = (
    faces: Float32Array[],
    vertices: Float32Array[]
): void => {
    let vertex = 0;
    // Copy over face-attribute values to their respective vertex-attribute values:
    for (const face of faces) {
        vertices[vertex++].set(face);
        vertices[vertex++].set(face);
        vertices[vertex++].set(face);
    }
};

export const pullFaceWithSharedVertices = (
    vertices: Float32Array[],
    faces: Float32Array[],
    indices: Indices[]
): void => {
    for (const [face, [vi1, vi2, vi3]] of zip(faces, indices))
        for (const [v1, v2, v3, comp] of zip(vertices[vi1], vertices[vi2], vertices[vi3]))
            face[comp] = (v1 + v2 + v3) / 3;
};

export const pullFacesWithUnsharedVertices = (
    faces: Float32Array[],
    vertices: Float32Array[]
): void => {
    let vertex = 0;
    for (const face of faces)
        for (const [v1, v2, v3, comp] of zip(vertices[vertex++], vertices[vertex++], vertices[vertex++]))
            face[comp] = (v1 + v2 + v3) / 3;
};
