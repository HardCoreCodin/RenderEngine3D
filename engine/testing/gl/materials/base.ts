import GLProgram from "../program.js";
import {GLScene} from "../render/engine.js";
import {GLMeshBuffers} from "../render/mesh_buffers.js";
import {GLRenderPipeline} from "../render/pipeline.js";
import BASE_VERTEX_SHADER_CODE from "./shaders/vertex/base.js";
import BASE_FRAGMENT_SHADER_CODE from "./shaders/fragment/base.js";

import {BaseMaterial} from "../../../lib/render/materials.js";
import {IMesh} from "../../../lib/_interfaces/geometry.js";
import {IMatrix4x4} from "../../../lib/_interfaces/matrix.js";

export class GLMaterial extends BaseMaterial<WebGL2RenderingContext> {
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