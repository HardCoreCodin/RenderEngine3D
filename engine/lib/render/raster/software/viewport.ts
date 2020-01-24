import RasterCamera from "./nodes/camera.js";
import RasterViewport from "../_base/viewport.js";
import {mat3} from "../../../accessors/matrix3x3.js";


export default class SoftwareRasterViewport
    extends RasterViewport<CanvasRenderingContext2D, RasterCamera> {
    readonly ndc_to_screen = mat3();

    reset(width: number, height: number, x: number, y: number): void {
        const half_width = width / 2;
        const half_height = height / 2;

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
        this.render_pipeline.resetRenderTarget(this._size, this._position);
    }
}