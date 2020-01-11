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
    readonly scene: SceneType;
    readonly screen: ScreenType;

    protected _controller: IController;
    protected _frame_time = 1000 / 60;
    protected _last_timestamp = 0;
    protected _delta_time = 0;

    protected constructor(
        canvas: HTMLCanvasElement,
        scene?: SceneType,
        camera?: CameraType,
        controller?: IController,
        screen?: ScreenType
    ) {
        this.context = this._createContext(canvas);

        if (scene) {
            scene.context = this.context;
            this.scene = scene;
        } else
            this.scene = this._createDefaultScene();

        if (screen) {
            screen.context = this.context;
            this.screen = screen;
        } else {
            if (!camera)
                camera = this._getDefaultCamera();

            this.screen = this._createDefaultScreen(canvas, camera);
        }

        if (controller) {
            controller.canvas = canvas;
            controller.viewport = this.screen.active_viewport;
            this._controller = controller;
        } else
            this._controller = this._createDefaultController(canvas, this.screen.active_viewport);
    }

    get controller(): IController {
        return this._controller;
    }

    set controller(controller: IController) {
        this._controller = this.screen.controller = controller;
        controller.viewport = this.screen.active_viewport;
    }

    update(time: number): void {
        this._delta_time = (time - this._last_timestamp) / this._frame_time;
        this._last_timestamp = time;
        this._controller.update(this._delta_time);

        // update world-matrices for all dynamic nodes in the scene
        for (const node of this.scene.children)
            node.refreshWorldMatrix();

        this.screen.refresh();

        requestAnimationFrame(this.update);
    };

    start() {
        requestAnimationFrame(this.update);
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