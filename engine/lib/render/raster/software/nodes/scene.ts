import RasterCamera from "./camera.js";
import SoftwareRasterMaterial from "../materials/_base.js";
import BaseScene from "../../../../nodes/scene.js";
import {CameraConstructor, MaterialConstructor} from "../../../../_interfaces/render.js";


export default class RasterScene extends BaseScene<CanvasRenderingContext2D, RasterCamera> {
    protected _getDefaultCameraClass(): CameraConstructor<RasterCamera> {
        return RasterCamera
    };

    protected _getDefaultMaterialClass(): MaterialConstructor<CanvasRenderingContext2D, SoftwareRasterMaterial> {
        return SoftwareRasterMaterial
    };
}