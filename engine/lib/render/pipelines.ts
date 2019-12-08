import Scene from "../scene_graph/scene.js";
import Viewport from "./viewport.js";

export default class RenderPipeline {

    constructor(
        public scene: Scene,
        private geometries = scene.geometries
    ){}

    render(viewport: Viewport): void {
        for (const geometry of this.geometries) {
            geometry.raterizer.rasterize(viewport);


            // Only render geometries who's bounding boxes intersect the view frustum
            if (clip_space_bounds.toNDC()) {
                clip_space_vertices = geometry.clip_space.vertices.positions;

                geometry.prepWorldAndClipSpaces(world_to_clip);
                for (const clip_space_triangle of clip_space_vertices.triangles) {
                    if (clip_space_triangle.in_view) {
                        clip_space_triangle.as3D(ndc_space_triangle);
                        clip_space_triangle.toNDC(ndc_space_triangle);
                    }
                }
            }
        }
    }
}
