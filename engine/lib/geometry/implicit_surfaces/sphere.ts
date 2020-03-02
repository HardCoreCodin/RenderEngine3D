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
        const distance = intersectSphere(
            this.radius,
            ray.closest_distance_squared,

            this.center.array,
            ray.origin.array,
            ray.direction.array,

            hit.position.array,
            hit.surface_normal.array
        );

        if (distance) {
            ray.closest_distance_squared = distance;
            return true;
        } else
            return false;
    }
    //
    // intersect(ray: Ray, hit: RayHit): boolean {
    //     const radius = this.radius;
    //     const squared_sphere_radius = radius * radius;
    //
    //     const center_x = this.center.x; const center_y = this.center.y; const center_z = this.center.z;
    //     const origin_x = ray.origin.x; const origin_y = ray.origin.y; const origin_z = ray.origin.z;
    //     const raydir_x = ray.direction.x; const raydir_y = ray.direction.y; const raydir_z = ray.direction.z;
    //
    //     const distance_from_origin_to_closest_position = (
    //         (center_x - origin_x) * raydir_x +
    //         (center_y - origin_y) * raydir_y +
    //         (center_z - origin_z) * raydir_z
    //     );
    //
    //     if (distance_from_origin_to_closest_position <= 0)
    //         return false;
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
    //         return false;
    //
    //     const squared_delta = squared_sphere_radius - squared_distance_from_closest_position_to_center;
    //     const origin_to_closest_minus_squared_delta = distance_from_origin_to_closest_position - squared_delta;
    //     if (origin_to_closest_minus_squared_delta > ray.closest_distance_squared)
    //         return false;
    //
    //     let hit_x = closest_position_x;
    //     let hit_y = closest_position_y;
    //     let hit_z = closest_position_z;
    //
    //     if (squared_delta > 0.001) {
    //         const distance_to_intersection = distance_from_origin_to_closest_position - Math.sqrt(squared_delta);
    //
    //         if (distance_to_intersection <= 0)
    //             return false;
    //
    //         hit_x = origin_x + distance_to_intersection * raydir_x;
    //         hit_y = origin_y + distance_to_intersection * raydir_y;
    //         hit_z = origin_z + distance_to_intersection * raydir_z;
    //     }
    //
    //     hit.position.x = hit_x;
    //     hit.position.y = hit_y;
    //     hit.position.z = hit_z;
    //
    //     if (radius === 1) {
    //         hit.surface_normal.x = hit_x - center_x;
    //         hit.surface_normal.y = hit_y - center_y;
    //         hit.surface_normal.z = hit_z - center_z;
    //     } else {
    //         hit.surface_normal.x = (hit_x - center_x) / radius;
    //         hit.surface_normal.y = (hit_y - center_y) / radius;
    //         hit.surface_normal.z = (hit_z - center_z) / radius;
    //     }
    //
    //     ray.closest_distance_squared = origin_to_closest_minus_squared_delta;
    //     return true;
    // }
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
//     O = o.array;
//     D = d.array;
//     P = p.array;
//     N = n.array;
//     S = s.array;
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
// O = o.array;
// D = d.array;
// P = p.array;
// N = n.array;
// S = s.array;
//
// return intersectSphere(this.radius,
//     S[0][s.id], S[1][s.id], S[2][s.id],
//     O[0][o.id], O[1][o.id], O[2][o.id],
//     D[0][d.id], D[1][d.id], D[2][d.id],
//
//     p.id, P[0], P[1], P[2],
//     n.id, N[0], N[1], N[2]
// );

