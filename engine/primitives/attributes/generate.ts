// import {
//     FaceVertices,
//     Values,
//     UnsharedVertexValues,
//     VertexFaces
// } from "../../types.js";
// import {cross, subtract} from "../../math/vec3.js";
// import {float3} from "../../factories.js";
//
// // Temporary float arrays for computations:
// const temp = float3(3);
//
// export const generateVertexFaces = (
//     face_vertices: FaceVertices,
//     vertex_count: number
// ) : VertexFaces => {
//     const temp_array = Array(vertex_count);
//     for (let i = 0; i < vertex_count; i++)
//         temp_array[i] = [];
//
//     let vertex_id, face_id, connections : number  = 0;
//     for (const face_vertex_ids of face_vertices) {
//         for ([face_id, vertex_id] of face_vertex_ids.entries()) {
//             temp_array[vertex_id].push(face_id);
//             connections++
//         }
//     }
//
//     const vertex_faces: VertexFaces = Array(vertex_count);
//     const buffer = new Uint32Array(connections);
//     let offset = 0;
//     for (const [i, array] of temp_array.entries()) {
//         vertex_faces[i] = buffer.subarray(offset, array.length);
//         vertex_faces[i].set(array);
//         offset += array.length;
//     }
//
//     return vertex_faces;
// };
//
// export const randomize = (values: Values) : void => {
//     // Assigned random values:
//     for (const array of values)
//         for (const index of array.keys())
//             array[index] = Math.random();
// };
//
// export const averageSharedVerticesToFaces = (
//     shared_vertices: Values,
//     faces: Values,
//     face_vertices: FaceVertices
// ) : void => {
//     for (const [c, vertex] of this.values.entries()) {
//         for (let f = 0; f < this.mesh.face_count; f++)
//             faces[c][f] = (
//                 vertex[face_vertices[0][f]] +
//                 vertex[face_vertices[1][f]] +
//                 vertex[face_vertices[2][f]]
//             ) / 3;
//     }
// };
//
// export const averageUnsharedVerticesToFaces = (
//     unshared_vertices: UnsharedVertexValues,
//     faces: Values
// ) : void => {
//     const [v0, v1, v2] = unshared_vertices;
//     for (const [c, face] of faces.entries())
//         for (let f = 0; f < faces.length; f++)
//             face[f] = (v0[c][f] + v1[c][f] + v2[c][f]) / 3;
// };
//
// export const averageFacesToSharedVertices = (
//     faces: Values,
//     shared_Vertices: Values,
//     vertex_faces: VertexFaces
// ) : void => {
//     // Average vertex-attribute values from their related face's attribute values:
//     for (const [vertex_id, face_ids] of vertex_faces.entries()) {
//         // For each component 'accumulate-in' the face-value of all the faces of this vertex:
//         for (const [c, face] of faces.entries()) {
//             let accumulator = 0;
//
//             for (let f of face_ids)
//                 accumulator += face[f];
//
//             shared_Vertices[c][vertex_id] += accumulator / face_ids.length;
//         }
//     }
// };
//
// export const distributeFacesToUnsharedVertices = (
//     faces: Values,
//     unshared_vertices: UnsharedVertexValues
// ) : void => {
//     // Copy over face-attribute values to their respective vertex-attribute values:
//     for (const vertex_components of unshared_vertices)
//         for (const [c, vertex] of vertex_components.entries())
//             for (let f = 0; f < faces[0].length; f++)
//                 vertex[f] = faces[c][f];
// };
//
// export const computeFaceNormalsFromSharedVertexPositions = (
//     shared_vertices: Values,
//     faces: Values,
//     face_vertices: FaceVertices
// ) : void => {
//     for (let f = 0; f < faces[0].length; f++) {
//         subtract(
//             shared_vertices, face_vertices[1][f],
//             shared_vertices, face_vertices[0][f],
//             temp, 0
//         );
//         subtract(
//             shared_vertices, face_vertices[2][f],
//             shared_vertices, face_vertices[0][f],
//             temp, 1
//         );
//
//         setFaceNormalsFromTempVectors(faces, f);
//     }
// };
//
// export const computeFaceNormalsFromUnsharedVertexPositions = (
//     unshared_vertices: UnsharedVertexValues,
//     faces: Values
// ) : void => {
//     for (let f = 0; f < faces[0].length; f++) {
//         subtract(
//             unshared_vertices[1], f,
//             unshared_vertices[0], f,
//             temp, 0
//         );
//         subtract(
//             unshared_vertices[2], f,
//             unshared_vertices[0], f,
//             temp, 1
//         );
//
//         setFaceNormalsFromTempVectors(faces, f);
//     }
// };
//
// const setFaceNormalsFromTempVectors = (faces: Values, face_index: number) => {
//     cross(
//         temp, 0,
//         temp, 1,
//         temp, 2
//     );
//
//     faces[0][face_index] = temp[0][2];
//     faces[1][face_index] = temp[1][2];
//     faces[2][face_index] = temp[2][2];
// };