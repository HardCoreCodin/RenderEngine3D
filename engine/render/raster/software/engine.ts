import Rasterizer from "./pipeline.js";
import RenderEngine from "../../base/engine.js";
import SoftwareRasterViewport from "./viewport.js";
import SoftwareRasterMaterial from "./materials/_base.js";
import {FPSController} from "../../../input/controllers.js";
import {ControllerConstructor} from "../../../core/interfaces/input.js";


export default class RasterEngine extends RenderEngine
{
    constructor(parent_element?: HTMLElement, Controller: ControllerConstructor = FPSController) {
        super(
            SoftwareRasterViewport,
            SoftwareRasterMaterial,
            Rasterizer,
            parent_element,
            Controller,
        );
    }
}