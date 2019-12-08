import {Float4, T3} from "../../types.js";

// Culling flags:
// ======================
export const NEAR  = 0b0000_0001;
export const FAR   = 0b0000_0010;
export const BELOW = 0b0000_0100;
export const ABOVE = 0b0000_1000;
export const RIGHT = 0b0001_0000;
export const LEFT  = 0b0010_0000;
export const ALL   = 0b0011_1111;
export const CULL  = 0b0100_0000;

// Clipping flags:
// ===============
export const INSIDE    = 0b0000;
export const V1_BEHIND = 0b0001;
export const V2_BEHIND = 0b0010;
export const V3_BEHIND = 0b0100;
export const CLIP      = 0b1000;

export const OUTSIDE = V1_BEHIND | V2_BEHIND | V3_BEHIND;

let directions,
    shared_directions,

    vertices_behind,
    vertices_behind_count,

    one_over_w, w, x, y, z,

    v1,
    v2,
    v3,

    v1_is_behind,
    v2_is_behind,
    v3_is_behind,

    v1_index,
    v2_index,
    v3_index: number;

let has_inside,
    has_behind: boolean;

export const frustumCheck = <FaceVerticesArrayType extends Uint8Array|Uint16Array|Uint32Array = Uint32Array>(
    [X, Y, Z, W]: Float4,
    vertex_flags: Uint8Array,

    [
        indices_v1,
        indices_v2,
        indices_v3
    ]: T3<FaceVerticesArrayType>,
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
    has_inside = has_behind = false;
    for (let i = 0; i < X.length; i++) {
        w = W[i];
        x = X[i];
        y = Y[i];
        z = Z[i];

        if (z < 0) {
            has_behind = true;

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

    if (!has_behind)
        // The mesh intersects the frustum in some way but no vertex is behind the near clipping plane.
        // Since geometric clipping is done only against the near clipping plane, there is nothing to clip.
        // The other sides of the frustum would get raster-clipped later by clamping pixels outside the screen.
        return INSIDE;


    // Phase 2: Check face intersections against the frustum:
    // ------------------------------------------------------
    vertices_behind = 0;
    has_inside = has_behind = false;
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
                // The face is fully outside the frustum, and does not intersect it.
                face_flags[face_index] = OUTSIDE;
                // Note: This includes the cases where all 3 vertices are "behind" the view frustum.
                // In these cases the "behind" direction would be "a" direction that is shared.
                // Below there are checks for when "any" of the vertices are "behind",
                // Becuse the cases of 3 of them behind is skipped here, then below would only be
                // handling case where only 1 or 2 of the vertices are behind.
                // If all of them are behind, we skip the face here.
                continue;
            }

            // One or more vertices are outside, and no out-direction is shared across them.
            // The face is visible in the view frustum in some way, so it's vertices should not be culled:
            if (v1 & CULL) v1 -= CULL;
            if (v2 & CULL) v2 -= CULL;
            if (v3 & CULL) v3 -= CULL;
            // Note: Re-including the vertices could have ran the rist of a division-by-zero
            // at the perspective devide step - however, this face will be clipped before that,
            // so whichever vertex is behind the near clipping plane now, will be clamped to it by then.
            // If no vertex is behind the view frustum, then no clipping will occur,
            // but the face is still (potentially) visible in some way, so pesrpective-devide needs to
            // occur on it's vertices. It may later be deemed back-facing and 'then' culled,
            // but for that to be able to happen it needs to pass through the perspective-devide,
            // so that back-face culling can be applied on it in screen-space.

            // If any vertex is behind the view frustum, the face needs to be clipped:
            vertices_behind = 0;
            if (v1 & NEAR) vertices_behind |= V1_BEHIND;
            if (v2 & NEAR) vertices_behind |= V2_BEHIND;
            if (v3 & NEAR) vertices_behind |= V3_BEHIND;
            if (vertices_behind) has_behind = true;

            face_flags[face_index] = vertices_behind;
            // Note: Even it no vertices are behind the view frustum,
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
        has_behind ? CLIP :
        has_inside ? INSIDE :
        CULL
    );
};

const perspectiveDevide = (
    [Xa, Ya, Za, Wa]: Float4,
    [Xo, Yo, Zo, Wo]: Float4,
    vertex_flags: Uint8Array
): void => {
    for (let i = 0; i < Xa.length; i++) if (vertex_flags[i]) {
        one_over_w = 1.0 / Wa[i];
        Xo[i] = Xa[i] * one_over_w;
        Yo[i] = Ya[i] * one_over_w;
        Zo[i] = Za[i] * one_over_w;
        Wo[i] = 1;
    }
};

