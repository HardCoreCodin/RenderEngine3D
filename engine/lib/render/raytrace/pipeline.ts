import RayTraceViewport from "./viewport.js";
import BaseRenderPipeline from "../_base/pipelines.js";
import {RayHit} from "../../buffers/rays.js";
import {pos3} from "../../accessors/position.js";
import {dir3} from "../../accessors/direction.js";

const MAX_DISTANCE = Number.MAX_SAFE_INTEGER;

export default class RayTracer extends BaseRenderPipeline<CanvasRenderingContext2D, RayTraceViewport>
{
    protected readonly _closest_normal = dir3();
    protected readonly _hit = new RayHit(pos3(), dir3());

    render(viewport: RayTraceViewport): void {
        if (!this.scene.implicit_geometries.count)
            return;

        const hit = this._hit;
        const closest_normal = this._closest_normal;
        const hit_normal = hit.surface_normal;

        let any_hit: boolean;

        const render_target = viewport.render_target;
        render_target.clear();

        for (const ray of viewport.rays) {
            ray.closest_distance_squared = MAX_DISTANCE;
            any_hit = false;

            for (const geo of this.scene.implicit_geometries)
                if (geo.intersect(ray, hit))
                    any_hit = true;

            if (any_hit) {
                closest_normal.setFrom(hit_normal).iadd(1).idiv(2);
                render_target.putPixel(ray.pixel_index,
                    closest_normal.x,
                    closest_normal.y,
                    closest_normal.z
                );
            }
        }

        render_target.draw();
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