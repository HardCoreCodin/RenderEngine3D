import RayTraceViewport from "./viewport.js";
import BaseRenderPipeline from "../_base/pipelines.js";
import {drawPixel} from "../../../utils.js";
import {intersectSphere, intersectSpheres} from "./_core/ray_sphere_intersection.js";

export default class RayTracer extends BaseRenderPipeline<CanvasRenderingContext2D, RayTraceViewport>
{
    render(viewport: RayTraceViewport): void {
        const pixels = viewport.pixels;
        const spheres = this.scene.spheres;
        const sphere_radii = spheres.radii;
        const sphere_centers = spheres.centers.arrays;
        const sphere_count = spheres.count;

        const rays = viewport.rays;
        const ray = rays.current;
        const count = rays.count;
        const ray_origin = ray.origin.array;
        const ray_directions = ray.directions;
        const origin_x = ray_origin[0];
        const origin_y = ray_origin[1];
        const origin_z = ray_origin[2];
        const hit = ray.closest_hit;
        const hit_position = hit.position.array;
        const hit_normal = hit.surface_normal.array;
        let r, g, b, a = 1;

        let any_hit: boolean;
        let distance, closest_distance, raydir_x, raydir_y, raydir_z: number;
        let offset = 0;
        let sphere_index: number;
        let sphere_center: Float32Array;

        for (let index = 0; index < count; index++) {
            raydir_x = ray_directions[offset++];
            raydir_y = ray_directions[offset++];
            raydir_z = ray_directions[offset++];

            any_hit = false;
            closest_distance = Infinity;
            for ([sphere_index, sphere_center] of sphere_centers.entries()) {
                distance = intersectSphere(
                    sphere_radii[sphere_index],
                    closest_distance,

                    sphere_center[0],
                    sphere_center[1],
                    sphere_center[2],

                    origin_x,
                    origin_y,
                    origin_z,

                    raydir_x,
                    raydir_y,
                    raydir_z,

                    hit_position,
                    hit_normal
                );

                if (distance) {
                    closest_distance = distance;
                    any_hit = true;
                }
            }

            // any_hit = intersectSpheres(
            //     sphere_radii,
            //     sphere_centers,
            //
            //     ray_origin,
            //     ray_directions,
            //
            //     offset,
            //     hit_position,
            //     hit_normal
            // );
            if (any_hit) {
                r = (hit_normal[0] + 1.0) / 2.0;
                g = (hit_normal[1] + 1.0) / 2.0;
                b = (hit_normal[2] + 1.0) / 2.0;
            } else
                r = g = b = 0;

            drawPixel(pixels, index, r, g, b, a);
            // offset += 3;
        }
    }
}



// import RayTraceViewport from "./viewport.js";
// import BaseRenderPipeline from "../_base/pipelines.js";
// import {RayHit} from "../../buffers/rays.js";
// import {pos3} from "../../accessors/position.js";
// import {dir3} from "../../accessors/direction.js";
//
// export default class RayTracer extends BaseRenderPipeline<CanvasRenderingContext2D, RayTraceViewport>
// {
//     protected readonly _hit = new RayHit(pos3(), dir3());
//
//     render(viewport: RayTraceViewport): void {
//         // if (!this.scene.implicit_geometry_array.length)
//         //     return;
//
//         const pixel_count = viewport.pixel_count;
//         const pixels = viewport.pixels;
//         const geos = this.scene.implicit_geometry_array;
//         const hit = this._hit;
//         const hit_normal = hit.surface_normal;
//         const ray = viewport.rays.current;
//         const ray_directions = viewport.rays.directions.arrays;
//         let any_hit: boolean;
//
//         for (const [i, ray_direction_array] of ray_directions.entries()) {
//             if (i === pixel_count)
//                 break;
//
//             ray.closest_distance_squared = 10000;
//             ray.direction.array = ray_direction_array;
//             any_hit = false;
//
//             for (const geo of geos) {
//                 if (geo.intersect(ray, hit))
//                     any_hit = true;
//             }
//
//             if (any_hit) pixels[i] = (
//                 255 << 24 )|(  // alpha
//                 ((hit_normal.z + 1) * 127.5) << 16 )|(  // blue
//                 ((hit_normal.y + 1) * 127.5) << 8  )|(  // green
//                 ((hit_normal.x + 1) * 127.5)            // red
//             );
//         }
//     }
// }
//






// hit_mask: Uint8Array;
// hits: Array<RayHit>;
//
// protected _reset_hits(): void {
//     const length = this.scene.implicit_geometries.count;
//     if (length !== this.hits.length) {
//
//     }
// }
//
// on_implicit_geometry_added(geo: ImplicitGeometry) {this._reset_hits()}
// on_implicit_geometry_removed(geo: ImplicitGeometry) {this._reset_hits()}