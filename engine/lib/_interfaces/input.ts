import {I2D} from "./vectors.js";
import Camera from "../nodes/camera.js";
import {IViewport} from "./render.js";

export interface IControllerKeys {
    up: number;
    down: number;

    forward: number;
    backwards: number;

    right: number;
    left: number;

    yaw_right: number;
    yaw_left: number;

    pitch_up: number;
    pitch_down: number;
}

export interface IController {
    viewport: IViewport;
    camera: Camera,

    position_changed: boolean;
    direction_changed: boolean;

    key_pressed: boolean;
    readonly keys: IControllerKeys;
    readonly pressed: Uint8Array;

    mouse_up: number;
    mouse_down: number;
    mouse_moved: boolean;
    mouse_movement: I2D;
    mouse_clicked: boolean;
    mouse_double_clicked: boolean;
    mouse_wheel: number;
    mouse_wheel_moved: boolean;
    mouse_sensitivity: number;
    mouse_wheel_sensitivity: number;

    movement_speed: number;
    rotation_speed: number;

    update(delta_time: number): void;
    keyUp (key: number): void;
}

export type ControllerConstructor = new (
    _camera: Camera,
    movement_speed?: number,
    rotation_speed?: number,
    mouse_sensitivity?: number,
    mouse_wheel_sensitivity?: number
) => IController;