import {Float2, Float4, T2, T3} from "../../types.js";

// Culling flags:
// ======================
export const NEAR  = 0b0000_0001;
export const FAR   = 0b0000_0010;
export const BELOW = 0b0000_0100;
export const ABOVE = 0b0000_1000;
export const RIGHT = 0b0001_0000;
export const LEFT  = 0b0010_0000;
export const CULL  = 0b0100_0000;
export const ALL   = 0b0011_1111;

// Clipping flags:
// ===============
export const INSIDE  = 0b0000;
export const V1_NEAR = 0b0001;
export const V2_NEAR = 0b0010;
export const V3_NEAR = 0b0100;
export const CLIP    = 0b0111;

let directions,
    shared_directions,

    face,
    face_area,
    face_index,
    extra,

    one_over_w, w, x, y, z,
    one_minus_t, t,

    v1, x1, y1,
    v2, x2, y2,
    v3, x3, y3,

    from_index,
    to_index,

    first_vertex_inside, second_vertex_inside,
    first_vertex_outside, second_Vertex_outside,

    v1_index,
    v2_index,
    v3_index: number;

let has_inside,
    has_near,
    has_front_facing: boolean;

export const frustumCheck = <FaceVerticesArrayType extends Uint8Array|Uint16Array|Uint32Array = Uint32Array>(
    [X, Y, Z, W]: Float4,
    [
        indices_v1,
        indices_v2,
        indices_v3
    ]: T3<FaceVerticesArrayType>,

    vertex_flags: Uint8Array,
    face_flags: Uint8Array
): number => {
    // This is a 2-phaze process:
    // ==========================
    //
    // Phase 1: Check vertex positions against the frustum:
    // ----------------------------------------------------
    // For each vertex, check where it is in relation to the view frustum,
    // and collect the results into a flags array (single number bit-pattern per-vertex).
    // While doing so, keep track of which side(s) of the frustum are shared by all vertices.
    // When done, first analyze the results before continuing to phase 2.
    // Early bail-out if any of these conditions are met:
    // A. The entire mesh is outside the frustum - early return with the CULL flag.
    // B. The entire mesh is inside the frustum - early return with the INSIDE flag.
    // C. No geometric clipping is needed - early return with the INSIDE flag.
    //
    //
    // Phase 2: Check face intersections against the frustum:
    // ------------------------------------------------------
    // For each "face" (collection of 3 vertex indices) fetch the flags of it's 3 vertices
    // that were just collected in phase 1.
    // Loop through all faces (vertex indices), fetching their respective
    //    vertex flags that were just collected, and collecting face-flags for
    //    each face. about
    //
    //
    // Phase 1 - Check vertex positions against the frustum:
    // =====================================================
    vertex_flags.fill(0);
    directions = ALL;
    has_inside = has_near = false;
    for (let i = 0; i < X.length; i++) {
        w = W[i];
        x = X[i];
        y = Y[i];
        z = Z[i];

        if (z < 0) {
            has_near = true;

            directions = NEAR;
        } else if (z > w)
            directions = FAR;
        else
            directions = 0;

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
            //   (All vertises are above and/or all vertices on the left and/or all vertices behind, etc.)
        } else
            has_inside = true;
    }

    if (!has_inside && shared_directions)
        // All vertices are completely outside, and all share at least one out-region.
        // The entire mesh is completly outside the frustum and does not intersect it in any way.
        // It can be safely culled altogether.
        return CULL;

    if (!has_near)
        // The mesh intersects the frustum in some way but no vertex is behind the near clipping plane.
        // Since geometric clipping is done only against the near clipping plane, there is nothing to clip.
        // The other sides of the frustum would get raster-clipped later by clamping pixels outside the screen.
        return INSIDE;


    // Phase 2: Check face intersections against the frustum:
    // ------------------------------------------------------
    face = 0;
    has_inside = has_near = false;
    for (let face_index = 0; face_index < indices_v1.length; face_index++) {
        v1_index = indices_v1[face_index];
        v2_index = indices_v2[face_index];
        v3_index = indices_v3[face_index];

        v1 = vertex_flags[v1_index];
        v2 = vertex_flags[v2_index];
        v3 = vertex_flags[v3_index];

        if (v1 | v2 | v3) {
            // One or more vertices are outside - check edges for intersections:
            if (v1 & v2 & v3) {
                // All vertices share one or more out-direction(s).
                // The face is fully outside the frustum, and does not intersect it - cull it.
                face_flags[face_index] = CULL;
                // Note: This includes the cases where all 3 vertices are "behind" the view frustum.
                // In these cases the "behind" direction would be "a" direction that is shared.
                // Below there are checks for when "any" of the vertices are "behind",
                // Becuse the cases of 3 of them behind is skipped here, then below would only be
                // handling case where only 1 or 2 of the vertices are behind.
                // If all of them are behind, we skip the face here.
                continue;
            }

            // One or more vertices are outside, and no out-direction is shared across them.
            // The face is visible in the view frustum in some way.
            // It's vertices should not be culled:
            if (v1 & CULL) vertex_flags[v1_index] -= CULL;
            if (v2 & CULL) vertex_flags[v2_index] -= CULL;
            if (v3 & CULL) vertex_flags[v3_index] -= CULL;
            // Note: Re-including the vertices could have ran the rist of a division-by-zero
            // at the perspective devide step - however, this face will be clipped before that,
            // so whichever vertex is behind the near clipping plane now, will be clamped to it by then.
            // If no vertex is behind the view frustum, then no clipping will occur,
            // but the face is still (potentially) visible in some way, so pesrpective-devide needs to
            // occur on it's vertices. It may later be deemed back-facing and 'then' culled,
            // but for that to be able to happen it needs to pass through the perspective-devide,
            // such that back-face culling can be applied on it in screen-space.

            // If any vertex is behind the view frustum, the face needs to be clipped:
            face = 0;
            if (v1 & NEAR) face |= V1_NEAR;
            if (v2 & NEAR) face |= V2_NEAR;
            if (v3 & NEAR) face |= V3_NEAR;
            if (face) has_near = true;

            face_flags[face_index] = face;
            // Note: Even if no vertices are behind the view frustum,
            // the face is still visible in the view frustum somehow,
            // even though all it's vertices are outside of it.
            // It either intersects the frustum in direction(s) other than the near clipping plane,
            // or it may fully surrounding the whole view frustum.
            // No geometric clipping is needed, but the face can not be culled at this point.
        } else {
            // No vertices are outside the frustum (the face is fully within it).
            has_inside = true;
            face_flags[face_index] = INSIDE;
        }
    }

    return (
        has_near ? CLIP :
        has_inside ? INSIDE :
        CULL
    );
};
//
// const sendToNearClippingPlane = (
//     X: Float32Array,
//     Y: Float32Array,
//     Z: Float32Array,
//     W: Float32Array,
//
//     from_index: number,
//     to_index: number
// ) => {
//     const to_z = Z[to_index];
//     const from_z = Z[from_index];
//     const t = from_z / (from_z - to_z);
//     const one_minus_t = 1 - t;
//
//     W[to_index] = one_minus_t*W[from_index] + t*W[to_index];
//     X[to_index] = one_minus_t*X[from_index] + t*X[to_index];
//     Y[to_index] = one_minus_t*Y[from_index] + t*Y[to_index];
//     Z[to_index] = one_minus_t*from_z + t*to_z;
// };


