import Rasterizer from "./pipeline.js";
import RasterScene from "./nodes/scene.js";
import RasterCamera from "./nodes/camera.js";
import BaseRenderEngine from "../../_base/engine.js";
import SoftwareRasterScreen from "./screen.js";
import SoftwareRasterViewport from "./viewport.js";


export default class RasterEngine
    extends BaseRenderEngine<CanvasRenderingContext2D, SoftwareRasterScreen> { //}, RasterScene> {
    protected _createContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
        return canvas.getContext('2d');
    }

    protected _createDefaultScreen(camera: RasterCamera): SoftwareRasterScreen {
        return new SoftwareRasterScreen(
            camera,
            this.context,
            this.canvas,
            new Rasterizer(this.context, this._scene.mesh_geometries, this._scene.materials),
            SoftwareRasterViewport
        );
    }

    // protected _createDefaultScene(): RasterScene {
    //     return new RasterScene(this.context);
    // }

    protected _getDefaultCamera(): RasterCamera {
        return new RasterCamera(this._scene);
    }
}