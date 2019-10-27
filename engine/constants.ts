export const PRECISION_DIGITS = 3;

export const enum ATTRIBUTE {
    position = 0b1,
    normal = 0b010,
    color = 0b0100,
    uv = 0b0001000,
}

export const enum MODE {
    NONE = 0b0001,
    LOAD = 0b0010,
    PULL = 0b0100,
    GEN  = 0b1000,
}

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


export const FLAG__SHARE__VERTEX_POSITIONS  = 0b0000_0001;
export const FLAG__SHARE__VERTEX_NORMALS    = 0b0000_0010;
export const FLAG__SHARE__VERTEX_COLORS     = 0b0000_0100;
export const FLAG__SHARE__VERTEX_UVS        = 0b0000_1000;

export const FLAG__GENERATE__VERTEX_NORMALS = 0b0001_0000;
export const FLAG__GENERATE__VERTEX_COLORS  = 0b0010_0000;
export const FLAG__GENERATE__FACE_COLORS    = 0b0100_0000;
export const FLAG__GENERATE__FACE_POSITIONS = 0b1000_0000;

export const DEFAULT_FLAGS = (
    FLAG__SHARE__VERTEX_POSITIONS |
    FLAG__SHARE__VERTEX_NORMALS |
    FLAG__SHARE__VERTEX_COLORS
);



export const ATTRS: ATTRIBUTE[] = [
    ATTRIBUTE.position,
    ATTRIBUTE.normal,
    ATTRIBUTE.color,
    ATTRIBUTE.uv
];

export const ATTR_NAMES: string[] = [
    'position',
    'normal',
    'color',
    'uv'
];

