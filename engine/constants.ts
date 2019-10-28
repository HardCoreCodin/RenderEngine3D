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
export const enum FACE_INCLUDE {
    POSITION = 0b0001_0000,
    NORMAL   = 0b0010_0000,
    COLOR    = 0b0011_0000_0000_0000,
}
export const enum VERTEX_INCLUDE {
    UV       = 0b1000_0000,
    NORMAL   = 0b1000_0100_0000,
    COLOR    = 0b0111_0000_0000,
}

export const enum VERTEX_NORMAL_MODE {
    LOAD     = 0b0000_0100_0000,
    GATHER   = 0b1000_0000_0000,
}
export const enum VERTEX_COLOR_MODE {
    LOAD     = 0b0001_0000_0000,
    GATHER   = 0b0010_0000_0000,
    GENERATE = 0b0100_0000_0000,
}
export const enum FACE_COLOR_MODE {
    GATHER   = 0b0001_0000_0000_0000,
    GENERATE = 0b0010_0000_0000_0000,
}

export const getShared = (flags: number) : number => flags & 0b1111;
export const getVertexIncludes = (flags: number) : number => 1 | (
    (
        (
            VERTEX_INCLUDE.NORMAL & flags
        ) ? ATTRIBUTE.normal : 0
    ) | (
        (
            VERTEX_INCLUDE.COLOR & flags
        ) ? ATTRIBUTE.color : 0
    ) | (
        (
            VERTEX_INCLUDE.UV & flags
        ) ? ATTRIBUTE.uv : 0
    )
);
export const getFaceIncludes = (flags: number) : number => (
    (
        (
            FACE_INCLUDE.POSITION & flags
        ) ? ATTRIBUTE.position : 0
    ) | (
        (
            FACE_INCLUDE.NORMAL & flags
        ) ? ATTRIBUTE.normal : 0
    ) | (
        (
            FACE_INCLUDE.COLOR & flags
        ) ? ATTRIBUTE.color : 0
    )
);

export const enum NORMAL_SOURCE {
    NO_VERTEX__NO_FACE,
    NO_VERTEX__GENERATE_FACE,
    LOAD_VERTEX__NO_FACE,
    LOAD_VERTEX__GENERATE_FACE,
    GATHER_VERTEX__GENERATE_FACE
}

export const enum COLOR_SOURCE {
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

//
// export const enum SHARE {
//     position = 0b1_0000,
//     normal = 0b010_0000,
//     color = 0b0100_0000,
//     uv = 0b00_1000_0000,
// }
//
// export const enum CONVERT {
//     v2f_position = 0b0001_0000_0000,
//     v2f_color = 0b00_0010_0000_0000,
//     f2v_color = 0b00_0100_0000_0000,
//     f2v_normal = 0b0_1000_0000_0000,
// }
//
// export const enum GEN {
//     f_normal = 0b01_0000_0000_0000,
//     f_color = 0b010_0000_0000_0000,
//     v_color = 0b100_0000_0000_0000,
// }
//
// export const enum MASK {
//     LOAD = 0b00_0000_0000_0000_1111,
//     SHARE = 0b0_0000_0000_1111_0000,
//     CONVERT = 0b0000_1111_0000_0000,
//     GEN = 0b000_0111_0000_0000_0000,
//     ALL = 0b000_0111_1111_1111_1111,
// }
//
// export const enum OFFSET {
//     LOAD    = 4*0,
//     SHARE   = 4*1,
//     CONVERT = 4*2,
//     GEN     = 4*3,
// }
//
//

//
//
// export const MASK: number = (
//     ATTRIBUTE.position |
//     ATTRIBUTE.normal |
//     ATTRIBUTE.color |
//     ATTRIBUTE.uv |
//
//     SHARE.position |
//     SHARE.normal |
//     SHARE.color |
//     SHARE.uv |
//
//     V2F.position |
//     V2F.color |
//     F2V.color |
//     F2V.normal |
//
//     GEN.color
// );
//
// export const enum FLAGS {
//     VERTEX_LOAD,
//     VERTEX_SHARE,
//     VERTEX_PULL,
//     VERTEX_GEN,
//     FACE_PULL,
//     FACE_GEN
// }
//
// export const enum BYTE_MASK {
//     FIRST_HALF  = 0b0000_1111,
//     SECOND_HALF = 0b1111_0000
// }
//
// export const enum ATTRIBUTE_FLAG_MASKS {
//     share           = 0b0000_0000_0000_0000_0000_1111,
//     load_vertex     = 0b0000_0000_0000_0000_1111_0000,
//     gather_vertex   = 0b0000_0000_0000_1111_0000_0000,
//     gather_face     = 0b0000_0000_1111_0000_0000_0000,
//     generate_vertex = 0b0000_1111_0000_0000_0000_0000,
//     generate_face   = 0b1111_0000_0000_0000_0000_0000,
// }
//
// export const enum ATTRIBUTE_FLAG_MASK_OFFSETS {
//     load_vertex     = 4,
//     gather_vertex   = 4*2,
//     gather_face     = 4*3,
//     generate_vertex = 4*4,
//     generate_face   = 4*5,
// }
//
// export const enum MODE {
//     NONE = 0b0001,
//     LOAD = 0b0010,
//     PULL = 0b0100,
//     GEN  = 0b1000,
// }
//
//
// export const FLAG__SHARE__VERTEX_POSITIONS  = 0b0000_0001;
// export const FLAG__SHARE__VERTEX_NORMALS    = 0b0000_0010;
// export const FLAG__SHARE__VERTEX_COLORS     = 0b0000_0100;
// export const FLAG__SHARE__VERTEX_UVS        = 0b0000_1000;
//
// export const FLAG__GENERATE__VERTEX_NORMALS = 0b0001_0000;
// export const FLAG__GENERATE__VERTEX_COLORS  = 0b0010_0000;
// export const FLAG__GENERATE__FACE_COLORS    = 0b0100_0000;
// export const FLAG__GENERATE__FACE_POSITIONS = 0b1000_0000;
//
// export const DEFAULT_FLAGS = (
//     FLAG__SHARE__VERTEX_POSITIONS |
//     FLAG__SHARE__VERTEX_NORMALS |
//     FLAG__SHARE__VERTEX_COLORS
// );
//
//
//
// export const ATTRS: ATTRIBUTE[] = [
//     ATTRIBUTE.position,
//     ATTRIBUTE.normal,
//     ATTRIBUTE.color,
//     ATTRIBUTE.uv
// ];
//
// export const ATTR_NAMES: string[] = [
//     'position',
//     'normal',
//     'color',
//     'uv'
// ];
//
