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
        const geos = this.scene.implicit_geometry_array;
        const hit = this._hit;
        const hit_normal = hit.surface_normal;

        let any_hit: boolean;
        const pitch = viewport.width;
        const pitch2 = pitch + pitch;
        let pixel_index = pixels.length - pitch;
        let x = 0;

        for (const ray of viewport.rays) {
            ray.closest_distance_squared = 10000;
            any_hit = false;

            for (const geo of geos)
                if (geo.intersect(ray, hit))
                    any_hit = true;

            if (any_hit)
                pixels[pixel_index] = (
                    255 << 24 )|(  // alpha
                    ((hit_normal.z + 1) * 127.5) << 16 )|(  // blue
                    ((hit_normal.y + 1) * 127.5) << 8  )|(  // green
                    ((hit_normal.x + 1) * 127.5)            // red
            );

            x++;
            if (x === pitch) {
                pixel_index -= pitch2;
                x = 0;
            }

            pixel_index++;
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