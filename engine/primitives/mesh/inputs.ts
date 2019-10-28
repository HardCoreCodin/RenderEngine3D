// import {ColorInputs, NormalInputs, PositionInputs, UVInputs} from "../attributes/input.js";
// import {ATTRIBUTE} from "../../constants.js";
//
// export class MeshInputs {
//     constructor(
//         public readonly includes: ATTRIBUTE = ATTRIBUTE.position,
//         public position: PositionInputs = new PositionInputs(),
//         public normal: NormalInputs | null = ATTRIBUTE.position & includes ? new PositionInputs() : null,
//         public color: ColorInputs | null = ATTRIBUTE.normal & includes ? new ColorInputs() : null,
//         public uv: UVInputs | null = ATTRIBUTE.uv & includes ? new UVInputs() : null
//     ) {}
// }