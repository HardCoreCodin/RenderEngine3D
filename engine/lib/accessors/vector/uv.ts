import {Vector} from "./_base.js";
import {base2DFunctions} from "../../_arithmatic/vec2.js";
import {base3DFunctions} from "../../_arithmatic/vec3.js";
import {IUV2D, IUV3D} from "../../_interfaces/accessors/vector/uv.js";
import {IVector} from "../../_interfaces/accessors/vector/_base.js";

export class UV2D extends Vector implements IUV2D
{
    readonly _ = base2DFunctions;

    setTo(u: number, v: number): this {
        this._.set_to(
            this.id, this.arrays,
            u, v
        );

        return this;
    }

    set u(u: number) {this.arrays[0][this.id] = u}
    set v(v: number) {this.arrays[1][this.id] = v}

    get u(): number {return this.arrays[0][this.id]}
    get v(): number {return this.arrays[1][this.id]}
}

export class UV3D extends Vector implements IUV3D
{
    readonly _ = base3DFunctions;

    setTo(u: number, v: number, w: number): this {
        this._.set_to(
            this.id, this.arrays,
            u, v, w
        );

        return this;
    }

    set u(u: number) {this.arrays[0][this.id] = u}
    set v(v: number) {this.arrays[1][this.id] = v}
    set w(w: number) {this.arrays[2][this.id] = w}

    get u(): number {return this.arrays[0][this.id]}
    get v(): number {return this.arrays[1][this.id]}
    get w(): number {return this.arrays[2][this.id]}
}

const alloc2D = base2DFunctions.allocator;
const alloc3D = base3DFunctions.allocator;

export const uv = (
    u: number | IVector = 0,
    v: number = 0
): UV2D => typeof u === "number" ?
    new UV2D(alloc2D.allocateTemp(), alloc2D.temp_arrays).setTo(u, v) :
    new UV2D(u.id, u.arrays);

export const uvw = (
    u: number | IVector = 0,
    v: number = 0,
    w: number = 0
): UV3D => typeof u === "number" ?
    new UV3D(alloc3D.allocateTemp(), alloc3D.temp_arrays).setTo(u, v, w) :
    new UV3D(u.id, u.arrays);
