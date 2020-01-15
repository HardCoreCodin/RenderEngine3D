import Screen from "./screen.js";
import Camera from "./camera.js";
import RenderTarget from "./target.js";
import Scene from "../scene_graph/scene.js";
import RenderPipeline from "./pipelines.js";
import {mat3, mat4} from "../accessors/matrix.js";
import {IScene} from "../_interfaces/nodes.js";
import {IColor, IVector2D} from "../_interfaces/vectors.js";
import {ICamera, IRectangle, IRenderPipeline, IScreen, IViewport} from "../_interfaces/render.js";

export abstract class BaseViewport<
    Context extends RenderingContext,
    SceneType extends IScene<Context>,
    CameraType extends ICamera,
    RenderPipelineType extends IRenderPipeline<Context, SceneType>,
    ScreenType extends IScreen<Context, SceneType, CameraType, RenderPipelineType>>
    implements IViewport<Context>
{
    readonly world_to_view = mat4();
    readonly world_to_clip = mat4();

    constructor(
        protected _camera: CameraType,
        protected _render_pipeline: RenderPipelineType,
        protected readonly _screen: ScreenType,
        protected readonly _size: IRectangle,
        protected readonly _position: IVector2D = {x: 0, y: 0},
        protected readonly _context: Context = _screen.context as Context,
    ) {
        this.reset(_size.width, _size.height, _position.x, _position.y);
    }

    get width(): number {return this._size.width}
    get height(): number {return this._size.height}

    get x(): number {return this._position.x}
    get y(): number {return this._position.y}

    get scene(): SceneType{return this._screen.scene}
    get camera(): CameraType {return this._camera}
    set camera(camera: CameraType) {
        this._camera = camera;
        if (Object.is(this, this._screen.active_viewport))
            this._screen.controller.viewport = this;
    }

    get render_pipeline(): RenderPipelineType {return this._render_pipeline}
    set render_pipeline(render_pipeline: RenderPipelineType) {
        this._screen.unregisterViewport(this);
        this._render_pipeline = render_pipeline;
        this._screen.registerViewport(this);
    }

    refresh() {
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

        this.camera.view_frustum.aspect_ratio = width / height;
        this.updateMatrices();
    }

    updateMatrices(): void {
        this.camera.transform.matrix.invert(this.world_to_view
        ).mul(this.camera.projection_matrix, this.world_to_clip);
    }
}


export default class Viewport extends BaseViewport<CanvasRenderingContext2D, Scene, Camera, RenderPipeline, Screen> {
    readonly ndc_to_screen = mat3();
    protected _image: ImageData;
    protected _render_target: RenderTarget;

    refresh() {
        super.refresh();
        this._context.putImageData(this._image, this._position.x, this._position.y);
    }

    reset(width: number, height: number, x: number, y: number): void {
        const resized = width !== this._size.width || height !== this._size.height;
        if (resized) {
            const half_width = width / 2;
            const half_height = height / 2;

            // Scale the normalized screen to the pixel size:
            // (from normalized size of -1->1 horizontally and vertically having a width and height of 2)
            this.ndc_to_screen.scale.x = half_width;
            this.ndc_to_screen.scale.y = -half_height;
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
        if (!this._render_target)
            this._render_target = new RenderTarget(this._size);

        this._render_target.arrays[0] = new Uint32Array(this._image.data.buffer);
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