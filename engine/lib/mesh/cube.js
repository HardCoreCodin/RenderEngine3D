import Mesh from "./_base.js";
import { MeshOptions } from "./options.js";
import { InputPositions, MeshInputs } from "./inputs.js";
import { FaceVerticesInt8 } from "./face/vertices.js";
import { VertexFacesInt8 } from "./vertex/faces.js";
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
export const face_vertices = new FaceVerticesInt8(positions);
export const vertex_faces = new VertexFacesInt8(face_vertices, 8);
// Mesh options:
const defaults = new MeshOptions();
defaults.share = 1 /* position */;
defaults.normal = 1 /* NO_VERTEX__GENERATE_FACE */;
defaults.color = 1 /* NO_VERTEX__GENERATE_FACE */;
const CubeMesh = (options = defaults) => new Mesh(inputs, options, face_vertices, 8, vertex_faces);
export default CubeMesh;
//# sourceMappingURL=cube.js.map