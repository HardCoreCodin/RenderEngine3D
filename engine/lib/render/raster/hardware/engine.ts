import GLMaterial from "./materials/_base.js";
import GLRenderPipeline from "./pipeline.js";
import GLViewport from "./viewport.js";
import RenderEngine from "../../_base/engine.js";
import {FPSController} from "../../../input/controllers.js";
import {ControllerConstructor} from "../../../_interfaces/input.js";


export default class GLRenderEngine extends RenderEngine<WebGL2RenderingContext>
{
    constructor(parent_element?: HTMLElement, Controller: ControllerConstructor = FPSController) {
        super(
            GLViewport,
            GLMaterial,
            GLRenderPipeline,
            parent_element,
            Controller
        );
    }

    protected _createContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
        const gl = canvas.getContext('webgl2');

        gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        return gl;
    }
}