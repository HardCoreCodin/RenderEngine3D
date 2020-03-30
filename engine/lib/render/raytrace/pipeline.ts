import RayTraceViewport from "./viewport.js";
import BaseRenderPipeline from "../_base/pipelines.js";
import {drawPixel} from "../../../utils.js";
// import intersectRayWithSpheres from "./shaders/intersection/ray_sphere.js";
import {intersectSphere} from "./_core/ray_sphere_intersection.js";

export default class RayTracer extends BaseRenderPipeline<CanvasRenderingContext2D, RayTraceViewport>
{
    render(viewport: RayTraceViewport): void {
        const pixels = viewport.pixels;
        const spheres = this.scene.spheres;
        const sphere_radii = spheres.radii;
        const sphere_centers = spheres.centers.arrays;

        const rays = viewport.rays;
        const ray = rays.current;
        const count = rays.count;
        const ray_origin = ray.origin.array;
        const ray_directions = rays.directions;
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

//
// export default class RayTracer extends BaseRenderPipeline<CanvasRenderingContext2D, RayTraceViewport>
// {
//     render(viewport: RayTraceViewport): void {
//         const pixels = viewport.pixels;
//         const rays = viewport.rays;
//
//         const radii = this.scene.spheres.radii;
//         const centers = this.scene.spheres.centers.arrays;
//
//         const ray_direction = rays.current.direction.array;
//         const ray_origin = rays.current.origin.array;
//         const closest_hit_position = rays.current.closest_hit.position.array;
//         const closest_hit_normal = rays.current.closest_hit.surface_normal.array;
//
//         let r, g, b, a = 1;
//
//         for (const ray of rays) {
//             if (intersectRayWithSpheres(
//                 radii,
//                 centers,
//
//                 ray_origin,
//                 ray_direction,
//                 closest_hit_position,
//                 closest_hit_normal
//             )) {
//                 r = (closest_hit_normal[0] + 1.0) / 2.0;
//                 g = (closest_hit_normal[1] + 1.0) / 2.0;
//                 b = (closest_hit_normal[2] + 1.0) / 2.0;
//             } else r = g = b = 0;
//
//             drawPixel(pixels, ray.index, r, g, b, a);
//         }
//     }
// }