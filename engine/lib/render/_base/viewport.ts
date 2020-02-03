import Rectangle from "./rectangle.js";
import {Color4D, rgba} from "../../accessors/color.js";
import {IRenderPipeline, IDisplay, IViewport} from "../../_interfaces/render.js";
import {IController} from "../../_interfaces/input.js";


export default abstract class BaseViewport<
    Context extends RenderingContext,
    GridType extends Grid,
    BorderType extends Border>
    extends Rectangle
    implements IViewport<Context, GridType>
{
    is_active: boolean = false;

    readonly context: Context;

    grid: GridType;
    border: BorderType;

    protected abstract _getGrid(): GridType;
    protected abstract _getBorder(): BorderType;

    abstract update(): void;

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
        this.border = this._getBorder();
    };

    protected _init(): void {
        this.reset(this._display.width, this._display.height, this._display.x, this._display.y);
    }

    protected _drawOverlay(): void {
        if (this.grid.display) this.grid.draw();
        if (this.border.display) this.border.draw();
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

export abstract class Overlay {
    display = true;

    vertex_count: number;
    vertex_positions: Float32Array;

    readonly color_array = Float32Array.of(1, 1, 1, 1);
    protected _color = rgba(1);

    setFrom(other: this): void {
        this.color = other.color;
        this.display = other.display;
    }

    get color(): Color4D {return this._color}
    set color(color: Color4D) {this._color.setFrom(color).toArray(this.color_array)}

    abstract draw(): void;
}

export abstract class Border extends Overlay {
    constructor() {
        super();
        this.vertex_count = 4;
        this.vertex_positions = Float32Array.of(-1,-1,  1,-1,  1,1,  -1,1)
    }
}

export abstract class Grid extends Overlay {
    protected constructor(
        protected _size: number = 20
    ) {
        super();
        this._reset();
    }

    setFrom(other: this): void {
        super.setFrom(other);
        this.size = other.size;
    }

    get size(): number {return this._size}
    set size(size: number) {
        this._size = size;
        this._reset();
    }

    protected _reset(): void {
        right_and_front = this._size >>> 1;
        left_and_back = -right_and_front;
        this.vertex_count = 2 * (this._size + 1) * 2;
        grid = this.vertex_positions = new Float32Array(this.vertex_count * 3);
        v = 2 * (this._size + 1) * 3;
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