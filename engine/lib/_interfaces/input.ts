import {IViewport} from "./render.js";
import {IDirection3D, IVector2D} from "./vectors.js";

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
    readonly forward_direction: IDirection3D;
    readonly key_bindings: IControllerKeys;
    readonly key_pressed: IControllerKeys;

    viewport: IViewport;
    canvas: HTMLCanvasElement;

    position_changed: boolean;
    direction_changed: boolean;

    mouse_moved: boolean;
    mouse_movement: IVector2D;
    movement_speed: number;
    rotation_speed: number;
    mouse_sensitivity: number;

    update(delta_time: number): void;
}
