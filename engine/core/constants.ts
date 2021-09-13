export const PRECISION_DIGITS = 3;
export const CACHE_LINE_BYTES = 64;

export const enum FACE_VERTEX_NUMBER {
    _1,
    _2,
    _3,
}

export const enum FACE_TYPE {
    TRIANGLE = 3,
    QUAD,
}

export const enum DIM {
    _1D = 1,
    _2D = 2,
    _3D = 3,
    _4D = 4,
    _9D = 9,
    _16D = 16,
}

export const enum ATTRIBUTE {
    position     = 0b0000_0001,
    normal       = 0b0000_0010,
    color        = 0b0000_0100,
    uv           = 0b0000_1000
}

// Culling flags:
// ======================
export const NEAR  = 0b0000_0001;
export const FAR   = 0b0000_0010;
export const BELOW = 0b0000_0100;
export const ABOVE = 0b0000_1000;
export const RIGHT = 0b0001_0000;
export const LEFT  = 0b0010_0000;
export const OUT   = 0b0011_1111;
export const NDC   = 0b0100_0000;

// Clipping flags:
// ===============
export const CULL    = 0b0000_0000;
export const CLIP    = 0b0000_0001;
export const INSIDE  = 0b0000_0010;
export const INEXTRA = 0b0000_0100;

export const enum NORMAL_SOURCING {
    NO_VERTEX__NO_FACE,
    NO_VERTEX__GENERATE_FACE,
    LOAD_VERTEX__NO_FACE,
    LOAD_VERTEX__GENERATE_FACE,
    GATHER_VERTEX__GENERATE_FACE
}

export const enum COLOR_SOURCING {
    NO_VERTEX__NO_FACE,
    NO_VERTEX__GENERATE_FACE,
    LOAD_VERTEX__NO_FACE,
    LOAD_VERTEX__GATHER_FACE,
    LOAD_VERTEX__GENERATE_FACE,
    GENERATE_VERTEX__NO_FACE,
    GENERATE_VERTEX__GATHER_FACE,
    GENERATE_VERTEX__GENERATE_FACE,
    GATHER_VERTEX__GENERATE_FACE
}

export const PIE = Math.PI;
export const TWO_PIE = 2 * PIE;
export const DEGREES_TO_RADIANS_FACTOR = TWO_PIE / 360;
export const RADIANS_TO_DEGREES_FACTOR = 1 / DEGREES_TO_RADIANS_FACTOR;

export enum KEY_CODES {
    R = 82,
    F = 70,
    A = 65,
    D = 68,
    W = 87,
    S = 83,

    LEFT = 37,
    RIGHT = 39,
    UP = 38,
    DOWN = 40,

    SPACE = 32,
    SHIFT = 16,
    CTRL = 17,
    ALT = 18,
    ESC = 27,
    TAB = 9,
}

export const MIN_FOV = 1;
export const MAX_FOV = 179;
export const MIN_FOCAL_LENGTH = 0.1;
export const MIN_ZOOM = 0.1;

export const DEFAULT_FAR_CLIPPING_PLANE_DISTANCE = 100;
export const DEFAULT_NEAR_CLIPPING_PLANE_DISTANCE = 0.01;

export const NAVIGATION_DEFAULT__TARGET_DISTANCE  = 2;
export const NAVIGATION_DEFAULT__ZOOM = 1.0;
export const NAVIGATION_DEFAULT__FOCAL_LENGTH = 2.0;
export const NAVIGATION_DEFAULT__MAX_VELOCITY = 5;
export const NAVIGATION_DEFAULT__ACCELERATION = 10;

export const NAVIGATION_SPEED_DEFAULT__TURN   = 1;
export const NAVIGATION_SPEED_DEFAULT__ORIENT = 0.002;
export const NAVIGATION_SPEED_DEFAULT__ORBIT  = 0.002;
export const NAVIGATION_SPEED_DEFAULT__ZOOM   = 0.003;
export const NAVIGATION_SPEED_DEFAULT__DOLLY  = 0.1;
export const NAVIGATION_SPEED_DEFAULT__PAN    = 0.003;

const __array = new Uint8Array(4);
const __view = new Uint32Array(__array.buffer);
export const IS_BIG_ENDIAN =  !((__view[0] = 1) & __array[0]);
export const MAX_RENDER_TARGET_SIZE = 3840 * 2160;