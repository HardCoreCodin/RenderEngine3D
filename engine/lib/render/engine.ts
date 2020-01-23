import Camera from "./camera.js";
import {RasterScreen, RayTraceScreen} from "./screen.js";
import {RasterViewport, RayTraceViewport} from "./viewport.js";
import {Rasterizer} from "./pipelines.js";
import {KEY_CODES} from "../../constants.js";
import {IScene} from "../_interfaces/nodes.js";
import {IController} from "../_interfaces/input.js";
import {ICamera, IRenderEngine, IRenderPipeline, IScreen, IViewport} from "../_interfaces/render.js";
import {non_zero} from "../../utils.js";
import {RasterScene, RayTraceScene} from "../scene_graph/scene.js";
import {RayTracer} from "./raytracer.js";

export abstract class BaseRenderEngine<
    Context extends RenderingContext,
    CameraType extends ICamera,
    SceneType extends IScene<Context, CameraType>,
    RenderPipelineType extends IRenderPipeline<Context, CameraType>,
    ViewportType extends IViewport<Context, CameraType, SceneType, RenderPipelineType>,
    ScreenType extends IScreen<Context, CameraType, SceneType, RenderPipelineType, ViewportType>>
    implements IRenderEngine<Context, CameraType, SceneType, RenderPipelineType, ViewportType, ScreenType>
{
    protected abstract _createContext(canvas: HTMLCanvasElement): Context;
    protected abstract _createDefaultScreen(canvas: HTMLCanvasElement, camera: CameraType): ScreenType;
    protected abstract _createDefaultScene(): SceneType;
    protected abstract _getDefaultCamera(): CameraType;

    protected readonly _update_callback: FrameRequestCallback;

    readonly canvas: HTMLCanvasElement;
    readonly context: Context;
    protected _scene: SceneType;
    protected _screen: ScreenType;

    protected _is_active: boolean = false;
    protected _is_running: boolean = false;

    protected _last_timestamp = 0;
    protected _delta_time = 0;

    readonly pressed = new Uint8Array(256);
    readonly keys = {
        esc: KEY_CODES.ESC,
        ctrl: KEY_CODES.CTRL,
        space: KEY_CODES.SPACE
    };

    protected readonly _events = [
        'keyup',
        'keydown',
        'mouseup',
        'mousedown',
        'mousemove',
        'wheel',
        'click',
        'dblclick',
        'pointerlockchange'
    ];

    constructor(
        parent_element: HTMLElement = document.body,
        scene?: SceneType,
        camera?: CameraType,
        controller?: IController,
        screen?: ScreenType
    ) {
        this.canvas = document.createElement('canvas');
        parent_element.appendChild(this.canvas);

        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.canvas.style.cssText ='display: block; width: 100vw; height: 100vh;';
        this.context = this._createContext(this.canvas);
        this.scene = scene || this._createDefaultScene();
        this.screen = screen || this._createDefaultScreen(this.canvas, camera || this._getDefaultCamera());
        if (document.ontouchmove)
            this._events.concat(
                'touchmove',
                'touchstart',
                'touchend'
            );
        this._update_callback = this.update.bind(this)
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

    update(time: number): void {
        this._delta_time = time - this._last_timestamp;
        this._last_timestamp = time;

        if (this._is_active)
            this._screen.active_viewport.controller.update(this._delta_time);
        else if (!this.screen.active_viewport.camera.is_static)
            this.screen.active_viewport.updateMatrices();

        // update world-matrices for all dynamic nodes in the scene
        for (const node of this.scene.children)
            node.refreshWorldMatrix();

        this._screen.refresh();

        requestAnimationFrame(this._update_callback);
    }

    protected _on_pointerlockchange(pointer_event: PointerEvent): void {
        this._is_active = this.canvas === document.pointerLockElement;
    }

    protected _on_mousemove(mouse_event: MouseEvent): void {
        this._screen.active_viewport.controller.mouse_moved = true;
        this._screen.active_viewport.controller.mouse_movement.x += mouse_event.movementX;
        this._screen.active_viewport.controller.mouse_movement.y += mouse_event.movementY;
    }

    protected _on_wheel(wheel_event: WheelEvent): void {
        this._screen.active_viewport.controller.mouse_wheel = wheel_event.deltaY;
        this._screen.active_viewport.controller.mouse_wheel_moved = true;
    }

    protected _on_dblclick(): void {
        this._is_active = !this._is_active;
        this._screen.active_viewport.controller.mouse_double_clicked = this._is_active;
        if (this._is_active)
            this.canvas.requestPointerLock();
        else
            document.exitPointerLock();
    }

    protected _on_click(mouse_event: MouseEvent): void {
        this._screen.active_viewport.controller.mouse_clicked = true;
        this.screen.setViewportAt(mouse_event.clientX, mouse_event.clientY);
    }

    protected _on_mousedown(mouse_event: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        this._screen.setPosition(rect.left, rect.top);
        this._screen.active_viewport.controller.mouse_down = mouse_event.which;
    }

    protected _on_mouseup(mouse_event: MouseEvent): void {
        this._screen.active_viewport.controller.mouse_up = mouse_event.which;
    }

    protected _on_keydown(key_event: KeyboardEvent): void {
        this._screen.active_viewport.controller.key_pressed = true;

        for (const key of Object.keys(this.keys))
            if (this.keys[key] === key_event.which)
                this.pressed[key_event.which] = 1;

        for (const key of Object.keys(this._screen.active_viewport.controller.keys))
            if (this._screen.active_viewport.controller.keys[key] === key_event.which)
                this._screen.active_viewport.controller.pressed[key_event.which] = 1;
    }

    protected _on_keyup(key_event: KeyboardEvent): void {
        for (const key of Object.keys(this.keys))
            if (this.keys[key] === key_event.which)
                this.pressed[key_event.which] = 0;

        for (const key of Object.keys(this._screen.active_viewport.controller.keys))
            if (this._screen.active_viewport.controller.keys[key] === key_event.which)
                this._screen.active_viewport.controller.pressed[key_event.which] = 0;

        if (!this._screen.active_viewport.controller.pressed.some(non_zero))
            this._screen.active_viewport.controller.key_pressed = false;
    }

    handleEvent(event: Event): void {
        const handler = `_on_${event.type}`;
        if (typeof this[handler] === 'function') {
            if (event.type !== 'wheel')
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
        this.screen.active_viewport.camera.projection_matrix.update();
        this.screen.active_viewport.updateMatrices();

        this._screen.resize(this.canvas.clientWidth, this.canvas.clientHeight);
        requestAnimationFrame(this._update_callback);
    }

    stop() {
        this._stopListening();
        this._is_running = false;
    }
}

export class RasterEngine
    extends BaseRenderEngine<CanvasRenderingContext2D, Camera, RasterScene, Rasterizer, RasterViewport, RasterScreen>
{
    protected _createContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
        return canvas.getContext('2d');
    }

    protected _createDefaultScreen(canvas: HTMLCanvasElement, camera: Camera): RasterScreen {
        return new RasterScreen(camera, this.scene, this.context, canvas);
    }

    protected _createDefaultScene(): RasterScene {
        return new RasterScene(this.context);
    }

    protected _getDefaultCamera(): Camera {
        return this.scene.cameras.size ? [...this.scene.cameras][0] : this.scene.addCamera(Camera);
    }
}


export class RayTraceEngine
    extends BaseRenderEngine<CanvasRenderingContext2D, Camera, RayTraceScene, RayTracer, RayTraceViewport, RayTraceScreen>
{
    protected _createContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
        return canvas.getContext('2d');
    }

    protected _createDefaultScreen(canvas: HTMLCanvasElement, camera: Camera): RayTraceScreen {
        return new RayTraceScreen(camera, this.scene, this.context, canvas);
    }

    protected _createDefaultScene(): RayTraceScene {
        return new RayTraceScene(this.context);
    }

    protected _getDefaultCamera(): Camera {
        return this.scene.cameras.size ? [...this.scene.cameras][0] : this.scene.addCamera(Camera);
    }
}