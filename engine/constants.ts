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
    position = 0b0001,
    normal   = 0b0010,
    color    = 0b0100,
    uv       = 0b1000,
}
export const enum SHARE {
    POSITION = 0b0001,
    NORMAL   = 0b0010,
    COLOR    = 0b0100,
    UV       = 0b1000,
}


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