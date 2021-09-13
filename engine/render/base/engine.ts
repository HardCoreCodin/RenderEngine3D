import Scene from "../../nodes/scene.js";
import Display from "./display.js";
import InputController, {InputControllerConstructor} from "../../input/controllers.js";
import {
    IRenderEngine,
    IRenderPipelineConstructor,
    IViewportConstructor,
    IMaterialConstructor
} from "../../core/interfaces/render.js";
import UILayer from "../../input/ui.js";
import Mouse from "../../input/mouse.js";

export type UpdateCallback = (
    delta_time: number,
    elapsed_time: number
) => void;

export default class RenderEngine<Context extends RenderingContext = CanvasRenderingContext2D>
    implements IRenderEngine<Context>
{
    public readonly mouse = new Mouse();
    public readonly ui: UILayer;
    public readonly update_callbacks = new Set<UpdateCallback>();
    protected readonly _frame_request_callback: FrameRequestCallback;

    readonly canvas: HTMLCanvasElement;
    readonly context: Context;
    protected _scene: Scene<Context>;
    protected _display: Display<Context>;

    protected _is_running: boolean = false;

    protected _last_timestamp = 0;
    protected _delta_time = 0;

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
        Controller: InputControllerConstructor = InputController,
    ) {
        this.ui = new UILayer(parent_element);
        this.canvas = document.createElement('canvas');
        parent_element.appendChild(this.canvas);

        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.canvas.style.cssText ='display: block; width: 100vw; height: 100vh;';
        this.context = this._createContext(this.canvas);

        this._scene = new Scene(this.context, Material);
        this._display = new Display(this._scene.addCamera(), this.mouse, this._scene, RenderPipeline, Viewport, Controller, this.context);

        if (document.ontouchmove)
            this._events.concat(
                'touchmove',
                'touchstart',
                'touchend'
            );
        this._frame_request_callback = this.update.bind(this)
    }

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
        this._delta_time = (time - this._last_timestamp) * 0.001;
        this._last_timestamp = time;

        this._display.active_viewport.controller.update(this._display.active_viewport.camera, this._delta_time);

        for (const viewport of this._display.viewports) viewport.update();
        for (const update_callback of this.update_callbacks) update_callback(this._delta_time, time);
        for (const node of this._scene.children) node.refreshWorldMatrix();

        this._display.active_viewport.controller.reset(this._display.active_viewport.camera);

        this._display.refresh();

        requestAnimationFrame(this._frame_request_callback);
    }

    protected _on_pointerlockchange(pointer_event: PointerEvent): void {
        this.mouse.is_captured = this.canvas === document.pointerLockElement;
    }

    protected _on_mousemove(mouse_event: MouseEvent): void {
        this.mouse.setRawMovement(mouse_event.movementX, mouse_event.movementY);
    }

    protected _on_wheel(wheel_event: WheelEvent): void {
        this.mouse.wheel.scroll(wheel_event.deltaY);
    }

    protected _on_dblclick(wheel_event: WheelEvent): void {
        if (wheel_event.button) {
            if (wheel_event.button === 1)
                this.mouse.middle_button.doubleClick(wheel_event.clientX, wheel_event.clientY);
            else
                this.mouse.right_button.doubleClick(wheel_event.clientX, wheel_event.clientY);
        } else {
            this.mouse.left_button.doubleClick(wheel_event.clientX, wheel_event.clientY);
            if (this.mouse.is_captured)
                this.canvas.requestPointerLock();
            else
                document.exitPointerLock();
        }
    }

    protected _on_click(mouse_event: MouseEvent): void {
        switch (mouse_event.button) {
            case 0: return this.mouse.left_button.click(mouse_event.clientX, mouse_event.clientY);
            case 1: return this.mouse.middle_button.click(mouse_event.clientX, mouse_event.clientY);
            case 2: return this.mouse.right_button.click(mouse_event.clientX, mouse_event.clientY);
        }
        this._display.setViewportAt(mouse_event.clientX, mouse_event.clientY);
    }

    protected _on_mousedown(mouse_event: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        this._display.setPosition(rect.left, rect.top);
        switch (mouse_event.button) {
            case 0: return this.mouse.left_button.down(mouse_event.clientX, mouse_event.clientY);
            case 1: return this.mouse.middle_button.down(mouse_event.clientX, mouse_event.clientY);
            case 2: return this.mouse.right_button.down(mouse_event.clientX, mouse_event.clientY);
        }
    }

    protected _on_mouseup(mouse_event: MouseEvent): void {
        switch (mouse_event.button) {
            case 0: return this.mouse.left_button.up(mouse_event.clientX, mouse_event.clientY);
            case 1: return this.mouse.middle_button.up(mouse_event.clientX, mouse_event.clientY);
            case 2: return this.mouse.right_button.up(mouse_event.clientX, mouse_event.clientY);
        }
    }

    protected _on_keydown(key_event: KeyboardEvent): void {
        this._display.active_viewport.controller.onKeyChanged(key_event.which, true);
    }

    protected _on_keyup(key_event: KeyboardEvent): void {
        this._display.active_viewport.controller.onKeyChanged(key_event.which, false);
    }

    handleEvent(event: Event): void {
        const handler = `_on_${event.type}`;
        if (typeof this[handler] === 'function')
            return this[handler](event);
    }

    protected _startListening() {
        for (const event of this._events)
            document.addEventListener(event, this, { passive: true });
    }

    protected _stopListening() {
        for (const event of this._events)
            document.removeEventListener(event, this, false);
    }

    start() {
        this._startListening();
        this._is_running = true;
        this._display.resize(this.canvas.clientWidth, this.canvas.clientHeight);
        requestAnimationFrame(this._frame_request_callback);
    }

    stop() {
        this._stopListening();
        this._is_running = false;
    }

    protected _createContext(canvas: HTMLCanvasElement): Context {
        return canvas.getContext('2d') as Context;
    }
}