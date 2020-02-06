export const intersectSphere = (
    sphere_radius: number,
    origin_to_closest_minus_squared_delta_so_far: number,

    Sid: number, S: Float32Array[],
    Oid: number, O: Float32Array[],
    Did: number, D: Float32Array[],
    hit_pos_id: number, hit_pos: Float32Array[],
    hit_norm_id: number, hit_norm: Float32Array[],
): number => {
    const squared_sphere_radius = sphere_radius * sphere_radius;

    const center_x = S[0][Sid]; const center_y = S[1][Sid]; const center_z = S[2][Sid];
    const origin_x = O[0][Oid]; const origin_y = O[1][Oid]; const origin_z = O[2][Oid];
    const raydir_x = D[0][Did]; const raydir_y = D[1][Did]; const raydir_z = D[2][Did];

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
    if (origin_to_closest_minus_squared_delta > origin_to_closest_minus_squared_delta_so_far)
        return 0;

    if (squared_delta > 0.001) {
        const distance_to_intersection = distance_from_origin_to_closest_position - Math.sqrt(squared_delta);

        if (distance_to_intersection <= 0)
            return 0;

        const hit_x = origin_x + distance_to_intersection * raydir_x;
        const hit_y = origin_y + distance_to_intersection * raydir_y;
        const hit_z = origin_z + distance_to_intersection * raydir_z;

        hit_pos[0][hit_pos_id] = hit_x;
        hit_pos[1][hit_pos_id] = hit_y;
        hit_pos[2][hit_pos_id] = hit_z;

        if (sphere_radius === 1) {
            hit_norm[0][hit_norm_id] = hit_x - center_x;
            hit_norm[1][hit_norm_id] = hit_y - center_y;
            hit_norm[2][hit_norm_id] = hit_z - center_z;
        } else {
            hit_norm[0][hit_norm_id] = (hit_x - center_x) / sphere_radius;
            hit_norm[1][hit_norm_id] = (hit_y - center_y) / sphere_radius;
            hit_norm[2][hit_norm_id] = (hit_z - center_z) / sphere_radius;
        }
    } else {
        hit_pos[0][hit_pos_id] = closest_position_x;
        hit_pos[1][hit_pos_id] = closest_position_y;
        hit_pos[2][hit_pos_id] = closest_position_z;

        if (sphere_radius === 1) {
            hit_norm[0][hit_norm_id] = closest_position_x - center_x;
            hit_norm[1][hit_norm_id] = closest_position_y - center_y;
            hit_norm[2][hit_norm_id] = closest_position_z - center_z;
        } else {
            hit_norm[0][hit_norm_id] = (closest_position_x - center_x) / sphere_radius;
            hit_norm[1][hit_norm_id] = (closest_position_y - center_y) / sphere_radius;
            hit_norm[2][hit_norm_id] = (closest_position_z - center_z) / sphere_radius;
        }
    }

    return origin_to_closest_minus_squared_delta;
};
