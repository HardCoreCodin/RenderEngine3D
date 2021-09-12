import Mesh from "./mesh.js";
import { MeshOptions } from "./options.js";
import { MeshInputs } from "./inputs.js";
import { FaceVerticesInt8, VertexFacesInt8 } from "./indices.js";
export const inputs = new MeshInputs(1 /* position */ | 8 /* uv */ | 2 /* normal */);
// Quads vertex/index array (CCW LH):
// X coordinates (0 = left, 1 = right)
// Y coordinates (0 = bottom, 1 = top)
// Z coordinates (0 = front, 1 = back)
inputs.position.addVertex(-1, -1, -1);
inputs.position.addVertex(1, -1, -1);
inputs.position.addVertex(1, 1, -1);
inputs.position.addVertex(-1, 1, -1);
inputs.position.addVertex(-1, -1, 1);
inputs.position.addVertex(1, -1, 1);
inputs.position.addVertex(1, 1, 1);
inputs.position.addVertex(-1, 1, 1);
inputs.position.addFace(0, 1, 2, 3);
inputs.position.addFace(1, 5, 6, 2);
inputs.position.addFace(5, 4, 7, 6);
inputs.position.addFace(4, 0, 3, 7);
inputs.position.addFace(3, 2, 6, 7);
inputs.position.addFace(1, 0, 4, 5);
// UVs:
inputs.uv.addVertex(0, 0);
inputs.uv.addVertex(0, 1);
inputs.uv.addVertex(1, 1);
inputs.uv.addVertex(1, 0);
inputs.uv.addFace(0, 1, 2, 3);
inputs.uv.addFace(0, 1, 2, 3);
inputs.uv.addFace(0, 1, 2, 3);
inputs.uv.addFace(0, 1, 2, 3);
inputs.uv.addFace(0, 1, 2, 3);
inputs.uv.addFace(0, 1, 2, 3);
// Normals:
inputs.normal.addVertex(0, 0, -1);
inputs.normal.addVertex(1, 0, 0);
inputs.normal.addVertex(0, 0, +1);
inputs.normal.addVertex(-1, 0, 0);
inputs.normal.addVertex(0, 1, 0);
inputs.normal.addVertex(0, -1, 0);
inputs.normal.addFace(0, 0, 0, 0);
inputs.normal.addFace(1, 1, 1, 1);
inputs.normal.addFace(2, 2, 2, 2);
inputs.normal.addFace(3, 3, 3, 3);
inputs.normal.addFace(4, 4, 4, 4);
inputs.normal.addFace(5, 5, 5, 5);
inputs.sanitize();
// Cube inputs:
// =====================
export const CUBE_VERTEX_COUNT = 8;
export const CUBE_FACE_VERTICES = new FaceVerticesInt8().load(inputs.position);
export const CUBE_VERTEX_FACES = new VertexFacesInt8().load(CUBE_FACE_VERTICES, CUBE_VERTEX_COUNT);
// Mesh options:
const defaults = new MeshOptions(0, 2 /* LOAD_VERTEX__NO_FACE */, 1 /* NO_VERTEX__GENERATE_FACE */, true);
const Cube = (options = defaults) => new Mesh(inputs, options, CUBE_FACE_VERTICES, CUBE_VERTEX_FACES).load();
export default Cube;
//# sourceMappingURL=cube.js.map