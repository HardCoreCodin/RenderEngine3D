import Matrix3x3, {mat3} from "../../../accessors/matrix3x3.js";
import Matrix4x4 from "../../../accessors/matrix4x4.js";
import {FlagsBuffer2D} from "../../../buffers/flags.js";
import {Positions4D} from "../../../buffers/vectors.js";
import {Border, Grid} from "../../_base/viewport.js";
import RasterViewport from "../_base/viewport.js";
import RenderTarget from "../../_base/render_target.js";
import {perspectiveDivideAllVertexPositions, perspectiveDivideVertexPositions} from "./_core/half_space.js";
import {cullVertices} from "./_core/cull.js";
import {ABOVE, BELOW, CLIP, CULL, FAR, INSIDE, LEFT, NDC, NEAR, OUT, RIGHT} from "../../../../constants.js";
import {Position4D} from "../../../accessors/position.js";
import {dir4} from "../../../accessors/direction.js";

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

        this.render_target.reset();
        super.reset(width, height, x, y);
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

    refresh() {
        // this.update();
        this.context.fillStyle = "black";
        this.context.fillRect(this.x, this.y, this.width, this.height);
        super.refresh();
    }
}

export class SWBorder extends Border {
    draw(): void {

    }
}

let delta = dir4();

export class SWGrid extends Grid {
    protected _nds_to_screen: Matrix4x4;
    public view_positions: Positions4D;
    public edge_flags: FlagsBuffer2D;

    constructor(protected readonly _render_target: RenderTarget) {super()}

    project(world_to_clip: Matrix4x4, ndc_to_screen: Matrix3x3) {
        this._nds_to_screen.x_axis.setFrom(ndc_to_screen.x_axis);
        this._nds_to_screen.y_axis.setFrom(ndc_to_screen.y_axis);
        this._nds_to_screen.z_axis.setFrom(ndc_to_screen.z_axis);

        this.vertex_positions.mul(world_to_clip, this.view_positions);

        const cull_result: number = cullVertices(this.view_positions.arrays, this.edge_flags.array, this.view_positions.length);
        if (cull_result == CULL)
            return CULL;
        else if (cull_result == CLIP) {
            let from_flag, to_flag: number;
            let from, to: Position4D;
            let vertex_index: number = 0;
            from = new Position4D(this.view_positions.arrays[0]);
            to   = new Position4D(this.view_positions.arrays[1]);

            for (const flags of this.edge_flags) {
                from_flag = flags.array[0];
                to_flag   = flags.array[1];

                if (from_flag !== NDC ||
                    to_flag   !== NDC) {
                    if (from_flag === to_flag ||
                        ((from_flag & NEAR ) && (to_flag & NEAR)) ||
                        ((from_flag & FAR  ) && (to_flag & FAR))||
                        ((from_flag & LEFT ) && (to_flag & LEFT)) ||
                        ((from_flag & RIGHT) && (to_flag & RIGHT)) ||
                        ((from_flag & ABOVE) && (to_flag & ABOVE)) ||
                        ((from_flag & BELOW) && (to_flag & BELOW)))
                        flags.setAllTo(0);
                    else {
                        from.array = this.view_positions.arrays[vertex_index];
                        to.array = this.view_positions.arrays[vertex_index+1];
                        if (from_flag & NEAR) from.iadd(from.to(to, delta).imul(-from.z / Math.abs(to.z - from.z)));
                        if (to_flag  & NEAR)  to.iadd(to.to(from, delta).imul(-to.z / Math.abs(to.z - from.z)));
                        flags.setAllTo(NDC);
                    }
                }

                vertex_index += 2;
            }

            perspectiveDivideVertexPositions(this.view_positions.arrays, this.edge_flags.array);
            this.view_positions.imul(this._nds_to_screen, this.edge_flags.array);
        } else {
            perspectiveDivideAllVertexPositions(this.view_positions.arrays);
            this.view_positions.imul(this._nds_to_screen);
        }
    }

    protected _reset(): void {
        super._reset();

        if (this.view_positions) {
            if (this.view_positions.length !== this.vertex_positions.vertex_count) {
                this.view_positions.init(this.vertex_positions.vertex_count);
                this.edge_flags.init(this.vertex_positions.vertex_count / 2);
            }
        } else {
            this._nds_to_screen = new Matrix4x4().setToIdentity();
            this.view_positions = new Positions4D().init(this.vertex_positions.vertex_count);
            this.edge_flags = new FlagsBuffer2D().init(this.vertex_positions.vertex_count / 2);
        }
        this.view_positions.array.set(this.vertex_positions.array);
    }

    draw(): void {
        const context = this._render_target.context;
        context.beginPath();

        let vertex_index: number = 0;
        let from, to: Float32Array;
        for (let i = 0; i < this.edge_flags.length; i++) {
            from = this.view_positions.arrays[vertex_index++];
            to   = this.view_positions.arrays[vertex_index++];
            context.moveTo(from[0], from[1]);
            context.lineTo(to[0], to[1]);

            // this._render_target.drawLine2D(start.x, start.y, end.x, end.y, r, g, b, a);
        }

        context.closePath();
        context.strokeStyle = `${this.color}`;
        context.stroke();
    }
}