const to_ndc_all_in_place = (
    [Xa, Ya, Za, Wa]: Float4,
    mask?: Uint8Array
): void => {
    for (let i = 0; i < Xa.length; i++) {
        if (mask && !mask[i])
            continue;

        one_over_w = 1.0 / Wa[i];
        Xa[i] *= one_over_w;
        Ya[i] *= one_over_w;
        Za[i] *= one_over_w;
        Wa[i] = 1;
    }
};

// updateMasks(): void {
//     this.clip_space.vertices.vertex_positions.inView(this.frustum_culling_mask);
// }

//
// const projectToScreen = (
//
// ): void => {
//
// };
//
// let i1, // An index of the first vertex inside the frustum
//     i2, // An index of the second vertex inside the frustum
//     o1, // An index of the first vertex outside the frustum
//     o2 // An index of the second vertex outside the frustum
//     : number;
//
// const clip = (
//     [
//         indices_v1,
//         indices_v2,
//         indices_v3
//     ]: Int3,
//     face_flags: Uint8Array,
// ) => {
//     for (let face_index = 0; face_index < indices_v1.length; face_index++) {
//         flags = face_flags[face_index];
//         if (flags && flags < OUTSIDE) {
//             // Only clip faces that need clipping
//
//             i2 = 0;
//             if (flags & V1_BEHIND) {
//                 o1 = 0;
//                 if (flags & V2_BEHIND) {
//                     o2 = 1;
//                     i1 = 2;
//                 } else {
//                     i1 = 1;
//                     if (flags & V3_BEHIND)
//                         o2 = 2;
//                     else
//                         i2 = 2;
//                 }
//             } else {
//                 i1 = 0;
//                 if (flags & V2_BEHIND) {
//                     o1 = 1;
//                     if (flags & V3_BEHIND)
//                         o2 = 2;
//                     else
//                         i2 = 2;
//                 } else {
//                     i2 = 1;
//                     o1 = 2;
//                 }
//             }
//
//             // Break the input triangle into smaller output triangle(s).
//             // There are 2 possible cases left (when not returning early above):
//             if (i2) {
//                 extra_triangle.setFromOther(this);
//                 // Two vertices are inside the frustum.
//                 // Clipping forms a quad which needs to be split into 2 triangles.
//                 // The first is the original (only smaller, as above).
//                 this.sendToNearClippingPlane(i1, o1, near);
//                 if (this.color) {
//                     this.color.r = 0;
//                     this.color.g = 1;
//                     this.color.b = 0;
//                 }
//                 // The second is a new extra triangle, sharing 2 vertices
//                 extra_triangle.vertices[i1].setFromOther(this.vertices[o1]);
//                 extra_triangle.sendToNearClippingPlane(i2, o1, near);
//
//                 return 2; // Two adjacent triangles
//             } else {
//                 // Only one vertex is inside the frustum.
//                 // The triangle just needs to get smaller.
//                 // The two new vertices need to be on the near clipping plane:
//                 this.sendToNearClippingPlane(i1, o1, near);
//                 this.sendToNearClippingPlane(i1, o2, near);
//
//                 if (this.color) {
//                     this.color.r = 1;
//                     this.color.g = 0;
//                     this.color.b = 0;
//                 }
//
//                 return 1; // A single (smaller)triangle
//             }
//         }
//     }
// };
//
//
//
//
//     // Break the input triangle into smaller output triangle(s).
//     // There are 2 possible cases left (when not returning early above):
//     if (i2 === undefined) {
//         // Only one vertex is inside the frustum.
//         // The triangle just needs to get smaller.
//         // The two new vertices need to be on the near clipping plane:
//         this.sendToNearClippingPlane(i1, o1, near);
//         this.sendToNearClippingPlane(i1, o2, near);
//
//         if (this.color) {
//             this.color.r = 1;
//             this.color.g = 0;
//             this.color.b = 0;
//         }
//
//         return 1; // A single (smaller)triangle
//     } else {
//         extra_triangle.setFromOther(this);
//         // Two vertices are inside the frustum.
//         // Clipping forms a quad which needs to be split into 2 triangles.
//         // The first is the original (only smaller, as above).
//         this.sendToNearClippingPlane(i1, o1, near);
//         if (this.color) {
//             this.color.r = 0;
//             this.color.g = 1;
//             this.color.b = 0;
//         }
//         // The second is a new extra triangle, sharing 2 vertices
//         extra_triangle.vertices[i1].setFromOther(this.vertices[o1]);
//         extra_triangle.sendToNearClippingPlane(i2, o1, near);
//
//         return 2; // Two adjacent triangles
//     }
// };