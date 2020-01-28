import BaseViewport from "../_base/viewport.js";
import RenderTarget from "../_base/render_target.js";
import {generateRayDirections} from "./_core/ray_generation.js";
import {Directions3D, Positions3D} from "../../buffers/vectors.js";


export default class RayTraceViewport
    extends BaseViewport<CanvasRenderingContext2D>
{
    render_target: RenderTarget;
    ray_positions: Positions3D;
    ray_directions: Directions3D;
    ray_directions_transformed: Directions3D;

    protected _updateRayPositions(): void {
        this.ray_positions.setFrom(this.ray_directions).imul(this._controller.camera.transform.matrix);
    }

    protected _updateRayDirections(): void {
        this.ray_directions.mul(this._controller.camera.transform.matrix, this.ray_directions_transformed);
        this._updateRayPositions();
    }

    protected _resetRays(): void {
        width = this._size.width;
        height = this._size.height;

        pixel_count = width * height;
        if (pixel_count !== this.ray_positions.length) {
            this.ray_positions.init(pixel_count);
            this.ray_directions.init(pixel_count);
            this.ray_directions_transformed.init(pixel_count);
        }

        x_end = width / 2;
        y_end = height / 2;

        x_start = 0.5 - x_end;
        y_start = 0.5 - y_end;

        generateRayDirections(
            this._controller.camera.lense.focal_length,

            x_start,
            y_start,

            x_end,
            y_end,

            this.ray_directions.arrays[0],
            this.ray_directions.arrays[1],
            this.ray_directions.arrays[2]
        );

        this._updateRayDirections();
    }

    update(): void {
        if (this._controller.direction_changed)
            this._updateRayDirections();
        else if (this._controller.position_changed)
            this._updateRayPositions();
    }

    reset(width: number, height: number, x: number, y: number): void {
        super.reset(width, height, x, y);
        this._resetRays();
        this.render_target.reset();
    }

    protected _init(): void {
        this.ray_positions = new Positions3D();
        this.ray_directions = new Directions3D();
        this.ray_directions_transformed = new Directions3D();
        this.render_target = new RenderTarget(this);
        super._init();
    }
}

let pixel_count,
    width,
    height,

    x_start, x_end,
    y_start, y_end: number;