import Scene from "../../../../nodes/scene.js";
import GLProgram from "../_core/program.js";
import GLMeshBuffers from "../_core/mesh_buffers.js";
import GLRenderPipeline from "../pipeline.js";
import BaseMaterial from "../../../_base/material.js";
import {IMesh} from "../../../../_interfaces/geometry.js";
import {IMatrix4x4} from "../../../../_interfaces/matrix.js";


export default class GLMaterial extends BaseMaterial<WebGL2RenderingContext, GLRenderPipeline>
{
    protected _model_to_clip = new Float32Array(16);
    protected _mesh_buffers: GLMeshBuffers;

    constructor(
        scene: Scene<WebGL2RenderingContext>,
        vertex_shader_source: string = VERTEX_SHADER_SOURCE,
        fragment_shader_source: string = FRAGMENT_SHADER_SOURCE,
        readonly program: GLProgram = GLProgram.Compile(scene.context, vertex_shader_source, fragment_shader_source)
    ) {
        super(scene);
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
}


const VERTEX_SHADER_SOURCE = `#version 300 es

in vec3 position;
in vec2 uv;
out vec2 f_uv;
uniform mat4 model_to_clip;

void main() {
    f_uv = uv;
    gl_Position = model_to_clip * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `#version 300 es
precision mediump float;

out vec4 color;

void main() {
    color = vec4(1.0, 1.0, 1.0, 1.0);
}
`;