import {Float3, Float4, T2, T3} from "../../../../../types.js";
import {ABOVE, BELOW, CLIP, CULL, FAR, INSIDE, LEFT, NDC, NEAR, OUT, RIGHT} from "../../../../../constants.js";

export const cullVertices = (
    arrays: Float32Array[],
    vertex_flags: Uint8Array,
    vertex_count: number
): number => {
    // Check vertex positions against the frustum:
    // ----------------------------------------------------
    // For each vertex, check where it is in relation to the view frustum,
    // and collect the results into a flags array (single number bit-pattern per-vertex).
    // While doing so, keep track of which side(s) of the frustum are shared by all vertices.
    // When done, first analyze the results before continuing to phase 2.
    // Early bail-out if any of these conditions are met:
    // A. The entire mesh is outside the frustum - early return with the CULL flag.
    // B. The entire mesh is inside the frustum - early return with the INSIDE flag.
    // C. No geometric clipping is needed - early return with the INSIDE flag.
    vertex_flags.fill(CULL);

    let has_inside, has_near: boolean;
    has_inside = has_near = false;

    let directions, shared_directions, w, x, y, z: number;
    directions = shared_directions = OUT;

    for (let i = 0; i < vertex_count; i++) {
        x = arrays[i][0];
        y = arrays[i][1];
        z = arrays[i][2];
        w = arrays[i][3];

        if (z < 0) {
            has_near = true;

            directions = NEAR;
        } else if (z > w)
            directions = FAR;
        else
            directions = 0;

        if (w < 0) w = -w;
        if (x > w)
            directions |= RIGHT;
        else if (x < -w)
            directions |= LEFT;

        if (y > w)
            directions |= ABOVE;
        else if (y < -w)
            directions |= BELOW;

        if (directions) {
            // This vertex is outside of the view frustum.
            vertex_flags[i] = directions;
            // Note: This flag 'may' get removed from this vertex before the perspective-devide
            // (so it won't be skipped, essentially bringing it back) if it's still needed for culling/clipping.

            // Intersect the shared directions so-far, against this current out-direction:
            shared_directions &= directions;
            // Note: This will end-up beign zero if either:
            // A. All vertices are inside the frustum - no need for face clipping.
            // B. All vertices are outside the frustum in at least one direction shared by all.
            //   (All vertices are above and/or all vertices on the left and/or all vertices behind, etc.)
        } else {
            has_inside = true;
            vertex_flags[i] = NDC;
        }
    }

    if (!has_inside && shared_directions)
    // All vertices are completely outside, and all share at least one out-region.
    // The entire mesh is completely outside the frustum and does not intersect it in any way.
    // It can be safely culled altogether.
        return CULL;
    // else:
    // The mesh intersects the frustum in some way

    return has_near ? CLIP
        // At lease one vertex is outside the view frustum behind the near clipping plane.
        // The geometry needs to be checked for clipping.
        :
        // No vertex is behind the near clipping plane.
        // Since geometric clipping is done only against the near clipping plane, there is nothing to clip.
        // The other sides of the frustum would get raster-clipped later by clamping pixels outside the screen.
        INSIDE;
};

