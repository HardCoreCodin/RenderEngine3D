import Camera from "./camera.js";
import Screen from "./screen.js";
import Scene from "../scene_graph/scene.js";
import {FPSController} from "../input/controllers.js";
import {IController} from "../_interfaces/input.js";
import {IRenderEngine, IScreen} from "../_interfaces/render.js";

export abstract class BaseRenderEngine<ScreenType extends IScreen> implements IRenderEngine<ScreenType> {
    protected abstract _createDefaultScreen(canvas: HTMLCanvasElement, camera: Camera): ScreenType;
    protected abstract _createDefaultController(canvas: HTMLCanvasElement, camera: Camera): IController;

    readonly screen: ScreenType;
    protected _controller: IController;

    protected _frame_time = 1000 / 60;
    protected _last_timestamp = 0;
    protected _delta_time = 0;

    protected constructor(
        canvas: HTMLCanvasElement,
        readonly scene: Scene = new Scene(),
        camera: Camera = scene.camera_count ? scene.cameras[0] : scene.addCamera(),
        controller?: IController,
        screen?: ScreenType
    ) {
        this.screen = screen || this._createDefaultScreen(canvas, camera);
        this._controller = controller || this._createDefaultController(canvas, camera);
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

export abstract class RenderEngineFPS<ScreenType extends IScreen> extends BaseRenderEngine<ScreenType> {
    protected _createDefaultController(canvas: HTMLCanvasElement, camera: Camera): FPSController {
        return new FPSController(canvas, camera);
    }
}

export default class RenderEngine extends RenderEngineFPS<Screen> {
    protected _createDefaultScreen(canvas: HTMLCanvasElement, camera: Camera): Screen {
        return new Screen(camera, this._controller, canvas);
    }
}

