import {Grid} from "../../_base/viewport.js";
import RasterViewport from "../_base/viewport.js";
import RenderTarget from "../../_base/render_target.js";
import Matrix3x3, {mat3} from "../../../accessors/matrix3x3.js";
import Matrix4x4 from "../../../accessors/matrix4x4.js";
import {perspectiveDivideAllVertexPositions} from "./_core/half_space.js";
import {zip} from "../../../../utils.js";
import {Positions3D, Positions4D} from "../../../buffers/vectors.js";


export default class SoftwareRasterViewport extends RasterViewport<CanvasRenderingContext2D, SWGrid>
{
    ndc_to_screen: Matrix3x3;
    render_target: RenderTarget;

    reset(width: number, height: number, x: number, y: number): void {
        const half_width = width >>> 1;
        const half_height = height >>> 1;

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
        this.render_target.reset();
    }

    update(): void {
        super.update();
        this.grid.project(this.world_to_clip, this.ndc_to_screen);
    }

    protected _getGrid(): SWGrid {
        return new SWGrid(this.render_target);
    }

    _drawOverlay(): void {
        if (this.grid.display) this.grid.draw();
    }

    protected _init(): void {
        this.ndc_to_screen = mat3().setToIdentity();
        this.render_target = new RenderTarget(this);
        super._init();
    }
}

class SWGrid extends Grid {
    protected _nds_to_screen: Matrix4x4;
    public world_start_positions: Positions3D;
    public world_end_positions: Positions3D;
    public start_positions: Positions4D;
    public end_positions: Positions4D;

    constructor(protected readonly _render_target: RenderTarget) {super()}

    project(world_to_clip: Matrix4x4, ndc_to_screen: Matrix3x3): void {
        this.world_start_positions.mul(world_to_clip, this.start_positions);
        this.world_end_positions.mul(world_to_clip, this.end_positions);

        perspectiveDivideAllVertexPositions(this.start_positions.arrays);
        perspectiveDivideAllVertexPositions(this.end_positions.arrays);

        this._nds_to_screen.mat3.setFrom(ndc_to_screen);
        this.start_positions.imul(this._nds_to_screen);
        this.end_positions.imul(this._nds_to_screen);
    }

    protected _reset(): void {
        super._reset();

        line_count = this._vertex_count >>> 1;
        if (this.world_start_positions) {
            if (this.world_start_positions.length !== line_count) {
                this.world_start_positions.init(line_count);
                this.world_end_positions.init(line_count);
                this.start_positions.init(line_count);
                this.end_positions.init(line_count);
            }
        } else {
            this._nds_to_screen = new Matrix4x4().setToIdentity();
            this.world_start_positions = new Positions3D(line_count);
            this.world_end_positions = new Positions3D(line_count);
            this.start_positions = new Positions4D(line_count);
            this.end_positions = new Positions4D(line_count);
        }

        arrays = this.world_start_positions.arrays;
        sx = arrays[0];
        sy = arrays[1];
        sz = arrays[2];

        arrays = this.world_end_positions.arrays;
        ex = arrays[0];
        ey = arrays[1];
        ez = arrays[2];

        array = this._vertex_positions;
        component_index = 0;
        for (line_index = 0; line_index < line_count; line_index++) {
            sx[line_index] = array[component_index++];
            sy[line_index] = array[component_index++];
            sz[line_index] = array[component_index++];

            ex[line_index] = array[component_index++];
            ey[line_index] = array[component_index++];
            ez[line_index] = array[component_index++];
        }
    }

    draw(): void {
        // r = this._color_array[0];
        // g = this._color_array[1];
        // b = this._color_array[2];
        // a = this._color_array[3];

        context = this._render_target.context;
        context.beginPath();

        for (const [start, end] of zip(this.start_positions, this.end_positions)) {
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);

            // this._render_target.drawLine2D(start.x, start.y, end.x, end.y, r, g, b, a);
        }

        context.closePath();
        context.strokeStyle = `${this.color}`;
        context.stroke();
    }
}

let context: CanvasRenderingContext2D;
let array, sx, sy, sz, ex, ey, ez: Float32Array;
let arrays: Float32Array[];
let x1, y1, x2, y2, r, g, b, a,
    line_count,
    line_index,
    component_index: number;