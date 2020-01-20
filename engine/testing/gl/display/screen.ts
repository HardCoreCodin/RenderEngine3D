import {GLScene} from "../render/engine.js";
import {GLCamera} from "../render/camera.js";
import {GLViewport} from "./viewport.js";
import {GLRenderPipeline} from "../render/pipeline.js";

import {BaseScreen} from "../../../lib/render/screen.js";
import {ISize} from "../../../lib/_interfaces/render.js";
import {IVector2D} from "../../../lib/_interfaces/vectors.js";
import {IController} from "../../../lib/_interfaces/input.js";


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
        size: ISize,
        position: IVector2D
    ): GLViewport {
        return new GLViewport(camera, render_pipeline, controller, this, size, position);
    }
}
