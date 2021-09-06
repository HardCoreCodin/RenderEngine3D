import { dir3 } from "../accessors/direction.js";
import { DEFAULT_MOUSE_SENSITIVITY, DEFAULT_MOUSE_WHEEL_SENSITIVITY, DEFAULT_MOVEMENT_SPEED, DEFAULT_ROTATION_SPEED, KEY_CODES, MOUSE_BUTTON } from "../../constants.js";
class Controller {
    constructor(_camera, movement_speed = DEFAULT_MOVEMENT_SPEED, rotation_speed = DEFAULT_ROTATION_SPEED, mouse_sensitivity = DEFAULT_MOUSE_SENSITIVITY, mouse_wheel_sensitivity = DEFAULT_MOUSE_WHEEL_SENSITIVITY) {
        this._camera = _camera;
        this.movement_speed = movement_speed;
        this.rotation_speed = rotation_speed;
        this.mouse_sensitivity = mouse_sensitivity;
        this.mouse_wheel_sensitivity = mouse_wheel_sensitivity;
        this.pressed = new Uint8Array(256);
        this.position_changed = false;
        this.direction_changed = false;
        this.key_pressed = false;
        this.mouse_clicked = false;
        this.mouse_double_clicked = false;
        this.mouse_up = 0;
        this.mouse_down = 0;
        this.mouse_moved = false;
        this.mouse_movement = { x: 0, y: 0 };
        this.mouse_wheel_moved = false;
        this.mouse_wheel = 0;
        this.right_movement = dir3();
        this._rotation = _camera.transform.rotation;
        this._translation = _camera.transform.translation;
        this._matrix = _camera.transform.matrix;
    }
    get camera() { return this._camera; }
    set camera(camera) {
        this._camera = camera;
        this._rotation = camera.transform.rotation;
        this._translation = camera.transform.translation;
        this._matrix = camera.transform.matrix;
    }
    update(delta_time) {
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
    }
    keyUp(key) {
        if (key === KEY_CODES.CTRL)
            this.viewport.show_wire_frame = !this.viewport.show_wire_frame;
        else if (key === KEY_CODES.SPACE)
            this.viewport.cull_back_faces = !this.viewport.cull_back_faces;
    }
    _updateFromKeyboard(delta_time) { }
    _updateFromMouse(delta_time) { }
}
export class FPSController extends Controller {
    constructor() {
        super(...arguments);
        this.keys = {
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
    _updateFromKeyboard(delta_time) {
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
                    }
                    else {
                        this._translation.x -= this._matrix.z_axis.x * this.movement_amount;
                        this._translation.z -= this._matrix.z_axis.z * this.movement_amount;
                    }
                }
            }
            if (this.pressed[this.keys.right] ||
                this.pressed[this.keys.left]) {
                this._matrix.x_axis.mul(this.movement_amount, this.right_movement);
                if (this.pressed[this.keys.right])
                    this._translation.iadd(this.right_movement);
                else
                    this._translation.isub(this.right_movement);
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
    _updateFromMouse(delta_time) {
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
//# sourceMappingURL=controllers.js.map