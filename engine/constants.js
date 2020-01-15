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
export const MAX_FOV = TWO_PIE - 0.1;
export const MIN_FOCAL_LENGTH = 0.1;
export const MIN_ZOOM = 0.1;
export const MIN_FOV = 0.1;
export const DEFAULT_FOV = 90 * DEGREES_TO_RADIANS_FACTOR;
export const DEFAULT_ZOOM = 1;
export const DEFAULT_FOCAL_LENGTH = 1;
export const DEFAULT_MOVEMENT_SPEED = 0.006;
export const DEFAULT_ROTATION_SPEED = 0.002;
export const DEFAULT_MOUSE_SENSITIVITY = 0.4;
export const DEFAULT_MOUSE_WHEEL_SENSITIVITY = 1 / 1000;
export const DEFAULT_FAR_CLIPPING_PLANE_DISTANCE = 10000;
export const DEFAULT_NEAR_CLIPPING_PLANE_DISTANCE = 0.0001;
export const VIEWPORT_BORDER_STYLE = `
    position: absolute;
    outline: 2px solid steelblue;
    outline-offset: -2px;
    background:rgba(255,255,255,0.0);
    z-index: 3;
    padding: 0px;
    margin: 0px;
    display: none;
`;
//# sourceMappingURL=constants.js.map