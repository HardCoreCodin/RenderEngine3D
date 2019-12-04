import {ICamera} from "./render.js";
import {IDirection3D} from "./vectors.js";

export interface IKeys {
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
    readonly canvas: HTMLCanvasElement;
    readonly forward_direction: IDirection3D;

    camera: ICamera;

    key_bindings: IKeys;
    key_pressed: IKeys;

    position_changed: boolean;
    direction_changed: boolean;

    movement_speed: number;
    rotation_speed: number;
    mouse_sensitivity: number;

    update(delta_time: number): void;
}