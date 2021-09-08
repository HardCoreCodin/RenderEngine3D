import BaseViewport from "../base/viewport.js";
import RenderTarget from "../base/render_target.js";
import {SWBorder, SWGrid} from "../raster/software/viewport.js";
import {ProjectionPlane} from "../../buffers/rays.js";
import {MAX_RENDER_TARGET_SIZE} from "../../core/constants.js";
import {UINT32_ALLOCATOR} from "../../core/memory/allocators.js";

export default class RayTraceViewport
    extends BaseViewport<CanvasRenderingContext2D, SWGrid, SWBorder>
{
    render_target: RenderTarget;
    projection_plane: ProjectionPlane;
    pixels: Uint32Array;
    protected _all_pixels: Uint32Array;

    protected _init(): void {
        this.render_target = new RenderTarget(this);
        this.projection_plane = new ProjectionPlane(this);
        this._all_pixels = UINT32_ALLOCATOR.allocateBuffer(MAX_RENDER_TARGET_SIZE)[0];
        super._init();
    }

    update(): void {
        if (this._controller.direction_changed)
            this.projection_plane.reset();
    }

    reset(width: number, height: number, x: number, y: number): void {
        super.setTo(width, height, x, y);

        this.pixels = this._all_pixels.subarray(0, width * height);
        this.render_target.reset();
        this.projection_plane.reset();
    }

    refresh() {
        // this.pixels.fill(0);
        this._render_pipeline.render(this);
        this.render_target.array.set(this.pixels);
        this.context.putImageData(this.render_target.image, this.position.x, this.position.y);
        // this._drawOverlay();
    }
    protected _getGrid(): SWGrid {
        return new SWGrid(this.render_target);
    }

    protected _getBorder(): SWBorder {
        return new SWBorder();
    }
}