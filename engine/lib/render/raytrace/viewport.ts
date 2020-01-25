import RasterCamera from "../raster/software/nodes/camera.js";
import BaseViewport from "../_base/viewport.js";
import RenderTarget from "../_base/render_target.js";
import {Positions3D} from "../../attributes/vector/positions.js";
import {Directions3D} from "../../attributes/vector/directions.js";
import {generateRayDirections} from "./_core/ray_generation.js";
import {ISize} from "../../_interfaces/render.js";
import {I2D} from "../../_interfaces/vectors.js";


export default class RayTraceViewport
    extends BaseViewport<CanvasRenderingContext2D, RasterCamera>
{
    render_target: RenderTarget;

    readonly ray_positions = new Positions3D();
    readonly ray_directions = new Directions3D();
    readonly ray_directions_transformed = new Directions3D();

    protected _updateRayPositions(): void {
        this.ray_directions.mul4AsPos(this._controller.camera.transform.matrix, this.ray_positions);
    }

    protected _updateRayDirections(): void {
        this.ray_directions.mul4(this._controller.camera.transform.matrix, this.ray_directions_transformed);
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

        ray_directions_x = this.ray_directions.arrays[0];
        ray_directions_y = this.ray_directions.arrays[1];
        ray_directions_z = this.ray_directions.arrays[2];

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

            ray_directions_x,
            ray_directions_y,
            ray_directions_z
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
        this.render_target.reset();
        this._resetRays();
    }

    protected _init(size?: ISize, position?: I2D): void {
        super._init(size, position);
        this.render_target = new RenderTarget(this);
    }
}

let ray_directions_x,
    ray_directions_y,
    ray_directions_z: Float32Array;

let pixel_count,
    width,
    height,

    x_start, x_end,
    y_start, y_end: number;