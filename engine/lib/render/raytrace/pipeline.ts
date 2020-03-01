import RayTraceViewport from "./viewport.js";
import BaseRenderPipeline from "../_base/pipelines.js";
import {RayHit} from "../../buffers/rays.js";
import {pos3} from "../../accessors/position.js";
import {dir3} from "../../accessors/direction.js";

export default class RayTracer extends BaseRenderPipeline<CanvasRenderingContext2D, RayTraceViewport>
{
    protected readonly _hit = new RayHit(pos3(), dir3());

    render(viewport: RayTraceViewport): void {
        // if (!this.scene.implicit_geometry_array.length)
        //     return;

        const pixels = viewport.pixels;
        const rays = viewport.rays;
        const ray = rays.current;
        const ray_direction = ray.direction;
        const ray_directions = rays.directions;

        const geos = this.scene.implicit_geometry_array;
        const hit = this._hit;
        const hit_normal = hit.surface_normal;

        let any_hit: boolean;
        const ray_count = ray_directions.length;

        for (let i = 0; i < ray_count; i++) {
            ray_direction.id = i;
            ray.closest_distance_squared = 10000;
            any_hit = false;

            for (const geo of geos)
                if (geo.intersect(ray, hit))
                    any_hit = true;

            if (any_hit)
                pixels[i] = (
                    255 << 24 )|(  // alpha
                    ((hit_normal.z + 1) * 127.5) << 16 )|(  // blue
                    ((hit_normal.y + 1) * 127.5) << 8  )|(  // green
                    ((hit_normal.x + 1) * 127.5)            // red
            );
        }
    }
}






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