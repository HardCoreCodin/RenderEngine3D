import {dir3} from "../accessors/direction.js";
import {IPosition3D, IVector2D} from "../_interfaces/vectors.js";
import {IController, IControllerKeys} from "../_interfaces/input.js";
import {ICamera, IViewport} from "../_interfaces/render.js";
import {IEulerRotation} from "../_interfaces/transform.js";
import {IMatrix4x4} from "../_interfaces/matrix.js";
import {DEFAULT_MOUSE_SENSITIVITY, DEFAULT_MOVEMENT_SPEED, DEFAULT_ROTATION_SPEED, KEY_CODES} from "../../constants.js";

abstract class Controller
    implements IController
{
    abstract readonly key_bindings: IControllerKeys;
    readonly key_pressed: IControllerKeys = {
        forward: 0,
        backwards: 0,

        right: 0,
        left: 0,

        yaw_right: 0,
        yaw_left: 0,

        pitch_up: 0,
        pitch_down: 0,

        up: 0,
        down: 0,
    };

    position_changed: boolean = false;
    direction_changed: boolean = false;

    public mouse_moved: boolean = false;
    public mouse_movement: IVector2D = {x: 0, y: 0};
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
        viewport: IViewport,
        public canvas: HTMLCanvasElement,
        public movement_speed: number = DEFAULT_MOVEMENT_SPEED,
        public rotation_speed: number = DEFAULT_ROTATION_SPEED,
        public mouse_sensitivity: number = DEFAULT_MOUSE_SENSITIVITY
    ) {
        this.viewport = viewport;
    }

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
                    this._rotation.x += this.rotation_amount;
                else
                    this._rotation.x -= this.rotation_amount;
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

            if (this._camera.is_perspective) {
                if (this.key_pressed.forward ||
                    this.key_pressed.backwards) {
                    if (this.key_pressed.forward) {
                        this._translation.x += this._matrix.z_axis.x * this.movement_amount;
                        this._translation.z += this._matrix.z_axis.z * this.movement_amount;
                    } else {
                        this._translation.x -= this._matrix.z_axis.x * this.movement_amount;
                        this._translation.z -= this._matrix.z_axis.z * this.movement_amount;
                    }
                }
            }

            if (this.key_pressed.right ||
                this.key_pressed.left) {

                this._matrix.x_axis.mul(this.movement_amount, this.right_movement);

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

        if (!this._camera.is_static || this.direction_changed || this.position_changed) {
            this._viewport.updateMatrices();
            this.direction_changed = this.position_changed = false;
        }
    }

    protected _updateFromMouse(): void {
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
}

export class FPSController
    extends Controller
{
    key_bindings: IControllerKeys = {
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