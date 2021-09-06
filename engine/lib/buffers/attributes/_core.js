import { zip } from "../../../utils.js";
export const loadSharedVertices = (input_vertices, input_faces, output_vertices, output_faces) => {
    for (const [input_face, output_face] of zip(input_faces, output_faces))
        for (const [input_vertex, output_vertex] of zip(input_face, output_face))
            output_vertices[output_vertex].set(input_vertices[input_vertex]);
};
export const loadUnsharedVertices = (input_vertices, input_faces, output_vertices) => {
    let output_vertex = 0;
    for (const input_face of input_faces)
        for (const input_vertex of input_face)
            output_vertices[output_vertex++].set(input_vertices[input_vertex]);
};
export const loadVerticesSimple = (input_vertices, output_vertices) => {
    for (const [input_vertex, output_vertex] of zip(input_vertices, output_vertices))
        output_vertex.set(input_vertex);
};
export const pullSharedVertices = (faces, vertices, vertex_face_ids) => {
    let accumulated, face_id, vertex_id;
    // For each component 'accumulate-in' the face-value of all the faces_vertices of this vertex:
    for (let component_index = 0; component_index < faces[0].length; component_index++) {
        vertex_id = 0;
        // Average vertex-attribute values from their related face's attribute values:
        for (const face_ids of vertex_face_ids) {
            accumulated = 0;
            for (face_id of face_ids)
                accumulated += faces[face_id][component_index];
            vertices[vertex_id++][component_index] = accumulated / face_ids.length;
        }
    }
};
export const pullUnsharedVertices = (faces, vertices) => {
    let vertex = 0;
    // Copy over face-attribute values to their respective vertex-attribute values:
    for (const face of faces) {
        vertices[vertex++].set(face);
        vertices[vertex++].set(face);
        vertices[vertex++].set(face);
    }
};
export const pullFaceWithSharedVertices = (vertices, faces, indices) => {
    for (const [face, [vi1, vi2, vi3]] of zip(faces, indices))
        for (const [v1, v2, v3, comp] of zip(vertices[vi1], vertices[vi2], vertices[vi3]))
            face[comp] = (v1 + v2 + v3) / 3;
};
export const pullFacesWithUnsharedVertices = (faces, vertices) => {
    let vertex = 0;
    for (const face of faces)
        for (const [v1, v2, v3, comp] of zip(vertices[vertex++], vertices[vertex++], vertices[vertex++]))
            face[comp] = (v1 + v2 + v3) / 3;
};
//# sourceMappingURL=_core.js.map