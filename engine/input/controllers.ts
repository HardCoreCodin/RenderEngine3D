import {
    KEY_CODES,
    NAVIGATION_DEFAULT__ACCELERATION,
    NAVIGATION_DEFAULT__MAX_VELOCITY,
    NAVIGATION_SPEED_DEFAULT__DOLLY,
    NAVIGATION_SPEED_DEFAULT__ORBIT,
    NAVIGATION_SPEED_DEFAULT__ORIENT,
    NAVIGATION_SPEED_DEFAULT__PAN,
    NAVIGATION_SPEED_DEFAULT__TURN,
    NAVIGATION_SPEED_DEFAULT__ZOOM
} from "../core/constants.js";
import Mouse from "./mouse.js";
import Camera from "../nodes/camera.js";


export class ControllerSpeedSettings {
    turn: number   = NAVIGATION_SPEED_DEFAULT__TURN;
    zoom: number   = NAVIGATION_SPEED_DEFAULT__ZOOM;
    dolly: number  = NAVIGATION_SPEED_DEFAULT__DOLLY;
    orbit: number  = NAVIGATION_SPEED_DEFAULT__ORBIT;
    pan: number    = NAVIGATION_SPEED_DEFAULT__PAN;
    orient: number = NAVIGATION_SPEED_DEFAULT__ORIENT;
}

export class ControllerSettings {
    speeds = new ControllerSpeedSettings();
    max_velocity: number = NAVIGATION_DEFAULT__MAX_VELOCITY;
    acceleration: number = NAVIGATION_DEFAULT__ACCELERATION;
}

export interface ILook<T>{
    up: T;
    down: T;
}

export interface ITurn<T> {
    right: T;
    left: T;
}

export interface IMove<T> extends ILook<T>, ITurn<T> {
    forward: T;
    backward: T;
}

export interface IControlKeys<T> {
    space: T;
    shift: T;
    ctrl: T;
    alt: T;
    tab: T;
    esc: T;
}

export class IsPressed implements IControlKeys<boolean> {
    space: boolean = false;
    shift: boolean = false;
    ctrl: boolean = false;
    alt: boolean = false;
    tab: boolean = false;
    esc: boolean = false;
}

export interface IKeyMap {
    move: IMove<number>;
    turn: ITurn<number>;
    look: ILook<number>;
    is_pressed: IControlKeys<number>;
}

export class Turn implements ITurn<boolean> {
    right: boolean = false;
    left: boolean  = false;
}

export class Look extends Turn implements ILook<boolean> {
    up: boolean = false;
    down: boolean  = false;
}

export class Move extends Look implements IMove<boolean> {
    forward: boolean = false;
    backward: boolean = false;
    right: boolean = false;
    left: boolean  = false;
}

export type InputControllerConstructor = new (mouse: Mouse) => InputController;


export default class InputController
{
    readonly keys: IKeyMap = {
        move: {
            forward: KEY_CODES.W,
            left: KEY_CODES.A,
            backward: KEY_CODES.S,
            right: KEY_CODES.D,
            up: KEY_CODES.R,
            down: KEY_CODES.F
        },
        turn: {
            right: KEY_CODES.RIGHT,
            left: KEY_CODES.LEFT,
        },
        look: {
            up: KEY_CODES.UP,
            down: KEY_CODES.DOWN
        },
        is_pressed: {
            space: KEY_CODES.SPACE,
            shift: KEY_CODES.SHIFT,
            ctrl: KEY_CODES.CTRL,
            alt: KEY_CODES.ALT,
            tab: KEY_CODES.TAB,
            esc: KEY_CODES.ESC
        }
    };

    settings = new ControllerSettings();
    is_pressed = new IsPressed();
    move = new Move();
    turn = new Turn();
    look = new Look();

    constructor(public readonly mouse: Mouse) {
        mouse.middle_button.on_down = () => mouse.pos_raw_diff.setAllTo(0);
        mouse.left_button.on_double_click = () => {
            mouse.left_button.double_click_handled = true;
            mouse.is_captured = !mouse.is_captured;
            mouse.pos_raw_diff.setAllTo(0);
        }
    }

    pan(camera: Camera) {
        camera.pan(
            this.settings.speeds.pan * -this.mouse.pos_raw_diff.x,
             this.settings.speeds.pan * +this.mouse.pos_raw_diff.y
        );
        this.mouse.raw_movement_handled = true;
    }