export const perspectiveDevide = (
    [X, Y, Z, W]: Float4,
    vertex_flags: Uint8Array
): void => {
    for (let i = 0; i < X.length; i++)
        if (CULL & vertex_flags[i]) {
            one_over_w = 1.0 / W[i];
            X[i] *= one_over_w;
            Y[i] *= one_over_w;
            Z[i] *= one_over_w;
            W[i] *= one_over_w;
        }
};

export const clipFaces = <FaceVerticesArrayType extends Uint8Array|Uint16Array|Uint32Array = Uint32Array>(
    [X, Y, Z, W]: Float4,
    [indices_v1, indices_v2, indices_v3]: T3<FaceVerticesArrayType>,

    face_flags: Uint8Array,
    vertex_flags: Uint8Array,

    [T_1, ONE_MINUS_T_1]: Float2,
    [T_2, ONE_MINUS_T_2]: Float2,
    [FROM_INDEX_1, TO_INDEX_1]: T2<FaceVerticesArrayType>,
    [FROM_INDEX_2, TO_INDEX_2]: T2<FaceVerticesArrayType>,

    [X_extra, Y_extra, Z_extra, W_extra]: Float4,

    extra_face_flags: Uint8Array,
    extra_vertex_flags: Uint8Array,

    // [indices_v1_extra, indices_v2_extra, indices_v3_extra]: T3<FaceVerticesArrayType>,
    [EXTRA_T_1, EXTRA_ONE_MINUS_T_1]: Float2,
    [EXTRA_T_2, EXTRA_ONE_MINUS_T_2]: Float2,
    [EXTRA_FROM_INDEX_1, EXTRA_TO_INDEX_1]: T2<FaceVerticesArrayType>,
    [EXTRA_FROM_INDEX_2, EXTRA_TO_INDEX_2]: T2<FaceVerticesArrayType>,
): number => {
    extra = 0;
    extra_face_flags.fill(CULL);
    extra_vertex_flags.fill(CULL);

    for (face_index = 0; face_index < indices_v1.length; face_index++) {
        face = face_flags[face_index];
        if (CLIP & face) {
            face_flags[face_index] = INSIDE;

            v1_index = indices_v1[face_index];
            v2_index = indices_v2[face_index];
            v3_index = indices_v3[face_index];

            second_vertex_inside = -1;
            if (face & V1_NEAR) {
                first_vertex_outside = v1_index;
                if (face & V2_NEAR) {
                    second_Vertex_outside = v2_index;
                    first_vertex_inside = v3_index;
                } else {
                    first_vertex_inside = v2_index;
                    if (face & V3_NEAR)
                        second_Vertex_outside = v3_index;
                    else
                        second_vertex_inside = v3_index;
                }
            } else {
                first_vertex_inside = v1_index;
                if (face & V2_NEAR) {
                    first_vertex_outside = v2_index;
                    if (face & V3_NEAR)
                        second_Vertex_outside = v3_index;
                    else
                        second_vertex_inside = v3_index;
                } else {
                    second_vertex_inside = v2_index;
                    first_vertex_outside = v3_index;
                }
            }

            // Break the input triangle into smaller output triangle(s).
            // There are 2 possible cases:
            if (second_vertex_inside === -1) {
                // Only one vertex is inside the frustum.
                // The triangle just needs to get smaller.
                // The two new vertices need to be on the near clipping plane:

                from_index = FROM_INDEX_1[face_index] = first_vertex_inside;
                to_index = TO_INDEX_1[face_index] = first_vertex_outside;
                t = T_1[face_index] = Z[from_index] / (Z[from_index] - Z[to_index]);
                one_minus_t = ONE_MINUS_T_1[face_index] = 1 - t;

                W[to_index] = one_minus_t*W[from_index] + t*W[to_index];
                X[to_index] = one_minus_t*X[from_index] + t*X[to_index];
                Y[to_index] = one_minus_t*Y[from_index] + t*Y[to_index];
                Z[to_index] = one_minus_t*Z[from_index] + t*Z[to_index];


                from_index = FROM_INDEX_2[face_index] = first_vertex_inside;
                to_index = TO_INDEX_2[face_index] = second_Vertex_outside;
                t = T_2[face_index] = Z[from_index] / (Z[from_index] - Z[to_index]);
                one_minus_t = ONE_MINUS_T_2[face_index] = 1 - t;

                W[to_index] = one_minus_t*W[from_index] + t*W[to_index];
                X[to_index] = one_minus_t*X[from_index] + t*X[to_index];
                Y[to_index] = one_minus_t*Y[from_index] + t*Y[to_index];
                Z[to_index] = one_minus_t*Z[from_index] + t*Z[to_index];
            } else {
                // Two vertices are inside the frustum.
                // Clipping forms a quad which needs to be split into 2 triangles.
                // The first is the original (only smaller, as above).

                // this.sendToNearClippingPlane(first_vertex_inside, first_vertex_outside, near);
                from_index = FROM_INDEX_1[face_index] = first_vertex_inside;
                to_index = TO_INDEX_1[face_index] = first_vertex_outside;
                t = T_1[face_index] = Z[from_index] / (Z[from_index] - Z[to_index]);
                one_minus_t = ONE_MINUS_T_1[face_index] = 1 - t;

                W[to_index] = one_minus_t*W[from_index] + t*W[to_index];
                X[to_index] = one_minus_t*X[from_index] + t*X[to_index];
                Y[to_index] = one_minus_t*Y[from_index] + t*Y[to_index];
                Z[to_index] = one_minus_t*Z[from_index] + t*Z[to_index];

                // The second is a new extra triangle, sharing 2 vertices:
                // extra_triangle.setFromOther(this);
                // extra_triangle.vertices[first_vertex_inside].setFromOther(this.vertices[first_vertex_outside]);
                // switch (first_vertex_outside) {
                //     case v1_index: {
                //         indices_v1_extra[face_index] = first_vertex_outside;
                //
                //         switch (first_vertex_inside) {
                //             case v2_index: {
                //                 indices_v2_extra[face_index] = first_vertex_inside;
                //                 indices_v3_extra[face_index] = v3_index;
                //             }
                //             case v3_index: {
                //                 indices_v2_extra[face_index] = v2_index;
                //                 indices_v3_extra[face_index] = first_vertex_inside;
                //             }
                //         }
                //
                //         break;
                //     }
                //     case v2_index: {
                //         indices_v2_extra[face_index] = first_vertex_outside;
                //
                //         switch (first_vertex_inside) {
                //             case v2_index: {
                //                 indices_v1_extra[face_index] = first_vertex_inside;
                //                 indices_v3_extra[face_index] = v3_index;
                //             }
                //             case v3_index: {
                //                 indices_v1_extra[face_index] = v1_index;
                //                 indices_v3_extra[face_index] = first_vertex_inside;
                //             }
                //         }
                //
                //         break;
                //     }
                //     case v3_index: {
                //         indices_v3_extra[face_index] = first_vertex_outside;
                //
                //         switch (first_vertex_inside) {
                //             case v1_index: {
                //                 indices_v1_extra[face_index] = first_vertex_inside;
                //                 indices_v2_extra[face_index] = v2_index;
                //             }
                //             case v2_index: {
                //                 indices_v2_extra[face_index] = v2_index;
                //                 indices_v3_extra[face_index] = first_vertex_inside;
                //             }
                //         }
                //
                //         break;
                //     }
                // }

                // extra_triangle.sendToNearClippingPlane(second_vertex_inside, first_vertex_outside, near);
                from_index = EXTRA_FROM_INDEX_2[face_index] = second_vertex_inside;
                to_index = EXTRA_TO_INDEX_2[face_index] = first_vertex_outside;
                t = EXTRA_T_2[face_index] = Z[from_index] / (Z[from_index] - Z[to_index]);
                one_minus_t = EXTRA_ONE_MINUS_T_2[face_index] = 1 - t;

                W_extra[to_index] = one_minus_t*W[from_index] + t*W[to_index];
                X_extra[to_index] = one_minus_t*X[from_index] + t*X[to_index];
                Y_extra[to_index] = one_minus_t*Y[from_index] + t*Y[to_index];
                Z_extra[to_index] = one_minus_t*Z[from_index] + t*Z[to_index];

                extra_vertex_flags[to_index] = extra_face_flags[face_index] = INSIDE;
                extra++;
            }
        }
    }

    return extra;
};

