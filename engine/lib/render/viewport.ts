import Camera from "./camera.js";
import RenderTarget from "./target.js";
import {mat3, mat4} from "../accessors/matrix.js";
import {IColor, IVector2D} from "../_interfaces/vectors.js";
import {IRectangle, IRenderPipeline, IViewport} from "../_interfaces/render.js";
import RenderPipeline from "./pipelines.js";

export abstract class BaseViewport<Context extends RenderingContext> implements IViewport<Context> {
    readonly world_to_view = mat4();
    readonly world_to_clip = mat4();

    camera_has_moved_or_rotated: boolean = false;
    abstract render_pipeline: IRenderPipeline<Context>;

    constructor(
        protected readonly _context: Context,
        public camera: Camera,
        protected readonly _size: IRectangle,
        protected readonly _position: IVector2D = {x: 0, y: 0}
    ) {
        this.reset(_size.width, _size.height, _position.x, _position.y);
    }

    get width(): number {return this._size.width}
    get height(): number {return this._size.height}
    get x(): number {return this._position.x}
    get y(): number {return this._position.y}

    refresh() {
        if (this.camera_has_moved_or_rotated) {
            this.camera.transform.matrix.invert(this.world_to_view);
            this.world_to_view.mul(this.camera.projection_matrix, this.world_to_clip);
            this.camera_has_moved_or_rotated = false;
        }

        this.render_pipeline.render(this);
    }

    scale(x: number, y: number): void {
        this.reset(
            this._size.width * x,
            this._size.height * y,
            this._position.x * x,
            this._position.y * y
        );
    }

    reset(width: number, height: number, x: number, y: number): void {
        this._size.width = width;
        this._size.height = height;
        this._position.x = x;
        this._position.y = y;

        this.camera.aspect_ratio = width / height;
    }
}

export default class Viewport extends BaseViewport<CanvasRenderingContext2D> {
    readonly ndc_to_screen = mat3();
    private _image: ImageData;

    render_pipeline = new RenderPipeline();

    constructor(
        context: CanvasRenderingContext2D,
        camera: Camera,
        size: IRectangle,
        position: IVector2D = {x: 0, y: 0},
        readonly render_target = new RenderTarget(size)
    ) {
        super(context, camera, size, position);
        this._resetRenderTarget();
    }

    refresh() {
        super.refresh();
        this._context.putImageData(this._image, this._position.x, this._position.y);
    }

    reset(width: number, height: number, x: number, y: number): void {
        const resized = width !== this._size.width || height !== this._size.height;
        if (resized) {
            const half_width = width >> 1;
            const half_height = height >> 1;

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
        }

        if (resized || x !== this._position.x || y !== this._position.y) {
            super.reset(width, height, x, y);
            this._resetRenderTarget();
        }
    }

    private _resetRenderTarget(): void {
        this._image = this._context.getImageData(
            this._position.x,
            this._position.y,

            this._size.width,
            this._size.height
        );
        this.render_target.arrays[0] = new Uint32Array(this._image.data.buffer);
    }

    drawTriangle(v1: IVector2D, v2: IVector2D, v3: IVector2D, color: IColor) {
        this._context.beginPath();

        this._context.moveTo(v1.x, v1.y);
        this._context.lineTo(v2.x, v2.y);
        this._context.lineTo(v3.x, v3.y);
        // this.context.lineTo(v1.x, v1.y);
        this._context.closePath();

        this._context.strokeStyle = `${color}`;
        this._context.stroke();
    }

    fillTriangle(v1: IVector2D, v2: IVector2D, v3: IVector2D, color: IColor) {
        this._context.beginPath();

        this._context.moveTo(v1.x, v1.y);
        this._context.lineTo(v2.x, v2.y);
        this._context.lineTo(v3.x, v3.y);

        this._context.closePath();

        this._context.fillStyle = `${color}`;
        this._context.fill();
    }
}