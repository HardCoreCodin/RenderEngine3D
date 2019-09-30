import Screen from "./screen.js";
import Camera from "./primitives/camera.js";
import Direction3D from "./linalng/3D/direction.js";

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

export class FPSController {
    public position_changed: boolean = false;
    public direction_changed: boolean = false;

    private last_mouse_x: number;
    private last_mouse_y: number;

    private forward_movement = new Direction3D();
    private right_movement = new Direction3D();

    private movement_amount: number;
    private rotation_amount: number;

    constructor(
        private readonly camera: Camera,
        private readonly screen: Screen,

        public movement_speed: number = 0.1,
        public rotation_speed: number = 0.01,
        public mouse_sensitivity: number = 0.1,

        private readonly _forward_direction = new Direction3D(),
        private readonly look_direction = camera.transform.rotation.matrix.k, // The player's forward direction
        private readonly right_direction = camera.transform.rotation.matrix.i, // The player's right direction
    ) {}

    get forward_direction() : Direction3D {
        this._forward_direction.x = this.look_direction.x;
        this._forward_direction.z = this.look_direction.z;
        this._forward_direction.normalize();

        return this._forward_direction;
    }

    update(delta_time: number): void {
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
                    this.camera.position.add(this.forward_movement);
                else
                    this.camera.position.sub(this.forward_movement);
            }

            if (pressed.right ||
                pressed.left) {

                this.right_direction.times(this.movement_amount, this.right_movement);

                if (pressed.right)
                    this.camera.position.add(this.right_movement);
                else
                    this.camera.position.sub(this.right_movement);
            }

            if (pressed.up ||
                pressed.down) {

                if (pressed.up)
                    this.camera.position.y += this.movement_amount;
                else
                    this.camera.position.y -= this.movement_amount;
            }
        }

        if (this.screen.mouse_x !== undefined) {
            if (this.last_mouse_x !== undefined) {
                this.direction_changed = true;
                this.rotation_amount = this.mouse_sensitivity * this.rotation_speed;
                this.camera.transform.rotation.x += this.rotation_amount * (this.screen.mouse_y - this.last_mouse_y;
                this.camera.transform.rotation.y += this.rotation_amount * (this.last_mouse_x - this.screen.mouse_x);
            }

            this.last_mouse_x = this.screen.mouse_x;
            this.last_mouse_y = this.screen.mouse_y;
        }
    }
}

document.addEventListener('keydown', (event) => {
    switch (event.which) {
        case UP_KEY_CODE: pressed.up = true; break;
        case DOWN_KEY_CODE: pressed.down = true; break;

        case FORWARD_kEY_CODE: pressed.forward = true; break;
        case BACKWARD_kEY_CODE: pressed.backwards = true; break;

        case LEFT_kEY_CODE: pressed.left = true; break;
        case RIGHT_kEY_CODE: pressed.right = true; break;

        case YAW_LEFT_KEY_CODE: pressed.yaw_left = true; break;
        case YAW_RIGHT_KEY_CODE: pressed.yaw_right = true; break;

        case PITCH_UP_KEY_CODE: pressed.pitch_up = true; break;
        case PITCH_DOWN_KEY_CODE: pressed.pitch_down = true; break;
    }
});
document.addEventListener('keyup', (event) => {
    switch (event.which) {
        case UP_KEY_CODE: pressed.up = false; break;
        case DOWN_KEY_CODE: pressed.down = false; break;

        case FORWARD_kEY_CODE: pressed.forward = false; break;
        case BACKWARD_kEY_CODE: pressed.backwards = false; break;

        case LEFT_kEY_CODE: pressed.left = false; break;
        case RIGHT_kEY_CODE: pressed.right = false; break;

        case YAW_LEFT_KEY_CODE: pressed.yaw_left = false; break;
        case YAW_RIGHT_KEY_CODE: pressed.yaw_right = false; break;

        case PITCH_UP_KEY_CODE: pressed.pitch_up = false; break;
        case PITCH_DOWN_KEY_CODE: pressed.pitch_down = false; break;
    }
});