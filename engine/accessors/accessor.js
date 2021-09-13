import { approach } from "../core/utils.js";
export class Accessor {
    constructor(array) {
        this.allocator = this._getAllocator();
        this.array = array || this.allocator.allocate();
    }
    is(other) {
        return Object.is(this, other) || (Object.is(this.array, other.array));
    }
    isNonZero() {
        for (let i = 0; i < this.array.length; i++)
            if (this.array[i])
                return true;
        return false;
    }
}
export class Vector extends Accessor {
    constructor() {
        super(...arguments);
        this.on_change = null;
    }
    approach(other, by) {
        if (by) {
            for (let i = 0; i < this.array.length; i++)
                this.array[i] = approach(this.array[i], other.array[i], by);
            if (this.on_change)
                this.on_change(this);
        }
        return this;
    }
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
//# sourceMappingURL=accessor.js.map