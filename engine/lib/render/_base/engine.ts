import Scene from "../../nodes/scene.js";
import Camera from "../../nodes/camera.js";
import Display from "./display.js";
import RasterViewport from "../raster/_base/viewport.js";
import {KEY_CODES} from "../../../constants.js";
import {FPSController} from "../../input/controllers.js";
import {ControllerConstructor, IController} from "../../_interfaces/input.js";
import {
    IRenderEngine,
    IRenderPipelineConstructor,
    IViewport,
    IViewportConstructor,
    IMaterialConstructor
} from "../../_interfaces/render.js";
import {non_zero} from "../../../utils.js";


export default class RenderEngine<Context extends RenderingContext = CanvasRenderingContext2D>
    implements IRenderEngine<Context>
{
    protected readonly _update_callback: FrameRequestCallback;

    readonly canvas: HTMLCanvasElement;
    readonly context: Context;
    protected _scene: Scene<Context>;
    protected _display: Display<Context>;

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
        Viewport: IViewportConstructor<Context>,
        Material: IMaterialConstructor<Context>,
        RenderPipeline: IRenderPipelineConstructor<Context>,
        parent_element: HTMLElement = document.body,
        Controller: ControllerConstructor = FPSController,
    ) {
        this.canvas = document.createElement('canvas');
        parent_element.appendChild(this.canvas);

        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.canvas.style.cssText ='display: block; width: 100vw; height: 100vh;';
        this.context = this._createContext(this.canvas);

        this._scene = new Scene(this.context, Material);
        this._display = new Display(this._scene, RenderPipeline, Viewport, Controller);

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

    get scene(): Scene<Context> {return this._scene}
    set scene(scene: Scene<Context>) {
        scene.context = this.context;
        this._scene = scene;
    }

    get display(): Display<Context> {return this._display}
    set display(display: Display<Context>) {
        display.context = this.context;
        this._display = display;
    }

    update(time: number): void {
        this._delta_time = time - this._last_timestamp;
        this._last_timestamp = time;

        viewport = this._display.active_viewport;
        viewports = this._display.viewports;
        controller = viewport.controller;
        camera = controller.camera;
        if (this._is_active) {
            controller.update(this._delta_time);
            if (!camera.is_static || controller.direction_changed || controller.position_changed) {
                for (viewport of viewports)
                    if (Object.is(controller, viewport.controller))
                        viewport.update();
                controller.direction_changed = controller.position_changed = false;
            }
        } else if (!camera.is_static)
            for (viewport of viewports)
                if (Object.is(controller, viewport.controller))
                    viewport.update();

        // update world-matrices for all dynamic nodes in the scene
        for (const node of this._scene.children)
            node.refreshWorldMatrix();

        this._display.refresh();

        requestAnimationFrame(this._update_callback);
    }

    protected _on_pointerlockchange(pointer_event: PointerEvent): void {
        this._is_active = this.canvas === document.pointerLockElement;
    }

    protected _on_mousemove(mouse_event: MouseEvent): void {
        controller = this._display.active_viewport.controller;
        controller.mouse_moved = true;
        controller.mouse_movement.x += mouse_event.movementX;
        controller.mouse_movement.y += mouse_event.movementY;
    }

    protected _on_wheel(wheel_event: WheelEvent): void {
        controller = this._display.active_viewport.controller;
        controller.mouse_wheel = wheel_event.deltaY;
        controller.mouse_wheel_moved = true;
    }

    protected _on_dblclick(): void {
        this._is_active = !this._is_active;
        this._display.active_viewport.controller.mouse_double_clicked = this._is_active;
        if (this._is_active)
            this.canvas.requestPointerLock();
        else
            document.exitPointerLock();
    }

    protected _on_click(mouse_event: MouseEvent): void {
        this._display.active_viewport.controller.mouse_clicked = true;
        this._display.setViewportAt(mouse_event.clientX, mouse_event.clientY);
    }

    protected _on_mousedown(mouse_event: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        this._display.setPosition(rect.left, rect.top);
        this._display.active_viewport.controller.mouse_down = mouse_event.which;
    }

    protected _on_mouseup(mouse_event: MouseEvent): void {
        this._display.active_viewport.controller.mouse_up = mouse_event.which;
    }

    protected _on_keydown(key_event: KeyboardEvent): void {
        controller = this._display.active_viewport.controller;
        controller.key_pressed = true;

        for (const key of Object.keys(this.keys))
            if (this.keys[key] === key_event.which)
                this.pressed[key_event.which] = 1;

        for (const key of Object.keys(controller.keys))
            if (controller.keys[key] === key_event.which)
                controller.pressed[key_event.which] = 1;
    }

    protected _on_keyup(key_event: KeyboardEvent): void {
        controller = this._display.active_viewport.controller;

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
        viewport = this._display.active_viewport;
        if (viewport instanceof RasterViewport)
            viewport.projection_matrix.update();
        viewport.update();

        this._display.resize(this.canvas.clientWidth, this.canvas.clientHeight);
        requestAnimationFrame(this._update_callback);
    }

    stop() {
        this._stopListening();
        this._is_running = false;
    }

    protected _createContext(canvas: HTMLCanvasElement): Context {
        return canvas.getContext('2d') as Context;
    }
}

let camera: Camera;
let viewport: IViewport;
let viewports: Generator<IViewport>;
let controller: IController;