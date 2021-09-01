import {
    add_a_3D_vector_to_another_3D_vector_in_place,
    add_a_3D_vector_to_another_3D_vector_to_out,
    dot_a_3D_direction_with_a_direction_between_two_positions,
    dot_a_3D_direction_with_another_3D_direction,
    multiply_a_3D_vector_by_a_number_and_add_another_vector_to_out,
    multiply_a_3D_vector_by_a_number_in_place,
    multiply_a_3D_vector_by_a_number_to_out,
    negate_a_3D_direction_in_place,
    square_the_distance_from_a_3D_positions_to_another_3D_position,
    square_the_length_of_a_3D_direction,
    subtract_a_3D_vector_from_another_3D_vector_to_out
} from "../../../../math/vec3.js";

export const intersectRayWithSpheres1 = (
    radii: Float32Array,
    centers: Float32Array[],
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
    let r, offset = 0;
    for (const center of centers) {
        r = radii[offset++];
        r2 = r*r;
        sx = center[0];
        sy = center[1];
        sz = center[2];

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

const s = new Float32Array(3); // The center position of the sphere of the current intersection
const S = new Float32Array(3); // The center position of the sphere of the closest intersection yet
const p = new Float32Array(3); // The position of the closest intersection of the ray with the spheres yet
const t = new Float32Array(3);
const RD = new Float32Array(3);
const RO_to_s = new Float32Array(3);

export const intersectRayWithSpheres2 = (
    radii: Float32Array,
    centers: Float32Array[],
    RO: Float32Array, // The position that the ray originates from
    RD: Float32Array, // The direction that the ray is aiming at
    hit_position: Float32Array, // The position of the closest intersection of the ray with the spheres
    hit_normal: Float32Array    // The direction of the surface of the sphere at the intersection position
) : boolean => {
    let r, r2, // The radius of the current sphere (and it's square)
        d, d2, // The distance from the origin to the position of the current intersection (and it's square)
        o2c, // The distance from the ray's origin to a position along the ray closest to the current sphere's center
        O2C, // The distance from the ray's origin to that position along the ray for the closest intersection
        r2_minus_d2, // The square of the distance from that position to the current intersection position
        R2_minus_D2, // The square of the distance from that position to the closest intersection position
        sx, sy, sz, // The center position of the sphere of the current intersection
        // Sx, Sy, Sz, // The center position of the sphere of the closest intersection yet
        px, py, pz, // The position of the closest intersection of the ray with the spheres yet
        R : number = 0; // The radius of the closest intersecting sphere

    let D = Infinity; // The distance from the origin to the position of the closest intersection yet - squared

    const RDx = RD[0];
    const RDy = RD[1];
    const RDz = RD[2];
    const ROx = RO[0];
    const ROy = RO[1];
    const ROz = RO[2];
    // let S;

    // Loop over all the spheres and intersect the ray against them:
    let i = 0;
    for (const center of centers) {
        r = radii[i++];
        r2 = r*r;
        sx = center[0];
        sy = center[1];
        sz = center[2];
        //
        // subtract_a_3D_vector_from_another_3D_vector_to_out(center, RO, RO_to_s);
        // o2c = dot_a_3D_direction_with_another_3D_direction(RD, RO_to_s);
        // o2c = dot_a_3D_direction_with_a_direction_between_two_positions(RD, RO, center);
        o2c = (sx - ROx)*RDx + (sy - ROy)*RDy + (sz - ROz)*RDz;
        if (o2c > 0) {
            // multiply_a_3D_vector_by_a_number_and_add_another_vector_to_out(RD, o2c, RO, p);
            px = ROx + o2c*RDx;
            py = ROy + o2c*RDy;
            pz = ROz + o2c*RDz;
            // d2 = square_the_distance_from_a_3D_positions_to_another_3D_position(p, center);
            d2 = (sx - px)**2 + (sy - py)**2 + (sz - pz)**2;
            if (d2 <= r2) {
                r2_minus_d2 = r2 - d2;
                d = o2c - r2_minus_d2;
                if (d > 0 && d <= D) {
                    D = d; R = r; O2C = o2c; R2_minus_D2 = r2_minus_d2;
                    // S = center;
                    S[0] = sx;
                    S[1] = sy;
                    S[2] = sz;

                    hit_position[0] = px;
                    hit_position[1] = py;
                    hit_position[2] = pz;
                }
            }
        }
    }

    if (R) {
        if (R2_minus_D2 > 0.001) multiply_a_3D_vector_by_a_number_and_add_another_vector_to_out(RD, O2C - Math.sqrt(R2_minus_D2), RO, hit_position);
        subtract_a_3D_vector_from_another_3D_vector_to_out(hit_position, S, hit_normal);
        if (R !== 1) multiply_a_3D_vector_by_a_number_in_place(hit_normal, 1 / R);
        return true;
    } else
        return false;
    //
    //
    // let r, r2, // The radius of the current sphere (and it's square)
    //     d, d2, // The distance from the origin to the position of the current intersection (and it's square)
    //     o2c, // The distance from the ray's origin to a position along the ray closest to the current sphere's center
    //     O2C, // The distance from the ray's origin to that position along the ray for the closest intersection
    //     r2_minus_d2, // The square of the distance from that position to the current intersection position
    //     R2_minus_D2, // The square of the distance from that position to the closest intersection position
    //     R : number = 0; // The radius of the closest intersecting sphere
    //
    // let D = Infinity; // The distance from the origin to the position of the closest intersection yet - squared
    //
    // const sphere_count = radii.length;
    // // Loop over all the spheres and intersect the ray against them:
    // for (let i = 0; i < sphere_count; i++) {
    //     r = radii[i];
    //     r2 = r**2;
    //     s.set(centers[i]);
    //
    //     subtract_a_3D_vector_from_another_3D_vector_to_out(s, RO, t);
    //     o2c = dot_a_3D_direction_with_another_3D_direction(t, RD);
    //     if (o2c > 0) {
    //         multiply_a_3D_vector_by_a_number_to_out(RD, o2c, t);
    //         add_a_3D_vector_to_another_3D_vector_to_out(RO, t, p);
    //         subtract_a_3D_vector_from_another_3D_vector_to_out(s, p, t);
    //         d2 = square_the_length_of_a_3D_direction(t);
    //         if (d2 <= r2) {
    //             r2_minus_d2 = r2 - d2;
    //             d = o2c - r2_minus_d2;
    //             if (d > 0 && d <= D) {
    //                 S.set(s); D = d; R = r; O2C = o2c; R2_minus_D2 = r2_minus_d2;
    //                 hit_position.set(p);
    //             }
    //         }
    //     }
    // }
    //
    // if (R) {
    //     if (R2_minus_D2 > 0.001) {
    //         multiply_a_3D_vector_by_a_number_to_out(RD, O2C - Math.sqrt(R2_minus_D2), t);
    //         add_a_3D_vector_to_another_3D_vector_to_out(RO, t, hit_position);
    //     }
    //
    //     subtract_a_3D_vector_from_another_3D_vector_to_out(hit_position, S, hit_normal);
    //     if (R != 1)
    //         multiply_a_3D_vector_by_a_number_in_place(hit_normal, 1 / R);
    //
    //     return true;
    // } else
    //     return false;
};

const intersectRayWithSpheres = (
    radii: Float32Array,
    centers: Float32Array,
    RO: Float32Array, // The position that the ray originates from
    RDs: Float32Array, // The direction that the ray is aiming at
    offset: number,
    hit_position: Float32Array, // The position of the closest intersection of the ray with the spheres
    hit_normal: Float32Array    // The direction of the surface of the sphere at the intersection position
) : boolean => {
    let r, r2, // The radius of the current sphere (and it's square)
        d, d2, // The distance from the origin to the position of the current intersection (and it's square)
        o2c, // The distance from the ray's origin to a position along the ray closest to the current sphere's center
        O2C, // The distance from the ray's origin to that position along the ray for the closest intersection
        r2_minus_d2, // The square of the distance from that position to the current intersection position
        R2_minus_D2, // The square of the distance from that position to the closest intersection position
        R : number = 0; // The radius of the closest intersecting sphere

    let D = Infinity; // The distance from the origin to the position of the closest intersection yet - squared
    RD[0] = RDs[offset++];
    RD[1] = RDs[offset++];
    RD[2] = RDs[offset  ];

    const sphere_count = radii.length;
    // Loop over all the spheres and intersect the ray against them:
    offset = 0;
    for (let i = 0; i < sphere_count; i++) {
        r = radii[i];
        r2 = r**2;
        s[0] = centers[offset++];
        s[1] = centers[offset++];
        s[2] = centers[offset++];

        subtract_a_3D_vector_from_another_3D_vector_to_out(s, RO, t);
        o2c = dot_a_3D_direction_with_another_3D_direction(t, RD);
        if (o2c > 0) {
            multiply_a_3D_vector_by_a_number_to_out(RD, o2c, t);
            add_a_3D_vector_to_another_3D_vector_to_out(RO, t, p);
            subtract_a_3D_vector_from_another_3D_vector_to_out(s, p, t);
            d2 = square_the_length_of_a_3D_direction(t);
            if (d2 <= r2) {
                r2_minus_d2 = r2 - d2;
                d = o2c - r2_minus_d2;
                if (d > 0 && d <= D) {
                    S.set(s); D = d; R = r; O2C = o2c; R2_minus_D2 = r2_minus_d2;
                    hit_position.set(p);
                }
            }
        }
    }

    if (R) {
        if (R2_minus_D2 > 0.001) {
            multiply_a_3D_vector_by_a_number_to_out(RD, O2C - Math.sqrt(R2_minus_D2), t);
            add_a_3D_vector_to_another_3D_vector_to_out(RO, t, hit_position);
        }

        subtract_a_3D_vector_from_another_3D_vector_to_out(hit_position, S, hit_normal);
        if (R != 1)
            multiply_a_3D_vector_by_a_number_in_place(hit_normal, 1 / R);

        return true;
    } else
        return false;
};

export default intersectRayWithSpheres;