import { FlagsBuffer2D } from "../../../buffers/flags.js";
import { Positions4D } from "../../../buffers/vectors.js";
import { Border, Grid } from "../../_base/viewport.js";
import RasterViewport from "../_base/viewport.js";
import RenderTarget from "../../_base/render_target.js";
import { projectAllVertexPositions, projectSomeVertexPositions } from "./_core/half_space.js";
import { cullVertices } from "./_core/cull.js";
import { ABOVE, BELOW, CLIP, CULL, FAR, LEFT, NDC, NEAR, RIGHT } from "../../../core/constants.js";
import { Position4D } from "../../../accessors/position.js";
import { dir4 } from "../../../accessors/direction.js";
export default class SoftwareRasterViewport extends RasterViewport {
    reset(width, height, x, y) {
        super.reset(width, height, x, y);
        this.render_target.reset();
    }
    update() {
        super.update();
        this.grid.project(this.world_to_clip, this.size);
    }
    _getGrid() {
        return new SWGrid(this.render_target);
    }
    _getBorder() {
        return new SWBorder();
    }
    _init() {
        this.render_target = new RenderTarget(this);
        this.wire_frame_render_target = new RenderTarget(this);
        super._init();
    }
    refresh() {
        this.context.fillStyle = "black";
        this.context.fillRect(this.x, this.y, this.width, this.height);
        super.refresh();
    }
}
export class SWBorder extends Border {
    draw() {
    }
}
let delta = dir4();
export class SWGrid extends Grid {
    constructor(_render_target) {
        super();
        this._render_target = _render_target;
    }
    project(world_to_clip, size) {
        this.vertex_positions.mul(world_to_clip, this.view_positions);
        const half_width = size.width >>> 1;
        const half_height = size.height >>> 1;
        const cull_result = cullVertices(this.view_positions.arrays, this.edge_flags.array, this.vertex_positions.vertex_count);
        if (cull_result === CULL)
            return CULL;
        if (cull_result === CLIP) {
            let from_flag, to_flag;
            let from, to;
            let vertex_index = 0;
            from = new Position4D(this.view_positions.arrays[0]);
            to = new Position4D(this.view_positions.arrays[1]);
            for (const flags of this.edge_flags) {
                from_flag = flags.array[0];
                to_flag = flags.array[1];
                if (from_flag !== NDC ||
                    to_flag !== NDC) {
                    if (from_flag === to_flag ||
                        ((from_flag & NEAR) && (to_flag & NEAR)) ||
                        ((from_flag & FAR) && (to_flag & FAR)) ||
                        ((from_flag & LEFT) && (to_flag & LEFT)) ||
                        ((from_flag & RIGHT) && (to_flag & RIGHT)) ||
                        ((from_flag & ABOVE) && (to_flag & ABOVE)) ||
                        ((from_flag & BELOW) && (to_flag & BELOW)))
                        flags.setAllTo(0);
                    else {
                        from.array = this.view_positions.arrays[vertex_index];
                        to.array = this.view_positions.arrays[vertex_index + 1];
                        if (from_flag & NEAR)
                            from.iadd(from.to(to, delta).imul(-from.z / Math.abs(to.z - from.z)));
                        if (to_flag & NEAR)
                            to.iadd(to.to(from, delta).imul(-to.z / Math.abs(to.z - from.z)));
                        flags.setAllTo(NDC);
                    }
                }
                vertex_index += 2;
            }
            projectSomeVertexPositions(this.view_positions.arrays, this.vertex_positions.vertex_count, this.edge_flags.array, half_width, half_height);
            // this.view_positions.imul(this._nds_to_screen, this.edge_flags.array);
        }
        else {
            projectAllVertexPositions(this.view_positions.arrays, this.vertex_positions.vertex_count, half_width, half_height);
            // this.view_positions.imul(this._nds_to_screen);
        }
    }
    _reset() {
        super._reset();
        if (this.view_positions) {
            if (this.view_positions.length !== this.vertex_positions.vertex_count) {
                this.view_positions.init(this.vertex_positions.vertex_count);
                this.edge_flags.init(this.vertex_positions.vertex_count / 2);
            }
        }
        else {
            this.view_positions = new Positions4D().init(this.vertex_positions.vertex_count);
            this.edge_flags = new FlagsBuffer2D().init(this.vertex_positions.vertex_count / 2);
        }
        this.view_positions.array.set(this.vertex_positions.array);
    }
    draw() {
        const context = this._render_target.context;
        context.beginPath();
        let vertex_index = 0;
        let from, to;
        for (let i = 0; i < this.edge_flags.length; i++) {
            from = this.view_positions.arrays[vertex_index++];
            to = this.view_positions.arrays[vertex_index++];
            context.moveTo(from[0], from[1]);
            context.lineTo(to[0], to[1]);
            // this._render_target.drawLine2D(start.x, start.y, end.x, end.y, r, g, b, a);
        }
        context.closePath();
        context.strokeStyle = `${this.color}`;
        context.stroke();
    }
}
//# sourceMappingURL=viewport.js.map