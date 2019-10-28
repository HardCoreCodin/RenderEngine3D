// import {ATTRIBUTE, BYTE_MASK, FLAGS} from "../../constants.js";
//
// const DEBUG_MODE: boolean = true;
//
// export class Flags {
//     private _buffer: Uint8Array = new Uint8Array(6);
//
//     constructor(public readonly input_includes: ATTRIBUTE = ATTRIBUTE.position) {
//         if (input_includes & ATTRIBUTE.position)
//             this._buffer[FLAGS.VERTEX_LOAD] |= ATTRIBUTE.position;
//         else
//             throw `Invalid input - missing vertex positions!`;
//     }
//
//     private _setValue(value: number, flag: FLAGS) : void {
//         value &= BYTE_MASK.FIRST_HALF;
//
//         if (DEBUG_MODE) {
//             switch (flag) {
//                 case FLAGS.VERTEX_LOAD: value = sanitiseLoad_D(value); break;
//                 case FLAGS.VERTEX_SHARE: value = sanitiseShare_D(value); break;
//                 case FLAGS.VERTEX_PULL: value = sanitisePullV_D(value); break;
//                 case FLAGS.VERTEX_GEN: value = sanitiseGenV_D(value); break;
//                 case FLAGS.FACE_PULL: value = sanitisePullF_D(value); break;
//                 case FLAGS.FACE_GEN: value = sanitiseGenF_D(value); break;
//             }
//         } else {
//             switch (flag) {
//                 case FLAGS.VERTEX_LOAD: value = sanitiseLoad(value); break;
//                 case FLAGS.VERTEX_SHARE: value = sanitiseShare(value); break;
//                 case FLAGS.VERTEX_PULL: value = sanitisePullV(value); break;
//                 case FLAGS.VERTEX_GEN: value = sanitiseGenV(value); break;
//                 case FLAGS.FACE_PULL: value = sanitisePullF(value); break;
//                 case FLAGS.FACE_GEN: value = sanitiseGenF(value); break;
//             }
//         }
//
//         this._buffer[flag] = value;
//     }
//
//     get load() : number {return this._buffer[FLAGS.VERTEX_LOAD]}
//     set load(value: number) {this._setValue(value, FLAGS.VERTEX_LOAD)}
//
//     get share() : number {return this._buffer[FLAGS.VERTEX_SHARE]}
//     set share(value: number) {this._setValue(value, FLAGS.VERTEX_SHARE)}
//
//     get vertex_pull() : number {return this._buffer[FLAGS.VERTEX_PULL]}
//     set vertex_pull(value: number) {this._setValue(value, FLAGS.VERTEX_PULL)}
//
//     get face_pull() : number {return this._buffer[FLAGS.FACE_PULL]}
//     set face_pull(value: number) {this._setValue(value, FLAGS.FACE_PULL)}
//
//     get vertex_gen() : number {return this._buffer[FLAGS.VERTEX_GEN]}
//     set vertex_gen(value: number) {this._setValue(value, FLAGS.VERTEX_GEN)}
//
//     get face_gen() : number {return this._buffer[FLAGS.FACE_GEN]}
//     set face_gen(value: number) {this._setValue(value, FLAGS.FACE_GEN)}
//
//     get vertex_includes() : number {
//         return ((
//             this._buffer[FLAGS.VERTEX_LOAD] & this.input_includes) |
//             this._buffer[FLAGS.VERTEX_PULL] |
//             this._buffer[FLAGS.VERTEX_GEN]
//         );
//     }
//     get face_includes() : number {
//         return (
//             this._buffer[FLAGS.FACE_PULL] |
//             this._buffer[FLAGS.FACE_GEN]
//         );
//     }
// }
//
// const sanitiseLoad = (value: number, input: number) : number => {
//     if (value - input) value &= ~(value - input);
//     return value | ATTRIBUTE.position;
// };
// const sanitiseLoad_D = (value: number, input: number) : number => {
//     if (!(value) || value === ATTRIBUTE.position)
//         return ATTRIBUTE.position;
//
//     if (!(value & ATTRIBUTE.position)) {
//         console.debug('Can not disable loading of vertex positions!');
//         value |= ATTRIBUTE.position;
//     }
//
//     if (value - input) {
//         console.debug('Can not load unavailable attributes!');
//         value -= input;
//     }
// };
//
// const sanitiseShare = (value: ATTRIBUTE) : number => {
//
// };
// const sanitiseShare_D = (value: ATTRIBUTE) : number => {
//     const unavailable = this.vertex_includes;
//     if (value - available) {
//         console.debug('Can not share unavailable vertex attributes!');
//         value -= (value - available)
//     }
// };
//
// const sanitisePullV = (value: ATTRIBUTE) : number => {
//
// };
// const sanitisePullV_D = (value: ATTRIBUTE) : number => {
//     if (value & ATTRIBUTE.uv) {
//         console.debug('Can not gather UVs!');
//         value -= ATTRIBUTE.uv;
//     }
//
//     const inverse = this.face_pull;
//     if (value & inverse) {
//         console.debug('Vertices and faces can not gather from each other!');
//         value -= inverse;
//     }
//
//     const unavailable = value - this.face_gen;
//     if (unavailable) {
//         console.debug('Can not gather vertex attributes from non-generated face attributes!');
//         value -= unavailable
//     }
// };
//
// const sanitisePullF = (value: ATTRIBUTE) : number => {
//
// };
// const sanitisePullF_D = (value: ATTRIBUTE) : number => {
//     const illegal = ATTRIBUTE.uv | ATTRIBUTE.normal;
//     if (value & illegal) {
//         console.debug('Can not gather face UVs and/or normals!');
//         value -= illegal;
//     }
//
//     const inverse = this._buffer[FLAGS.VERTEX_PULL];
//     if (value & inverse) {
//         console.debug('Vertices and faces can not gather from each other!');
//         value -= inverse;
//     }
//
//     const unavailable = value - (this.vertex_gen | (this._buffer[FLAGS.VERTEX_LOAD] & this.input_includes));
//     if (unavailable) {
//         console.debug('Can not gather vertex attributes from non-generated face attributes!');
//         value -= unavailable
//     }
// };
//
// const sanitiseGenV = (value: ATTRIBUTE) : number => {
//
// };
// const sanitiseGenV_D = (value: ATTRIBUTE) : number => {
//     const illegal = ATTRIBUTE.uv | ATTRIBUTE.normal;
//     if (value & illegal) {
//         console.debug('Can not generate vertex UVs and/or positions!');
//         value -= illegal;
//     }
// };
//
// const sanitiseGenF = (value: ATTRIBUTE) : number => {
//
// };
// const sanitiseGenF_D = (value: ATTRIBUTE) : number => {
//     const illegal = ATTRIBUTE.uv | ATTRIBUTE.normal;
//     if (value & illegal) {
//         console.debug('Can not generate vertex UVs and/or positions!');
//         value -= illegal;
//     }
// };
//
//
//
//
//
//
// export const enum FACE_INCLUDE {
//     POSITION = 0b0001_0000,
//     NORMAL   = 0b0010_0000,
//     COLOR    = 0b0011_0000_0000_0000,
// }
// export const enum VERTEX_INCLUDE {
//     UV       = 0b1000_0000,
//     NORMAL   = 0b1000_0100_0000,
//     COLOR    = 0b0111_0000_0000,
// }
//
// export const enum VERTEX_NORMAL_MODE {
//     LOAD     = 0b0000_0100_0000,
//     GATHER   = 0b1000_0000_0000,
// }
// export const enum VERTEX_COLOR_MODE {
//     LOAD     = 0b0001_0000_0000,
//     GATHER   = 0b0010_0000_0000,
//     GENERATE = 0b0100_0000_0000,
// }
// export const enum FACE_COLOR_MODE {
//     GATHER   = 0b0001_0000_0000_0000,
//     GENERATE = 0b0010_0000_0000_0000,
// }
//
// export const getShared = (flags: number) : number => flags & 0b1111;
// export const getVertexIncludes = (flags: number) : number => 1 | (
//     (
//         (
//             VERTEX_INCLUDE.NORMAL & flags
//         ) ? ATTRIBUTE.normal : 0
//     ) | (
//         (
//             VERTEX_INCLUDE.COLOR & flags
//         ) ? ATTRIBUTE.color : 0
//     ) | (
//         (
//             VERTEX_INCLUDE.UV & flags
//         ) ? ATTRIBUTE.uv : 0
//     )
// );
// export const getFaceIncludes = (flags: number) : number => (
//     (
//         (
//             FACE_INCLUDE.POSITION & flags
//         ) ? ATTRIBUTE.position : 0
//     ) | (
//         (
//             FACE_INCLUDE.NORMAL & flags
//         ) ? ATTRIBUTE.normal : 0
//     ) | (
//         (
//             FACE_INCLUDE.COLOR & flags
//         ) ? ATTRIBUTE.color : 0
//     )
// );
//
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
