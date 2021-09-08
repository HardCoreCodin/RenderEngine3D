import Buffer from "../core/memory/buffers.js";
import {Flags, InterpolationVertexIndices} from "../accessors/accessor.js";
import {Flags1D, Flags2D, Flags3D} from "../accessors/flags.js";
import {FlagsConstructor} from "../core/interfaces/flags.js";
import {FLAGS_1D_ALLOCATOR, FLAGS_2D_ALLOCATOR, FLAGS_3D_ALLOCATOR, U32_4D_ALLOCATOR} from "../core/memory/allocators.js";

export abstract class FlagsBuffer<FlagsType extends Flags> extends Buffer<Uint8Array> {
    current: FlagsType;

    constructor(protected readonly Flags: FlagsConstructor<FlagsType>) {super()}

    init(length: number, array?: Uint8Array, arrays?: Uint8Array[]): this {
        super.init(length, array, arrays);
        this._post_init();
        return this;
    }

    protected _post_init(): void {
        this.current = new this.Flags(this.arrays[0]);
    }

    * [Symbol.iterator](): Generator<FlagsType> {
        for (const array of this.arrays) {
            this.current.array = array;
            yield this.current;
        }
    }

    setFrom<OtherFlagsType extends Flags>(other: FlagsBuffer<OtherFlagsType>): this {
        this.array.set(other.array);
        return this;
    }
}

export class FlagsBuffer1D extends FlagsBuffer<Flags1D> { protected  _getAllocator() {return FLAGS_1D_ALLOCATOR} constructor() {super(Flags1D)}}
export class FlagsBuffer2D extends FlagsBuffer<Flags2D> { protected  _getAllocator() {return FLAGS_2D_ALLOCATOR} constructor() {super(Flags2D)}}
export class FlagsBuffer3D extends FlagsBuffer<Flags3D> { protected  _getAllocator() {return FLAGS_3D_ALLOCATOR} constructor() {super(Flags3D)}}

export class InterpolationVertexIndicesBuffer extends Buffer<Uint32Array> {
    current: InterpolationVertexIndices;

    protected  _getAllocator() {
        return U32_4D_ALLOCATOR;
    }

    init(length: number, array?: Uint32Array, arrays?: Uint32Array[]): this {
        super.init(length, array, arrays);
        this._post_init();
        return this;
    }

    protected _post_init(): void {
        this.current = new InterpolationVertexIndices(this.arrays[0]);
    }

    * [Symbol.iterator](): Generator<InterpolationVertexIndices> {
        for (const array of this.arrays) {
            this.current.array = array;
            yield this.current;
        }
    }

    setFrom<OtherFlagsType extends Flags>(other: FlagsBuffer<OtherFlagsType>): this {
        this.array.set(other.array);
        return this;
    }
}
