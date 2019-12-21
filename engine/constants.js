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
export const KEY_CODES = {
    R: 82,
    F: 70,
    A: 65,
    D: 68,
    W: 87,
    S: 83,
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40
};
//# sourceMappingURL=constants.js.map