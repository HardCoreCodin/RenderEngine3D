import { U32_4D_ALLOCATOR } from "../memory/allocators.js";
export class Accessor {
    constructor(array) {
        this.allocator = this._getAllocator();
        this.array = array || this.allocator.allocate();
    }
    is(other) {
        return Object.is(this, other) || (Object.is(this.array, other.array));
    }
}
export class Vector extends Accessor {
}
export class Flags extends Accessor {
    anySet(test_flag) {
        for (const flag of this.array)
            if (flag & test_flag)
                return true;
        return false;
    }
    allSet(test_flag) {
        for (const flag of this.array)
            if (!(flag & test_flag))
                return false;
        return true;
    }
    setTo(...values) {
        let index = 0;
        for (const value of values)
            this.array[index++] = value;
        return this;
    }
    setAllTo(value) {
        this.array.fill(value);
        return this;
    }
    setFrom(other) {
        this.array.set(other.array);
        return this;
    }
    equals(other) {
        for (let i = 0; i < this.allocator.dim; i++)
            if (this.array[i] !== other.array[i])
                return false;
        return true;
    }
}
export class InterpolationVertexIndices extends Accessor {
    _getAllocator() { return U32_4D_ALLOCATOR; }
    get src1() { return this.array[0]; }
    get trg1() { return this.array[1]; }
    get src2() { return this.array[2]; }
    get teg2() { return this.array[3]; }
    set src1(index) { this.array[0] = index; }
    set trg1(index) { this.array[1] = index; }
    set src2(index) { this.array[2] = index; }
    set teg2(index) { this.array[3] = index; }
    copy(out = new InterpolationVertexIndices()) {
        return out.setFrom(this);
    }
    setTo(...values) {
        let index = 0;
        for (const value of values)
            this.array[index++] = value;
        return this;
    }
    setAllTo(value) {
        this.array.fill(value);
        return this;
    }
    setFrom(other) {
        this.array.set(other.array);
        return this;
    }
    equals(other) {
        for (let i = 0; i < this.allocator.dim; i++)
            if (this.array[i] !== other.array[i])
                return false;
        return true;
    }
}
//# sourceMappingURL=accessor.js.map