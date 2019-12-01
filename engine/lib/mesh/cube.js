import Mesh from "./_base.js";
import { MeshOptions } from "./options.js";
import { InputPositions, MeshInputs } from "./inputs.js";
import { VertexFaces } from "./vertex/faces.js";
import { FaceVertices } from "./face/vertices.js";
// Vertex position values:
export const vertices = [
    [
        0, 1, 1, 0,
        0, 1, 1, 0
    ],
    [
        0, 0, 1, 1,
        0, 0, 1, 1
    ],
    [
        0, 0, 0, 0,
        1, 1, 1, 1
    ],
];
// Quad face vertex-index_arrays:
export const indices = [
    [0, 1, 5, 4, 0, 3],
    [1, 5, 4, 0, 1, 2],
    [2, 6, 7, 3, 5, 6],
    [3, 2, 6, 7, 4, 7],
];
// Cube inputs:
// =====================
export const positions = new InputPositions(4 /* QUAD */, vertices, indices).triangulate();
export const inputs = new MeshInputs(3 /* TRIANGLE */, 1 /* position */, positions);
export const vertex_faces = new VertexFaces(positions);
export const face_vertices = new FaceVertices(positions);
// Mesh options:
const default_options = new MeshOptions();
default_options.share = 1 /* position */;
default_options.normal = 1 /* NO_VERTEX__GENERATE_FACE */;
default_options.color = 1 /* NO_VERTEX__GENERATE_FACE */;
const CubeMesh = (options = default_options) => new Mesh(inputs, options, 6, 8, vertex_faces, face_vertices);
export default CubeMesh;
//# sourceMappingURL=cube.js.map