import Camera from "./camera.js";
import RenderTarget from "./target.js";
import RenderPipeline from "./pipelines.js";
import {mat4} from "../accessors/matrix.js";
import {IVector2D} from "../_interfaces/vectors.js";
import {IRectangle, IViewport} from "../_interfaces/render.js";

export default class Viewport
    implements IViewport
{
    readonly view_matrix = mat4();
    readonly clip_matrix = mat4();
    readonly screen_matrix = mat4();

    aspect_ratio: number;
    aspect_ratio_has_changed: boolean = false;
    size_has_changed: boolean = false;
    camera_hase_moved_or_rotated: boolean = false;

    constructor(
        public camera: Camera,

        private size: IRectangle,
        public position: IVector2D = {x: 0, y: 0},
        pixels?: Uint32Array,

        private readonly render_target = new RenderTarget(size, pixels)
    ) {
        camera.viewport = this;
    }

    reset(pixels: Uint32Array, width: number, height: number, x: number, y: number): void {
        this.setSize(width, height);

        this.position.x = x;
        this.position.y = y;

        this.render_target.reset(pixels);
    }

    refresh(render_pipeline: RenderPipeline) {
        if (this.aspect_ratio_has_changed ||
            this.camera.frustum.has_changed) {
            this.camera.updateProjectionMatrix();
            this.aspect_ratio_has_changed = this.camera.frustum.has_changed = false;
        }

        if (this.camera_hase_moved_or_rotated) {
            this.camera.transform.matrix.inverted(this.view_matrix);
            this.view_matrix.times(this.camera.projection_matrix, this.clip_matrix);
            this.camera_hase_moved_or_rotated = false;
        }

        if (this.size_has_changed) {
            this.screen_matrix.i.x = this.screen_matrix.pos3.x = this.size.width * 0.5;
            this.screen_matrix.j.y = this.screen_matrix.pos3.y = this.size.height * 0.5;
            this.screen_matrix.j.y *= -1;
            // this.depth_buffer = new Float32Array(this.screen.width * this.screen.height);
            this.size_has_changed = false;
        }

        render_pipeline.render(this);
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

    get width(): number {
        return this.size.width;
    }

    get height(): number {
        return this.size.height;
    }
}