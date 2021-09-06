import Scene from "../../nodes/scene.js";
import Display from "./display.js";
import { KEY_CODES } from "../../../constants.js";
import { FPSController } from "../../input/controllers.js";
import { non_zero } from "../../../utils.js";
export default class RenderEngine {
    constructor(Viewport, Material, RenderPipeline, parent_element = document.body, Controller = FPSController) {
        this._is_active = false;
        this._is_running = false;
        this._last_timestamp = 0;
        this._delta_time = 0;
        this.pressed = new Uint8Array(256);
        this.keys = {
            esc: KEY_CODES.ESC,
            ctrl: KEY_CODES.CTRL,
            space: KEY_CODES.SPACE
        };
        this._events = [
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
        this.canvas = document.createElement('canvas');
        parent_element.appendChild(this.canvas);
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.canvas.style.cssText = 'display: block; width: 100vw; height: 100vh;';
        this.context = this._createContext(this.canvas);
        this._scene = new Scene(this.context, Material);
        this._display = new Display(this._scene, RenderPipeline, Viewport, Controller);
        if (document.ontouchmove)
            this._events.concat('touchmove', 'touchstart', 'touchend');
        this._update_callback = this.update.bind(this);
    }
    get is_active() { return this._is_active; }
    get is_running() { return this._is_running; }
    get scene() { return this._scene; }
    set scene(scene) {
        scene.context = this.context;
        this._scene = scene;
    }
    get display() { return this._display; }
    set display(display) {
        display.context = this.context;
        this._display = display;
    }
    update(time) {
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
        }
        else if (!camera.is_static)
            for (viewport of viewports)
                if (Object.is(controller, viewport.controller))
                    viewport.update();
        // update world-matrices for all dynamic nodes in the scene
        for (const node of this._scene.children)
            node.refreshWorldMatrix();
        this._display.refresh();
        requestAnimationFrame(this._update_callback);
    }
    _on_pointerlockchange(pointer_event) {
        this._is_active = this.canvas === document.pointerLockElement;
    }
    _on_mousemove(mouse_event) {
        controller = this._display.active_viewport.controller;
        controller.mouse_moved = true;
        controller.mouse_movement.x += mouse_event.movementX;
        controller.mouse_movement.y += mouse_event.movementY;
    }
    _on_wheel(wheel_event) {
        controller = this._display.active_viewport.controller;
        controller.mouse_wheel = wheel_event.deltaY;
        controller.mouse_wheel_moved = true;
    }
    _on_dblclick() {
        this._is_active = !this._is_active;
        this._display.active_viewport.controller.mouse_double_clicked = this._is_active;
        if (this._is_active)
            this.canvas.requestPointerLock();
        else
            document.exitPointerLock();
    }
    _on_click(mouse_event) {
        this._display.active_viewport.controller.mouse_clicked = true;
        this._display.setViewportAt(mouse_event.clientX, mouse_event.clientY);
    }
    _on_mousedown(mouse_event) {
        const rect = this.canvas.getBoundingClientRect();
        this._display.setPosition(rect.left, rect.top);
        this._display.active_viewport.controller.mouse_down = mouse_event.which;
    }
    _on_mouseup(mouse_event) {
        this._display.active_viewport.controller.mouse_up = mouse_event.which;
    }
    _on_keydown(key_event) {
        controller = this._display.active_viewport.controller;
        controller.key_pressed = true;
        for (const key of Object.keys(this.keys))
            if (this.keys[key] === key_event.which)
                this.pressed[key_event.which] = 1;
        for (const key of Object.keys(controller.keys))
            if (controller.keys[key] === key_event.which)
                controller.pressed[key_event.which] = 1;
    }
    _on_keyup(key_event) {
        controller = this._display.active_viewport.controller;
        controller.keyUp(key_event.which);
        for (const key of Object.keys(this.keys))
            if (this.keys[key] === key_event.which)
                this.pressed[key_event.which] = 0;
        for (const key of Object.keys(controller.keys))
            if (controller.keys[key] === key_event.which)
                controller.pressed[key_event.which] = 0;
        if (!controller.pressed.some(non_zero))
            controller.key_pressed = false;
    }
    handleEvent(event) {
        const handler = `_on_${event.type}`;
        if (typeof this[handler] === 'function') {
            if (event.type !== 'wheel')
                event.preventDefault();
            return this[handler](event);
        }
    }
    _startListening() {
        for (const event of this._events)
            document.addEventListener(event, this, false);
    }
    _stopListening() {
        for (const event of this._events)
            document.removeEventListener(event, this, false);
    }
    start() {
        this._startListening();
        this._is_running = true;
        this._display.resize(this.canvas.clientWidth, this.canvas.clientHeight);
        requestAnimationFrame(this._update_callback);
    }
    stop() {
        this._stopListening();
        this._is_running = false;
    }
    _createContext(canvas) {
        return canvas.getContext('2d');
    }
}
let camera;
let viewport;
let viewports;
let controller;
//# sourceMappingURL=engine.js.map