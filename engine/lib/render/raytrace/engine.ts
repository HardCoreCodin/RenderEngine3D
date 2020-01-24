import RayTracer from "./pipeline.js";
import RayTraceScene from "./nodes/scene.js";
import RayTraceScreen from "./screen.js";
import RasterCamera from "../raster/software/nodes/camera.js";
import BaseRenderEngine from "../_base/engine.js";


export default class RayTraceEngine
    extends BaseRenderEngine<CanvasRenderingContext2D, RayTraceScene, RayTraceScreen> {
    protected _createContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
        return canvas.getContext('2d');
    }

    protected _createDefaultScreen(camera: RasterCamera): RayTraceScreen {
        return new RayTraceScreen(this.context,
            new RayTracer(this.context, this._scene.mesh_geometries, this._scene.materials),
            this.canvas,
            camera
        );
    }

    protected _createDefaultScene(): RayTraceScene {
        return new RayTraceScene(this.context);
    }

    protected _getDefaultCamera(): RasterCamera {
        return new RasterCamera(this._scene);
    }
}