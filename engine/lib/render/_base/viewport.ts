import Rectangle from "./rectangle.js";
import {Color4D, rgba} from "../../accessors/color.js";
import {I2D} from "../../_interfaces/vectors.js";
import {ICamera, IRenderPipeline, IDisplay, ISize, IViewport} from "../../_interfaces/render.js";
import {IController} from "../../_interfaces/input.js";


export default abstract class BaseViewport<
    Context extends RenderingContext,
    CameraType extends ICamera = ICamera>
    extends Rectangle
    implements IViewport<Context>
{
    is_active: boolean = false;

    grid_size: number = 20;
    display_grid: boolean = true;
    display_border: boolean = true;

    abstract update(): void;

    protected readonly _border_color = rgba();
    protected readonly _grid_color = rgba();

    protected _initOverlay(): void {};
    protected _drawOverlay(): void {};

    constructor(
        protected _controller: IController<CameraType>,
        protected _render_pipeline: IRenderPipeline<Context>,
        protected readonly _display: IDisplay<Context>,
        readonly context: Context = _display.context as Context,
        size?: ISize,
        position?: I2D
    ) {
        super();
        this._init(size, position);
        this._initOverlay();
    }

    protected _init(size?: ISize, position?: I2D): void {
        if (size && position)
            this.reset(size.width, size.height, position.x, position.y);
    }

    setBorderColor(color: Color4D): void {
        this._border_color.setFrom(color);
    }

    setGridColor(color: Color4D): void {
        this._grid_color.setFrom(color);
    }

    setFrom(other: this): void {
        this._controller.camera.setFrom(other.controller.camera);
        this.reset(
            other._size.width,
            other._size.height,
            other._position.x,
            other._position.y
        )
    }

    get controller(): IController<CameraType> {return this._controller}
    set controller(constroller: IController<CameraType>) {this._controller = constroller}

    get render_pipeline(): IRenderPipeline<Context> {return this._render_pipeline}
    set render_pipeline(render_pipeline: IRenderPipeline<Context>) {
        this._display.unregisterViewport(this);
        this._render_pipeline = render_pipeline;
        this._display.registerViewport(this);
    }

    refresh() {
        this._render_pipeline.render(this);
        this._drawOverlay();
    }

    is_inside(x: number, y: number): boolean {
        return (
            x >= this._position.x && x < this._position.x + this._size.width &&
            y >= this._position.y && y < this._position.y + this._size.height
        );
    }
}