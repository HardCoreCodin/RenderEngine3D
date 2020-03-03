import BaseViewport from "../_base/viewport.js";
import RenderTarget from "../_base/render_target.js";
import {SWBorder, SWGrid} from "../raster/software/viewport.js";
import {Rays} from "../../buffers/rays.js";
import {MAX_RENDER_TARGET_SIZE} from "../../../constants.js";
import {UINT32_ALLOCATOR} from "../../memory/allocators.js";

export default class RayTraceViewport
    extends BaseViewport<CanvasRenderingContext2D, SWGrid, SWBorder>
{
    render_target: RenderTarget;
    rays: Rays;
    pixels: Uint32Array;
    protected _all_pixels: Uint32Array;

    protected _init(): void {
        this.render_target = new RenderTarget(this);
        this._all_pixels = UINT32_ALLOCATOR.allocateBuffer(MAX_RENDER_TARGET_SIZE)[0];
        this.rays = new Rays(MAX_RENDER_TARGET_SIZE, this._controller.camera.transform.translation);
        super._init();
    }

    update(): void {
        if (this._controller.direction_changed)
            this.rays.rotate(this._controller.camera.transform.matrix);
    }

    reset(width: number, height: number, x: number, y: number): void {
        super.reset(width, height, x, y);

        this.rays.generate(width, height, this._controller.camera.lense.focal_length);
        this.rays.rotate(this._controller.camera.transform.matrix);
        this.pixels = this._all_pixels.subarray(0, width * height);

        this.render_target.reset();
    }

    refresh() {
        // this.pixels.fill(0);
        this._render_pipeline.render(this);
        this.render_target.array.set(this.pixels);
        this.context.putImageData(this.render_target.image, this._position.x, this._position.y);
        // this._drawOverlay();
    }
    protected _getGrid(): SWGrid {
        return new SWGrid(this.render_target);
    }

    protected _getBorder(): SWBorder {
        return new SWBorder();
    }
}
// import BaseViewport from "../_base/viewport.js";
// import RenderTarget from "../_base/render_target.js";
// import {generateRayDirections} from "./_core/ray_generation.js";
// import {Directions3D} from "../../buffers/vectors.js";
// import {SWBorder, SWGrid} from "../raster/software/viewport.js";
// import Rays from "../../buffers/rays.js";
// import {PIXELS_ALLOCATOR} from "../../memory/allocators.js";
// import {MAX_RENDER_TARGET_SIZE} from "../../../constants.js";
//
// export default class RayTraceViewport
//     extends BaseViewport<CanvasRenderingContext2D, SWGrid, SWBorder>
// {
//     pixels: Uint32Array;
//     rays: Rays;
//     protected _all_pixels: Uint32Array;
//     protected _source_ray_directions: Directions3D;
//
//     render_target: RenderTarget;
//     pixel_count: number;
//
//     protected _init(): void {
//         this._all_pixels = PIXELS_ALLOCATOR.allocateBuffer(MAX_RENDER_TARGET_SIZE/2)[0];
//         this._source_ray_directions = new Directions3D().init(MAX_RENDER_TARGET_SIZE/2);
//         this.rays = new Rays(this._controller.camera.transform.translation).init(MAX_RENDER_TARGET_SIZE/2);
//         this.render_target = new RenderTarget(this);
//
//         super._init();
//     }
//
//     update(): void {
//         if (this._controller.direction_changed)
//             this._updateRayDirections();
//     }
//
//     protected _updateRayDirections(): void {
//         this._source_ray_directions.mul(
//             this._controller.camera.transform.matrix,
//             this.rays.directions,
//             null,
//             0,
//             this.pixel_count
//         );
//     }
//
//     protected _resetRays(): void {
//         const width = this._size.width;
//         const height = this._size.height;
//         this.pixel_count = width * height;
//         this.pixels = this._all_pixels.subarray(0, this.pixel_count);
//
//         generateRayDirections(
//             this._source_ray_directions.array,
//             this._controller.camera.lense.focal_length,
//             width, height,
//         );
//
//         this._updateRayDirections();
//     }
//
//     reset(width: number, height: number, x: number, y: number): void {
//         super.reset(width, height, x, y);
//         this._resetRays();
//         this.render_target.reset();
//     }
//
//     refresh() {
//         this.pixels.fill(0);
//         this._render_pipeline.render(this);
//         this.render_target.array.set(this.pixels);
//         this.context.putImageData(this.render_target.image, this._position.x, this._position.y);
//         // this._drawOverlay();
//     }
//     protected _getGrid(): SWGrid {
//         return new SWGrid(this.render_target);
//     }
//
//     protected _getBorder(): SWBorder {
//         return new SWBorder();
//     }
// }