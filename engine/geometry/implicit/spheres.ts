import {Positions3D} from "../../buffers/vectors.js";
import {FLOAT32_ALLOCATOR} from "../../core/memory/allocators.js";

export default class Spheres {
    count: number;
    radii: Float32Array;
    centers = new Positions3D();

    init(count: number) {
        this.centers.init(count);
        this.radii = FLOAT32_ALLOCATOR.allocateBuffer(count)[0];
    }
}