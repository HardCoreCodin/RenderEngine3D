import BaseMaterial from "../../../base/material.js";
import Rasterizer from "../pipeline.js";
import Scene from "../../../../nodes/scene.js";
import shadePixelCoords, {IPixelShader} from "./shaders/pixel.js";
import shadeMesh, {IMeshShader} from "./shaders/mesh.js";

export default class SoftwareRasterMaterial extends BaseMaterial<CanvasRenderingContext2D, Rasterizer>
{
    constructor(
        readonly scene: Scene<CanvasRenderingContext2D>,
        public pixel_shader: IPixelShader = shadePixelCoords,
        public mesh_shader: IMeshShader = shadeMesh
    ) {
        super(scene);
    }
}

//
// export class PixelShader {
//
// }
//
// export class StandardMaterial {
//
// }
//
//
// const SHADER_BODY_TOKEN = 'ShaderBody';
// const SHADER_FUNCTION_BODY_TEMPLATE = `
//     for (const pixel of pixels) {
//         ${SHADER_BODY_TOKEN}
//     }
// `;
//
// const SHADER_MAIN_BODY_REGEX = /BeginShader(.+)EndShader/;
//
//
// const createShaderFunction = (script_element: HTMLScriptElement): Function => new Function(
//     'inputs',  'outputs',
//     SHADER_FUNCTION_BODY_TEMPLATE.replace(
//         SHADER_BODY_TOKEN,
//         SHADER_MAIN_BODY_REGEX.exec(script_element.innerText)[1]
//     )
// );
//
//
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