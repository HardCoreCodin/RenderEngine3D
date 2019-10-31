import { Float32Buffer } from "./base.js";
import Direction3D from "../linalng/3D/direction.js";
import Direction4D from "../linalng/4D/direction.js";
export class Directions3D {
    constructor(count, stride = 3, buffer = new Float32Buffer(count, stride), current = new Direction3D(buffer.sub_arrays[0])) {
        this.count = count;
        this.stride = stride;
        this.buffer = buffer;
        this.current = current;
    }
    at(index, current = this.current) {
        current.buffer = this.buffer.sub_arrays[index];
        return current;
    }
}
export class Directions4D {
    constructor(count, stride = 4, buffer = new Float32Buffer(count, stride), current = new Direction4D(buffer.sub_arrays[0])) {
        this.count = count;
        this.stride = stride;
        this.buffer = buffer;
        this.current = current;
    }
    at(index, current = this.current) {
        current.buffer = this.buffer.sub_arrays[index];
        return current;
    }
}
//# sourceMappingURL=direction.js.map