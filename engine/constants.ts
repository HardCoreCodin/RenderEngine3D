export const PRECISION_DIGITS = 3;
export const OBJ_LINE_HEADER__FACE = 'f';
export const OBJ_LINE_HEADER__VERTEX = 'v';
export const OBJ_LINE_HEADER__NORMAL = 'vn';
export const OBJ_LINE_HEADER__UV = 'vt';

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
