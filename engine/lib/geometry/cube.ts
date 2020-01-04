import Mesh from "./mesh.js";
import {MeshOptions} from "./options.js";
import {MeshInputs} from "./inputs.js";
import {ATTRIBUTE, COLOR_SOURCING, FACE_TYPE, NORMAL_SOURCING} from "../../constants.js";
import {FaceVerticesInt8, VertexFacesInt8} from "./indices.js";

export const inputs = new MeshInputs(FACE_TYPE.QUAD, ATTRIBUTE.position|ATTRIBUTE.uv);

// Positions: Quad face vertex-index_arrays (Clockwise winding order for left-handed coordinate system):
inputs.position.vertices[0] = [0, 0, 1, 1, 1, 1, 0, 0]; // X coordinates (0 = left, 1 = right)
inputs.position.vertices[1] = [0, 1, 1, 0, 0, 1, 1, 0]; // Y coordinates (0 = bottom, 1 = top)
inputs.position.vertices[2] = [0, 0, 0, 0, 1, 1, 1, 1]; // Z coordinates (0 = front, 1 = back)
inputs.position.faces_vertices[0] = [0, 3, 4, 7, 2, 7]; // Vertex 1 of each quad
inputs.position.faces_vertices[1] = [1, 2, 5, 6, 6, 0]; // Vertex 2 of each quad
inputs.position.faces_vertices[2] = [2, 5, 6, 1, 5, 3]; // Vertex 3 of each quad
inputs.position.faces_vertices[3] = [3, 4, 7, 0, 3, 4]; // Vertex 4 of each quad

// UVs:
inputs.uv.vertices[0] = [0, 0, 1, 1];
inputs.uv.vertices[1] = [0, 1, 1, 0];
inputs.uv.faces_vertices[0].fill(0); // Vertex 1 of each quad
inputs.uv.faces_vertices[1].fill(1); // Vertex 2 of each quad
inputs.uv.faces_vertices[2].fill(2); // Vertex 3 of each quad
inputs.uv.faces_vertices[3].fill(3); // Vertex 4 of each quad

inputs.sanitize();

// Cube inputs:
// =====================
export const cube_vertex_count = 8;
export const cube_face_vertices = new FaceVerticesInt8().load(inputs.position);
export const cube_vertex_faces = new VertexFacesInt8().load(cube_face_vertices, cube_vertex_count);

// Mesh options:
const defaults = new MeshOptions(0,
    NORMAL_SOURCING.NO_VERTEX__GENERATE_FACE,
    COLOR_SOURCING.NO_VERTEX__GENERATE_FACE,
    true
);

const CubeMesh = (options: MeshOptions = defaults): Mesh => new Mesh(
    inputs, options, cube_face_vertices, cube_vertex_count, cube_vertex_faces
);

export default CubeMesh;