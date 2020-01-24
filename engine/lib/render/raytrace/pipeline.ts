import RenderTarget from "../_base/render_target.js";
import RasterCamera from "../raster/software/nodes/camera.js";
import RayTraceViewport from "./viewport.js";
import Canvas2DRenderPipeline from "../_base/pipelines.js";
import {Positions4D} from "../../attributes/vector/positions.js";
import {Directions3D} from "../../attributes/vector/directions.js";

let render_target: RenderTarget;

let ray_directions_x,
    ray_directions_y,
    ray_directions_z: Float32Array;

let pixel_count,
    width,
    height,

    x, x_start, x_end,
    y, y_start, y_end,

    ray_direction_index: number;


export default class RayTracer extends Canvas2DRenderPipeline<RayTraceViewport>
{
    protected _ray_directions = new Directions3D();
    protected _ray_positions = new Positions4D();

    // protected _ray_directions_transform = mat4();

    // _generateRayDirections(width: number, height: number, focal_length: number, camera_transform: Matrix4x4): void {
        // camera_transform.invert(this._ray_directions_transform).transpose();
    protected _generateRays(width: number, height: number, camera: RasterCamera): void {
        pixel_count = width * height;
        if (pixel_count !== this._ray_directions.length) {
            this._ray_directions.init(pixel_count);
            this._ray_positions.init(pixel_count);
        }

        ray_directions_x = this._ray_directions.arrays[0];
        ray_directions_y = this._ray_directions.arrays[1];
        ray_directions_z = this._ray_directions.arrays[2];
        ray_directions_z.fill(camera.lense.focal_length);

        x_end = width / 2;
        y_end = height / 2;

        x_start = 0.5 - x_end;
        y_start = 0.5 - y_end;

        ray_direction_index = 0;

        for (y = y_start; y < y_end; y++) {
            for (x = x_start; x < x_end; x++) {
                ray_directions_x[ray_direction_index] = x;
                ray_directions_y[ray_direction_index] = y;
                ray_direction_index++;
            }
        }

        this._ray_directions.normalize();
        this._ray_positions.setFrom(this._ray_directions);
        this._ray_positions.mul(camera.transform.matrix);
        this._ray_directions.mul(camera.transform.rotation.matrix);

        // this._ray_directions.normalize().mul(this._ray_directions_transform);
    }

    _render(viewport: RayTraceViewport): void {
        // if (!this.scene.mesh_geometries.mesh_count)
        //     return;

        render_target = this._render_target;

        width = viewport.width;
        height = viewport.height;

        this._generateRays(width, height, viewport.camera);

        y_start = viewport.y;
        x_start = viewport.x;

        y_end = y_start + height;
        x_end = x_start + width;

        ray_directions_x = this._ray_positions.arrays[0];
        ray_directions_y = this._ray_positions.arrays[1];
        ray_directions_z = this._ray_positions.arrays[2];
        ray_direction_index = 0;

        for (y = y_start; y < y_end; y++) {
            for (x = x_start; x < x_end; x++) {
                render_target.putPixel(
                    x, y,
                    ray_directions_x[ray_direction_index],
                    ray_directions_y[ray_direction_index],
                    ray_directions_z[ray_direction_index],
                    1
                );
                ray_direction_index++;
            }
        }
    }
}