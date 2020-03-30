const intersectRayWithSpheres = (
    radii: Float32Array,
    centers: Float32Array,
    ROx: number, ROy: number, ROz: number, // The position that the ray originates from
    RDx: number, RDy: number, RDz: number, // The direction that the ray is aiming at
    hit_position: Float32Array, // The position of the closest intersection of the ray with the spheres
    hit_normal: Float32Array    // The direction of the surface of the sphere at the intersection position
) : boolean => {
    let r2, // The radius of the current sphere (and it's square)
        d, d2, // The distance from the origin to the position of the current intersection (and it's square)
        o2c, // The distance from the ray's origin to a position along the ray closest to the current sphere's center
        O2C, // The distance from the ray's origin to that position along the ray for the closest intersection
        r2_minus_d2, // The square of the distance from that position to the current intersection position
        R2_minus_D2, // The square of the distance from that position to the closest intersection position
        sx, sy, sz, // The center position of the sphere of the current intersection
        Sx, Sy, Sz, // The center position of the sphere of the closest intersection yet
        px, py, pz, // The position of the closest intersection of the ray with the spheres yet
        R : number = 0; // The radius of the closest intersecting sphere

    let D = Infinity; // The distance from the origin to the position of the closest intersection yet - squared

    // Loop over all the spheres and intersect the ray against them:
    let offset = 0;
    for (const r of radii) {
        r2 = r*r;
        sx = centers[offset++];
        sy = centers[offset++];
        sz = centers[offset++];

        o2c = (sx - ROx)*RDx + (sy - ROy)*RDy + (sz - ROz)*RDz;
        if (o2c > 0) {
            px = ROx + o2c*RDx;
            py = ROy + o2c*RDy;
            pz = ROz + o2c*RDz;

            d2 = (sx - px)**2 + (sy - py)**2 + (sz - pz)**2;
            if (d2 <= r2) {
                r2_minus_d2 = r2 - d2;
                d = o2c - r2_minus_d2;
                if (d > 0 && d <= D) {
                    D = d; R = r; O2C = o2c; R2_minus_D2 = r2_minus_d2;
                    Sx = sx; hit_position[0] = px;
                    Sy = sy; hit_position[1] = py;
                    Sz = sz; hit_position[2] = pz;
                }
            }
        }
    }

    if (R) {
        if (R2_minus_D2 > 0.001) {
            D = O2C - Math.sqrt(R2_minus_D2);
            hit_position[0] = ROx + D*RDx;
            hit_position[1] = ROy + D*RDy;
            hit_position[2] = ROz + D*RDz;
        }

        if (R === 1) {
            hit_normal[0] = hit_position[0] - Sx;
            hit_normal[1] = hit_position[1] - Sy;
            hit_normal[2] = hit_position[2] - Sz;
        } else {
            const one_over_radius = 1 / R;
            hit_normal[0] = (hit_position[0] - Sx) * one_over_radius;
            hit_normal[1] = (hit_position[1] - Sy) * one_over_radius;
            hit_normal[2] = (hit_position[2] - Sz) * one_over_radius;
        }

        return true;
    } else
        return false;
};

export default intersectRayWithSpheres;