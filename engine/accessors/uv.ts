import Vector2D from "./vector2D.js";
import Vector3D from "./vector3D.js";
import {IUV2D, IUV3D} from "../core/interfaces/vectors.js";
import {VECTOR_2D_ALLOCATOR, VECTOR_3D_ALLOCATOR} from "../core/memory/allocators.js";

export class UV2D extends Vector2D<Float32Array, UV2D> implements IUV2D
{
    protected _getAllocator() {return VECTOR_2D_ALLOCATOR}

    setTo(u: number, v: number): this {return super.setTo(u, v)}
    copy(out: UV2D = new UV2D()): UV2D {return out.setFrom(this)}

    set u(u: number) {this.array[0] = u}
    set v(v: number) {this.array[1] = v}

    get u(): number {return this.array[0]}
    get v(): number {return this.array[1]}
}

export class UV3D extends Vector3D<Float32Array, UV3D> implements IUV3D
{
    protected _getAllocator() {return VECTOR_3D_ALLOCATOR}

    setTo(u: number, v: number, w: number): this {return super.setTo(u, v, w)}
    copy(out: UV3D = new UV3D()): UV3D {return out.setFrom(this)}

    set u(u: number) {this.array[0] = u}
    set v(v: number) {this.array[1] = v}
    set w(w: number) {this.array[2] = w}

    get u(): number {return this.array[0]}
    get v(): number {return this.array[1]}
    get w(): number {return this.array[2]}

    get uv(): UV2D {return new UV2D(this.array.subarray(0, 2))}
    get vw(): UV2D {return new UV2D(this.array.subarray(1, 3))}

    set uv(other: UV2D) {this.array.set(other.array)}
    set vw(other: UV2D) {this.array.set(other.array, 1)}
}

export const uv = (
    u: number = 0,
    v: number = u
): UV2D => new UV2D().setTo(u, v);

export const uvw = (
    u: number = 0,
    v: number = u,
    w: number = u
): UV3D => new UV3D().setTo(u, v, w);