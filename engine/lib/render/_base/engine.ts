import RasterCamera from "../raster/software/nodes/camera.js";
import {KEY_CODES} from "../../../constants.js";
import {IScene} from "../../_interfaces/nodes.js";
import {IController} from "../../_interfaces/input.js";
import {ICamera, IRenderEngine, IScreen, IViewport} from "../../_interfaces/render.js";
import {non_zero} from "../../../utils.js";


export default abstract class BaseRenderEngine<
    Context extends RenderingContext,
    SceneType extends IScene<Context>,
    ScreenType extends IScreen<Context>,
    CameraType extends ICamera = ICamera>
    implements IRenderEngine<Context, SceneType, ScreenType>
{
    protected abstract _createDefaultScreen(camera: CameraType): ScreenType;
    protected abstract _createContext(canvas: HTMLCanvasElement): Context;
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
        this.screen = screen || this._createDefaultScreen(camera || this._getDefaultCamera());
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

        viewport = this._screen.active_viewport;
        camera = viewport.camera;
        if (this._is_active) {
            controller = viewport.controller;
            controller.update(this._delta_time);
            if (!camera.is_static || controller.direction_changed || controller.position_changed) {
                viewport.updateMatrices();
                controller.direction_changed = controller.position_changed = false;
            }
        } else if (!camera.is_static)
            viewport.updateMatrices();

        // update world-matrices for all dynamic nodes in the scene
        for (const node of this._scene.children)
            node.refreshWorldMatrix();

        this._screen.refresh();

        requestAnimationFrame(this._update_callback);
    }

    protected _on_pointerlockchange(pointer_event: PointerEvent): void {
        this._is_active = this.canvas === document.pointerLockElement;
    }

    protected _on_mousemove(mouse_event: MouseEvent): void {
        controller = this._screen.active_viewport.controller;
        controller.mouse_moved = true;
        controller.mouse_movement.x += mouse_event.movementX;
        controller.mouse_movement.y += mouse_event.movementY;
    }

    protected _on_wheel(wheel_event: WheelEvent): void {
        controller = this._screen.active_viewport.controller;
        controller.mouse_wheel = wheel_event.deltaY;
        controller.mouse_wheel_moved = true;
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
        this._screen.setViewportAt(mouse_event.clientX, mouse_event.clientY);
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
        controller = this._screen.active_viewport.controller;
        controller.key_pressed = true;

        for (const key of Object.keys(this.keys))
            if (this.keys[key] === key_event.which)
                this.pressed[key_event.which] = 1;

        for (const key of Object.keys(controller.keys))
            if (controller.keys[key] === key_event.which)
                controller.pressed[key_event.which] = 1;
    }

    protected _on_keyup(key_event: KeyboardEvent): void {
        controller = this._screen.active_viewport.controller;

        for (const key of Object.keys(this.keys))
            if (this.keys[key] === key_event.which)
                this.pressed[key_event.which] = 0;

        for (const key of Object.keys(controller.keys))
            if (controller.keys[key] === key_event.which)
                controller.pressed[key_event.which] = 0;

        if (!controller.pressed.some(non_zero))
            controller.key_pressed = false;
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
        viewport = this._screen.active_viewport;
        camera = viewport.camera;
        if (camera instanceof RasterCamera)
            camera.projection_matrix.update();
        viewport.updateMatrices();

        this._screen.resize(this.canvas.clientWidth, this.canvas.clientHeight);
        requestAnimationFrame(this._update_callback);
    }

    stop() {
        this._stopListening();
        this._is_running = false;
    }
}

let camera: ICamera;
let viewport: IViewport;
let controller: IController;