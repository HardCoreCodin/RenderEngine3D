import RasterCamera from "../raster/software/nodes/camera.js";
import BaseViewport from "../_base/viewport.js";

export default class RayTraceViewport
    extends BaseViewport<CanvasRenderingContext2D, RasterCamera> {
    updateMatrices(): void {
    }

    reset(width: number, height: number, x: number, y: number): void {
        super.reset(width, height, x, y);
        this.render_pipeline.resetRenderTarget(this._size, this._position);
    }
}