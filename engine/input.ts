const UP_KEY_CODE = 82; // r
const DOWN_KEY_CODE = 70; // f

const LEFT_kEY_CODE = 65; // a
const RIGHT_kEY_CODE = 68; // d

const FORWARD_kEY_CODE = 87; // w
const BACKWARD_kEY_CODE = 83; // s

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
export default pressed;

document.addEventListener('keydown', (event) => {
    switch (event.which) {
        case UP_KEY_CODE: pressed.up = true; break;
        case DOWN_KEY_CODE: pressed.down = true; break;

        case FORWARD_kEY_CODE: pressed.forward = true; break;
        case BACKWARD_kEY_CODE: pressed.backwards = true; break;

        case LEFT_kEY_CODE: pressed.yaw_left = true; break;
        case RIGHT_kEY_CODE: pressed.yaw_right = true; break;

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

        case LEFT_kEY_CODE: pressed.yaw_left = false; break;
        case RIGHT_kEY_CODE: pressed.yaw_right = false; break;

        case YAW_LEFT_KEY_CODE: pressed.yaw_left = false; break;
        case YAW_RIGHT_KEY_CODE: pressed.yaw_right = false; break;

        case PITCH_UP_KEY_CODE: pressed.pitch_up = false; break;
        case PITCH_DOWN_KEY_CODE: pressed.pitch_down = false; break;
    }
});