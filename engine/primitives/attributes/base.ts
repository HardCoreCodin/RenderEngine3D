// import {ATTRIBUTE, DIM} from "../../constants.js";
// import {Values} from "../../types.js";
// import {float} from "../../factories.js";
// import {randomize} from "./generate.js";
// import {AttributeInputs} from "./input.js";
//
// export class BaseAttribute {
//     public readonly name: string;
//     public readonly id: ATTRIBUTE;
//     public readonly dim: DIM = DIM._3D;
//
//     public readonly values: Values;
//     public is_loaded: boolean = false;
//
//     constructor(length: number) {
//         this.values = float(length, this.dim)
//     }
//
//     protected _load(inputs: AttributeInputs): void {
//         if (inputs === null)
//             throw `${this.name}s could not be loaded, as there are no inputs!`;
//
//         for (const [component_num, component_values] of this.values.entries())
//             component_values.set(inputs.vertices[component_num]);
//
//         this.is_loaded = true;
//     }
//
//     protected _generate() : void {
//         randomize(this.values);
//
//         this.is_loaded = true;
//     }
// }
//
// export interface ILoad {
//     load(...args: any[]): void;
// }
//
// export interface IGather {
//     gatherFrom(...args: any[]): void;
// }
//
// export interface IGenerate {
//     generate(...args: any[]): void;
// }