import GLMaterial from "./materials/_base.js";
import GLRenderPipeline from "./pipeline.js";
import GLViewport from "./viewport.js";
import RenderEngine from "../../base/engine.js";
import { FPSController } from "../../../input/controllers.js";
export default class GLRenderEngine extends RenderEngine {
    constructor(parent_element, Controller = FPSController) {
        super(GLViewport, GLMaterial, GLRenderPipeline, parent_element, Controller);
    }
    _createContext(canvas) {
        const gl = canvas.getContext('webgl2');
        gl.enable(gl.BLEND);
        gl.enable(gl.DEPTH_TEST);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        return gl;
    }
}
//# sourceMappingURL=engine.js.map