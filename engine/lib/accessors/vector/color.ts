import {Vector} from "./_base.js";
import {base3DFunctions} from "../../_arithmatic/vec3.js";
import {base4DFunctions} from "../../_arithmatic/vec4.js";
import {IColor3D, IColor4D} from "../../_interfaces/accessors/vector/color.js";
import {IVector} from "../../_interfaces/accessors/vector/_base.js";

export class Color3D extends Vector implements IColor3D
{
    readonly _ = base3DFunctions;

    setTo(r: number, g: number, b: number): this {
        this._.set_to(
            this.id, this.arrays,
            r, g, b
        );

        return this;
    }

    get r(): number {return this.arrays[0][this.id]}
    get g(): number {return this.arrays[1][this.id]}
    get b(): number {return this.arrays[2][this.id]}

    set r(r: number) {this.arrays[0][this.id] = r}
    set g(g: number) {this.arrays[1][this.id] = g}
    set b(b: number) {this.arrays[2][this.id] = b}
}

export class Color4D extends Vector implements IColor4D
{
    readonly _ = base4DFunctions;

    setTo(r: number, g: number, b: number, a: number): this {
        this._.set_to(
            this.id, this.arrays,
            r, g, b, a
        );

        return this;
    }

    get r(): number {return this.arrays[0][this.id]}
    get g(): number {return this.arrays[1][this.id]}
    get b(): number {return this.arrays[2][this.id]}
    get a(): number {return this.arrays[3][this.id]}

    set r(r: number) {this.arrays[0][this.id] = r}
    set g(g: number) {this.arrays[1][this.id] = g}
    set b(b: number) {this.arrays[2][this.id] = b}
    set a(a: number) {this.arrays[3][this.id] = a}
}

const alloc3D = base3DFunctions.allocator;
const alloc4D = base4DFunctions.allocator;

export const rgb = (
    r: number | IVector = 0,
    g: number = 0,
    b: number = 0
): Color3D => typeof r === "number" ?
    new Color3D(alloc3D.allocateTemp(), alloc3D.temp_arrays).setTo(r, g, b) :
    new Color3D(r.id, r.arrays);

export const rgba = (
    r: number | IVector = 0,
    g: number = 0,
    b: number = 0,
    a: number = 0
): Color4D => typeof r === "number" ?
    new Color4D(alloc4D.allocateTemp(), alloc4D.temp_arrays).setTo(r, g, b, a) :
    new Color4D(r.id, r.arrays);