    zoom(camera: Camera) {
        camera.lense.zoom(this.settings.speeds.zoom * this.mouse.wheel.scroll_amount);
        this.mouse.wheel.scroll_handled = true;
    }

    dolly(camera: Camera) {
        camera.dolly(this.settings.speeds.dolly * this.mouse.wheel.scroll_amount);
        this.mouse.wheel.scroll_handled = true;
    }

    orient(camera: Camera) {
        // Y mouse movement are actually NEGATIVE when the mose is moved UP(!)
        // This has to do with the 2D coordinate system of the canvas going top-to-bottom (with 0 on top).
        //
        // Moving the mouse upwards, should actually rotate around the X axis(!)
        // Angle values are consistent with 2D rotation on every axis individually:
        // In other words, for each axis-rotation, looking at the axis being rotated
        // from it's tip (positive-end) down, a POSITIVE angle increment would mean to
        // rotate the axis COUNTER CLOCK-WISE (CCW).
        //
        // When the mouse is moved upwards the player is looking up so the camera should
        // be orienting upwards. This means a counter-clockwise rotation around the X axis,
        // looking at it from it's tip.
        // This requires a positive increment to the rotation angle on the X axis.
        // Because when the move moves up the increment values for Y are negative,
        // to get a positive increment in such cases the x-rotation angle needs to be
        // DECREMENTED by that negative-Y amount.
        //
        // Similarly, when the mouse is moved to the right, the player is looking to the right
        // so the camera should be orienting CLOCK-WISE (CW) around Y (Y is up) looking at Y from the top.
        // A CW rotation is a negative angle increment, so again the rotation value is DECREMENTED.

        camera.orient(
            camera.rotation.y + this.settings.speeds.orient * -this.mouse.pos_raw_diff.x,
            camera.rotation.x + this.settings.speeds.orient * -this.mouse.pos_raw_diff.y
        );
        this.mouse.raw_movement_handled = true;
    }

    orbit(camera: Camera): void {
        camera.orbit(
            this.settings.speeds.orbit * -this.mouse.pos_raw_diff.x,
            this.settings.speeds.orbit * -this.mouse.pos_raw_diff.y
        );
        this.mouse.raw_movement_handled = true;
    }

    onKeyChanged(key: number, pressed: boolean) {
        if (     key === this.keys.is_pressed.esc)   this.is_pressed.esc   = pressed;
        if (     key === this.keys.is_pressed.ctrl)  this.is_pressed.ctrl  = pressed;
        else if (key === this.keys.is_pressed.alt)   this.is_pressed.alt   = pressed;
        else if (key === this.keys.is_pressed.shift) this.is_pressed.shift = pressed;
        else if (key === this.keys.is_pressed.space) this.is_pressed.space = pressed;
        else if (key === this.keys.is_pressed.tab)   this.is_pressed.tab   = pressed;

        else if (key === this.keys.look.up)          this.look.up          = pressed;
        else if (key === this.keys.look.down)        this.look.down        = pressed;
        else if (key === this.keys.turn.left)        this.turn.left        = pressed;
        else if (key === this.keys.turn.right)       this.turn.right       = pressed;
        else if (key === this.keys.move.up)          this.move.up          = pressed;
        else if (key === this.keys.move.down)        this.move.down        = pressed;
        else if (key === this.keys.move.left)        this.move.left        = pressed;
        else if (key === this.keys.move.right)       this.move.right       = pressed;
        else if (key === this.keys.move.forward)     this.move.forward     = pressed;
        else if (key === this.keys.move.backward)    this.move.backward    = pressed;
    }

    update(camera: Camera, delta_time: number): void {
        if (this.move.right ||
            this.move.left ||
            this.move.up ||
            this.move.down ||
            this.move.forward ||
            this.move.backward ||
            this.turn.left ||
            this.turn.right ||
            camera.velocity.isNonZero())
            camera.navigate(this, delta_time);

        if (this.mouse.is_captured) {
            if (this.mouse.moved)        this.orient(camera);
            if (this.mouse.wheel.scrolled) this.zoom(camera);
        } else {
            if (this.mouse.wheel.scrolled) this.dolly(camera);
            if (this.mouse.moved) {
                if (this.mouse.middle_button.is_pressed) {
                    if (this.is_pressed.alt)
                        this.orbit(camera);
                    else
                        this.pan(camera);
                }
            }
        }
    }

    reset(camera: Camera) {
        camera.moved = false;
        camera.turned = false;
        camera.lense.zoomed = false;
        this.mouse.reset();
    }
}