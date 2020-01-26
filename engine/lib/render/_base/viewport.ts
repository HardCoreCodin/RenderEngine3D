import Rectangle from "./rectangle.js";
import {Color4D, rgba} from "../../accessors/color.js";
import {IRenderPipeline, IDisplay, IViewport} from "../../_interfaces/render.js";
import {IController} from "../../_interfaces/input.js";


export default abstract class BaseViewport<
    Context extends RenderingContext,
    GridType extends Grid = Grid>
    extends Rectangle
    implements IViewport<Context, GridType>
{
    is_active: boolean = false;

    readonly context: Context;

    grid: GridType;
    protected _getGrid(): GridType {return new Grid() as GridType}

    abstract update(): void;

    protected readonly _border_color = rgba();
    protected _drawOverlay(): void {};

    constructor(
        protected _controller: IController,
        protected _render_pipeline: IRenderPipeline<Context>,
        protected readonly _display: IDisplay<Context>
    ) {
        super();
        this.context = _display.context as Context;
        this._init();
        this._initOverlay();
    }

    protected _initOverlay(): void {
        this.grid = this._getGrid();
    };

    protected _init(): void {
        this.reset(this._display.width, this._display.height, this._display.x, this._display.y);
    }

    display_border: boolean = true;
    setBorderColor(color: Color4D): void {
        this._border_color.setFrom(color);
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

    get controller(): IController {return this._controller}
    set controller(constroller: IController) {this._controller = constroller}

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

export class Grid {
    display = true;

    protected _size: number;
    protected _color = rgba(1);
    protected _vertex_count: number;
    protected _vertex_positions: Float32Array;

    constructor(size: number = 20) {
        this.size = size;
    }

    setFrom(other: this): void {
        this.size = other.size;
        this.color = other.color;
        this.display = other.display;
    }

    get color(): Color4D {return this._color}
    set color(color: Color4D) {this._color.setFrom(color)}

    get vertex_count(): number {return this._vertex_count}
    get vertex_positions(): Float32Array {return this._vertex_positions}

    get size(): number {return this._size}
    set size(size: number) {
        this._size = size;
        right_and_front = size >>> 1;
        left_and_back = -right_and_front;
        this._vertex_count = 2 * (size + 1) * 2;
        grid = this._vertex_positions = new Float32Array(this._vertex_count * 3);
        v = 2 * (size + 1) * 3;
        offset = 0;
        for (i = left_and_back; i <= right_and_front; i++) {
            grid[offset    ] = grid[offset + 3] = grid[offset + v + 2] = grid[offset + v + 5] = i;
            grid[offset + 2] = grid[offset + v    ] = right_and_front;
            grid[offset + 5] = grid[offset + v + 3] = left_and_back;
            offset += 6;
        }
    }
}

let grid: Float32Array;
let right_and_front,
    left_and_back,
    i, offset, v: number;