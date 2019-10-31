import { Float32Buffer } from "./base.js";
import Color3D from "../linalng/3D/color.js";
import Color4D from "../linalng/4D/color.js";
//
// export type ColorComponentBuffer = Uint8Array;
// export const ColorComponentBuffer = Uint8Array;
//
// export type ColorsBuffer = Uint8Buffer;
// export const ColorsBuffer = Uint8Buffer;
export class Colors3D {
    constructor(count, stride = 3, buffer = new Float32Buffer(count, stride), current = new Color3D(buffer.sub_arrays[0])) {
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
export class Colors4D {
    constructor(count, stride = 4, buffer = new Float32Buffer(count, stride), current = new Color4D(buffer.sub_arrays[0])) {
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
//# sourceMappingURL=color.js.map