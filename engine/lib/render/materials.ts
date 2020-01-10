import {MeshGeometries} from "./geometry.js";
import Mesh from "../geometry/mesh.js";
import Scene from "../scene_graph/scene.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {IMaterial} from "../_interfaces/render.js";

export abstract class BaseMaterial implements IMaterial {
    static LAST_ID = 0;

    abstract prepareMeshForDrawing(mesh: Mesh): void;
    abstract drawMesh(mesh: Mesh, matrix: Matrix4x4);

    protected constructor(
        readonly scene: Scene,
        readonly id: number = BaseMaterial.LAST_ID++,
        readonly mesh_geometries = new MeshGeometries(scene)
    ) {}
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