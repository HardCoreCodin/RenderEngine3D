import {GLScene} from "../render/engine.js";
import {GLCamera} from "../render/camera.js";
import {GLViewport} from "./viewport.js";
import {GLRenderPipeline} from "../render/pipeline.js";

import {BaseScreen} from "../../../lib/render/screen.js";
import {IRectangle} from "../../../lib/_interfaces/render.js";
import {IVector2D} from "../../../lib/_interfaces/vectors.js";
import {IController} from "../../../lib/_interfaces/input.js";
import GLProgram from "../program.js";
import {GLVertexArray} from "../buffers.js";


export class GLScreen extends BaseScreen<WebGL2RenderingContext, GLCamera, GLScene, GLRenderPipeline, GLViewport> {
    protected _createDefaultRenderPipeline(context: WebGL2RenderingContext, scene: GLScene): GLRenderPipeline {
        return new GLRenderPipeline(context, scene);
    }

    resize(width: number, height: number): void {
        this.context.canvas.width  = width;
        this.context.canvas.height = height;
        super.resize(width, height);
    }

    protected _createViewport(
        camera: GLCamera,
        render_pipeline: GLRenderPipeline,
        controller: IController,
        size: IRectangle,
        position: IVector2D
    ): GLViewport {
        return new GLViewport(camera, render_pipeline, controller, this, size, position);
    }

    protected _viewport_border: GLViewportBorder;

    protected _initBorder(): void {
        this._viewport_border = new GLViewportBorder(this.context);
    }

    protected _drawBorder(): void {
        this.context.viewport(
            this._active_viewport.x,
            this._active_viewport.y,
            this._active_viewport.width,
            this._active_viewport.height
        );
        this._viewport_border.program.use();
        this._viewport_border.vertices.bind();
        this._viewport_border.vertices.attributes.position.draw(this.context.LINES);
    }
}

const GLVIEWPORT_BORDER_LINES = Float32Array.of(
    -1, -1,   -1, -1,
    1, -1,  1, 1,
    1, 1,  -1, 1,
    -1, 1,  -1, -1,
    );
const GLVIEWPORT_BORDER_VERTEX_SHADER_CODE = `#version 300 es
layout(location = 0) in vec4 position;

void main() {
    gl_Position = position;
}`;

const GLVIEWPORT_BORDER_FRAGMENT_SHADER_CODE = `#version 300 es
precision mediump float;
out vec4 color;

void main() {
  color = vec4(0.0, 1.0, 1.0, 1.0);
}`;


class GLViewportBorder {
    readonly program: GLProgram;
    readonly vertices: GLVertexArray;

    constructor(gl: WebGL2RenderingContext) {
        this.program = new GLProgram(gl,
            GLVIEWPORT_BORDER_VERTEX_SHADER_CODE,
            GLVIEWPORT_BORDER_FRAGMENT_SHADER_CODE
        );
        this.vertices = new GLVertexArray(
            gl, 8, {
                position: GLVIEWPORT_BORDER_LINES
            },
            this.program.locations
        );
    }
}