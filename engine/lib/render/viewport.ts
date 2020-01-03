import Camera from "./camera.js";
import RenderTarget from "./target.js";
import RenderPipeline from "./pipelines.js";
import {mat3, mat4} from "../accessors/matrix.js";
import {IVector2D} from "../_interfaces/vectors.js";
import {IRectangle, IViewport} from "../_interfaces/render.js";

export default class Viewport implements IViewport {
    readonly world_to_view = mat4();
    readonly world_to_clip = mat4();
    readonly ndc_to_screen = mat3();

    image: ImageData;
    aspect_ratio: number;
    aspect_ratio_has_changed: boolean = false;
    size_has_changed: boolean = false;
    camera_hase_moved_or_rotated: boolean = false;
    render_pipeline: RenderPipeline = new RenderPipeline();

    constructor(
        public camera: Camera,
        readonly context: CanvasRenderingContext2D,
        readonly size: IRectangle,
        readonly position: IVector2D = {x: 0, y: 0},
        readonly render_target = new RenderTarget(size)
    ) {
        this.reset(size.width, size.height, position.x, position.y);
    }

    get width(): number {return this.size.width}
    get height(): number {return this.size.height}

    reset(width: number, height: number, x: number, y: number): void {
        this.setSize(width, height);
        this.position.x = x;
        this.position.y = y;
        this.image = this.context.getImageData(x, y, width, height);
        this.render_target.reset(this.image);
    }

    refresh() {
        if (this.aspect_ratio_has_changed ||
            this.camera.frustum.has_changed) {
            this.camera.updateProjectionMatrix();
            this.aspect_ratio_has_changed = this.camera.frustum.has_changed = false;
        }

        if (this.camera_hase_moved_or_rotated) {
            this.camera.transform.matrix.invert(this.world_to_view);
            this.world_to_view.mul(this.camera.projection_matrix, this.world_to_clip);
            this.camera_hase_moved_or_rotated = false;
        }

        if (this.size_has_changed) {
            const half_width = this.size.width >> 1;
            const half_height = this.size.height >> 1;

            // Scale the normalized screen to the pixel size:
            // (from normalized size of -1->1 horizontally and vertically, so from width and height of 2)
            this.ndc_to_screen.x_axis.x = half_width;
            this.ndc_to_screen.x_axis.y = -half_height;
            // Note: HTML5 Canvas element has a coordinate system that goes top-to-bottom vertically.

            // Move the screen up and to the right appropriately,
            // such that it goes 0->width horizontally and 0->height vertically:
            this.ndc_to_screen.translation.x = half_width;
            this.ndc_to_screen.translation.y = half_height;

            // this.depth_buffer = new Float32Array(this.screen.width * this.screen.height);

            this.size_has_changed = false;
        }

        this.render_pipeline.render(this);
    }

    setSize(width: number, height: number) {
        if (width === this.size.width &&
            height === this.size.height)
            return;

        this.size_has_changed = true;

        const new_aspect_ratio = width / height;
        this.aspect_ratio_has_changed = new_aspect_ratio !== this.aspect_ratio;
        this.aspect_ratio = new_aspect_ratio;
    }

    clear() {
        this.context.clearRect(this.position.x, this.position.y, this.size.width, this.size.height);
    }
}