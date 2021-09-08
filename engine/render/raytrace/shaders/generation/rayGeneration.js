export const generateRayDirections = (ray_directions, focal_length, width, height) => {
    const sqrt = Math.sqrt;
    const squared_focal_length = focal_length * focal_length;
    const one_over_width = 1 / width;
    let ray_direction_index = 0;
    let ray_direction_length = 0;
    let x, x_dir, x_dir_squared;
    let y, y_dir, y_dir_squared;
    for (y = height; y !== 0; y--) {
        y_dir = ((y + 0.5) * one_over_width) - 0.5;
        y_dir_squared = y_dir * y_dir;
        for (x = 0; x < width; x++) {
            x_dir = ((x + 0.5) * one_over_width) - 0.5;
            x_dir_squared = x_dir * x_dir;
            ray_direction_length = sqrt(x_dir_squared + y_dir_squared + squared_focal_length);
            ray_directions[ray_direction_index++] = x_dir / ray_direction_length;
            ray_directions[ray_direction_index++] = y_dir / ray_direction_length;
            ray_directions[ray_direction_index++] = focal_length / ray_direction_length;
        }
    }
};
//# sourceMappingURL=rayGeneration.js.map