import RasterViewport from "../_base/viewport.js";
import RenderTarget from "../../_base/render_target.js";
import {mat3} from "../../../accessors/matrix3x3.js";
import {ISize} from "../../../_interfaces/render.js";
import {I2D} from "../../../_interfaces/vectors.js";


export default class SoftwareRasterViewport extends RasterViewport<CanvasRenderingContext2D>
{
    readonly ndc_to_screen = mat3();
    render_target: RenderTarget;

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
        this.render_target.reset();
    }

    update(): void {
    }

    protected _init(size?: ISize, position?: I2D): void {
        super._init(size, position);
        this.render_target = new RenderTarget(this);
    }
}