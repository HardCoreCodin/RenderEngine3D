import Camera from "./camera.js";
import Screen from "./screen.js";
import Scene from "../scene_graph/scene.js";
import {FPSController} from "../input/controllers.js";
import {IScene} from "../_interfaces/nodes.js";
import {IController} from "../_interfaces/input.js";
import {ICamera, IRenderEngine, IRenderPipeline, IScreen, IViewport} from "../_interfaces/render.js";
import Viewport from "./viewport.js";
import RenderPipeline from "./pipelines.js";

export abstract class BaseRenderEngine<
    Context extends RenderingContext,
    RenderPipelineType extends IRenderPipeline<Context>,
    ViewportType extends IViewport<Context, RenderPipelineType>,
    ScreenType extends IScreen<Context, RenderPipelineType, ViewportType>,
    SceneType extends IScene>
    implements IRenderEngine<Context, RenderPipelineType, ViewportType, ScreenType, SceneType>
{
    protected abstract _createDefaultScene(): SceneType;
    protected abstract _createDefaultScreen(canvas: HTMLCanvasElement, camera: ICamera): ScreenType;
    protected abstract _createDefaultController(canvas: HTMLCanvasElement, camera: ICamera): IController;

    readonly scene: SceneType;
    readonly screen: ScreenType;

    protected _controller: IController;
    protected _frame_time = 1000 / 60;
    protected _last_timestamp = 0;
    protected _delta_time = 0;

    protected constructor(
        canvas: HTMLCanvasElement,
        scene?: SceneType,
        camera?: ICamera,
        controller?: IController,
        screen?: ScreenType
    ) {
        camera = camera || this._getDefaultCamera();
        this.scene = scene || this._createDefaultScene();
        this.screen = screen || this._createDefaultScreen(canvas, camera);
        this._controller = controller || this._createDefaultController(canvas, camera);
    }

    protected _getDefaultCamera(): ICamera {
        return this.scene.cameras.size ? this.scene.cameras[0] : this.scene.addCamera();
    }

    get controller(): IController {
        return this._controller;
    }

    set controller(controller: IController) {
        this._controller = this.screen.controller = controller;
        controller.camera = this.screen.active_viewport.camera;
    }

    update(time: number): void {
        this._delta_time = (time - this._last_timestamp) / this._frame_time;
        this._last_timestamp = time;
        this._controller.update(this._delta_time);

        this.screen.active_viewport.camera_has_moved_or_rotated = this._controller.direction_changed || this._controller.position_changed;
        this._controller.direction_changed = this._controller.position_changed = false;

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

export abstract class RenderEngineFPS<
    Context extends RenderingContext,
    RenderPipelineType extends IRenderPipeline<Context>,
    ViewportType extends IViewport<Context, RenderPipelineType>,
    ScreenType extends IScreen<Context, RenderPipelineType, ViewportType>,
    SceneType extends IScene>
    extends BaseRenderEngine<Context, RenderPipelineType, ViewportType, ScreenType, SceneType>
{
    protected _createDefaultController(canvas: HTMLCanvasElement, camera: ICamera): FPSController {
        return new FPSController(canvas, camera);
    }
}

export default class RenderEngine
    extends RenderEngineFPS<CanvasRenderingContext2D, RenderPipeline, Viewport, Screen, Scene>
{
    protected _createDefaultScreen(canvas: HTMLCanvasElement, camera: Camera): Screen {
        return new Screen(camera, this._controller, canvas);
    }

    protected _createDefaultScene(): Scene {
        return new Scene();
    }
}

