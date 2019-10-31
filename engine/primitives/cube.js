import { Mesh, MeshInputs, MeshOptions } from "./mesh.js";
import { InputPositions } from "./attribute.js";
// Cube inputs in quads:
// =====================
const mesh_inputs = new MeshInputs(1 /* position */, 4 /* QUAD */, new InputPositions(4 /* QUAD */, 
// Vertex position values:
[
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
], 
// Quad face vertex-indices:
[
    [0, 1, 5, 4, 0, 3],
    [1, 5, 4, 0, 1, 2],
    [2, 6, 7, 3, 5, 6],
    [3, 2, 6, 7, 4, 7],
]));
const Cube = (share = 1 /* position */, normals = 1 /* NO_VERTEX__GENERATE_FACE */, colors = 1 /* NO_VERTEX__GENERATE_FACE */) => new Mesh(mesh_inputs, new MeshOptions(share, normals, colors));
export default Cube;
//# sourceMappingURL=cube.js.map