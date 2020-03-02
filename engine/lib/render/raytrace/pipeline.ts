import RayTraceViewport from "./viewport.js";
import BaseRenderPipeline from "../_base/pipelines.js";
import {RayHit} from "../../buffers/rays.js";
import {pos3} from "../../accessors/position.js";
import {dir3} from "../../accessors/direction.js";
import {drawPixel} from "../../../utils.js";

export default class RayTracer extends BaseRenderPipeline<CanvasRenderingContext2D, RayTraceViewport>
{
    protected readonly _hit = new RayHit(pos3(), dir3());

    render(viewport: RayTraceViewport): void {
        // if (!this.scene.implicit_geometry_array.length)
        //     return;

        const pixel_count = viewport.pixel_count;
        const pixels = viewport.pixels;
        const geos = this.scene.implicit_geometry_array;
        const hit = this._hit;
        const hit_normal = hit.surface_normal.array;
        const ray = viewport.ray;
        ray.direction_offset = 0;
        let any_hit: boolean;

        let r, g, b, a = 1;

        for (let i = 0; i < pixel_count; i++) {
            ray.closest_distance_squared = 10000;
            any_hit = false;

            for (const geo of geos) {
                if (geo.intersect(ray, hit))
                    any_hit = true;
            }

            if (any_hit) {
                r = (hit_normal[0] + 1.0) / 2.0;
                g = (hit_normal[1] + 1.0) / 2.0;
                b = (hit_normal[2] + 1.0) / 2.0;
            } else r = g = b = 0;

            drawPixel(pixels, i, r, g, b, a);

            ray.direction_offset += 3;
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