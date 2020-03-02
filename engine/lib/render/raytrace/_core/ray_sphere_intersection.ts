export const intersectSphere = (
    radius: number,
    closest_distance_squared: number,

    center_x: number,
    center_y: number,
    center_z: number,

    origin_x: number,
    origin_y: number,
    origin_z: number,

    raydir_x: number,
    raydir_y: number,
    raydir_z: number,

    hitpos: Float32Array,
    normal: Float32Array
) : number => {
    const squared_sphere_radius = radius * radius;

    const distance_from_origin_to_closest_position = (
        (center_x - origin_x) * raydir_x +
        (center_y - origin_y) * raydir_y +
        (center_z - origin_z) * raydir_z
    );
    if (distance_from_origin_to_closest_position <= 0)
        return 0;

    const closest_position_x = origin_x + distance_from_origin_to_closest_position * raydir_x;
    const closest_position_y = origin_y + distance_from_origin_to_closest_position * raydir_y;
    const closest_position_z = origin_z + distance_from_origin_to_closest_position * raydir_z;

    const closest_position_to_center_x = center_x - closest_position_x;
    const closest_position_to_center_y = center_y - closest_position_y;
    const closest_position_to_center_z = center_z - closest_position_z;

    const squared_distance_from_closest_position_to_center = (
        closest_position_to_center_x*closest_position_to_center_x +
        closest_position_to_center_y*closest_position_to_center_y +
        closest_position_to_center_z*closest_position_to_center_z
    );

    if (squared_distance_from_closest_position_to_center > squared_sphere_radius)
        return 0;

    const squared_delta = squared_sphere_radius - squared_distance_from_closest_position_to_center;
    const origin_to_closest_minus_squared_delta = distance_from_origin_to_closest_position - squared_delta;
    if (origin_to_closest_minus_squared_delta > closest_distance_squared)
        return 0;

    let hit_x = closest_position_x;
    let hit_y = closest_position_y;
    let hit_z = closest_position_z;

    if (squared_delta > 0.001) {
        const distance_to_intersection = distance_from_origin_to_closest_position - Math.sqrt(squared_delta);

        if (distance_to_intersection <= 0)
            return 0;

        hit_x = origin_x + distance_to_intersection * raydir_x;
        hit_y = origin_y + distance_to_intersection * raydir_y;
        hit_z = origin_z + distance_to_intersection * raydir_z;
    }

    hitpos[0] = hit_x;
    hitpos[1] = hit_y;
    hitpos[2] = hit_z;

    if (radius === 1) {
        normal[0] = hit_x - center_x;
        normal[1] = hit_y - center_y;
        normal[2] = hit_z - center_z;
    } else {
        const one_over_radius = 1 / radius;
        normal[0] = (hit_x - center_x) * one_over_radius;
        normal[1] = (hit_y - center_y) * one_over_radius;
        normal[2] = (hit_z - center_z) * one_over_radius;
    }

    return origin_to_closest_minus_squared_delta;
};