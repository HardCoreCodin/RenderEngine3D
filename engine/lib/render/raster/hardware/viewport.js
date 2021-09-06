import GLProgram from "./_core/program.js";
import { GLVertexArray } from "./_core/buffers.js";
import { Border, Grid } from "../../_base/viewport.js";
import RasterViewport, { OrthographicProjectionMatrix, PerspectiveProjectionMatrix } from "../_base/viewport.js";
export default class GLViewport extends RasterViewport {
    _init() {
        super._init();
    }
    _getGrid() {
        return new GLGrid(this.context, this.world_to_clip);
    }
    _getBorder() {
        return new GLBorder(this.context);
    }
    update() {
        super.update();
    }
    refresh() {
        this.context.enable(this.context.SCISSOR_TEST);
        this.context.scissor(this.position.x, this.position.y, this.size.width, this.size.height);
        this.context.clearColor(0, 0, 0, 1);
        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);
        this.context.viewport(this.position.x, this.position.y, this.size.width, this.size.height);
        this._render_pipeline.render(this);
        this._drawOverlay();
        this.context.disable(this.context.SCISSOR_TEST);
    }
    _getPerspectiveProjectionMatrix() {
        return new GLPerspectiveProjectionMatrix(this._controller.camera.lense, this.view_frustum);
    }
    _getOrthographicProjectionMatrix() {
        return new GLOrthographicProjectionMatrix(this._controller.camera.lense, this.view_frustum);
    }
}
export class GLPerspectiveProjectionMatrix extends PerspectiveProjectionMatrix {
    // Override DX-style projection matrix formulation with GL-style one:
    updateZ() {
        // GL clip-space has a depth-span of 2 (-1 to 1)
        n = this.view_frustum.near;
        f = this.view_frustum.far;
        d = this.view_frustum.one_over_depth_span;
        this.z_axis.z = (f + n) * d;
        this.translation.z = -2 * f * n * d;
    }
}
export class GLOrthographicProjectionMatrix extends OrthographicProjectionMatrix {
    // Override DX-style projection matrix formulation with GL-style one:
    updateZ() {
        n = this.view_frustum.near;
        f = this.view_frustum.far;
        d = this.view_frustum.one_over_depth_span;
        this.z_axis.z = -2 * d;
        this.translation.z = d * (f + n);
    }
}
class GLOverlay {
    constructor(overlay, vertex_shader_source, fragment_shader_source, program = GLProgram.Compile(overlay.gl, vertex_shader_source, fragment_shader_source)) {
        this.overlay = overlay;
        this.program = program;
        this._color_uniform = program.uniforms.color;
        this._vao = new GLVertexArray(overlay.gl, overlay.vertex_positions.vertex_count, {
            position: overlay.vertex_positions.array
        }, this.program.locations);
        this._vbo = this._vao.attributes.position;
    }
    load() {
        this._vbo.load(this.overlay.vertex_positions.array, this.overlay.vertex_positions.vertex_count);
    }
    pre_draw() {
        this.program.use();
        this._vao.bind();
        this._color_uniform.load(this.overlay.color.array);
    }
    draw(mode) {
        this._vbo.draw(mode);
    }
}
class GLBorder extends Border {
    constructor(gl) {
        super();
        this.gl = gl;
        this._overlay = new GLOverlay(this, BORDER_VERTEX_SHADER, BORDER_FRAGMENT_SHADER);
    }
    draw() {
        this._overlay.pre_draw();
        this._overlay.draw(this.gl.LINE_LOOP);
    }
}
class GLGrid extends Grid {
    constructor(gl, _world_to_clip) {
        super();
        this.gl = gl;
        this._world_to_clip = _world_to_clip;
        this._overlay = new GLOverlay(this, GRID_VERTEX_SHADER, GRID_FRAGMENT_SHADER);
        this._world_to_clip_uniform = this._overlay.program.uniforms.world_to_clip;
    }
    get size() { return this._size; }
    set size(size) {
        super.size = size;
        this._overlay.load();
    }
    draw() {
        this._overlay.pre_draw();
        this._world_to_clip_uniform.load(this._world_to_clip.array);
        this._overlay.draw(this.gl.LINES);
    }
}
let n, f, d;
const BORDER_VERTEX_SHADER = `#version 300 es

in vec4 position;

void main() {
    gl_Position = position;
}
`;
const BORDER_FRAGMENT_SHADER = `#version 300 es
precision mediump float;

uniform vec4 color;
out vec4 fragment_color;

void main() {
    fragment_color = color;
}
`;
const GRID_VERTEX_SHADER = `#version 300 es

in vec3 position;
uniform mat4 world_to_clip;

void main() {
    gl_Position = world_to_clip * vec4(position, 1.0);
}
`;
const GRID_FRAGMENT_SHADER = `#version 300 es
precision mediump float;

uniform vec4 color;
out vec4 fragment_color;

void main() {
    fragment_color = color;
}
`;
//# sourceMappingURL=viewport.js.map