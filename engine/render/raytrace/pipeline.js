import BaseRenderPipeline from "../base/pipelines.js";
import { drawPixel } from "../../core/utils.js";
import { intersectRayWithSpheres2 } from "./shaders/intersection/raySphere.js";
// import {RayHit} from "../../buffers/rays.js";
import { dir3 } from "../../accessors/direction.js";
import { pos3 } from "../../accessors/position.js";
// const ray = new Ray();
// const hit = new RayHit();
const current = dir3();
const start = dir3();
const ray_dir = dir3();
const hit_position = pos3();
const hit_normal = dir3();
export default class RayTracer extends BaseRenderPipeline {
    render(viewport) {
        let r, g, b, index = 0;
        start.setFrom(viewport.projection_plane.start);
        for (let y = 0; y < viewport.height; y++) {
            current.setFrom(start);
            for (let x = 0; x < viewport.width; x++) {
                current.normalize(ray_dir);
                if (intersectRayWithSpheres2(this.scene.spheres.radii, this.scene.spheres.centers.arrays, viewport.controller.camera.transform.translation.array, ray_dir.array, hit_position.array, hit_normal.array)) {
                    r = (hit_normal.x + 1.0) / 2.0;
                    g = (hit_normal.y + 1.0) / 2.0;
                    b = (hit_normal.z + 1.0) / 2.0;
                }
                else
                    r = g = b = 0;
                drawPixel(viewport.pixels, index++, r, g, b, 1);
                current.iadd(viewport.projection_plane.right);
            }
            start.iadd(viewport.projection_plane.down);
        }
    }
}
//# sourceMappingURL=pipeline.js.map