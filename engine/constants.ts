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
    uv           = 0b0000_1000,
    interpolator = 0b0001_0000,
    barycentric  = 0b0010_0000
}

export const enum SHARE {
    POSITION = 0b0001,
    NORMAL   = 0b0010,
    COLOR    = 0b0100,
    UV       = 0b1000,
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
    CTRL = 17,
    ESC = 27
}

export enum MOUSE_BUTTON {
    LEFT = 1,
    MIDDLE = 2,
    RIGHT = 3
}

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
