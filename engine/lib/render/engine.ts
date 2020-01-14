import Camera from "./camera.js";
import Screen from "./screen.js";
import Scene from "../scene_graph/scene.js";
import Viewport from "./viewport.js";
import RenderPipeline from "./pipelines.js";
import {FPSController} from "../input/controllers.js";
import {KEY_CODES} from "../../constants.js";
import {IScene} from "../_interfaces/nodes.js";
import {IController} from "../_interfaces/input.js";
import {ICamera, IRenderEngine, IRenderPipeline, IScreen, IViewport} from "../_interfaces/render.js";

export abstract class BaseRenderEngine<
    Context extends RenderingContext,
    SceneType extends IScene<Context>,
    CameraType extends ICamera,
    RenderPipelineType extends IRenderPipeline<Context, SceneType>,
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

    protected _is_active: boolean = false;
    protected _is_running: boolean = false;

    protected _controller: IController;
    protected _last_timestamp = 0;
    protected _delta_time = 0;

    readonly key_pressed = {
        esc: 0,
        ctrl: 0,
        space: 0
    };

    readonly key_bindings = {
        esc: KEY_CODES.ESC,
        ctrl: KEY_CODES.CTRL,
        space: KEY_CODES.SPACE
    };

    protected readonly _events = [
        'keyup',
        'keydown',
        'mousemove',
        'click',
        'pointerlockchange'
    ];

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

        if (document.ontouchmove)
            this._events.concat(
                'touchmove',
                'touchstart',
                'touchend'
            );
    }

    get is_active(): boolean {return this._is_active}
    get is_running(): boolean {return this._is_running}

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
        this._delta_time = time - this._last_timestamp;
        this._last_timestamp = time;

        if (this._is_active)
            this._controller.update(this._delta_time);
        else if (!this.screen.active_viewport.camera.is_static)
            this.screen.active_viewport.updateMatrices();

        // update world-matrices for all dynamic nodes in the scene
        for (const node of this.scene.children)
            node.refreshWorldMatrix();

        this.screen.refresh();

        requestAnimationFrame(this.update.bind(this));
    }

    protected _on_pointerlockchange(pointer_event: PointerEvent): void {
        this._is_active = document.documentElement === document.pointerLockElement;
    }

    protected _on_mousemove(mouse_event: MouseEvent): void {
        this._controller.mouse_movement.x += mouse_event.movementX;
        this._controller.mouse_movement.y += mouse_event.movementY;
        this._controller.mouse_moved = true;
    }

    protected _on_click() {
        if (!this._is_active) {
            this._is_active = true;
            this._controller.mouse_movement.x = 0;
            this._controller.mouse_movement.y = 0;
            document.documentElement.requestPointerLock();
        }
    }

    protected _on_keydown(key_event: KeyboardEvent): void {
        for (const key of Object.keys(this.key_bindings))
            if (this.key_bindings[key] === key_event.which)
                this.key_pressed[key] = 1;

        for (const key of Object.keys(this._controller.key_bindings))
            if (this._controller.key_bindings[key] === key_event.which)
                this._controller.key_pressed[key] = 1;
    }

    protected _on_keyup(key_event: KeyboardEvent): void {
        for (const key of Object.keys(this.key_bindings))
            if (this.key_bindings[key] === key_event.which)
                this.key_pressed[key] = 0;

        for (const key of Object.keys(this._controller.key_bindings))
            if (this._controller.key_bindings[key] === key_event.which)
                this._controller.key_pressed[key] = 0;
    }

    handleEvent(event: Event): void {
        const handler = `_on_${event.type}`;
        if (typeof this[handler] === 'function') {
            event.preventDefault();
            return this[handler](event);
        }
    }

    protected _startListening() {
        for (const event of this._events)
            document.addEventListener(event, this, false);
    }

    protected _stopListening() {
        for (const event of this._events)
            document.removeEventListener(event, this, false);
    }

    start() {
        this._startListening();
        this._is_running = true;

        // Engine starts "inactive" to input until user clicks on the canvas.
        // Matrices are updated by the controller (which is inactive initially).
        // Initialize matrices manually here once, to set their initial state:
        this.screen.active_viewport.camera.updateProjectionMatrix();
        this.screen.active_viewport.updateMatrices();
        requestAnimationFrame(this.update.bind(this));
    }

    stop() {
        this._stopListening();
        this._is_running = false;
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