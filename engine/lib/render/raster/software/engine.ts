import Rasterizer from "./pipeline.js";
import RasterCamera from "./nodes/camera.js";
import RenderEngine from "../../_base/engine.js";
import SoftwareRasterViewport from "./viewport.js";
import SoftwareRasterMaterial from "./materials/_base.js";
import {FPSController} from "../../../input/controllers.js";
import {ControllerConstructor} from "../../../_interfaces/input.js";


export default class RasterEngine extends RenderEngine
{
    constructor(parent_element?: HTMLElement, Controller: ControllerConstructor = FPSController) {
        super(
            RasterCamera,
            SoftwareRasterViewport,
            SoftwareRasterMaterial,
            Rasterizer,
            parent_element,
            Controller,
        );
    }
}