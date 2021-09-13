import RayTracer from "./pipeline.js";
import RenderEngine from "../base/engine.js";
import RayTraceViewport from "./viewport.js";
import RayTraceMaterial from "./materials/base.js";
import InputController, {InputControllerConstructor} from "../../input/controllers.js";


export default class RayTraceEngine extends RenderEngine
{
    constructor(parent_element?: HTMLElement, Controller: InputControllerConstructor = InputController) {
        super(
            RayTraceViewport,
            RayTraceMaterial,
            RayTracer,
            parent_element,
            Controller
        );
    }
}