export const cullBackFaces = <FaceVerticesArrayType extends Uint8Array|Uint16Array|Uint32Array = Uint32Array>(
    [X, Y, Z, W]: Float4,
    [indices_v1, indices_v2, indices_v3]: T3<FaceVerticesArrayType>,
    face_areas: Float32Array,
    face_flags: Uint8Array,
    extra_face_flags: Uint8Array
): number => {
    has_front_facing = false;

    for (face_index = 0; face_index < indices_v1.length; face_index++) if (!face_flags[face_index]) {
        v1_index = indices_v1[face_index];
        v2_index = indices_v2[face_index];
        v3_index = indices_v3[face_index];

        x1 = X[v1_index];
        x2 = X[v2_index];
        x3 = X[v3_index];

        y1 = Y[v1_index];
        y2 = Y[v2_index];
        y3 = Y[v3_index];

        // Compute the determinant (area of the paralelogram formed by the 3 vertices)
        // If the area is zero, the triangle also has a zero surface so can not be drawn.
        // If the area is negative, the parallelogram (triangle) is facing backwards.
        face_area = (
            (x3 - x2) * (y1 - y2)
        ) - (
            (y3 - y2) * (x1 - x2)
        );
        if (face_area > 0) {
            has_front_facing = true;
            face_areas[face_index] = face_area;
        } else
            face_flags[face_index] = extra_face_flags[face_index] = CULL;
    }

    return has_front_facing ? INSIDE : CULL;
};