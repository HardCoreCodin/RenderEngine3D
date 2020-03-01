export const intersectSphere = (
    radius: number,
    closest_distance_squared: number,

    center_id: number, center: Float32Array[],
    origin_id: number, origin: Float32Array[],
    raydir_id: number, raydir: Float32Array[],

    hitpos_id: number, hitpos: Float32Array[],
    normal_id: number, normal: Float32Array[]
) : number => {
    const squared_sphere_radius = radius * radius;

    const center_x = center[0][center_id];
    const center_y = center[1][center_id];
    const center_z = center[2][center_id];

    const origin_x = origin[0][origin_id];
    const origin_y = origin[1][origin_id];
    const origin_z = origin[2][origin_id];

    const raydir_x = raydir[0][raydir_id];
    const raydir_y = raydir[1][raydir_id];
    const raydir_z = raydir[2][raydir_id];

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

    hitpos[0][hitpos_id] = hit_x;
    hitpos[1][hitpos_id] = hit_y;
    hitpos[2][hitpos_id] = hit_z;

    if (radius === 1) {
        normal[0][normal_id] = hit_x - center_x;
        normal[1][normal_id] = hit_y - center_y;
        normal[2][normal_id] = hit_z - center_z;
    } else {
        const one_over_radius = 1 / radius;
        normal[0][normal_id] = (hit_x - center_x) * one_over_radius;
        normal[1][normal_id] = (hit_y - center_y) * one_over_radius;
        normal[2][normal_id] = (hit_z - center_z) * one_over_radius;
    }

    return origin_to_closest_minus_squared_delta;
};

//
// export const intersectSphere = (
//     sphere_radius: number,
//     origin_to_closest_minus_squared_delta_so_far: number,
//
//     Sid: number, S: Float32Array[],
//     Oid: number, O: Float32Array[],
//     Did: number, D: Float32Array[],
//     hit_pos_id: number, hit_pos: Float32Array[],
//     hit_norm_id: number, hit_norm: Float32Array[],
// ): number => {
//     const squared_sphere_radius = sphere_radius * sphere_radius;
//
//     const center_x = S[0][Sid]; const center_y = S[1][Sid]; const center_z = S[2][Sid];
//     const origin_x = O[0][Oid]; const origin_y = O[1][Oid]; const origin_z = O[2][Oid];
//     const raydir_x = D[0][Did]; const raydir_y = D[1][Did]; const raydir_z = D[2][Did];
//
//     const distance_from_origin_to_closest_position = (
//         (center_x - origin_x) * raydir_x +
//         (center_y - origin_y) * raydir_y +
//         (center_z - origin_z) * raydir_z
//     );
//
//     if (distance_from_origin_to_closest_position <= 0)
//         return 0;
//
//     const closest_position_x = origin_x + distance_from_origin_to_closest_position * raydir_x;
//     const closest_position_y = origin_y + distance_from_origin_to_closest_position * raydir_y;
//     const closest_position_z = origin_z + distance_from_origin_to_closest_position * raydir_z;
//
//     const closest_position_to_center_x = center_x - closest_position_x;
//     const closest_position_to_center_y = center_y - closest_position_y;
//     const closest_position_to_center_z = center_z - closest_position_z;
//
//     const squared_distance_from_closest_position_to_center = (
//         closest_position_to_center_x*closest_position_to_center_x +
//         closest_position_to_center_y*closest_position_to_center_y +
//         closest_position_to_center_z*closest_position_to_center_z
//     );
//
//     if (squared_distance_from_closest_position_to_center > squared_sphere_radius)
//         return 0;
//
//     const squared_delta = squared_sphere_radius - squared_distance_from_closest_position_to_center;
//     const origin_to_closest_minus_squared_delta = distance_from_origin_to_closest_position - squared_delta;
//     if (origin_to_closest_minus_squared_delta > origin_to_closest_minus_squared_delta_so_far)
//         return 0;
//
//     let hit_x = closest_position_x;
//     let hit_y = closest_position_y;
//     let hit_z = closest_position_z;
//
//     if (squared_delta > 0.001) {
//         const distance_to_intersection = distance_from_origin_to_closest_position - Math.sqrt(squared_delta);
//
//         if (distance_to_intersection <= 0)
//             return 0;
//
//         hit_x = origin_x + distance_to_intersection * raydir_x;
//         hit_y = origin_y + distance_to_intersection * raydir_y;
//         hit_z = origin_z + distance_to_intersection * raydir_z;
//
//         if (sphere_radius === 1) {
//             hit_norm[0][hit_norm_id] = hit_x - center_x;
//             hit_norm[1][hit_norm_id] = hit_y - center_y;
//             hit_norm[2][hit_norm_id] = hit_z - center_z;
//         } else {
//             hit_norm[0][hit_norm_id] = (hit_x - center_x) / sphere_radius;
//             hit_norm[1][hit_norm_id] = (hit_y - center_y) / sphere_radius;
//             hit_norm[2][hit_norm_id] = (hit_z - center_z) / sphere_radius;
//         }
//     }
//
//     hit_pos[0][hit_pos_id] = hit_x;
//     hit_pos[1][hit_pos_id] = hit_y;
//     hit_pos[2][hit_pos_id] = hit_z;
//
//     if (sphere_radius === 1) {
//         hit_norm[0][hit_norm_id] = hit_x - center_x;
//         hit_norm[1][hit_norm_id] = hit_y - center_y;
//         hit_norm[2][hit_norm_id] = hit_z - center_z;
//     } else {
//         hit_norm[0][hit_norm_id] = (hit_x - center_x) / sphere_radius;
//         hit_norm[1][hit_norm_id] = (hit_y - center_y) / sphere_radius;
//         hit_norm[2][hit_norm_id] = (hit_z - center_z) / sphere_radius;
//     }
//
//     return origin_to_closest_minus_squared_delta;
// };
