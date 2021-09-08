import { Positions3D } from "../../buffers/vectors.js";
import { FLOAT32_ALLOCATOR } from "../../core/memory/allocators.js";
export default class Spheres {
    constructor() {
        this.centers = new Positions3D();
    }
    init(count) {
        this.centers.init(count);
        this.radii = FLOAT32_ALLOCATOR.allocateBuffer(count)[0];
    }
}
//# sourceMappingURL=spheres.js.map