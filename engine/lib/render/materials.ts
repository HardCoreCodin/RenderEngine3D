import Geometry from "./geometry.js";
import {VertexPositions3D, VertexPositions4D} from "../geometry/positions.js";
import Mesh from "../geometry/mesh.js";
import {CULL, INSIDE} from "../../constants.js";
import {cullFaces, cullVertices} from "../math/rendering/culling.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {Bounds4D} from "../geometry/bounds.js";

export default class Material {
    static LAST_ID = 0;
    static DEFAULT: Material;

    readonly mesh_geometries = new Map<Mesh, Geometry[]>();

    constructor(
        readonly geometry: Geometry,

        readonly mesh_shader: MeshShader,
        readonly pixel_shader: PixelShader,

        readonly id: number = Material.LAST_ID++
    ){}

}



export class PixelShader {

}

export class StandardMaterial {

}


const SHADER_BODY_TOKEN = 'ShaderBody';
const SHADER_FUNCTION_BODY_TEMPLATE = `
    for (const pixel of pixels) {
        ${SHADER_BODY_TOKEN}
    }
`;

const SHADER_MAIN_BODY_REGEX = /BeginShader(.+)EndShader/;


const createShaderFunction = (script_element: HTMLScriptElement): Function => new Function(
    'inputs',  'outputs',
    SHADER_FUNCTION_BODY_TEMPLATE.replace(
        SHADER_BODY_TOKEN,
        SHADER_MAIN_BODY_REGEX.exec(script_element.innerText)[1]
    )
);


// // Example:
// // <script type="pixel-shader">
//
// const main = (
//     inputs: ShaderInputs,
//     outputs: ShaderOutputs,
//     x: number,
//     y: number
// ) => {
// // BeginShader
// outputs.set(inputs);
// // EndShader
// };
// // </script>
//
// // function (inputs, outputs) {
// //     for (let pixel_offset = 0; pixel_offset < frame_buffer.length; pixel_offset++) {
// //         if ()
// //         outputs.set(inputs);
// //     }
// // }