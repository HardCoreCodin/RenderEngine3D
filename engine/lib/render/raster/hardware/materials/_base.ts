import GLScene from "../nodes/scene.js";
import GLProgram from "../_core/program.js";
import GLMeshBuffers from "../_core/mesh_buffers.js";
import GLRenderPipeline from "../pipeline.js";
import BaseMaterial from "../../../_base/material.js";
import {IMesh} from "../../../../_interfaces/geometry.js";
import {IMatrix4x4} from "../../../../_interfaces/matrix.js";


export default class GLMaterial extends BaseMaterial<WebGL2RenderingContext, GLRenderPipeline>
{
    readonly program: GLProgram;

    protected _model_to_clip = new Float32Array(16);
    protected _mesh_buffers: GLMeshBuffers;

    constructor(scene: GLScene) {
        super(scene);
        this.program = new GLProgram(
            scene.context,
            this._getVertexShaderCode(),
            this._getFragmentShaderShaderCode()
        );
    }

    prepareMeshForDrawing(mesh: IMesh, render_pipeline: GLRenderPipeline): void {
        this._mesh_buffers = render_pipeline.mesh_buffers.get(mesh);
        this._mesh_buffers.vertex_array.bindToLocations(this.program.locations);
        this._mesh_buffers.vertex_array.bind();
    }

    uploadUniforms(): void {
        this.program.uniforms.model_to_clip.load(this._model_to_clip);
    }

    drawMesh(mesh: IMesh, model_to_clip: IMatrix4x4) {
        model_to_clip.toArray(this._model_to_clip);

        this.uploadUniforms();

        this._mesh_buffers.index_buffer.draw();
    }

    protected _getVertexShaderCode(): string {
        return BASE_VERTEX_SHADER_CODE;
    };

    protected _getFragmentShaderShaderCode(): string {
        return BASE_FRAGMENT_SHADER_CODE;
    };
}

let BASE_VERTEX_SHADER_CODE: string;
let BASE_FRAGMENT_SHADER_CODE: string;

for (const script of document.scripts)
    if (script.type.startsWith('x-shader')) {
        if (script.type.endsWith('vertex'))
            BASE_VERTEX_SHADER_CODE = script.text;
        if (script.type.endsWith('fragment'))
            BASE_FRAGMENT_SHADER_CODE = script.text;
    }