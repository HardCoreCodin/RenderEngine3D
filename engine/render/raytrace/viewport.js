import BaseViewport, { ProjectionPlane } from "../base/viewport.js";
import RenderTarget from "../base/render_target.js";
import { SWBorder, SWGrid } from "../raster/software/viewport.js";
import { MAX_RENDER_TARGET_SIZE } from "../../core/constants.js";
import { UINT32_ALLOCATOR } from "../../core/memory/allocators.js";
export default class RayTraceViewport extends BaseViewport {
    _init() {
        this.render_target = new RenderTarget(this);
        this.projection_plane = new ProjectionPlane();
        this._all_pixels = UINT32_ALLOCATOR.allocateBuffer(MAX_RENDER_TARGET_SIZE)[0];
        super._init();
    }
    update() {
        if (this.camera.turned)
            this.projection_plane.reset(this);
    }
    reset(width, height, x, y) {
        super.setTo(width, height, x, y);
        this.pixels = this._all_pixels.subarray(0, width * height);
        this.render_target.reset();
        this.projection_plane.reset(this);
    }
    refresh() {
        // this.pixels.fill(0);
        this._render_pipeline.render(this);
        this.render_target.array.set(this.pixels);
        this.context.putImageData(this.render_target.image, this.position.x, this.position.y);
        // this._drawOverlay();
    }
    _getGrid() {
        return new SWGrid(this.render_target);
    }
    _getBorder() {
        return new SWBorder();
    }
}
//# sourceMappingURL=viewport.js.map