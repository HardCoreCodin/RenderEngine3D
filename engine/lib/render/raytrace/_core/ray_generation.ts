const sqrt = Math.sqrt;
let x, focal_length_squared,
    y, y_squared,
    ray_direction_length,
    ray_direction_index: number;


const generateRayPositions = (
    ray_direction_x: Float32Array,
    ray_direction_y: Float32Array,
    ray_direction_z: Float32Array,

    X: Float32Array,
    Y: Float32Array,
    Z: Float32Array
): void => {

};

export const generateRayDirections = (
    focal_length: number,

    x_start: number,
    y_start: number,

    x_end: number,
    y_end: number,

    X: Float32Array,
    Y: Float32Array,
    Z: Float32Array
): void => {
    focal_length_squared = focal_length * focal_length;
    ray_direction_index = 0;

    for (y = y_start; y < y_end; y++) {
        y_squared = y * y;

        for (x = x_start; x < x_end; x++) {
            ray_direction_length = sqrt(x*x + y_squared + focal_length_squared);

            X[ray_direction_index] = x / ray_direction_length;
            Y[ray_direction_index] = y / ray_direction_length;
            Z[ray_direction_index] = focal_length / ray_direction_length;

            ray_direction_index++;
        }
    }
};