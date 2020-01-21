import {dir3} from "../accessors/direction.js";
import {IPosition3D, I2D} from "../_interfaces/vectors.js";
import {IController, IControllerKeys} from "../_interfaces/input.js";
import {ICamera, IViewport} from "../_interfaces/render.js";
import {IEulerRotation} from "../_interfaces/transform.js";
import {IMatrix4x4} from "../_interfaces/matrix.js";
import {
    DEFAULT_MOUSE_SENSITIVITY,
    DEFAULT_MOUSE_WHEEL_SENSITIVITY,
    DEFAULT_MOVEMENT_SPEED,
    DEFAULT_ROTATION_SPEED,
    KEY_CODES, MOUSE_BUTTON
} from "../../constants.js";

abstract class Controller
    implements IController
{
    abstract readonly keys: IControllerKeys;
    readonly pressed = new Uint8Array(256);

    position_changed: boolean = false;
    direction_changed: boolean = false;

    public key_pressed: boolean = false;
    public mouse_clicked: boolean = false;
    public mouse_double_clicked: boolean = false;

    public mouse_up: number = 0;
    public mouse_down: number = 0;

    public mouse_moved: boolean = false;
    public mouse_movement: I2D = {x: 0, y: 0};

    public mouse_wheel_moved: boolean = false;
    public mouse_wheel: number = 0;

    protected movement_amount: number;
    protected rotation_amount: number;
    protected readonly right_movement = dir3();

    protected _viewport: IViewport;
    protected _rotation: IEulerRotation;
    protected _translation: IPosition3D;
    protected _matrix: IMatrix4x4;
    protected _camera: ICamera;
    protected _projection_matrix: IMatrix4x4;

    constructor(
        public canvas: HTMLCanvasElement,
        public movement_speed: number = DEFAULT_MOVEMENT_SPEED,
        public rotation_speed: number = DEFAULT_ROTATION_SPEED,
        public mouse_sensitivity: number = DEFAULT_MOUSE_SENSITIVITY,
        public mouse_wheel_sensitivity: number = DEFAULT_MOUSE_WHEEL_SENSITIVITY
    ) {}

    get viewport(): IViewport {return this._viewport}
    set viewport(viewport: IViewport) {
        this._viewport = viewport;
        this._camera = viewport.camera;
        this._rotation = viewport.camera.transform.rotation;
        this._translation = viewport.camera.transform.translation;
        this._matrix = viewport.camera.transform.matrix;
        this._projection_matrix = viewport.camera.projection_matrix;
    }

    update(delta_time: number): void {
        this.position_changed = false;
        this.direction_changed = false;

        if (this.mouse_double_clicked) {
            this.mouse_movement.x = 0;
            this.mouse_movement.y = 0;
            this.mouse_moved = false;
            this.mouse_double_clicked = false;
        }

        if (this.key_pressed)
            this._updateFromKeyboard(delta_time);

        if (this.mouse_moved || this.mouse_wheel_moved || this.mouse_clicked)
            this._updateFromMouse(delta_time);

        if (!this._camera.is_static || this.direction_changed || this.position_changed) {
            this._viewport.updateMatrices();
            this.direction_changed = this.position_changed = false;
        }
    }

    protected _updateFromKeyboard(delta_time: number): void {}
    protected _updateFromMouse(delta_time: number): void {}
}

export class FPSController
    extends Controller
{
    keys: IControllerKeys = {
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

    protected _updateFromKeyboard(delta_time: number): void {
        if (this.pressed[this.keys.yaw_left] ||
            this.pressed[this.keys.yaw_right] ||
            this.pressed[this.keys.pitch_up] ||
            this.pressed[this.keys.pitch_down]) {

            this.direction_changed = true;
            this.rotation_amount = this.rotation_speed * delta_time;

            if (this.pressed[this.keys.yaw_left] ||
                this.pressed[this.keys.yaw_right]) {

                if (this.pressed[this.keys.yaw_left])
                    this._rotation.y += this.rotation_amount;
                else
                    this._rotation.y -= this.rotation_amount;
            }

            if (this.pressed[this.keys.pitch_up] ||
                this.pressed[this.keys.pitch_down]) {

                if (this.pressed[this.keys.pitch_up])
                    this._rotation.x += this.rotation_amount;
                else
                    this._rotation.x -= this.rotation_amount;
            }
        }

        if (this.pressed[this.keys.forward] ||
            this.pressed[this.keys.backwards] ||
            this.pressed[this.keys.right] ||
            this.pressed[this.keys.left] ||
            this.pressed[this.keys.up] ||
            this.pressed[this.keys.down]) {

            this.position_changed = true;
            this.movement_amount = this.movement_speed * delta_time;

            if (this._camera.is_perspective) {
                if (this.pressed[this.keys.forward] ||
                    this.pressed[this.keys.backwards]) {
                    if (this.pressed[this.keys.forward]) {
                        this._translation.x += this._matrix.z_axis.x * this.movement_amount;
                        this._translation.z += this._matrix.z_axis.z * this.movement_amount;
                    } else {
                        this._translation.x -= this._matrix.z_axis.x * this.movement_amount;
                        this._translation.z -= this._matrix.z_axis.z * this.movement_amount;
                    }
                }
            }

            if (this.pressed[this.keys.right] ||
                this.pressed[this.keys.left]) {

                this._matrix.x_axis.mul(this.movement_amount, this.right_movement);

                if (this.pressed[this.keys.right])
                    this._translation.add(this.right_movement);
                else
                    this._translation.sub(this.right_movement);
            }

            if (this.pressed[this.keys.up] ||
                this.pressed[this.keys.down]) {

                if (this.pressed[this.keys.up])
                    this._translation.y += this.movement_amount;
                else
                    this._translation.y -= this.movement_amount;
            }
        }
    }

    protected _updateFromMouse(delta_time: number): void {
        if (this.mouse_moved) {
            this.direction_changed = true;
            this.rotation_amount = this.mouse_sensitivity * this.rotation_speed;

            // Note:
            // Y mouse movement are actually NEGATIVE when the mose is moved UP(!)
            // This has to do with the 2D coordinate system of the canvas going top-to-bottom (with 0 on top).
            //
            // Also Note:
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
            // so the camera should be orienting CLOCK-WIZE (CW) around Y (Y is up) looking at Y from the top.
            // A CW roation is a negative angle increment, so again the rotation value is DECREMENTED.
            this._rotation.x -= this.rotation_amount * this.mouse_movement.y;
            this._rotation.y -= this.rotation_amount * this.mouse_movement.x;

            this.mouse_movement.x = this.mouse_movement.y = 0;
            this.mouse_moved = false;
        }

        if (this.mouse_wheel_moved) {
            if (this._camera.is_perspective)
                this._camera.lense.focal_length -= this.mouse_wheel * this.mouse_wheel_sensitivity;
            else
                this._camera.lense.zoom -= this.mouse_wheel * this.mouse_wheel_sensitivity;
            this.mouse_wheel_moved = false;
        }

        if (this.mouse_clicked) {
            this.mouse_clicked = false;
        }

        if (this.mouse_down) {
            if (this.mouse_down === MOUSE_BUTTON.MIDDLE)
                this._camera.is_perspective = !this._camera.is_perspective;

            this.mouse_down = 0;
        }

        if (this.mouse_up) {
            this.mouse_up = 0;
        }
    }
}