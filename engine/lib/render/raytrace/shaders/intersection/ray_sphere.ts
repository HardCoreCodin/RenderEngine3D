const S = new Float32Array(3); // The center position of the sphere of the closest intersection yet
const p = new Float32Array(3); // The position of the closest intersection of the ray with the spheres yet

const intersectRayWithSpheres = (
    radii: Float32Array,
    centers: Float32Array[],

    Ro: Float32Array, // The position that the ray originates from
    Rd: Float32Array, // The direction that the ray is aiming at

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

    // Loop over all the spheres and intersect the ray against them:
    for (const [i, s] of centers.entries()) {
        r = radii[i];
        r2 = r*r;

        o2c = (
            (s[0] - Ro[0]) * Rd[0] +
            (s[1] - Ro[1]) * Rd[1] +
            (s[2] - Ro[2]) * Rd[2]
        );
        if (o2c > 0) {
            p[0] = Ro[0] + o2c*Rd[0];
            p[1] = Ro[1] + o2c*Rd[1];
            p[2] = Ro[2] + o2c*Rd[2];

            d2 = (
                (s[0] - p[0]) ** 2 +
                (s[1] - p[1]) ** 2 +
                (s[2] - p[2]) ** 2
            );
            if (d2 <= r2) {
                r2_minus_d2 = r2 - d2;
                d = o2c - r2_minus_d2;
                if (d > 0 && d <= D) {
                    D = d;
                    R = r;
                    O2C = o2c;
                    R2_minus_D2 = r2_minus_d2;
                    S.set(s);
                    hit_position.set(p);
                }
            }
        }
    }

    if (R) {
        if (R2_minus_D2 > 0.001) {
            D = O2C - Math.sqrt(R2_minus_D2);
            hit_position[0] = Ro[0] + D*Rd[0];
            hit_position[1] = Ro[1] + D*Rd[1];
            hit_position[2] = Ro[2] + D*Rd[2];
        }

        if (R === 1) {
            hit_normal[0] = hit_position[0] - S[0];
            hit_normal[1] = hit_position[1] - S[1];
            hit_normal[2] = hit_position[2] - S[2];
        } else {
            const one_over_radius = 1 / R;
            hit_normal[0] = (hit_position[0] - S[0]) * one_over_radius;
            hit_normal[1] = (hit_position[1] - S[1]) * one_over_radius;
            hit_normal[2] = (hit_position[2] - S[2]) * one_over_radius;
        }

        return true;
    } else
        return false;
};

export default intersectRayWithSpheres;