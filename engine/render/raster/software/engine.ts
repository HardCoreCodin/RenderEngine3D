import Rasterizer from "./pipeline.js";
import RenderEngine from "../../base/engine.js";
import SoftwareRasterViewport from "./viewport.js";
import SoftwareRasterMaterial from "./materials/base.js";
import InputController, {InputControllerConstructor} from "../../../input/controllers.js";


export default class RasterEngine extends RenderEngine
{
    constructor(parent_element?: HTMLElement, Controller: InputControllerConstructor = InputController) {
        super(
            SoftwareRasterViewport,
            SoftwareRasterMaterial,
            Rasterizer,
            parent_element,
            Controller,
        );
    }
}