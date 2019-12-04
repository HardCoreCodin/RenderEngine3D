import Scene from "../scene_graph/scene.js";
import Viewport from "./viewport.js";

export default class RenderPipeline {
    near: number;
    far: number;

    constructor(
        public scene: Scene,
    ){}

    render(viewport: Viewport): void {
        this.near = viewport.camera.frustum.near;
        this.far = viewport.camera.frustum.far;

        for (const geometry of this.scene.geometries) {
            // Update the clip-space bounding box
            geometry.world_bounds.transform(viewport.clip_matrix, geometry.clip_bounds);

            // Only render geometries who's bounding boxes intersect the view frustum
            if (geometry.clip_bounds.in_view(this.near, this.far)) {

            }
        }
    }
}