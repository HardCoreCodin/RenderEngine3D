import RasterCamera from "../raster/software/nodes/camera.js";
import RayTracer from "./pipeline.js";
import RayTraceViewport from "./viewport.js";
import BaseScreen from "../_base/screen.js";
import {IController} from "../../_interfaces/input.js";
import {ISize} from "../../_interfaces/render.js";
import {I2D} from "../../_interfaces/vectors.js";


export default class RayTraceScreen extends BaseScreen<CanvasRenderingContext2D> {
    protected _createViewport(
        camera: RasterCamera,
        render_pipeline: RayTracer,
        controller: IController,
        size: ISize,
        position: I2D
    ): RayTraceViewport {
        return new RayTraceViewport(camera, render_pipeline, controller, this, size, position);
    }
}