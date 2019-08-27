const MOVE_UP_KEY_CODE = 82; // r
const MOVE_DOWN_KEY_CODE = 70; // f
const MOVE_LEFT_kEY_CODE = 65; // a
const MOVE_RIGHT_kEY_CODE = 68; // d
const MOVE_FORWARD_kEY_CODE = 87; // w
const MOVE_BACKWARD_kEY_CODE = 83; // s
const TURN_LEFT_KEY_CODE = 81; // q
const TURN_RIGHT_KEY_CODE = 69; // e

const pressed = {
    mu: false,
    md: false,
    mf: false,
    mb: false,
    mr: false,
    ml: false,
    tl: false,
    tr: false
};
export default pressed;

document.addEventListener('keydown', (event) => {
    switch (event.which) {
        case MOVE_UP_KEY_CODE: pressed.mu = true; break;
        case MOVE_DOWN_KEY_CODE: pressed.md = true; break;
        case MOVE_LEFT_kEY_CODE: pressed.ml = true; break;
        case MOVE_RIGHT_kEY_CODE: pressed.mr = true; break;
        case MOVE_FORWARD_kEY_CODE: pressed.mf = true; break;
        case MOVE_BACKWARD_kEY_CODE: pressed.mb = true; break;
        case TURN_LEFT_KEY_CODE: pressed.tl = true; break;
        case TURN_RIGHT_KEY_CODE: pressed.tr = true; break;
    }
});
document.addEventListener('keyup', (event) => {
    switch (event.which) {
        case MOVE_UP_KEY_CODE: pressed.mu = false; break;
        case MOVE_DOWN_KEY_CODE: pressed.md = false; break;
        case MOVE_LEFT_kEY_CODE: pressed.ml = false; break;
        case MOVE_RIGHT_kEY_CODE: pressed.mr = false; break;
        case MOVE_FORWARD_kEY_CODE: pressed.mf = false; break;
        case MOVE_BACKWARD_kEY_CODE: pressed.mb = false; break;
        case TURN_LEFT_KEY_CODE: pressed.tl = false; break;
        case TURN_RIGHT_KEY_CODE: pressed.tr = false; break;
    }
});