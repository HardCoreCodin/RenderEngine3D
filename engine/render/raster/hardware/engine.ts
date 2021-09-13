import GLMaterial from "./materials/base.js";
import GLRenderPipeline from "./pipeline.js";
import GLViewport from "./viewport.js";
import RenderEngine from "../../base/engine.js";
import InputController, {InputControllerConstructor} from "../../../input/controllers.js";


export default class GLRenderEngine extends RenderEngine<WebGL2RenderingContext>
{
    constructor(parent_element?: HTMLElement, Controller: InputControllerConstructor = InputController) {
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