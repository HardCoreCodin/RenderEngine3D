import BaseViewport from "../_base/viewport.js";
import RenderTarget from "../_base/render_target.js";
import {generateRayDirections} from "./_core/ray_generation.js";
import {Directions3D} from "../../buffers/vectors.js";
import {SWBorder, SWGrid} from "../raster/software/viewport.js";
import Rays from "../../buffers/rays.js";


export default class RayTraceViewport
    extends BaseViewport<CanvasRenderingContext2D, SWGrid, SWBorder>
{
    render_target: RenderTarget;
    rays: Rays;
    pixels: Uint32Array;
    protected _source_ray_directions: Directions3D;

    protected _init(): void {
        this._source_ray_directions = new Directions3D();
        this.rays = new Rays(this._controller.camera.transform.translation);
        this.render_target = new RenderTarget(this);

        super._init();
    }

    update(): void {
        if (this._controller.direction_changed)
            this._updateRayDirections();
    }

    protected _updateRayDirections(): void {
        // this.rays.directions.array.set(this._source_ray_directions.array);
        this._source_ray_directions.mul(this._controller.camera.transform.matrix, this.rays.directions);
    }

    protected _resetRays(): void {
        const width = this._size.width;
        const height = this._size.height;
        const pixel_count = width * height;
        if (pixel_count !== this.rays.directions.length) {
            this.rays.init(pixel_count);
            this._source_ray_directions.init(pixel_count);
        }

        generateRayDirections(
            this._controller.camera.lense.focal_length,
            this._position.x,
            this._position.y,
            width,
            height,
            this._source_ray_directions.array,
        );

        this._updateRayDirections();
    }

    reset(width: number, height: number, x: number, y: number): void {
        super.reset(width, height, x, y);
        this._resetRays();
        this.render_target.reset();
        this.pixels = new Uint32Array(this.render_target.array.length);
    }

    refresh() {
        this.pixels.fill(0);
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