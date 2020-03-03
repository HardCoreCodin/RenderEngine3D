import {Positions3D} from "../../buffers/vectors.js";
import {FLOAT32_ALLOCATOR} from "../../memory/allocators.js";
import {Ray} from "../../buffers/rays.js";
import {intersectSpheres} from "../../render/raytrace/_core/ray_sphere_intersection.js";

export default class Spheres {
    count: number;
    radii: Float32Array;
    centers = new Positions3D();

    init(count: number) {
        this.centers.init(count);
        this.radii = FLOAT32_ALLOCATOR.allocateBuffer(count)[0];
    }

    intersect(ray: Ray): boolean {
        return intersectSpheres(
            this.radii,
            this.centers.arrays,

            ray.origin.array,
            ray.directions,
            ray.directions_offset,
            ray.closest_hit.position.array,
            ray.closest_hit.surface_normal.array
        );
    }
}