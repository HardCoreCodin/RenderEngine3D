import {Mesh, MeshInputs, MeshOptions} from "./mesh.js";
import {ATTRIBUTE, COLOR_SOURCING, FACE_TYPE, NORMAL_SOURCING} from "../constants.js";
import {InputPositions} from "./attribute.js";

// Cube inputs in quads:
// =====================
const mesh_inputs  = new MeshInputs(
    FACE_TYPE.QUAD,
    ATTRIBUTE.position,

    new InputPositions(
        FACE_TYPE.QUAD,

        // Vertex position values:
        [
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
        ],

        // Quad face vertex-indices:
        [
            [0, 1, 5, 4, 0, 3], // Vertex 1 of each quad
            [1, 5, 4, 0, 1, 2], // Vertex 2 of each quad
            [2, 6, 7, 3, 5, 6], // Vertex 3 of each quad
            [3, 2, 6, 7, 4, 7], // Vertex 4 of each quad
        ]
    )
);

const makeCube = (
    share: ATTRIBUTE = ATTRIBUTE.position,
    normals: NORMAL_SOURCING = NORMAL_SOURCING.NO_VERTEX__GENERATE_FACE,
    colors: COLOR_SOURCING = COLOR_SOURCING.NO_VERTEX__GENERATE_FACE,
) : Mesh => new Mesh(mesh_inputs, new MeshOptions(share, normals, colors));

export default makeCube;