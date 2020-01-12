import Camera from "./camera.js";
import Screen from "./screen.js";
import Scene from "../scene_graph/scene.js";
import Viewport from "./viewport.js";
import RenderPipeline from "./pipelines.js";
import {FPSController} from "../input/controllers.js";
import {IScene} from "../_interfaces/nodes.js";
import {IController} from "../_interfaces/input.js";
import {ICamera, IRenderEngine, IRenderPipeline, IScreen, IViewport} from "../_interfaces/render.js";

export abstract class BaseRenderEngine<
    Context extends RenderingContext,
    SceneType extends IScene<Context>,
    CameraType extends ICamera,
    RenderPipelineType extends IRenderPipeline<Context>,
    ViewportType extends IViewport<Context, SceneType, CameraType, RenderPipelineType>,
    ScreenType extends IScreen<Context, SceneType, CameraType, RenderPipelineType, ViewportType>>
    implements IRenderEngine<Context, SceneType, CameraType, RenderPipelineType, ViewportType, ScreenType>
{
    protected abstract _createContext(canvas: HTMLCanvasElement): Context;
    protected abstract _createDefaultScreen(canvas: HTMLCanvasElement, camera: CameraType): ScreenType;
    protected abstract _createDefaultController(canvas: HTMLCanvasElement, viewport: ViewportType): IController;
    protected abstract _createDefaultScene(): SceneType;
    protected abstract _getDefaultCamera(): CameraType;

    readonly context: Context;
    protected _scene: SceneType;
    protected _screen: ScreenType;

    protected _controller: IController;
    // protected _frame_time = 1000 / 60;
    protected _last_timestamp = 0;
    protected _delta_time = 0;

    constructor(
        readonly canvas: HTMLCanvasElement,
        scene?: SceneType,
        camera?: CameraType,
        controller?: IController,
        screen?: ScreenType
    ) {
        this.context = this._createContext(canvas);
        this.scene = scene || this._createDefaultScene();
        this.screen = screen || this._createDefaultScreen(canvas, camera || this._getDefaultCamera());
        this.controller = controller || this._createDefaultController(canvas, this.screen.active_viewport);
    }

    get scene(): SceneType {return this._scene}
    set scene(scene: SceneType) {
        scene.context = this.context;
        this._scene = scene;
    }

    get screen(): ScreenType {return this._screen}
    set screen(screen: ScreenType) {
        screen.context = this.context;
        this._screen = screen;
    }

    get controller(): IController {return this._controller}
    set controller(controller: IController) {
        controller.canvas = this.canvas;
        controller.viewport = this.screen.active_viewport;
        this._controller = this.screen.controller = controller;
    }

    update(time: number): void {
        // this._delta_time = (time - this._last_timestamp) / this._frame_time;
        this._delta_time = this._last_timestamp ? (time - this._last_timestamp) : 0;
        this._last_timestamp = time;
        this._controller.update(this._delta_time);

        // update world-matrices for all dynamic nodes in the scene
        for (const node of this.scene.children)
            node.refreshWorldMatrix();

        this.screen.refresh();

        requestAnimationFrame(this.update.bind(this));
    };

    start() {
        requestAnimationFrame(this.update.bind(this));
    }
}

export default class RenderEngine
    extends BaseRenderEngine<CanvasRenderingContext2D, Scene, Camera, RenderPipeline, Viewport, Screen>
{
    protected _createContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
        return canvas.getContext('2d');
    }

    protected _createDefaultScreen(canvas: HTMLCanvasElement, camera: Camera): Screen {
        return new Screen(camera, this.scene, this.context, this._controller, canvas);
    }

    protected _createDefaultController(canvas: HTMLCanvasElement, viewport: IViewport): FPSController {
        return new FPSController(viewport, canvas);
    }

    protected _createDefaultScene(): Scene {
        return new Scene(this.context);
    }

    protected _getDefaultCamera(): Camera {
        return this.scene.cameras.size ? this.scene.cameras[0] : this.scene.addCamera(Camera);
    }
}