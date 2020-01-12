import {GLScreen} from "./screen.js";
import {GLScene} from "../render/engine.js";
import {GLCamera} from "../render/camera.js";
import {GLRenderPipeline} from "../render/pipeline.js";

import {BaseViewport} from "../../../lib/render/viewport.js";


export class GLViewport extends BaseViewport<WebGL2RenderingContext, GLScene, GLCamera, GLRenderPipeline, GLScreen> {
    protected _getDefaultRenderPipeline(context: WebGL2RenderingContext): GLRenderPipeline {
        if (!DEFAULT_RENDER_PIPELINE)
            DEFAULT_RENDER_PIPELINE = new GLRenderPipeline(context);

        return DEFAULT_RENDER_PIPELINE;
    }

    reset(width: number, height: number, x: number, y: number): void {
        if (width !== this._size.width ||
            height !== this._size.height ||
            x !== this._position.x ||
            y !== this._position.y
        ) {
            super.reset(width, height, x, y);
            this._context.viewport(x, y, width, height);
        }
    }
}

let DEFAULT_RENDER_PIPELINE: GLRenderPipeline;