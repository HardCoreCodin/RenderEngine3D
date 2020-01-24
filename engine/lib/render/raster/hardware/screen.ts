import GLCamera from "./nodes/camera.js";
import GLViewport from "./viewport.js";
import GLRenderPipeline from "./pipeline.js";

import BaseScreen from "../../_base/screen.js";
import {IController} from "../../../_interfaces/input.js";


export default class GLScreen extends BaseScreen<WebGL2RenderingContext> {
    resize(width: number, height: number): void {
        this.context.canvas.width  = width;
        this.context.canvas.height = height;
        super.resize(width, height);
    }

    protected _createViewport(
        camera: GLCamera,
        render_pipeline: GLRenderPipeline,
        controller: IController
    ): GLViewport {
        return new GLViewport(camera, render_pipeline, controller, this);
    }
}
