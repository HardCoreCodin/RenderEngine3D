import Rasterizer from "./pipeline.js";
import RenderEngine from "../../base/engine.js";
import SoftwareRasterViewport from "./viewport.js";
import SoftwareRasterMaterial from "./materials/_base.js";
import { FPSController } from "../../../input/controllers.js";
export default class RasterEngine extends RenderEngine {
    constructor(parent_element, Controller = FPSController) {
        super(SoftwareRasterViewport, SoftwareRasterMaterial, Rasterizer, parent_element, Controller);
    }
}
//# sourceMappingURL=engine.js.map