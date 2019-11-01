import { Float32Buffer } from "./base.js";
import Position3D from "../linalng/3D/position.js";
import Position4D from "../linalng/4D/position.js";
export class Positions3D {
    constructor(count, stride = 3, buffer = new Float32Buffer(count, stride), current = new Position3D(buffer.sub_arrays[0])) {
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
export class Positions4D {
    constructor(count, stride = 4, buffer = new Float32Buffer(count, stride), current = new Position4D(buffer.sub_arrays[0])) {
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
//# sourceMappingURL=position.js.map