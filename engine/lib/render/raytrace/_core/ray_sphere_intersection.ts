export const intersectSpheres = (
    sphere_radii: Float32Array,
    sphere_centers: Float32Array[],

    ray_origin: Float32Array,
    ray_directions: Float32Array,
    ray_directions_offset: number,

    P: Float32Array, // The position of the closest intersection of the ray with the spheres
    N: Float32Array  // The direction of the surface of the sphere at the intersection position
) : boolean => {
    // The position that the ray originates from:
    const Ox = ray_origin[0];
    const Oy = ray_origin[1];
    const Oz = ray_origin[2];

    // The direction that the ray is aiming at:
    const Dx = ray_directions[ray_directions_offset  ];
    const Dy = ray_directions[ray_directions_offset+1];
    const Dz = ray_directions[ray_directions_offset+2];

    let any_hit = false; // Track if the ray intersected any of the spheres
    let r, r2: number; // The radius of a sphere (and it's square)
    let d, d2: number; // The distance from the origin to the position of the current intersection (and it's square)
    let cd2: number; // The distance from the origin to the position of the closest intersection yet - squared
    let CI_Px, CI_Py, CI_Pz: number; // The position of the closest intersection of the ray with the spheres yet
    let CI_Sx, CI_Sy, CI_Sz: number; // The center position of the sphere of the closest intersection yet
    let Sx, Sy, Sz: number; // The center position of a sphere
    let Cx, Cy, Cz: number; // A position along the ray that is closest to the sphere's center
    let ICd2: number;   // The square of the distance from that position to an intersection position
    let CI_Cd2: number; // The square of the distance from that position to the closest intersection position
    let OCd: number;    // The distance from the ray's origin to that position along the ray
    let CI_OCd: number; // The distance from the ray's origin to that position along the ray for the closest intersection
    let CSx, CSy, CSz: number; // A direction from that position along the ray towards the sphere's center
    let CSd2: number; // The length of that direction - squared
    // It is the square of the distance from that position along the ray to the center of the sphere.

    // To begin with, position the closest intersection at infinity
    cd2 = Infinity;

    // Loop over all the spheres and intersect the ray against them:
    for (const [sphere_index, sphere_center] of sphere_centers.entries()) {
        Sx = sphere_center[0];
        Sy = sphere_center[1];
        Sz = sphere_center[2];
        r = sphere_radii[sphere_index];
        r2 = r*r;

        OCd = (
            (Sx - Ox) * Dx +
            (Sy - Oy) * Dy +
            (Sz - Oz) * Dz
        );

        // If that distance is zero, the ray originates at the center of the sphere.
        // If it's negative, it originates "in front" of the center of the sphere (it is behind it)
        // In either case there is no relevant intersection
        if (OCd <= 0)
            continue;

        Cx = Ox + Dx*OCd;
        Cy = Oy + Dy*OCd;
        Cz = Oz + Dz*OCd;

        CSx = Sx - Cx;
        CSy = Sy - Cy;
        CSz = Sz - Cz;

        CSd2 = (
            CSx*CSx +
            CSy*CSy +
            CSz*CSz
        );

        // If the distance is larger than the sphere's radius
        // (or it's square is larger than the square of the sphere's radius)
        // the ray missed the sphere and went passed by it
        if (CSd2 > r2)
            continue;

        ICd2 = r2 - CSd2;
        d2 = OCd - ICd2;
        if (d2 < 0 || d2 >= cd2)
            continue;

        cd2 = d2;
        CI_Cd2 = ICd2;
        CI_OCd = OCd;

        CI_Px = Cx;
        CI_Py = Cy;
        CI_Pz = Cz;

        CI_Sx = Sx;
        CI_Sy = Sy;
        CI_Sz = Sz;

        any_hit = true;
    }

    if (any_hit) {
        if (CI_Cd2 > 0.001) {
            d = CI_OCd - Math.sqrt(CI_Cd2);
            CI_Px = Ox + d*Dx;
            CI_Py = Oy + d*Dy;
            CI_Pz = Oz + d*Dz;
        }

        if (r === 1) {
            N[0] = CI_Px - CI_Sx;
            N[1] = CI_Py - CI_Sy;
            N[2] = CI_Pz - CI_Sz;
        } else {
            const one_over_radius = 1 / r;
            N[0] = (CI_Px - CI_Sx) * one_over_radius;
            N[1] = (CI_Py - CI_Sy) * one_over_radius;
            N[2] = (CI_Pz - CI_Sz) * one_over_radius;
        }

        P[0] = CI_Px;
        P[1] = CI_Py;
        P[2] = CI_Pz;
    }

    return any_hit;
};

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