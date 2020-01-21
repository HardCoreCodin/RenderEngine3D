import Camera from "./camera.js";
import Rectangle from "./rectangle.js";
import {RasterScene, RayTraceScene} from "../scene_graph/scene.js";
import {Rasterizer, RayTracer} from "./pipelines.js";
import {mat3, mat4} from "../accessors/matrix.js";
import {IScene} from "../_interfaces/nodes.js";
import {I2D} from "../_interfaces/vectors.js";
import {ICamera, ISize, IRenderPipeline, IScreen, IViewport} from "../_interfaces/render.js";
import {IController} from "../_interfaces/input.js";
import {Color4D, rgba} from "../accessors/color.js";

export class BaseViewport<
    Context extends RenderingContext,
    CameraType extends ICamera,
    SceneType extends IScene<Context, CameraType>,
    RenderPipelineType extends IRenderPipeline<Context, CameraType>>
    extends Rectangle
    implements IViewport<Context, CameraType, SceneType>
{
    grid_size: number = 20;
    display_grid: boolean = true;
    display_border: boolean = true;

    protected readonly _border_color = rgba();
    protected readonly _grid_color = rgba();

    readonly world_to_view = mat4();
    readonly world_to_clip = mat4();

    protected _initOverlay(): void {};
    protected _drawOverlay(): void {}

    constructor(
        protected _camera: CameraType,
        protected _render_pipeline: RenderPipelineType,
        protected _controller: IController,
        protected readonly _screen: IScreen<Context, CameraType, SceneType, RenderPipelineType>,
        size: ISize,
        position: I2D = {x: 0, y: 0},
        readonly context: Context = _screen.context as Context
    ) {
        super();
        this._initOverlay();
        this._controller.viewport = this;
        this.reset(size.width, size.height, position.x, position.y);
    }

    setBorderColor(color: Color4D): void {
        this._border_color.setFrom(color);
    }

    setGridColor(color: Color4D): void {
        this._grid_color.setFrom(color);
    }

    setFrom(other: this): void {
        this._camera.setFrom(other._camera);
        this._render_pipeline = other._render_pipeline;
        this.world_to_clip.setFrom(other.world_to_clip);
        this.world_to_view.setFrom(other.world_to_view);
        this.reset(
            other._size.width,
            other._size.height,
            other._position.x,
            other._position.y
        )
    }

    get controller(): IController {return this._controller}
    set controller(constroller: IController) {
        constroller.viewport = this;
        this._controller = constroller;
    }

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
        this._render_pipeline.render(this);
        this._drawOverlay();
    }

    reset(
        width: number,
        height: number,
        x: number = this._position.x,
        y: number = this._position.y
    ): void {
        super.reset(width, height, x, y);
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

export class Canvas2DViewport<
    CameraType extends ICamera,
    SceneType extends IScene<CanvasRenderingContext2D, CameraType>,
    RenderPipelineType extends IRenderPipeline<CanvasRenderingContext2D, CameraType> = IRenderPipeline<CanvasRenderingContext2D, CameraType>>
    extends BaseViewport<CanvasRenderingContext2D, CameraType, SceneType, RenderPipelineType>
{
    reset(width: number, height: number, x: number, y: number): void {
        super.reset(width, height, x, y);
        this.render_pipeline.resetRenderTarget(this._size, this._position);
    }
}


export class RayTraceViewport extends Canvas2DViewport<Camera, RayTraceScene, RayTracer> {}

export class RasterViewport extends Canvas2DViewport<Camera, RasterScene, Rasterizer> {
    readonly ndc_to_screen = mat3();

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

        super.reset(width, height, x, y);
    }
}