export const generateRayDirections = (
    focal_length: number,

    viewport_x: number,
    viewport_y: number,

    width: number,
    height: number,

    X: Float32Array,
    Y: Float32Array,
    Z: Float32Array
): void => {
    const sqrt = Math.sqrt;
    const squared_focal_length = focal_length * focal_length;
    const one_over_width = 1 / width;
    let ray_direction_index = 0;
    let ray_direction_length = 0;
    let x, x_dir, x_dir_squared;
    let y, y_dir, y_dir_squared;

    for (y = 0; y < height; y++) {
        y_dir = ((y + 0.5) * one_over_width) - 0.5;
        y_dir_squared = y_dir * y_dir;

        for (x = 0; x < width; x++) {
            x_dir = ((x + 0.5) * one_over_width) - 0.5;
            x_dir_squared = x_dir * x_dir;

            ray_direction_length = sqrt(x_dir_squared + y_dir_squared + squared_focal_length);

            X[ray_direction_index] = x_dir / ray_direction_length;
            Y[ray_direction_index] = y_dir / ray_direction_length;
            Z[ray_direction_index] = focal_length / ray_direction_length;
            ray_direction_index++;
        }
    }
};