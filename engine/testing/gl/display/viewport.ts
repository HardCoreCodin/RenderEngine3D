import {GLScreen} from "./screen.js";
import {GLScene} from "../render/engine.js";
import {GLCamera} from "../render/camera.js";
import {GLRenderPipeline} from "../render/pipeline.js";

import {BaseViewport} from "../../../lib/render/viewport.js";


export class GLViewport extends BaseViewport<WebGL2RenderingContext, GLCamera, GLScene, GLRenderPipeline, GLScreen> {
    protected _pre_render(): void {
        this._context.enable(this._context.SCISSOR_TEST);
        this._context.scissor(this._position.x, this._position.y, this._size.width, this._size.height);
        this._context.clearColor(0, 0, 0, 1);
        this._context.clear(this._context.COLOR_BUFFER_BIT | this._context.DEPTH_BUFFER_BIT);
        this._context.viewport(this._position.x, this._position.y, this._size.width, this._size.height);
    }

    protected _post_render(): void {
        this._context.disable(this._context.SCISSOR_TEST);
    }
}