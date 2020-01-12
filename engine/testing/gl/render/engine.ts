import {GLCamera} from "./camera.js";
import {GLScreen} from "../display/screen.js";
import {GLMaterial} from "../materials/base.js";
import {GLViewport} from "../display/viewport.js";
import {GLRenderPipeline} from "./pipeline.js";

import {BaseScene} from "../../../lib/scene_graph/scene.js";
import {BaseRenderEngine} from "../../../lib/render/engine.js";
import {FPSController} from "../../../lib/input/controllers.js";


export class GLScene extends BaseScene<WebGL2RenderingContext, GLCamera, GLMaterial> {}
export class GLRenderEngine
    extends BaseRenderEngine<WebGL2RenderingContext, GLScene, GLCamera, GLRenderPipeline, GLViewport, GLScreen>
{
    protected _createContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
        gl = canvas.getContext('webgl2');

        gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        return gl;
    }

    protected _createDefaultScreen(canvas: HTMLCanvasElement, camera: GLCamera): GLScreen {
        return new GLScreen(camera, this.scene, this.context, this._controller, canvas);
    }

    protected _createDefaultController(canvas: HTMLCanvasElement, viewport: GLViewport): FPSController {
        return new FPSController(viewport, canvas);
    }

    protected _createDefaultScene(): GLScene {
        return new GLScene(this.context);
    }

    protected _getDefaultCamera(): GLCamera {
        return this.scene.cameras.size ? this.scene.cameras[0] : this.scene.addCamera(GLCamera);
    }
}

let gl: WebGL2RenderingContext;