export const intersectSpheres = (
    sphere_radii: Float32Array,
    sphere_centers: Float32Array[],

    ray_origin: Float32Array,
    ray_direction: Float32Array,

    P: Float32Array, // The position of the closest intersection of the ray with the spheres
    N: Float32Array  // The direction of the surface of the sphere at the intersection position
) : boolean => {
    // O: The position that the ray originates from:
    const Ox = ray_origin[0];
    const Oy = ray_origin[1];
    const Oz = ray_origin[2];

    // The direction that the ray is aiming at:
    const Dx = ray_direction[0];
    const Dy = ray_direction[1];
    const Dz = ray_direction[2];

    let any_hit = false; // Track if the ray intersected any of the spheres

    let d, d2: number; // The distance from the origin to the position of the current intersection (and it's square)
    let r, r2: number; // The radius of the current sphere (and it's square)
    let Ix, Iy, Iz: number; // I: A position along the ray that intersects the current sphere
    let Sx, Sy, Sz: number;
    let Cx, Cy, Cz: number;
    let SCx, SCy, SCz: number;
    let OSx, OSy, OSz: number;

    let OCd: number;
    let ICd2: number;
    let CSd2: number;

    let cl_Sx, cl_Sy, cl_Sz: number; // The center position of the sphere of the closest intersection yet
    let cl_Px, cl_Py, cl_Pz: number; // The position of the closest intersection of the ray with the spheres yet
    let cl_OCd: number; // The distance from the ray's origin to that position along the ray for the closest intersection
    let cl_Cd2: number; // The square of the distance from that position to the closest intersection position
    let cl_OPd2 = Infinity; // The distance from the origin to the position of the closest intersection yet - squared

    // Loop over all the spheres and intersect the ray against them:
    for (const [sphere_index, sphere_center] of sphere_centers.entries()) {
        // S: The center position of the current sphere
        Sx = sphere_center[0];
        Sy = sphere_center[1];
        Sz = sphere_center[2];

        // OS: A direction from the ray's origin (O) to the current sphere's center (S)
        OSx = Sx - Ox;
        OSy = Sy - Oy;
        OSz = Sz - Oz;

        // The distance from the ray's origin (O) to a position along the ray closest to the current sphere's center
        OCd = Dx*OSx + Dy*OSy + Dz*OSz;

        // If that distance is zero, the ray originates at the center of the sphere.
        // If it's negative, it originates "in front" of the center of the sphere (it is behind it)
        // In either case there is no relevant intersection
        if (OCd <= 0)
            continue;

        // C: A position along the ray that is closest to the current sphere's center
        Cx = Ox + Dx*OCd;
        Cy = Oy + Dy*OCd;
        Cz = Oz + Dz*OCd;

        // SC: A direction from the current sphere's center to that position (C)
        SCx = Cx - Sx;
        SCy = Cy - Sy;
        SCz = Cz - Sz;

        // The (squared)length of that direction (SC).
        // It is the (squared)distance from center of the current sphere (S) to that closest position (C).
        CSd2 = SCx*SCx + SCy*SCy + SCz*SCz;

        // If that distance (squared) is greater than the sphere's radius (squared)
        // the ray missed the sphere and went passed by it:
        r = sphere_radii[sphere_index];
        r2 = r*r;
        if (CSd2 > r2)
            continue;

        // The (squared)distance from the current intersection position (I) to that closest position (C)
        ICd2 = r2 - CSd2;

        d2 = OCd - ICd2;
        if (d2 >= cl_OPd2)
            continue;

        cl_OPd2 = d2;
        cl_Cd2 = ICd2;
        cl_OCd = OCd;

        cl_Px = Cx;
        cl_Py = Cy;
        cl_Pz = Cz;

        cl_Sx = Sx;
        cl_Sy = Sy;
        cl_Sz = Sz;

        any_hit = true;
    }

    if (any_hit) {
        if (cl_Cd2 > 0.001) {
            d = cl_OCd - Math.sqrt(cl_Cd2);
            cl_Px = Ox + d*Dx;
            cl_Py = Oy + d*Dy;
            cl_Pz = Oz + d*Dz;
        }

        if (r === 1) {
            N[0] = cl_Px - cl_Sx;
            N[1] = cl_Py - cl_Sy;
            N[2] = cl_Pz - cl_Sz;
        } else {
            const one_over_radius = 1 / r;
            N[0] = (cl_Px - cl_Sx) * one_over_radius;
            N[1] = (cl_Py - cl_Sy) * one_over_radius;
            N[2] = (cl_Pz - cl_Sz) * one_over_radius;
        }

        P[0] = cl_Px;
        P[1] = cl_Py;
        P[2] = cl_Pz;
    }

    return any_hit;
};

export const intersectSphere = (
    radius: number,
    closest_distance_squared: number,

    center_x: number,
    center_y: number,
    center_z: number,

    // The position that the ray originates from:
    origin_x: number,
    origin_y: number,
    origin_z: number,

    // The direction that the ray is aiming at:
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