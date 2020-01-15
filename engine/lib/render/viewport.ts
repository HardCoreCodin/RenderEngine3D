import Screen from "./screen.js";
import Camera from "./camera.js";
import RenderTarget from "./target.js";
import Scene from "../scene_graph/scene.js";
import RenderPipeline from "./pipelines.js";
import {mat3, mat4} from "../accessors/matrix.js";
import {IScene} from "../_interfaces/nodes.js";
import {IColor, IVector2D} from "../_interfaces/vectors.js";
import {ICamera, IRectangle, IRenderPipeline, IScreen, IViewport} from "../_interfaces/render.js";
import {IController} from "../_interfaces/input.js";

export abstract class BaseViewport<
    Context extends RenderingContext,
    CameraType extends ICamera,
    SceneType extends IScene<Context, CameraType>,
    RenderPipelineType extends IRenderPipeline<Context, SceneType>,
    ScreenType extends IScreen<Context, CameraType, SceneType, RenderPipelineType>>
    implements IViewport<Context>
{
    readonly world_to_view = mat4();
    readonly world_to_clip = mat4();

    protected abstract _pre_render(): void;
    protected abstract _post_render(): void;

    constructor(
        protected _camera: CameraType,
        protected _render_pipeline: RenderPipelineType,
        protected _controller: IController,
        protected readonly _screen: ScreenType,
        protected readonly _size: IRectangle,
        protected readonly _position: IVector2D = {x: 0, y: 0},
        protected readonly _context: Context = _screen.context as Context
    ) {
        this.reset(_size.width, _size.height, _position.x, _position.y);
        this._controller.viewport = this;
    }

    setFrom(other: this): void {
        this._position.x = other._position.x;
        this._position.y = other._position.y;
        this._size.width = other._size.width;
        this._size.height = other._size.height;
        this._render_pipeline = other._render_pipeline;
        this._camera.setFrom(other._camera);
        this.world_to_clip.setFrom(other.world_to_clip);
        this.world_to_view.setFrom(other.world_to_view);
    }

    get controller(): IController {return this._controller};
    set controller(constroller: IController) {
        constroller.viewport = this;
        this._controller = constroller;
    }

    get width(): number {return this._size.width}
    get height(): number {return this._size.height}

    get x(): number {return this._position.x}
    get y(): number {return this._position.y}

    set x(x: number) {this.reset(this._size.width, this._size.height, x, this._position.y)}
    set y(y: number) {this.reset(this._size.width, this._size.height, this._position.x, y)}

    set width(width: number) {this.reset(width, this._size.height, this._position.x, this._position.y)}
    set height(height: number) {this.reset(this._size.width, height, this._position.x, this._position.y)}

    get scene(): SceneType{return this._screen.scene}
    get camera(): CameraType {return this._camera}
    set camera(camera: CameraType) {this._camera = camera}

    get render_pipeline(): RenderPipelineType {return this._render_pipeline}
    set render_pipeline(render_pipeline: RenderPipelineType) {
        this._screen.unregisterViewport(this);
        this._render_pipeline = render_pipeline;
        this._screen.registerViewport(this);
    }

    refresh() {
        this._pre_render();
        this.render_pipeline.render(this);
        this._post_render();
    }

    reset(
        width: number = this._size.width,
        height: number = this._size.height,
        x: number = this._position.x,
        y: number = this._position.y
    ): void {
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

    is_inside(x: number, y: number): boolean {
        return (
            x >= this._position.x && x < this._position.x + this._size.width &&
            y >= this._position.y && y < this._position.y + this._size.height
        );
    }
}


export default class Viewport extends BaseViewport<CanvasRenderingContext2D, Camera, Scene, RenderPipeline, Screen> {
    readonly ndc_to_screen = mat3();
    protected _image: ImageData;
    protected _render_target: RenderTarget;

    protected _pre_render(): void {
        this._context.clearRect(this._position.x, this._position.y, this._size.width, this._size.height);
    }

    protected _post_render(): void {
        this._context.putImageData(this._image, this._position.x, this._position.y);
    }

    reset(width: number, height: number, x: number, y: number): void {
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

        this._resetRenderTarget();
        super.reset(width, height, x, y);
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