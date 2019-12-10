import Mesh from "./mesh.js";
import { MeshOptions } from "./options.js";
import { InputPositions, MeshInputs } from "./inputs.js";
import { FaceVerticesInt8, VertexFacesInt8 } from "./indices.js";
// Vertex position values:
export const vertices = [
    [0, 0, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 1, 1, 1, 1],
];
// Quad face vertex-index_arrays (Clockwise winding order for left-handed coordinate system):
export const indices = [
    [0, 3, 4, 7, 2, 7],
    [1, 2, 5, 6, 6, 0],
    [2, 5, 6, 1, 5, 3],
    [3, 4, 7, 0, 3, 4],
];
// Cube inputs:
// =====================
export const positions = new InputPositions(4 /* QUAD */, vertices, indices).triangulate();
export const inputs = new MeshInputs(3 /* TRIANGLE */, 1 /* position */, positions);
export const cube_face_vertices = new FaceVerticesInt8().load(positions);
export const cube_vertex_faces = new VertexFacesInt8().load(cube_face_vertices, 8);
// Mesh options:
const defaults = new MeshOptions();
defaults.share = 1 /* position */;
defaults.normal = 1 /* NO_VERTEX__GENERATE_FACE */;
defaults.color = 1 /* NO_VERTEX__GENERATE_FACE */;
const CubeMesh = (options = defaults) => new Mesh(inputs, options, cube_face_vertices, 8, cube_vertex_faces);
export default CubeMesh;
//# sourceMappingURL=cube.js.map