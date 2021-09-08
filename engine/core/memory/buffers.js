export default class Buffer {
    constructor() {
        this.arrays = [];
        this.allocator = this._getAllocator();
    }
    get length() {
        return this._length;
    }
    init(length, array, arrays) {
        this._length = length;
        if (array && arrays) {
            this.array = array;
            this.arrays = arrays;
        }
        else
            [
                this.array,
                this.arrays
            ] = this.allocator.allocateBuffer(length);
        return this;
    }
}
//# sourceMappingURL=buffers.js.map