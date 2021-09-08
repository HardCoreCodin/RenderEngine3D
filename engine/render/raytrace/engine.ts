import RayTracer from "./pipeline.js";
import RenderEngine from "../base/engine.js";
import RayTraceViewport from "./viewport.js";
import RayTraceMaterial from "./materials/base.js";
import {FPSController} from "../../input/controllers.js";
import {ControllerConstructor} from "../../core/interfaces/input.js";


export default class RayTraceEngine extends RenderEngine
{
    constructor(parent_element?: HTMLElement, Controller: ControllerConstructor = FPSController) {
        super(
            RayTraceViewport,
            RayTraceMaterial,
            RayTracer,
            parent_element,
            Controller
        );
    }
}