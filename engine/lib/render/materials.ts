import Mesh from "../geometry/mesh.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {Rasterizer, RayTracer} from "./pipelines.js";
import {MeshGeometries} from "./geometry.js";
import {IScene} from "../_interfaces/nodes.js";
import {IMaterial, IRenderPipeline} from "../_interfaces/render.js";

export class BaseMaterial<
    Context extends RenderingContext,
    RenderPipelineType extends IRenderPipeline<Context>>
    implements IMaterial<Context, RenderPipelineType>
{
    static LAST_ID = 0;

    prepareMeshForDrawing(mesh: Mesh, render_pipeline: RenderPipelineType): void {};
    drawMesh(mesh: Mesh, matrix: Matrix4x4): void {};

    readonly id: number;
    readonly mesh_geometries: MeshGeometries;

    constructor(readonly scene: IScene<Context>) {
        this.id = BaseMaterial.LAST_ID++;
        scene.materials.add(this);
        this.mesh_geometries = new MeshGeometries(scene);
    }
}

export class RasterMaterial extends BaseMaterial<CanvasRenderingContext2D, Rasterizer> {}

export class RayTraceMaterial extends BaseMaterial<CanvasRenderingContext2D, RayTracer> {}

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