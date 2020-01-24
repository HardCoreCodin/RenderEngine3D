import RasterCamera from "../../raster/software/nodes/camera.js";
import RayTraceMaterial from "../materials/_base.js";
import BaseScene from "../../../nodes/scene.js";
import {CameraConstructor, MaterialConstructor} from "../../../_interfaces/render.js";


export default class RayTraceScene extends BaseScene<CanvasRenderingContext2D, RasterCamera> {
    protected _getDefaultCameraClass(): CameraConstructor<RasterCamera> {
        return RasterCamera
    };

    protected _getDefaultMaterialClass(): MaterialConstructor<CanvasRenderingContext2D, RayTraceMaterial> {
        return RayTraceMaterial
    };
}