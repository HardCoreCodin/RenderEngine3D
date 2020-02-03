import Mesh from "./mesh.js";
import { MeshOptions } from "./options.js";
import { MeshInputs } from "./inputs.js";
import { FaceVerticesInt8, VertexFacesInt8 } from "./indices.js";
export const inputs = new MeshInputs(1 /* position */ | 8 /* uv */);
// Quads vertex/index arrays (CCW LH):
// X coordinates (0 = left, 1 = right)
// Y coordinates (0 = bottom, 1 = top)
// Z coordinates (0 = front, 1 = back)
inputs.position.pushVertex([0, 0, 0]);
inputs.position.pushVertex([1, 0, 0]);
inputs.position.pushVertex([1, 1, 0]);
inputs.position.pushVertex([0, 1, 0]);
inputs.position.pushVertex([0, 0, 1]);
inputs.position.pushVertex([1, 0, 1]);
inputs.position.pushVertex([1, 1, 1]);
inputs.position.pushVertex([0, 1, 1]);
inputs.position.pushFace([0, 1, 2, 3]);
inputs.position.pushFace([1, 5, 6, 2]);
inputs.position.pushFace([5, 4, 7, 6]);
inputs.position.pushFace([4, 0, 3, 7]);
inputs.position.pushFace([3, 2, 6, 7]);
inputs.position.pushFace([1, 0, 4, 5]);
// UVs:
inputs.uv.pushVertex([0, 0]);
inputs.uv.pushVertex([0, 1]);
inputs.uv.pushVertex([1, 1]);
inputs.uv.pushVertex([1, 0]);
inputs.uv.pushFace([0, 1, 2, 3]);
inputs.uv.pushFace([0, 1, 2, 3]);
inputs.uv.pushFace([0, 1, 2, 3]);
inputs.uv.pushFace([0, 1, 2, 3]);
inputs.uv.pushFace([0, 1, 2, 3]);
inputs.uv.pushFace([0, 1, 2, 3]);
inputs.sanitize();
// Cube inputs:
// =====================
export const cube_vertex_count = 8;
export const cube_face_vertices = new FaceVerticesInt8().load(inputs.position);
export const cube_vertex_faces = new VertexFacesInt8().load(cube_face_vertices, cube_vertex_count);
// Mesh options:
const defaults = new MeshOptions(1 /* position */, 1 /* NO_VERTEX__GENERATE_FACE */, 1 /* NO_VERTEX__GENERATE_FACE */, true);
const Cube = (options = defaults) => new Mesh(inputs, options, cube_face_vertices, cube_vertex_faces).load();
export default Cube;
//# sourceMappingURL=cube.js.map