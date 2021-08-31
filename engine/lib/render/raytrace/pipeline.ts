import RayTraceViewport from "./viewport.js";
import BaseRenderPipeline from "../_base/pipelines.js";
import {drawPixel} from "../../../utils.js";
import intersectRayWithSpheres, {intersectRayWithSpheres1} from "./shaders/intersection/ray_sphere.js";

export default class RayTracer extends BaseRenderPipeline<CanvasRenderingContext2D, RayTraceViewport>
{
    render(viewport: RayTraceViewport): void {
        const pixels = viewport.pixels;
        const spheres = this.scene.spheres;
        const radii = spheres.radii;
        const centers = spheres.centers.array;

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

        let raydir_x, raydir_y, raydir_z: number;
        let offset = 0;

        for (let index = 0; index < count; index++) {
            raydir_x = ray_directions[offset++];
            raydir_y = ray_directions[offset++];
            raydir_z = ray_directions[offset++];
            if (intersectRayWithSpheres1(
                radii, centers,
                origin_x, origin_y, origin_z,
                raydir_x, raydir_y, raydir_z,
                hit_position, hit_normal
            )) {
                r = (hit_normal[0] + 1.0) / 2.0;
                g = (hit_normal[1] + 1.0) / 2.0;
                b = (hit_normal[2] + 1.0) / 2.0;
            } else r = g = b = 0;

            drawPixel(pixels, index, r, g, b, a);
        }
    }

    render1(viewport: RayTraceViewport): void {
        const pixels = viewport.pixels;
        const spheres = this.scene.spheres;
        const radii = spheres.radii;
        const centers = spheres.centers.array;

        const rays = viewport.rays;
        const ray = rays.current;
        const count = rays.count;
        const ray_origin = ray.origin.array;
        const ray_directions = rays.directions;
        const hit = ray.closest_hit;
        const hit_position = hit.position.array;
        const hit_normal = hit.surface_normal.array;
        let r, g, b, a = 1;

        let offset = 0;

        for (let index = 0; index < count; index++) {
            if (intersectRayWithSpheres(
                radii, centers,
                ray_origin,
                ray_directions, offset,
                hit_position, hit_normal
            )) {
                r = (hit_normal[0] + 1.0) / 2.0;
                g = (hit_normal[1] + 1.0) / 2.0;
                b = (hit_normal[2] + 1.0) / 2.0;
            } else r = g = b = 0;
            offset +=3 ;
            drawPixel(pixels, index, r, g, b, a);
        }
    }
}