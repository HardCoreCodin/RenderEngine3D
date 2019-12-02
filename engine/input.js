import { Direction3D } from "./lib/accessors/vector/direction.js";
const UP_KEY_CODE = 82; // R
const DOWN_KEY_CODE = 70; // F
const LEFT_kEY_CODE = 65; // A
const RIGHT_kEY_CODE = 68; // D
const FORWARD_kEY_CODE = 87; // W
const BACKWARD_kEY_CODE = 83; // S
const YAW_LEFT_KEY_CODE = 37; // left arrow
const YAW_RIGHT_KEY_CODE = 39; // right arrow
const PITCH_UP_KEY_CODE = 38; // up arrow
const PITCH_DOWN_KEY_CODE = 40; // down arrow
const pressed = {
    up: false,
    down: false,
    forward: false,
    backwards: false,
    right: false,
    left: false,
    yaw_right: false,
    yaw_left: false,
    pitch_up: false,
    pitch_down: false
};
export default class FPSController {
    constructor(camera, canvas, forward_movement = new Direction3D(), right_movement = new Direction3D(), _forward_direction = new Direction3D(), movement_speed = 0.1, rotation_speed = 0.01, mouse_sensitivity = 0.1, look_direction = camera.transform.matrix.k, // The player's forward direction
    right_direction = camera.transform.matrix.i) {
        this.camera = camera;
        this.canvas = canvas;
        this.forward_movement = forward_movement;
        this.right_movement = right_movement;
        this._forward_direction = _forward_direction;
        this.movement_speed = movement_speed;
        this.rotation_speed = rotation_speed;
        this.mouse_sensitivity = mouse_sensitivity;
        this.look_direction = look_direction;
        this.right_direction = right_direction;
        this.position_changed = false;
        this.direction_changed = false;
        this.on_mousemove = (mouse_event) => {
            this.mouse_x = mouse_event.clientX - this.canvas.offsetLeft;
            this.mouse_y = mouse_event.clientY - this.canvas.offsetTop;
        };
        this.on_keydown = (key_event) => {
            switch (key_event.which) {
                case UP_KEY_CODE:
                    pressed.up = true;
                    break;
                case DOWN_KEY_CODE:
                    pressed.down = true;
                    break;
                case FORWARD_kEY_CODE:
                    pressed.forward = true;
                    break;
                case BACKWARD_kEY_CODE:
                    pressed.backwards = true;
                    break;
                case LEFT_kEY_CODE:
                    pressed.left = true;
                    break;
                case RIGHT_kEY_CODE:
                    pressed.right = true;
                    break;
                case YAW_LEFT_KEY_CODE:
                    pressed.yaw_left = true;
                    break;
                case YAW_RIGHT_KEY_CODE:
                    pressed.yaw_right = true;
                    break;
                case PITCH_UP_KEY_CODE:
                    pressed.pitch_up = true;
                    break;
                case PITCH_DOWN_KEY_CODE:
                    pressed.pitch_down = true;
                    break;
            }
        };
        this.on_keyup = (key_event) => {
            switch (key_event.which) {
                case UP_KEY_CODE:
                    pressed.up = false;
                    break;
                case DOWN_KEY_CODE:
                    pressed.down = false;
                    break;
                case FORWARD_kEY_CODE:
                    pressed.forward = false;
                    break;
                case BACKWARD_kEY_CODE:
                    pressed.backwards = false;
                    break;
                case LEFT_kEY_CODE:
                    pressed.left = false;
                    break;
                case RIGHT_kEY_CODE:
                    pressed.right = false;
                    break;
                case YAW_LEFT_KEY_CODE:
                    pressed.yaw_left = false;
                    break;
                case YAW_RIGHT_KEY_CODE:
                    pressed.yaw_right = false;
                    break;
                case PITCH_UP_KEY_CODE:
                    pressed.pitch_up = false;
                    break;
                case PITCH_DOWN_KEY_CODE:
                    pressed.pitch_down = false;
                    break;
            }
        };
        canvas.onmousemove = this.on_mousemove;
        document.onkeydown = this.on_keydown;
        document.onkeyup = this.on_keyup;
    }
    get forward_direction() {
        this._forward_direction.x = this.look_direction.x;
        this._forward_direction.z = this.look_direction.z;
        this._forward_direction.normalize();
        return this._forward_direction;
    }
    update(delta_time) {
        this.position_changed = false;
        this.direction_changed = false;
        if (pressed.yaw_left ||
            pressed.yaw_right ||
            pressed.pitch_up ||
            pressed.pitch_down) {
            this.direction_changed = true;
            this.rotation_amount = this.rotation_speed * delta_time;
            if (pressed.yaw_left ||
                pressed.yaw_right) {
                if (pressed.yaw_left)
                    this.camera.transform.rotation.y += this.rotation_amount;
                else
                    this.camera.transform.rotation.y -= this.rotation_amount;
            }
            if (pressed.pitch_up ||
                pressed.pitch_down) {
                if (pressed.pitch_up)
                    this.camera.transform.rotation.x -= this.rotation_amount;
                else
                    this.camera.transform.rotation.x += this.rotation_amount;
            }
        }
        if (pressed.forward ||
            pressed.backwards ||
            pressed.right ||
            pressed.left ||
            pressed.up ||
            pressed.down) {
            this.position_changed = true;
            this.movement_amount = this.movement_speed * delta_time;
            if (pressed.forward ||
                pressed.backwards) {
                this.forward_direction.times(this.movement_amount, this.forward_movement);
                if (pressed.forward)
                    this.camera.transform.translation.add(this.forward_movement);
                else
                    this.camera.transform.translation.sub(this.forward_movement);
            }
            if (pressed.right ||
                pressed.left) {
                this.right_direction.times(this.movement_amount, this.right_movement);
                if (pressed.right)
                    this.camera.transform.translation.add(this.right_movement);
                else
                    this.camera.transform.translation.sub(this.right_movement);
            }
            if (pressed.up ||
                pressed.down) {
                if (pressed.up)
                    this.camera.transform.translation.y += this.movement_amount;
                else
                    this.camera.transform.translation.y -= this.movement_amount;
            }
        }
        if (this.mouse_x !== undefined) {
            if (this.last_mouse_x !== undefined) {
                this.direction_changed = true;
                this.rotation_amount = this.mouse_sensitivity * this.rotation_speed;
                this.camera.transform.rotation.x += this.rotation_amount * (this.mouse_y - this.last_mouse_y);
                this.camera.transform.rotation.y += this.rotation_amount * (this.last_mouse_x - this.mouse_x);
            }
            this.last_mouse_x = this.mouse_x;
            this.last_mouse_y = this.mouse_y;
        }
    }
}
//# sourceMappingURL=input.js.map