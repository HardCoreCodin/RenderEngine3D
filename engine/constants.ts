export const PRECISION_DIGITS = 3;

export const enum VERTEX_NUM {
    _1,
    _2,
    _3,
}

export const enum VERTICES_PER_FACE {
    TRIANGLE = 3,
    QUAD,
}

export const enum DIM {
    _2D = 2,
    _3D,
    _4D,
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