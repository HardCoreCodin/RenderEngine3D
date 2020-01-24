import RayTracer from "./pipeline.js";
import RayTraceScene from "./nodes/scene.js";
import RayTraceScreen from "./screen.js";
import RasterCamera from "../raster/software/nodes/camera.js";
import BaseRenderEngine from "../_base/engine.js";
import RayTraceViewport from "./viewport.js";
import Scene from "../../nodes/scene.js";
import {IController} from "../../_interfaces/input.js";
import RayTraceMaterial from "./materials/_base.js";


export default class RayTraceEngine
    extends BaseRenderEngine<CanvasRenderingContext2D, RayTraceScreen> { //, RayTraceScene> {

    constructor(
        parent_element?: HTMLElement,
        scene?: Scene<CanvasRenderingContext2D>,
        camera?: RasterCamera,
        controller?: IController,
        screen?: RayTraceScreen
    ) {
        super(
            RasterCamera,
            RayTraceMaterial,
            parent_element,
            scene,
            camera,
            controller,
            screen
        );
    }

    protected _createContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
        return canvas.getContext('2d');
    }

    protected _createDefaultScreen(camera: RasterCamera): RayTraceScreen {
        return new RayTraceScreen(
            camera,
            this.context,
            this.canvas,
            new RayTracer(this.context, this._scene.mesh_geometries, this._scene.materials),
            RayTraceViewport
        );
    }

    // protected _createDefaultScene(): RayTraceScene {
    //     return new RayTraceScene(this.context);
    // }

    protected _getDefaultCamera(): RasterCamera {
        return new RasterCamera(this._scene);
    }
}