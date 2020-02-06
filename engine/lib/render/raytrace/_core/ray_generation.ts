const sqrt = Math.sqrt;
let x_start,
    x_end,
    x_pixel,
    x_dir,
    x_dir_squared,

    y_start,
    y_end,
    y_pixel,
    y_dir,
    y_dir_squared,

    focal_length_squared,
    ray_direction_length,
    ray_direction_index,
    pixel_index: number;


export const generateRayDirections = (
    focal_length: number,

    viewport_x: number,
    viewport_y: number,

    width: number,
    height: number,

    X: Float32Array,
    Y: Float32Array,
    Z: Float32Array,

    pixel_indices: Uint32Array
): void => {
    x_end = width / 2;
    y_end = height / 2;

    x_start = 0.5 - x_end;
    y_start = 0.5 - y_end;

    ray_direction_index = 0;
    pixel_index = viewport_x * width + viewport_y;
    focal_length_squared = focal_length * focal_length;

    for (y_pixel = y_start; y_pixel < y_end; y_pixel++) {
        y_dir = (y_end - y_pixel) / width;
        y_dir_squared = y_dir * y_dir;

        for (x_pixel = x_start; x_pixel < x_end; x_pixel++) {
            x_dir = x_pixel / width;
            x_dir_squared = x_dir * x_dir;

            ray_direction_length = sqrt(x_dir_squared + y_dir_squared + focal_length_squared);

            X[ray_direction_index] = x_dir / ray_direction_length;
            Y[ray_direction_index] = y_dir / ray_direction_length;
            Z[ray_direction_index] = focal_length / ray_direction_length;

            pixel_indices[ray_direction_index++] = pixel_index++;
        }
    }
};