import RayTraceViewport from "./viewport.js";
import BaseRenderPipeline from "../base/pipelines.js";
import {drawPixel} from "../../core/utils.js";
import {intersectRayWithSpheres2} from "./shaders/intersection/raySphere.js";
// import {RayHit} from "../../buffers/rays.js";
import {dir3} from "../../accessors/direction.js";
import {pos3} from "../../accessors/position.js";

// const ray = new Ray();
// const hit = new RayHit();
const current = dir3();
const start = dir3();
const ray_dir = dir3();
const hit_position = pos3();
const hit_normal = dir3();

export default class RayTracer extends BaseRenderPipeline<CanvasRenderingContext2D, RayTraceViewport>
{
    render(viewport: RayTraceViewport): void {
        let r, g, b, index = 0;

        start.setFrom(viewport.projection_plane.start);
        for (let y: number = 0; y < viewport.height; y++) {
            current.setFrom(start);
            for (let x: number = 0; x < viewport.width; x++) {
                current.normalize(ray_dir);
                if (intersectRayWithSpheres2(
                    this.scene.spheres.radii,
                    this.scene.spheres.centers.arrays,
                    viewport.controller.camera.transform.translation.array,
                    ray_dir.array,
                    hit_position.array,
                    hit_normal.array
                )) {
                    r = (hit_normal.x + 1.0) / 2.0;
                    g = (hit_normal.y + 1.0) / 2.0;
                    b = (hit_normal.z + 1.0) / 2.0;
                } else r = g = b = 0;

                drawPixel(viewport.pixels, index++, r, g, b, 1);

                current.iadd(viewport.projection_plane.right);
            }
            start.iadd(viewport.projection_plane.down);
        }
    }

    // render2(viewport: RayTraceViewport): void {
    //     const spheres = this.scene.spheres;
    //     const radii = spheres.radii;
    //     const centers = spheres.centers.arrays;
    //     const origin_x = viewport.controller.camera.transform.translation.x;
    //     const origin_y = viewport.controller.camera.transform.translation.y;
    //     const origin_z = viewport.controller.camera.transform.translation.z;
    //     const hit_position = hit.position.array;
    //     const hit_normal = hit.surface_normal.array;
    //     let r, g, b, one_over_len, ray_dir_x, ray_dir_y, ray_dir_z, index = 0;
    //
    //     start.setFrom(viewport.projection_plane.start);
    //     for (let y: number = 0; y < viewport.height; y++) {
    //         current.setFrom(start);
    //         for (let x: number = 0; x < viewport.width; x++) {
    //             one_over_len = 1 / current.length;
    //             ray_dir_x = one_over_len * current.x;
    //             ray_dir_y = one_over_len * current.y;
    //             ray_dir_z = one_over_len * current.z;
    //
    //             if (intersectRayWithSpheres1(
    //                 radii, centers,
    //                 origin_x, origin_y, origin_z,
    //                 ray_dir_x, ray_dir_y, ray_dir_z,
    //                 hit_position, hit_normal
    //             )) {
    //                 r = (hit_normal[0] + 1.0) / 2.0;
    //                 g = (hit_normal[1] + 1.0) / 2.0;
    //                 b = (hit_normal[2] + 1.0) / 2.0;
    //             } else r = g = b = 0;
    //
    //             drawPixel(viewport.pixels, index++, r, g, b, 1);
    //
    //             current.iadd(viewport.projection_plane.right);
    //         }
    //         start.iadd(viewport.projection_plane.down);
    //     }
    // }
}