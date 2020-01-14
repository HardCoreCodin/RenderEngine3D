import {GLScreen} from "./screen.js";
import {GLScene} from "../render/engine.js";
import {GLCamera} from "../render/camera.js";
import {GLRenderPipeline} from "../render/pipeline.js";

import {BaseViewport} from "../../../lib/render/viewport.js";


export class GLViewport extends BaseViewport<WebGL2RenderingContext, GLScene, GLCamera, GLRenderPipeline, GLScreen> {
    refresh() {
        this._context.viewport(
            this._position.x,
            this._position.y,
            this._size.width,
            this._size.height
        );
        super.refresh();
    }

    // reset(width: number, height: number, x: number, y: number): void {
    //     if (width !== this._size.width ||
    //         height !== this._size.height ||
    //         x !== this._position.x ||
    //         y !== this._position.y
    //     ) {
    //         super.reset(width, height, x, y);
    //         this._context.viewport(x, y, width, height);
    //     }
    // }
}