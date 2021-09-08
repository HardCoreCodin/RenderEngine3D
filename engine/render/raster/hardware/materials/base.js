import GLProgram from "../core/program.js";
import BaseMaterial from "../../../base/material.js";
export default class GLMaterial extends BaseMaterial {
    constructor(scene, vertex_shader_source = VERTEX_SHADER_SOURCE, fragment_shader_source = FRAGMENT_SHADER_SOURCE, program = GLProgram.Compile(scene.context, vertex_shader_source, fragment_shader_source)) {
        super(scene);
        this.program = program;
    }
    prepareMeshForDrawing(mesh, render_pipeline) {
        this._mesh_buffers = render_pipeline.mesh_buffers.get(mesh);
        this._mesh_buffers.vertex_array.bindToLocations(this.program.locations);
        this._mesh_buffers.vertex_array.bind();
    }
    uploadUniforms() {
        this.program.uniforms.model_to_clip.load(this._model_to_clip.array);
    }
    drawMesh(mesh, model_to_clip) {
        this._model_to_clip = model_to_clip;
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
//# sourceMappingURL=base.js.map