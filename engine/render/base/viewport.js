import Rectangle from "./rectangle.js";
import { rgba } from "../../accessors/color.js";
import { VertexPositions2D, VertexPositions3D } from "../../buffers/attributes/positions.js";
import { Position3D } from "../../accessors/position.js";
import { Direction3D } from "../../accessors/direction.js";
export default class BaseViewport extends Rectangle {
    constructor(camera, controller, _render_pipeline, _display) {
        super(_display.size, _display.position);
        this.camera = camera;
        this.controller = controller;
        this._render_pipeline = _render_pipeline;
        this._display = _display;
        this.is_active = false;
        this.cull_back_faces = true;
        this.show_wire_frame = false;
        this.context = _display.context;
        this._init();
    }
    _initOverlay() {
        this.grid = this._getGrid();
        this.border = this._getBorder();
    }
    ;
    _init() {
        this._initOverlay();
        this.reset(this._display.width, this._display.height, this._display.x, this._display.y);
    }
    _drawOverlay() {
        if (this.grid.display)
            this.grid.draw();
        if (this.border.display)
            this.border.draw();
    }
    setFrom(other) {
        this.camera = other.camera;
        this.controller = other.controller;
        this.setTo(other.size.width, other.size.height, other.position.x, other.position.y);
    }
    get render_pipeline() { return this._render_pipeline; }
    set render_pipeline(render_pipeline) {
        this._display.unregisterViewport(this);
        this._render_pipeline = render_pipeline;
        this._display.registerViewport(this);
    }
    refresh() {
        this._drawOverlay();
        this._render_pipeline.render(this);
    }
    is_inside(x, y) {
        return (x >= this.position.x && x < this.position.x + this.size.width &&
            y >= this.position.y && y < this.position.y + this.size.height);
    }
}
export class Overlay {
    constructor() {
        this.display = true;
        this.color = rgba(1);
    }
    setFrom(other) {
        this.color.setFrom(other.color);
        this.display = other.display;
    }
}
export class Border extends Overlay {
    constructor() {
        super();
        this.vertex_positions = new VertexPositions2D();
        this.vertex_positions.init(4);
        this.vertex_positions.array.set([-1, -1, 1, -1, 1, 1, -1, 1]);
    }
}
export class Grid extends Overlay {
    constructor(_size = 20) {
        super();
        this._size = _size;
        this.vertex_positions = new VertexPositions3D();
        this._reset();
    }
    setFrom(other) {
        super.setFrom(other);
        this.size = other.size;
    }
    get size() { return this._size; }
    set size(size) {
        this._size = size;
        this._reset();
    }
    _reset() {
        this.vertex_positions.init(2 * (this._size + 1) * 2);
        const grid = this.vertex_positions.array;
        const right_and_front = this._size >>> 1;
        const left_and_back = -right_and_front;
        const v = 2 * (this._size + 1) * 3;
        let offset = 0;
        for (let i = left_and_back; i <= right_and_front; i++) {
            grid[offset] = grid[offset + 3] = grid[offset + v + 2] = grid[offset + v + 5] = i;
            grid[offset + 2] = grid[offset + v] = right_and_front;
            grid[offset + 5] = grid[offset + v + 3] = left_and_back;
            offset += 6;
        }
    }
}
const forward = new Direction3D();
export class ProjectionPlane {
    constructor(start = new Position3D(), right = new Direction3D(), down = new Direction3D()) {
        this.start = start;
        this.right = right;
        this.down = down;
    }
    reset(viewport) {
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
//# sourceMappingURL=viewport.js.map