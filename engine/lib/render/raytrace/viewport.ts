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
    protected _source_ray_directions: Directions3D;
    protected _source_ray_directions_x: Float32Array;
    protected _source_ray_directions_y: Float32Array;
    protected _source_ray_directions_z: Float32Array;

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
        this._source_ray_directions.mul(this._controller.camera.transform.matrix, this.rays.directions);
    }

    protected _resetRays(): void {
        const width = this._size.width;
        const height = this._size.height;
        const pixel_count = width * height;
        if (pixel_count !== this.rays.directions.length) {
            this.rays.init(pixel_count);
            this._source_ray_directions.init(pixel_count);
            this._source_ray_directions_x = this._source_ray_directions.arrays[0];
            this._source_ray_directions_y = this._source_ray_directions.arrays[1];
            this._source_ray_directions_z = this._source_ray_directions.arrays[2];
        }

        generateRayDirections(
            this._controller.camera.lense.focal_length,
            this._position.x,
            this._position.y, width, height,
            this._source_ray_directions_x,
            this._source_ray_directions_y,
            this._source_ray_directions_z,
            this.rays.pixel_indices
        );

        this._updateRayDirections();
    }

    reset(width: number, height: number, x: number, y: number): void {
        super.reset(width, height, x, y);
        this._resetRays();
        this.render_target.reset();
    }

    protected _getGrid(): SWGrid {
        return new SWGrid(this.render_target);
    }

    protected _getBorder(): SWBorder {
        return new SWBorder();
    }
}

let pixel_count, width, height: number;