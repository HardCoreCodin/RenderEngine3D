import Matrix3x3, {mat3} from "../../../accessors/matrix3x3.js";
import Matrix4x4 from "../../../accessors/matrix4x4.js";
import {Positions3D, Positions4D} from "../../../buffers/vectors.js";
import {Border, Grid} from "../../_base/viewport.js";
import RasterViewport from "../_base/viewport.js";
import RenderTarget from "../../_base/render_target.js";
import {perspectiveDivideAllVertexPositions} from "./_core/half_space.js";
import {zip} from "../../../../utils.js";


export default class SoftwareRasterViewport extends RasterViewport<CanvasRenderingContext2D, SWGrid, SWBorder>
{
    ndc_to_screen: Matrix3x3;
    render_target: RenderTarget;

    reset(width: number, height: number, x: number, y: number): void {
        const half_width = width >>> 1;
        const half_height = height >>> 1;

        // Scale the normalized screen to the pixel size:
        // (from normalized size of -1->1 horizontally and vertically having a width and height of 2)
        this.ndc_to_screen.x_axis.x = half_width;
        this.ndc_to_screen.y_axis.y = -half_height;
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

    protected _getBorder(): SWBorder {
        return new SWBorder();
    }

    protected _init(): void {
        this.ndc_to_screen = mat3().setToIdentity();
        this.render_target = new RenderTarget(this);
        super._init();
    }
}

export class SWBorder extends Border {
    draw(): void {

    }
}

export class SWGrid extends Grid {
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

        this._nds_to_screen.x_axis.setFrom(ndc_to_screen.x_axis);
        this._nds_to_screen.y_axis.setFrom(ndc_to_screen.y_axis);
        this._nds_to_screen.z_axis.setFrom(ndc_to_screen.z_axis);
        this.start_positions.imul(this._nds_to_screen);
        this.end_positions.imul(this._nds_to_screen);
    }

    protected _reset(): void {
        super._reset();

        const line_count = this.vertex_positions.vertex_count / 2;
        if (this.world_start_positions) {
            if (this.world_start_positions.length !== line_count) {
                this.world_start_positions.init(line_count);
                this.world_end_positions.init(line_count);
                this.start_positions.init(line_count);
                this.end_positions.init(line_count);
            }
        } else {
            this._nds_to_screen = new Matrix4x4().setToIdentity();
            this.world_start_positions = new Positions3D().init(line_count);
            this.world_end_positions = new Positions3D().init(line_count);
            this.start_positions = new Positions4D().init(line_count);
            this.end_positions = new Positions4D().init(line_count);
        }

        let start_index = 0;
        let end_index = 1;
        const pos = this.vertex_positions.arrays;
        for (const [start, end] of zip(this.world_start_positions.arrays, this.world_end_positions.arrays)) {
            start.set(pos[start_index]);
            end.set(pos[end_index]);
            start_index += 2;
            end_index += 2;
        }
    }

    draw(): void {
        // r = this._color_array[0];
        // g = this._color_array[1];
        // b = this._color_array[2];
        // a = this._color_array[3];

        const context = this._render_target.context;
        context.beginPath();

        for (const [start, end] of zip(this.start_positions.arrays, this.end_positions.arrays)) {
            context.moveTo(start[0], start[1]);
            context.lineTo(end[0], end[1]);

            // this._render_target.drawLine2D(start.x, start.y, end.x, end.y, r, g, b, a);
        }

        context.closePath();
        context.strokeStyle = `${this.color}`;
        context.stroke();
    }
}