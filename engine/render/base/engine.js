import Scene from "../../nodes/scene.js";
import Display from "./display.js";
import InputController from "../../input/controllers.js";
import UILayer from "../../input/ui.js";
import Mouse from "../../input/mouse.js";
export default class RenderEngine {
    constructor(Viewport, Material, RenderPipeline, parent_element = document.body, Controller = InputController) {
        this.mouse = new Mouse();
        this.update_callbacks = new Set();
        this._is_running = false;
        this._last_timestamp = 0;
        this._delta_time = 0;
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
        this.ui = new UILayer(parent_element);
        this.canvas = document.createElement('canvas');
        parent_element.appendChild(this.canvas);
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.canvas.style.cssText = 'display: block; width: 100vw; height: 100vh;';
        this.context = this._createContext(this.canvas);
        this._scene = new Scene(this.context, Material);
        this._display = new Display(this._scene.addCamera(), this.mouse, this._scene, RenderPipeline, Viewport, Controller, this.context);
        if (document.ontouchmove)
            this._events.concat('touchmove', 'touchstart', 'touchend');
        this._frame_request_callback = this.update.bind(this);
    }
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
        this._delta_time = (time - this._last_timestamp) * 0.001;
        this._last_timestamp = time;
        this._display.active_viewport.controller.update(this._display.active_viewport.camera, this._delta_time);
        if (this.mouse.is_captured)
            this.canvas.requestPointerLock();
        else
            document.exitPointerLock();
        for (const viewport of this._display.viewports)
            viewport.update();
        for (const update_callback of this.update_callbacks)
            update_callback(this._delta_time, time);
        for (const node of this._scene.children)
            node.refreshWorldMatrix();
        this._display.active_viewport.controller.reset(this._display.active_viewport.camera);
        this._display.refresh();
        this.ui.update();
        requestAnimationFrame(this._frame_request_callback);
    }
    _on_pointerlockchange(pointer_event) {
        this.mouse.is_captured = this.canvas === document.pointerLockElement;
    }
    _on_mousemove(mouse_event) {
        this.mouse.setRawMovement(mouse_event.movementX, mouse_event.movementY);
    }
    _on_wheel(wheel_event) {
        this.mouse.wheel.scroll(wheel_event.deltaY);
    }
    _on_dblclick(wheel_event) {
        if (wheel_event.button) {
            if (wheel_event.button === 1)
                this.mouse.middle_button.doubleClick(wheel_event.clientX, wheel_event.clientY);
            else
                this.mouse.right_button.doubleClick(wheel_event.clientX, wheel_event.clientY);
        }
        else
            this.mouse.left_button.doubleClick(wheel_event.clientX, wheel_event.clientY);
    }
    _on_click(mouse_event) {
        switch (mouse_event.button) {
            case 0: return this.mouse.left_button.click(mouse_event.clientX, mouse_event.clientY);
            case 1: return this.mouse.middle_button.click(mouse_event.clientX, mouse_event.clientY);
            case 2: return this.mouse.right_button.click(mouse_event.clientX, mouse_event.clientY);
        }
        this._display.setViewportAt(mouse_event.clientX, mouse_event.clientY);
    }
    _on_mousedown(mouse_event) {
        const rect = this.canvas.getBoundingClientRect();
        this._display.setPosition(rect.left, rect.top);
        switch (mouse_event.button) {
            case 0: return this.mouse.left_button.down(mouse_event.clientX, mouse_event.clientY);
            case 1: return this.mouse.middle_button.down(mouse_event.clientX, mouse_event.clientY);
            case 2: return this.mouse.right_button.down(mouse_event.clientX, mouse_event.clientY);
        }
    }
    _on_mouseup(mouse_event) {
        switch (mouse_event.button) {
            case 0: return this.mouse.left_button.up(mouse_event.clientX, mouse_event.clientY);
            case 1: return this.mouse.middle_button.up(mouse_event.clientX, mouse_event.clientY);
            case 2: return this.mouse.right_button.up(mouse_event.clientX, mouse_event.clientY);
        }
    }
    _on_keydown(key_event) {
        this._display.active_viewport.controller.onKeyChanged(key_event.which, true);
    }
    _on_keyup(key_event) {
        this._display.active_viewport.controller.onKeyChanged(key_event.which, false);
    }
    handleEvent(event) {
        const handler = `_on_${event.type}`;
        if (typeof this[handler] === 'function')
            return this[handler](event);
    }
    _startListening() {
        for (const event of this._events)
            document.addEventListener(event, this, { passive: true });
    }
    _stopListening() {
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
    _createContext(canvas) {
        return canvas.getContext('2d');
    }
}
//# sourceMappingURL=engine.js.map