export const cullFaces = <FaceVerticesArrayType extends Uint8Array|Uint16Array|Uint32Array = Uint32Array>(
    [X, Y, Z, W]: Float4,
    [v1, v2, v3]: T3<FaceVerticesArrayType>,

    face_count: number,
    face_flags: Uint8Array,
    vertex_flags: Uint8Array,

    check_for_clipping: boolean = false,
    cull_back_faces: boolean = false,
    pz?: number
): number => {
    // Check face intersections against the frustum:
    face_flags.fill(CULL);

    let has_inside, has_near: boolean;
    has_inside = has_near = false;

    let v1_index, v1_flags, x1, y1, z1, d1_x, d1_y, d1_z,
        v2_index, v2_flags, x2, y2, z2, d2_x, d2_y, d2_z,
        v3_index, v3_flags, x3, y3, z3, nx, ny, nz, dot: number;

    for (let f = 0; f < face_count; f++) {
        // Fetch the index and out-direction flags of each of the face's vertices:
        v1_index = v1[f];
        v2_index = v2[f];
        v3_index = v3[f];
        v1_flags = vertex_flags[v1_index] & OUT;
        v2_flags = vertex_flags[v2_index] & OUT;
        v3_flags = vertex_flags[v3_index] & OUT;

        if (v1_flags | v2_flags | v3_flags) {
            // One or more vertices are outside - check edges for intersections:
            if (v1_flags & v2_flags & v3_flags) {
                // All vertices share one or more out-direction(s).
                // The face is fully outside the frustum, and does not intersect it.
                face_flags[f] = CULL;
                continue;
                // Note: This includes the cases where "all" 3 vertices cross the near clipping plane.
                // Below there are checks for when "any" of the vertices cross it (1 or 2, but not 3).
            } // else:
            // One or more vertices are outside, and no out-direction is shared across them.
            // The face is visible in the view frustum in some way.

            if (cull_back_faces) {
                // Check face orientation "early" (before the perspective divide)
                // Note:
                // This assumes that vertex positions were provided in 'clip' or 'view' space(!).
                // Also, that projected_origin_x/y/z were provided - these are the coordinates of the origin
                // which has the projection matrix alone applied to them.
                x1 = X[v1_index]; x2 = X[v2_index]; x3 = X[v3_index];
                y1 = Y[v1_index]; y2 = Y[v2_index]; y3 = Y[v3_index];
                z1 = Z[v1_index]; z2 = Z[v2_index]; z3 = Z[v3_index];

                // Compute 2 direction vectors forming a plane for the face:
                d1_x = x2 - x1; d2_x = x3 - x1;
                d1_y = y2 - y1; d2_y = y3 - y1;
                d1_z = z2 - z1; d2_z = z3 - z1;

                // Compute a normal vector of the face from these 2 direction vectors:
                nx = (d1_y * d2_z) -
                    (d1_z * d2_y);
                ny = (d1_z * d2_x) -
                    (d1_x * d2_z);
                nz = (d1_x * d2_y) -
                    (d1_y * d2_x);

                // Dot the vector from the face to the origin with the normal:
                dot = nz*(pz - z1) - ny*y1 - nx*x1;

                if (dot > 0) {
                    // if the angle is than 90 degrees the face is facing the camera
                    has_inside = true;
                    face_flags[f] = INSIDE;
                } else {
                    // if the angle is 90 the face is at grazing angle to the camera.
                    // if the angle is greater then 90 degreesm the face faces away from the camera.
                    face_flags[f] = CULL;
                    continue;
                }
            }

            has_inside = true;

            if (check_for_clipping) {
                // Check if any vertex crosses the near clipping plane:
                if (v1_flags & NEAR ||
                    v2_flags & NEAR ||
                    v3_flags & NEAR) {
                    // There is at least one vertex behind the near clipping plane.
                    // There face needs to be clipped:
                    vertex_flags[v1_index] |= NDC;
                    vertex_flags[v2_index] |= NDC;
                    vertex_flags[v3_index] |= NDC;
                    has_near = true;
                    face_flags[f] = CLIP;
                } else {
                    // Even if no vertices are behind the view frustum the face is still visible.
                    // It either intersects the frustum in direction(s) other than the near clipping plane,
                    // or it may fully surrounding the whole view frustum.
                    // No geometric clipping is needed, but the face can not be culled.
                    face_flags[f] = INSIDE;
                }
            } else {
                // No clip checking is asked for, there is nothing more that can be done here.
                // Back-face culling happens at NDC space, after clipping.
                face_flags[f] = INSIDE;
            }
        } else {
            // No vertices are outside the frustum (the face is fully within it).
            face_flags[f] = INSIDE;
            has_inside = true;
        }
    }

    return has_near ? CLIP :
        has_inside ? INSIDE : CULL;
};
//
// const cullBackFaces = (
//     X: Float32Array,
//     Y: Float32Array,
//     face_flags: Uint8Array,
//     face_areas: Float32Array
// ): number => {
//     // Back face culling (in screen-space):
//     // There are 2 pieces of information that are required to determine if a triangle ABC is facing front or back:
//     // 1. The sign of the area of 2D the parallelogram
//     // 2. The winding order of the vertices (CW vs. CCW)
//     //
//     // The 3D coordinate system here is "left handed" (as in DirectX).
//     // The "winding order" of the triangle's 3D vertices thus goes "clock-wise" (CW).
//     // However, rendering is done here into a coordinate system that goes
//     // left-to-right horizontally but top-to-bottom vertically(!).
//     // Because of that the screen-transform has to apply a vertical-flip (mirror),
//     // thus "reversing" the winding order in screen-space making it "counter clock wise" (CCW).
//     // The signed area of the parallelogram thus follows the right-hand rule of the cross-product.
//     // It could thus be computed from edge AB to edge AC as follows:
//     //
//     //   signed_area = (ABx * ACy) - (ABy * ACx)
//     //
//     // Where:
//     //   AB = B - A
//     //   AC = C - A
//     // And (in screen space):
//     //   A = V1 = [x1, y1]
//     //   B = V2 = [x2, y2]
//     //   C = V3 = [x3, y3]
//     // Such that:
//     //   AB = B - A = V2 - V1 = [x2, y2] - [x1, y1]
//     //   AC = C - A = V3 - V1 = [x3, y3] - [x1, y1]
//     // Thus:
//     //   ABx = Bx - Ax = V2x - V1x = x2 - x1
//     //   ABy = By - Ay = V2y - V1y = y2 - y1
//     // And:
//     //   ACx = Cx - Ax = V3x - V1x = x3 - x1
//     //   ACy = Cy - Ay = V3y - V1y = y3 - y1
//     // Thus:
//     //   signed_area = ((x2 - x1) * (y3 - y1)) - ((y2 - y1) * (x3 - x1))
//     //
//     has_front_facing = false;
//
//     for ([i, flags] of face_flags.entries()) if (flags) {
//         // Compute the area of the parallelogram formed by the 3 vertices.
//         x1 = X[i]; y1 = Y[i];
//         x2 = X[i]; y2 = Y[i];
//         x3 = X[i]; y3 = Y[i];
//
//         face_area = ((x2 - x1) * (y3 - y1)) - ((y2 - y1) * (x3 - x1));
//
//         if (face_area > 0) {
//             // if the area is positive, the parallelogram (and thus the face) is facing forward.
//             has_front_facing = true;
//             face_areas[i] = face_area;
//         } else
//         // if the area is negative, the parallelogram (and thus the face) is facing backwards.
//         // if the area is zero, the face also has a zero surface so can not be drawn.
//             face_flags[i] = CULL;
//     }
//
//     return has_front_facing ? INSIDE : CULL;
// };
