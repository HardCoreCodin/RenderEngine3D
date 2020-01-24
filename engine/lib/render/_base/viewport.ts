import Rectangle from "./rectangle.js";
import {Color4D, rgba} from "../../accessors/color.js";
import {I2D} from "../../_interfaces/vectors.js";
import {ICamera, IRenderPipeline, IScreen, ISize, IViewport} from "../../_interfaces/render.js";
import {IController} from "../../_interfaces/input.js";


export default abstract class BaseViewport<
    Context extends RenderingContext,
    CameraType extends ICamera>
    extends Rectangle
    implements IViewport<Context, CameraType>
{
    grid_size: number = 20;
    display_grid: boolean = true;
    display_border: boolean = true;

    abstract updateMatrices(): void;

    protected readonly _border_color = rgba();
    protected readonly _grid_color = rgba();

    protected _initOverlay(): void {};
    protected _drawOverlay(): void {}

    constructor(
        protected _camera: CameraType,
        protected _render_pipeline: IRenderPipeline<Context>,
        protected _controller: IController,
        protected readonly _screen: IScreen<Context>,
        size: ISize,
        position: I2D = {x: 0, y: 0},
        readonly context: Context = _screen.context as Context
    ) {
        super();
        this._init();
        this._initOverlay();
        this._controller.camera = _camera;
        this.reset(size.width, size.height, position.x, position.y);
    }

    protected _init(): void {}

    setBorderColor(color: Color4D): void {
        this._border_color.setFrom(color);
    }

    setGridColor(color: Color4D): void {
        this._grid_color.setFrom(color);
    }

    setFrom(other: this): void {
        this._camera.setFrom(other._camera);
        this._render_pipeline = other._render_pipeline;
        this.reset(
            other._size.width,
            other._size.height,
            other._position.x,
            other._position.y
        )
    }

    get controller(): IController {return this._controller}
    set controller(constroller: IController) {
        constroller.camera = this._camera;
        this._controller = constroller;
    }

    get camera(): CameraType {return this._camera}
    set camera(camera: CameraType) {
        this._camera = this._controller.camera = camera;
    }

    get render_pipeline(): IRenderPipeline<Context> {return this._render_pipeline}
    set render_pipeline(render_pipeline: IRenderPipeline<Context>) {
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
        this.updateMatrices();
    }


    is_inside(x: number, y: number): boolean {
        return (
            x >= this._position.x && x < this._position.x + this._size.width &&
            y >= this._position.y && y < this._position.y + this._size.height
        );
    }
}