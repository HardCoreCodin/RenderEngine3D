import Scene from "../../nodes/scene.js";
import {Ray, RayHit} from "../../buffers/rays.js";
import {Position3D} from "../../accessors/position.js";
import {ImplicitGeometry} from "../../nodes/geometry.js";
import {intersectSphere} from "../../render/raytrace/_core/ray_sphere_intersection.js";

export default class Sphere extends ImplicitGeometry
{
    readonly center: Position3D;

    constructor(scene: Scene, public radius: number = 1, is_rigid: boolean = true, is_renderable: boolean = true) {
        super(scene, is_rigid, is_renderable);
        this.center = this.transform.translation;
    }

    intersect(ray: Ray, hit: RayHit): boolean {
        const distance = intersectSphere(this.radius, ray.closest_distance_squared,
            this.transform.translation.id, this.transform.translation.arrays,
            ray.origin.id, ray.origin.arrays,
            ray.direction.id, ray.direction.arrays,
            hit.position.id, hit.position.arrays,
            hit.surface_normal.id, hit.surface_normal.arrays
        );

        if (distance) {
            ray.closest_distance_squared = distance;
            return true;
        } else
            return false;
    }
}



// protected readonly _closest_position = pos3();
// protected readonly _temp_dir = dir3();
// protected readonly _ray_origin_to_sphere_center =  dir3();

//
// intersect2(ray: Ray, hit: RayHit): boolean {
//     const origin = ray.origin;
//     const direction = ray.direction;
//     const position = hit.position;
//
//     const radius = this.radius;
//     const center = this.center;
//     const temp_dir = this._temp_dir;
//     const closest_position = this._closest_position;
//     const ray_origin_to_sphere_center = this._ray_origin_to_sphere_center;
//
//     let distance_to_closest_position,
//         squared_radius,
//         squared_distance,
//         delta_distance_squared,
//         hit_distance_with_squared_delta,
//         hit_distance: number;
//
//     origin.to(center, ray_origin_to_sphere_center);
//
//     // A distance along the ray from it's origin to the closest position to the sphere's center:
//     distance_to_closest_position = ray_origin_to_sphere_center.dot(direction);
//     if (distance_to_closest_position <= 0)
//     // Closest position is behind the ray (early-bail)
//         return false;
//
//     origin.add(
//         direction.mul(distance_to_closest_position, temp_dir),
//         closest_position
//     );
//
//     squared_distance = closest_position.to(center, temp_dir).length_squared;
//     squared_radius = radius * radius;
//     if (squared_distance > squared_radius)
//     // Intersection would be outside of the sphere (early-bail)
//         return false;
//
//     delta_distance_squared = squared_radius - squared_distance;
//     hit_distance_with_squared_delta = distance_to_closest_position - delta_distance_squared;
//     if (hit_distance_with_squared_delta > ray.closest_distance_squared)
//         return false;
//
//     ray.closest_distance_squared = hit_distance_with_squared_delta;
//
//     if (delta_distance_squared > 0.001) {
//         // The ray goes through the sphere
//         hit_distance = distance_to_closest_position - Math.sqrt(delta_distance_squared);
//         if (hit_distance <= 0)
//         // The hit is behind the ray (no valid intersection)
//             return false;
//
//         origin.add(
//             // Use the closest hit distance
//             direction.mul(hit_distance, temp_dir),
//             position
//         );
//     } else
//     // The ray is tangent to the sphere
//         position.setFrom(closest_position);
//
//     center.to(position, hit.surface_normal).idiv(radius);
//
//     return true;
// }


// intersect(ray: Ray, hit: RayHit): boolean {
//     o = ray.origin;
//     d = ray.direction;
//     p = hit.position;
//     n = hit.surface_normal;
//     s = this.transform.translation;
//
//     O = o.arrays;
//     D = d.arrays;
//     P = p.arrays;
//     N = n.arrays;
//     S = s.arrays;
//
//     return intersectSphere(this.radius,
//         S[0][s.id], S[1][s.id], S[2][s.id],
//         O[0][o.id], O[1][o.id], O[2][o.id],
//         D[0][d.id], D[1][d.id], D[2][d.id],
//
//         p.id, P[0], P[1], P[2],
//         n.id, N[0], N[1], N[2]
//     );
// }


//
// o = ray.origin;
// d = ray.direction;
// p = intersection.position;
// n = intersection.surface_normal;
// s = this.transform.translation;
//
// O = o.arrays;
// D = d.arrays;
// P = p.arrays;
// N = n.arrays;
// S = s.arrays;
//
// return intersectSphere(this.radius,
//     S[0][s.id], S[1][s.id], S[2][s.id],
//     O[0][o.id], O[1][o.id], O[2][o.id],
//     D[0][d.id], D[1][d.id], D[2][d.id],
//
//     p.id, P[0], P[1], P[2],
//     n.id, N[0], N[1], N[2]
// );

