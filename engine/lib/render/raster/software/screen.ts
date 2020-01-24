import RasterCamera from "./nodes/camera.js";
import Rasterizer from "./pipeline.js";
import SoftwareRasterViewport from "./viewport.js";
import BaseScreen from "../../_base/screen.js";
import {IController} from "../../../_interfaces/input.js";
import {ISize} from "../../../_interfaces/render.js";
import {I2D} from "../../../_interfaces/vectors.js";


export default class SoftwareRasterScreen extends BaseScreen<CanvasRenderingContext2D> {
    protected _createViewport(
        camera: RasterCamera,
        render_pipeline: Rasterizer,
        controller: IController,
        size: ISize,
        position: I2D
    ): SoftwareRasterViewport {
        return new SoftwareRasterViewport(camera, render_pipeline, controller, this, size, position);
    }
}