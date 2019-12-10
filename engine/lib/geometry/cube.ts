import Mesh from "./mesh.js";
import {MeshOptions} from "./options.js";
import {InputPositions, MeshInputs} from "./inputs.js";
import {ATTRIBUTE, COLOR_SOURCING, FACE_TYPE, NORMAL_SOURCING} from "../../constants.js";
import {QuadInputs} from "../../types.js";
import {FaceVerticesInt8, VertexFacesInt8} from "./indices.js";

// Vertex position values:
export const vertices: number[][] = [
    [0, 0, 1, 1, 1, 1, 0, 0], // X coordinates (0 = left, 1 = right)
    [0, 1, 1, 0, 0, 1, 1, 0], // Y coordinates (0 = bottom, 1 = top)
    [0, 0, 0, 0, 1, 1, 1, 1], // Z coordinates (0 = front, 1 = back)
];

// Quad face vertex-index_arrays (Clockwise winding order for left-handed coordinate system):
export const indices: QuadInputs = [
    [0, 3, 4, 7, 2, 7], // Vertex 1 of each quad
    [1, 2, 5, 6, 6, 0], // Vertex 2 of each quad
    [2, 5, 6, 1, 5, 3], // Vertex 3 of each quad
    [3, 4, 7, 0, 3, 4], // Vertex 4 of each quad
];

// Cube inputs:
// =====================
export const positions = new InputPositions(FACE_TYPE.QUAD, vertices, indices).triangulate();
export const inputs = new MeshInputs(FACE_TYPE.TRIANGLE, ATTRIBUTE.position, positions);
export const cube_face_vertices = new FaceVerticesInt8().load(positions);
export const cube_vertex_faces = new VertexFacesInt8().load(cube_face_vertices, 8);

// Mesh options:
const defaults = new MeshOptions();
defaults.share = ATTRIBUTE.position;
defaults.normal = NORMAL_SOURCING.NO_VERTEX__GENERATE_FACE;
defaults.color = COLOR_SOURCING.NO_VERTEX__GENERATE_FACE;

const CubeMesh = (options: MeshOptions = defaults): Mesh => new Mesh(
    inputs, options, cube_face_vertices, 8, cube_vertex_faces
);

export default CubeMesh;