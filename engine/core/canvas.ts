import mouse from "../input/mouse.js";
import is_pressed from "../input/keyboard.js";

export default class InteractiveCanvas<Context extends RenderingContext = CanvasRenderingContext2D>
{
    readonly context: Context;
    protected readonly _frame_request_callback: FrameRequestCallback;

    protected elapsed_time = 0;
    protected delta_time = 0;

    protected readonly _events = [
        'keyup',
        'keydown',
        'mouseup',
        'mousedown',
        'mousemove',
        'wheel',
        'click',
        'dblclick',
        'auxclick',
        'pointerlockchange'
    ];

    constructor(readonly canvas: HTMLCanvasElement) {
        this.context = this._createContext(canvas);
        this.OnInit();
        if (document.ontouchmove) this._events.concat('touchmove', 'touchstart', 'touchend');
        for (const event of this._events) document.addEventListener(event, this, { passive: true });
        
        this._frame_request_callback = this._update.bind(this);
        requestAnimationFrame(this._frame_request_callback);
    }

    OnInit() : void {};
    OnUpdate() : void {};
    OnKeyChanged(key_event: KeyboardEvent, key_is_pressed: boolean) : void {}

    protected _createContext(canvas: HTMLCanvasElement): Context {
        return canvas.getContext('2d') as Context;
    }

    private _update(time: number): void {
        time *= 0.001;
        this.delta_time = time - this.elapsed_time;
        this.elapsed_time = time;

        this.OnUpdate();

        mouse.reset();

        requestAnimationFrame(this._frame_request_callback);
    }

    handleEvent(event: Event) {
        const handler = `_on_${event.type}`;
        if (typeof this[handler] === 'function')
            return this[handler](event);
    }

    get is_mouse_over_canvas() : boolean {
        return 0 <= mouse.pos_x && mouse.pos_x <= this.canvas.clientWidth &&
               0 <= mouse.pos_y && mouse.pos_y <= this.canvas.clientHeight;
    }

    protected _on_pointerlockchange(): void { mouse.is_captured = this.canvas === document.pointerLockElement; }
    protected _on_mousemove(mouse_event: MouseEvent) : void { mouse.move(mouse_event.movementX, mouse_event.movementY); [mouse.pos_x, mouse.pos_y] = this._getCanvasSpaceMouseCoords(mouse_event)}
    protected _on_wheel(    wheel_event: WheelEvent) : void { mouse.wheel.scroll(wheel_event.deltaY); }
    protected _on_dblclick( mouse_event: MouseEvent) : void { mouse.doubleClick(                      ...this._getCanvasSpaceMouseCoords(mouse_event)); }
    protected _on_click(    mouse_event: MouseEvent) : void { mouse.left_button.click(                ...this._getCanvasSpaceMouseCoords(mouse_event)); }
    protected _on_auxclick( mouse_event: MouseEvent) : void { mouse.buttons[mouse_event.button].click(...this._getCanvasSpaceMouseCoords(mouse_event)); }
    protected _on_mousedown(mouse_event: MouseEvent) : void { mouse.buttons[mouse_event.button].down( ...this._getCanvasSpaceMouseCoords(mouse_event)); }
    protected _on_mouseup(  mouse_event: MouseEvent) : void { mouse.buttons[mouse_event.button].up(   ...this._getCanvasSpaceMouseCoords(mouse_event)); }
    protected _on_keydown( keyboard_event: KeyboardEvent) : void { this._on_key_changed(keyboard_event, true ); }
    protected _on_keyup(   keyboard_event: KeyboardEvent) : void { this._on_key_changed(keyboard_event, false); }
    protected _on_key_changed(keyboard_event: KeyboardEvent, key_is_pressed: boolean) : void {
        switch (keyboard_event.code) {
            case 'ArrowDown'   : is_pressed.down      = key_is_pressed; break;
            case 'ArrowUp'     : is_pressed.up        = key_is_pressed; break;
            case 'ArrowLeft'   : is_pressed.left      = key_is_pressed; break;
            case 'ArrowRight'  : is_pressed.right     = key_is_pressed; break;

            case 'Escape'      : is_pressed.escape    = key_is_pressed; break;
            case 'Pause'       : is_pressed.pause     = key_is_pressed; break;

            case 'Space'       : is_pressed.space     = key_is_pressed; break;
            case 'Backspace'   : is_pressed.backspace = key_is_pressed; break;
            case 'Enter'       : is_pressed.enter     = key_is_pressed; break;

            case 'Insert'      : is_pressed.insert    = key_is_pressed; break;
            case 'Delete'      : is_pressed.delete    = key_is_pressed; break;
            case 'Home'        : is_pressed.home      = key_is_pressed; break;
            case 'End'         : is_pressed.end       = key_is_pressed; break;
            case 'PageUp'      : is_pressed.page_up   = key_is_pressed; break;
            case 'PageDown'    : is_pressed.page_down = key_is_pressed; break;

            case 'ControlRight': is_pressed.ctrl      = key_is_pressed; break;
            case 'ControlLeft' : is_pressed.ctrl      = key_is_pressed; break;

            case 'AltLeft'     : is_pressed.alt       = key_is_pressed; break;
            case 'AltRight'    : is_pressed.alt       = key_is_pressed; break;

            case 'ShiftLeft'   : is_pressed.shift     = key_is_pressed; break;
            case 'ShiftRight'  : is_pressed.shift     = key_is_pressed; break;
        }

        this.OnKeyChanged(keyboard_event, key_is_pressed);
    }

    protected _getCanvasSpaceMouseCoords(event: MouseEvent|WheelEvent) : [number, number] {
        const rect = this.canvas.getBoundingClientRect();
        return [
            Math.floor(event.clientX - rect.left),
            Math.floor(event.clientY - rect.top)
        ];
    }
}