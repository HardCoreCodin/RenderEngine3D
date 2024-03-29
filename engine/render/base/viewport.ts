import Rectangle from "./rectangle.js";
import {rgba} from "../../accessors/color.js";
import {IDisplay, IRenderPipeline, IViewport} from "../../core/interfaces/render.js";
import {VertexPositions2D, VertexPositions3D} from "../../buffers/attributes/positions.js";
import {Position3D} from "../../accessors/position.js";
import {Direction3D} from "../../accessors/direction.js";
import InputController from "../../input/controllers.js";
import Camera from "../../nodes/camera.js";

export default abstract class BaseViewport<
    Context extends RenderingContext,
    GridType extends Grid,
    BorderType extends Border>
    extends Rectangle
    implements IViewport<Context, GridType>
{
    is_active: boolean = false;
    cull_back_faces: boolean = true;
    show_wire_frame: boolean = false;

    readonly context: Context;

    grid: GridType;
    border: BorderType;

    protected abstract _getGrid(): GridType;
    protected abstract _getBorder(): BorderType;

    abstract update(): void;
    abstract reset(width: number, height: number, x: number, y: number): void;

    constructor(
        public camera: Camera,
        public controller: InputController,
        protected _render_pipeline: IRenderPipeline<Context>,
        protected readonly _display: IDisplay<Context>
    ) {
        super(_display.size, _display.position);
        this.context = _display.context as Context;
        this._init();
    }

    protected _initOverlay(): void {
        this.grid = this._getGrid();
        this.border = this._getBorder();
    };

    protected _init(): void {
        this._initOverlay();
        this.reset(this._display.width, this._display.height, this._display.x, this._display.y);
    }

    protected _drawOverlay(): void {
        if (this.grid.display) this.grid.draw();
        if (this.border.display) this.border.draw();
    }

    setFrom(other: this): void {
        this.camera = other.camera;
        this.controller = other.controller;
        this.setTo(
            other.size.width,
            other.size.height,
            other.position.x,
            other.position.y
        )
    }

    get render_pipeline(): IRenderPipeline<Context> {return this._render_pipeline}
    set render_pipeline(render_pipeline: IRenderPipeline<Context>) {
        this._display.unregisterViewport(this);
        this._render_pipeline = render_pipeline;
        this._display.registerViewport(this);
    }

    refresh() {
        this._drawOverlay();
        this._render_pipeline.render(this);
    }

    is_inside(x: number, y: number): boolean {
        return (
            x >= this.position.x && x < this.position.x + this.size.width &&
            y >= this.position.y && y < this.position.y + this.size.height
        );
    }
}

export abstract class Overlay {
    display = true;
    color = rgba(1);

    setFrom(other: this): void {
        this.color.setFrom(other.color);
        this.display = other.display;
    }

    abstract draw(): void;
}

export abstract class Border extends Overlay {
    vertex_positions = new VertexPositions2D();

    constructor() {
        super();
        this.vertex_positions.init(4);
        this.vertex_positions.array.set([-1,-1,  1,-1,  1,1,  -1,1]);
    }
}

export abstract class Grid extends Overlay {
    vertex_positions = new VertexPositions3D();

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
        this.vertex_positions.init(2 * (this._size + 1) * 2);
        const grid = this.vertex_positions.array;
        const right_and_front = this._size >>> 1;
        const left_and_back = -right_and_front;
        const v = 2 * (this._size + 1) * 3;
        let offset = 0;
        for (let i = left_and_back; i <= right_and_front; i++) {
            grid[offset    ] = grid[offset + 3] = grid[offset + v + 2] = grid[offset + v + 5] = i;
            grid[offset + 2] = grid[offset + v    ] = right_and_front;
            grid[offset + 5] = grid[offset + v + 3] = left_and_back;
            offset += 6;
        }
    }
}

const forward = new Direction3D();

export class ProjectionPlane {
    constructor(
        public start: Position3D = new Position3D(),
        public right: Direction3D = new Direction3D(),
        public down: Direction3D = new Direction3D()
    ) {}

    reset(viewport: IViewport) {
        const camera = viewport.camera;
        camera.right.mul(1 - viewport.width, this.right);
        camera.up.mul(viewport.height - 2, this.down);
        camera.forward.mul(viewport.width * camera.lense.focal_length, forward);
        camera.position.add(forward, this.start);
        this.start.iadd(this.right);
        this.start.iadd(this.down);
        camera.right.mul(2, this.right);
        camera.up.mul(-2, this.down);
    }
}