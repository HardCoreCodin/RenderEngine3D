export const PRECISION_DIGITS = 3;
export const CACHE_LINE_BYTES = 64;
// Culling flags:
// ======================
export const NEAR = 1;
export const FAR = 2;
export const BELOW = 4;
export const ABOVE = 8;
export const RIGHT = 16;
export const LEFT = 32;
export const OUT = 63;
export const NDC = 64;
// Clipping flags:
// ===============
export const CULL = 0;
export const CLIP = 1;
export const INSIDE = 2;
export const INEXTRA = 4;
export const PIE = Math.PI;
export const TWO_PIE = 2 * PIE;
export const DEGREES_TO_RADIANS_FACTOR = TWO_PIE / 360;
export const RADIANS_TO_DEGREES_FACTOR = 1 / DEGREES_TO_RADIANS_FACTOR;
export var KEY_CODES;
(function (KEY_CODES) {
    KEY_CODES[KEY_CODES["R"] = 82] = "R";
    KEY_CODES[KEY_CODES["F"] = 70] = "F";
    KEY_CODES[KEY_CODES["A"] = 65] = "A";
    KEY_CODES[KEY_CODES["D"] = 68] = "D";
    KEY_CODES[KEY_CODES["W"] = 87] = "W";
    KEY_CODES[KEY_CODES["S"] = 83] = "S";
    KEY_CODES[KEY_CODES["LEFT"] = 37] = "LEFT";
    KEY_CODES[KEY_CODES["RIGHT"] = 39] = "RIGHT";
    KEY_CODES[KEY_CODES["UP"] = 38] = "UP";
    KEY_CODES[KEY_CODES["DOWN"] = 40] = "DOWN";
    KEY_CODES[KEY_CODES["SPACE"] = 32] = "SPACE";
    KEY_CODES[KEY_CODES["CTRL"] = 17] = "CTRL";
    KEY_CODES[KEY_CODES["ESC"] = 27] = "ESC";
})(KEY_CODES || (KEY_CODES = {}));
export var MOUSE_BUTTON;
(function (MOUSE_BUTTON) {
    MOUSE_BUTTON[MOUSE_BUTTON["LEFT"] = 1] = "LEFT";
    MOUSE_BUTTON[MOUSE_BUTTON["MIDDLE"] = 2] = "MIDDLE";
    MOUSE_BUTTON[MOUSE_BUTTON["RIGHT"] = 3] = "RIGHT";
})(MOUSE_BUTTON || (MOUSE_BUTTON = {}));
export const MIN_FOV = 1;
export const MAX_FOV = 179;
export const MIN_FOCAL_LENGTH = 0.1;
export const MIN_ZOOM = 0.1;
export const DEFAULT_ZOOM = 1;
export const DEFAULT_FOCAL_LENGTH = 1;
export const DEFAULT_MOVEMENT_SPEED = 0.003;
export const DEFAULT_ROTATION_SPEED = 0.002;
export const DEFAULT_MOUSE_SENSITIVITY = 0.4;
export const DEFAULT_MOUSE_WHEEL_SENSITIVITY = 0.001;
export const DEFAULT_FAR_CLIPPING_PLANE_DISTANCE = 10000;
export const DEFAULT_NEAR_CLIPPING_PLANE_DISTANCE = 0.0001;
const __array = new Uint8Array(4);
const __view = new Uint32Array(__array.buffer);
export const IS_BIG_ENDIAN = !((__view[0] = 1) & __array[0]);
export const MAX_RENDER_TARGET_SIZE = 3840 * 2160;
//# sourceMappingURL=constants.js.map