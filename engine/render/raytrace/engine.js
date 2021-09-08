import RayTracer from "./pipeline.js";
import RenderEngine from "../base/engine.js";
import RayTraceViewport from "./viewport.js";
import RayTraceMaterial from "./materials/base.js";
import { FPSController } from "../../input/controllers.js";
export default class RayTraceEngine extends RenderEngine {
    constructor(parent_element, Controller = FPSController) {
        super(RayTraceViewport, RayTraceMaterial, RayTracer, parent_element, Controller);
    }
}
//# sourceMappingURL=engine.js.map