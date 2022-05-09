import Rasterizer from "./pipeline.js";
import RenderEngine from "../../base/engine.js";
import SoftwareRasterViewport from "./viewport.js";
import SoftwareRasterMaterial from "./materials/base.js";
import InputController, {InputControllerConstructor} from "../../../input/controllers.js";
import Scene from "../../../nodes/scene.js";
import Camera from "../../../nodes/camera.js";


export default class RasterEngine extends RenderEngine
{
    constructor(
        scene: Scene<CanvasRenderingContext2D> = new Scene(SoftwareRasterMaterial),
        main_camera: Camera = scene.addCamera(),
        parent_element?: HTMLElement,
        Controller: InputControllerConstructor = InputController
    ) {
        super(
            SoftwareRasterViewport,
            SoftwareRasterMaterial,
            Rasterizer,
            scene,
            main_camera,
            parent_element,
            Controller,
        );
    }
}