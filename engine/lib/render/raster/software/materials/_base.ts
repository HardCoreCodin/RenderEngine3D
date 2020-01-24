import BaseMaterial from "../../../_base/material.js";
import Rasterizer from "../pipeline.js";

export default class SoftwareRasterMaterial extends BaseMaterial<CanvasRenderingContext2D, Rasterizer> {}

// export class PixelShader {
//
// }
//
// export class StandardMaterial {
//
// }

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