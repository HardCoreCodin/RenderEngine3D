import Mesh from "./mesh.js";
import {MeshOptions} from "./options.js";
import {MeshInputs} from "./inputs.js";
import {ATTRIBUTE, COLOR_SOURCING, NORMAL_SOURCING} from "../../constants.js";
import {FaceVerticesInt8, VertexFacesInt8} from "./indices.js";

export const inputs = new MeshInputs(ATTRIBUTE.position|ATTRIBUTE.uv);

// Quads vertex/index array (CCW LH):
// X coordinates (0 = left, 1 = right)
// Y coordinates (0 = bottom, 1 = top)
// Z coordinates (0 = front, 1 = back)
inputs.position.addVertex(0, 0, 0);
inputs.position.addVertex(1, 0, 0);
inputs.position.addVertex(1, 1, 0);
inputs.position.addVertex(0, 1, 0);

inputs.position.addVertex(0, 0, 1);
inputs.position.addVertex(1, 0, 1);
inputs.position.addVertex(1, 1, 1);
inputs.position.addVertex(0, 1, 1);

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

inputs.sanitize();

// Cube inputs:
// =====================
export const CUBE_VERTEX_COUNT = 8;
export const CUBE_FACE_VERTICES = new FaceVerticesInt8().load(inputs.position);
export const CUBE_VERTEX_FACES = new VertexFacesInt8().load(CUBE_FACE_VERTICES, CUBE_VERTEX_COUNT);

// Mesh options:
const defaults = new MeshOptions(
    0,
    NORMAL_SOURCING.NO_VERTEX__GENERATE_FACE,
    COLOR_SOURCING.NO_VERTEX__GENERATE_FACE,
    true
);

const Cube = (
    options: MeshOptions = defaults
): Mesh => new Mesh(
    inputs,
    options,
    CUBE_FACE_VERTICES,
    CUBE_VERTEX_FACES
).load();

export default Cube;