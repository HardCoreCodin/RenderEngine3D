import {dir3, Direction3D} from "../accessors/direction.js";
import {IPosition3D, IVector2D} from "../_interfaces/vectors.js";
import {IController, IKeys} from "../_interfaces/input.js";
import {KEY_CODES} from "../../constants.js";
import {IViewport} from "../_interfaces/render.js";
import {IEulerRotation} from "../_interfaces/transform.js";
import {IMatrix4x4} from "../_interfaces/matrix.js";

abstract class Controller
    implements IController
{
    abstract key_bindings: IKeys;
    readonly key_pressed: IKeys = {
        up: 0,
        down: 0,

        forward: 0,
        backwards: 0,

        right: 0,
        left: 0,

        yaw_right: 0,
        yaw_left: 0,

        pitch_up: 0,
        pitch_down: 0
    };

    position_changed: boolean = false;
    direction_changed: boolean = false;

    protected mouse_moved: boolean = false;
    protected current_mouse_position: IVector2D = {x: 0, y: 0};
    protected last_mouse_position: IVector2D = {x: 0, y: 0};

    protected movement_amount: number;
    protected rotation_amount: number;

    protected readonly forward_movement = dir3();
    protected readonly right_movement = dir3();
    protected readonly _forward_direction = dir3();

    protected _viewport: IViewport;
    protected _rotation: IEulerRotation;
    protected _translation: IPosition3D;
    protected _camera_matrix: IMatrix4x4;
    protected _projection_matrix: IMatrix4x4;
    protected _world_to_view: IMatrix4x4;
    protected _world_to_clip: IMatrix4x4;

    constructor(
        viewport: IViewport,
        public canvas: HTMLCanvasElement,
        public movement_speed: number = 0.1,
        public rotation_speed: number = 0.01,
        public mouse_sensitivity: number = 0.1
    ) {
        this.viewport = viewport;
        canvas.onmousemove = this._on_mousemove;
        document.onkeydown = this._on_keydown;
        document.onkeyup = this._on_keyup;
    }

    get viewport(): IViewport {return this._viewport}
    set viewport(viewport: IViewport) {
        this._rotation = viewport.camera.transform.rotation;
        this._translation = viewport.camera.transform.translation;
        this._camera_matrix = viewport.camera.transform.matrix;
        this._projection_matrix = viewport.camera.projection_matrix;
        this._world_to_view = viewport.world_to_view;
        this._world_to_clip = viewport.world_to_clip;
    }

    get forward_direction(): Direction3D {
        this._forward_direction.x = this._camera_matrix.z_axis.x;
        this._forward_direction.z = this._camera_matrix.z_axis.z;
        this._forward_direction.normalize();

        return this._forward_direction;
    }

    protected _on_mousemove(mouse_event): void {
        this.current_mouse_position.x = mouse_event.clientX - this.canvas.offsetLeft;
        this.current_mouse_position.y = mouse_event.clientY - this.canvas.offsetTop;
        this.mouse_moved = true;
    }

    protected _on_keydown(key_event): void {
        for (const key in this.key_bindings)
            if (this.key_bindings[key] === key_event.which)
                this.key_pressed[key] = 0;
    }

    protected _on_keyup(key_event): void {
        for (const key in this.key_bindings)
            if (this.key_bindings[key] === key_event.which)
                this.key_pressed[key] = 1;
    }

    update(delta_time: number): void {
        this.position_changed = false;
        this.direction_changed = false;

        if (this.key_pressed.yaw_left ||
            this.key_pressed.yaw_right ||
            this.key_pressed.pitch_up ||
            this.key_pressed.pitch_down) {

            this.direction_changed = true;
            this.rotation_amount = this.rotation_speed * delta_time;

            if (this.key_pressed.yaw_left ||
                this.key_pressed.yaw_right) {

                if (this.key_pressed.yaw_left)
                    this._rotation.y += this.rotation_amount;
                else
                    this._rotation.y -= this.rotation_amount;
            }

            if (this.key_pressed.pitch_up ||
                this.key_pressed.pitch_down) {

                if (this.key_pressed.pitch_up)
                    this._rotation.x -= this.rotation_amount;
                else
                    this._rotation.x += this.rotation_amount;
            }
        }

        if (this.key_pressed.forward ||
            this.key_pressed.backwards ||
            this.key_pressed.right ||
            this.key_pressed.left ||
            this.key_pressed.up ||
            this.key_pressed.down) {

            this.position_changed = true;
            this.movement_amount = this.movement_speed * delta_time;

            if (this.key_pressed.forward ||
                this.key_pressed.backwards) {

                this.forward_direction.mul(this.movement_amount, this.forward_movement);

                if (this.key_pressed.forward)
                    this._translation.add(this.forward_movement);
                else
                    this._translation.sub(this.forward_movement);
            }

            if (this.key_pressed.right ||
                this.key_pressed.left) {

                this._camera_matrix.x_axis.mul(this.movement_amount, this.right_movement);

                if (this.key_pressed.right)
                    this._translation.add(this.right_movement);
                else
                    this._translation.sub(this.right_movement);
            }

            if (this.key_pressed.up ||
                this.key_pressed.down) {

                if (this.key_pressed.up)
                    this._translation.y += this.movement_amount;
                else
                    this._translation.y -= this.movement_amount;
            }
        }

        if (this.mouse_moved)
            this._updateFromMouse();


        if (this.direction_changed || this.position_changed) {
            this._camera_matrix.invert(this._world_to_view);
            this._world_to_view.mul(this._projection_matrix, this._world_to_clip);
            this.direction_changed = this.position_changed = false;
        }
    }

    protected _updateFromMouse(): void {
        this.direction_changed = true;
        this.rotation_amount = this.mouse_sensitivity * this.rotation_speed;

        this._rotation.x += this.rotation_amount * (
            this.current_mouse_position.y -
            this.last_mouse_position.y
        );

        this._rotation.y += this.rotation_amount * (
            this.last_mouse_position.x -
            this.current_mouse_position.x
        );

        this.last_mouse_position.x = this.current_mouse_position.x;
        this.last_mouse_position.y = this.current_mouse_position.y;

        this.mouse_moved = false;
    }
}

export class FPSController
    extends Controller
{
    key_bindings = {
        forward: KEY_CODES.W,
        backwards: KEY_CODES.S,

        right: KEY_CODES.D,
        left: KEY_CODES.A,

        yaw_right: KEY_CODES.RIGHT,
        yaw_left: KEY_CODES.LEFT,

        pitch_up: KEY_CODES.UP,
        pitch_down: KEY_CODES.DOWN,

        up: KEY_CODES.R,
        down: KEY_CODES.F,
    };
}