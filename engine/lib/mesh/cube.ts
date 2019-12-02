import Mesh from "./_base.js";
import {MeshOptions} from "./options.js";
import {InputPositions, MeshInputs} from "./inputs.js";
import {ATTRIBUTE, COLOR_SOURCING, FACE_TYPE, NORMAL_SOURCING} from "../../constants.js";
import {QuadInputs} from "../../types.js";
import {VertexFaces} from "./vertex/faces.js";
import {FaceVertices} from "./face/vertices.js";

// Vertex position values:
export const vertices: number[][] = [
    [ // X coordinates (0 = left, 1 = right)
        0, 1, 1, 0,
        0, 1, 1, 0
    ],
    [ // Y coordinates (0 = bottom, 1 = top)
        0, 0, 1, 1,
        0, 0, 1, 1
    ],
    [ // Z coordinates (0 = front, 1 = back)
        0, 0, 0, 0,
        1, 1, 1, 1
    ],
];

// Quad face vertex-index_arrays:
export const indices: QuadInputs = [
    [0, 1, 5, 4, 0, 3], // Vertex 1 of each quad
    [1, 5, 4, 0, 1, 2], // Vertex 2 of each quad
    [2, 6, 7, 3, 5, 6], // Vertex 3 of each quad
    [3, 2, 6, 7, 4, 7], // Vertex 4 of each quad
];

// Cube inputs:
// =====================
export const positions = new InputPositions(FACE_TYPE.QUAD, vertices, indices).triangulate();
export const inputs = new MeshInputs(FACE_TYPE.TRIANGLE, ATTRIBUTE.position, positions);
export const face_vertices = new FaceVertices(positions);

// Mesh options:
const defaults = new MeshOptions();
defaults.share = ATTRIBUTE.position;
defaults.normal = NORMAL_SOURCING.NO_VERTEX__GENERATE_FACE;
defaults.color = COLOR_SOURCING.NO_VERTEX__GENERATE_FACE;

const CubeMesh = (options: MeshOptions = defaults): Mesh => new Mesh(inputs, options, face_vertices);

export default CubeMesh;