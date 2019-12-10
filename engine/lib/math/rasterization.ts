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
export const NDC   = 0b0100_0000;
export const NDCE  = 0b1000_0000;

// Clipping flags:
// ===============
export const CULL    = 0b0000;
export const CLIP    = 0b0001;
export const INSIDE  = 0b0010;
export const INEXTRA = 0b0100;

let directions,
    shared_directions,

    face_count,
    face_area,
    face_index,

    one_over_w, w, x, y, z,
    one_minus_t_1, t_1,
    one_minus_t_2, t_2,

    v1_flags, x1, y1,
    v2_flags, x2, y2,
    v3_flags, x3, y3,

    first_vertex_inside,
    first_vertex_inside_z,

    first_vertex_outside,
    first_vertex_outside_z,

    second_vertex_outside,
    second_vertex_outside_z,

    second_vertex_inside,
    second_vertex_inside_z,

    normal_x,
    normal_y,
    normal_z,
    normal_length_rcp,

    uv_index_from,
    uv_index_to,

    v1_index,
    v2_index,
    v3_index: number;

let has_inside,
    has_near;

export const cullAndClip = <FaceVerticesArrayType extends Uint8Array|Uint16Array|Uint32Array = Uint32Array>(
    [X, Y, Z, W]: Float4,
    [Xo, Yo, Zo, Wo]: Float4,
    [Xe, Ye, Ze, We]: Float4,
    [indices_v1, indices_v2, indices_v3]: T3<FaceVerticesArrayType>,

    vertex_flags: Uint8Array,
    face_flags: Uint8Array,
    face_areas?: Float32Array,
    extra_face_areas?: Float32Array,

    Xn?: Float32Array, Yn?: Float32Array, Zn?: Float32Array,
    Xno?: Float32Array, Yno?: Float32Array, Zno?: Float32Array,
    Xne?: Float32Array, Yne?: Float32Array, Zne?: Float32Array,

    U?: Float32Array, V?: Float32Array,
    Uo?: Float32Array, Vo?: Float32Array,
    Ue?: Float32Array, Ve?: Float32Array,
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
    vertex_flags.fill(CULL);
    face_flags.fill(CULL);

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
        } else {
            has_inside = true;
            vertex_flags[i] = INSIDE;
        }
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
    has_inside = has_near = false;
    face_count = indices_v1.length;
    for (face_index = 0; face_index < face_count; face_index++) {
        v1_index = indices_v1[face_index];
        v2_index = indices_v2[face_index];
        v3_index = indices_v3[face_index];

        v1_flags = vertex_flags[v1_index];
        v2_flags = vertex_flags[v2_index];
        v3_flags = vertex_flags[v3_index];

        if (v1_flags | v2_flags | v3_flags) {
            // One or more vertices are outside - check edges for intersections:
            if (v1_flags & v2_flags & v3_flags) {
                // All vertices share one or more out-direction(s).
                // The face is fully outside the frustum, and does not intersect it.
                // Note: This includes the cases where all 3 vertices are "behind" the view frustum.
                // In these cases the "behind" direction would be "a" direction that is shared.
                // Below there are checks for when "any" of the vertices are "behind",
                // Becuse the cases of 3 of them behind is skipped here, then below would only be
                // handling case where only 1 or 2 of the vertices are behind.
                // If all of them are behind, the face is skipped here.
                continue;
            } // else:
            // One or more vertices are outside, and no out-direction is shared across them.
            // The face is visible in the view frustum in some way.

            // If no clipping is asked for, there is nothing more that can be done here.
            // Back-face culling happens after perspective-divide, which can not happen without clipping.
            if (!face_areas) {
                has_inside = true;
                face_flags[face_index] = INSIDE;
                continue;
            }

            // Check if any vertex is behind the view frustum:
            second_vertex_inside = -1;
            first_vertex_outside = -1;
            if (v1_flags & NEAR) {
                first_vertex_outside = v1_index;
                if (v2_flags & NEAR) {
                    second_vertex_outside = v2_index;
                    first_vertex_inside = v3_index;
                } else {
                    first_vertex_inside = v2_index;
                    if (v3_flags & NEAR)
                        second_vertex_outside = v3_index;
                    else
                        second_vertex_inside = v3_index;
                }
            } else {
                first_vertex_inside = v1_index;
                if (v2_flags & NEAR) {
                    first_vertex_outside = v2_index;
                    if (v3_flags & NEAR)
                        second_vertex_outside = v3_index;
                    else
                        second_vertex_inside = v3_index;
                } else {
                    second_vertex_inside = v2_index;
                    first_vertex_outside = v3_index;
                }
            }

            if (first_vertex_outside === -1) {
                // There is at least one vertex behind the near clipping ploane.
                // There face needs to be clipped:

                // Break the input triangle into smaller output triangle(s)/
                // There are 2 possible cases:
                // 1: One vertex is inside the frustum, and the other two are behind the near clipping plane..
                //    The triangle just needs to get smaller by having it's 2 ouside-vertices
                //    moved right up-to the near clipping plane itself.
                // 2: Two vertices are inside the frustum, and the third one is behind the near clipping plane.
                //    Clipping forms a quad which needs to be split into 2 triangles.
                //    The first one is formed from the original one, by moving the vertex that is behind the
                //    clipping plane right up-to the near clipping plane itself (exactly as in the first case).
                //    The second triangle is a new triangle that needs to be created, from the 2 vertices that
                //    are inside, plus a new vertex that would need to be interpolated by moving the same vertex
                //    that is outside up-to the near clipping plane but towars the other vertex that is inside.
                //    Obviously the same vertex can-not be moved to 2 different places, so the vertex position
                //    needs to be stored so it can be interpolated again.

                first_vertex_inside_z = Z[first_vertex_inside];
                first_vertex_outside_z = Z[first_vertex_outside];

                if (vertex_flags[first_vertex_outside] < NDC) {
                    t_1 = first_vertex_inside_z / (first_vertex_inside_z - first_vertex_outside_z);
                    one_minus_t_1 = 1 - t_1;
                    Wo[first_vertex_outside] = t_1*W[first_vertex_outside] + one_minus_t_1*W[first_vertex_inside];
                    Xo[first_vertex_outside] = t_1*X[first_vertex_outside] + one_minus_t_1*X[first_vertex_inside];
                    Yo[first_vertex_outside] = t_1*Y[first_vertex_outside] + one_minus_t_1*Y[first_vertex_inside];
                    Zo[first_vertex_outside] = t_1*Z[first_vertex_outside] + one_minus_t_1*first_vertex_inside_z;
                }

                if (second_vertex_inside === -1) {
                    // Only one vertex is inside the frustum.
                    // The triangle just needs to get smaller.
                    // The two new vertices need to be on the near clipping plane:
                    if (vertex_flags[second_vertex_outside] < NDC) {
                        second_vertex_outside_z = Z[second_vertex_outside];
                        t_2 = first_vertex_inside_z / (first_vertex_inside_z - second_vertex_outside_z);
                        one_minus_t_2 = 1 - t_2;
                        Wo[second_vertex_outside] = t_2 * W[second_vertex_outside] + one_minus_t_2 * W[first_vertex_inside];
                        Xo[second_vertex_outside] = t_2 * X[second_vertex_outside] + one_minus_t_2 * X[first_vertex_inside];
                        Yo[second_vertex_outside] = t_2 * Y[second_vertex_outside] + one_minus_t_2 * Y[first_vertex_inside];
                        Zo[second_vertex_outside] = t_2 * second_vertex_outside_z + one_minus_t_2 * first_vertex_inside_z;
                    }
                } else {
                    // Two vertices are inside the frustum.
                    // Clipping forms a quad which needs to be split into 2 triangles.
                    // The first is the original (only smaller, as above).
                    if (vertex_flags[first_vertex_outside] < NDCE) {
                        second_vertex_inside_z = Z[second_vertex_inside];
                        t_2 = second_vertex_inside_z / (second_vertex_inside_z - first_vertex_outside_z);
                        one_minus_t_2 = 1 - t_2;
                        We[first_vertex_outside] = t_1 * W[first_vertex_outside] + one_minus_t_1 * W[second_vertex_inside];
                        Xe[first_vertex_outside] = t_1 * X[first_vertex_outside] + one_minus_t_1 * X[second_vertex_inside];
                        Ye[first_vertex_outside] = t_1 * Y[first_vertex_outside] + one_minus_t_1 * Y[second_vertex_inside];
                        Ze[first_vertex_outside] = t_1 * Z[first_vertex_outside] + one_minus_t_1 * second_vertex_inside_z;
                    }
                }

                // perspective devide:
                if (vertex_flags[v1_index] < NDC) {
                    one_over_w = 1 / Wo[v1_index];
                    Xo[v1_index] *= one_over_w;
                    Yo[v1_index] *= one_over_w;
                    Zo[v1_index] *= one_over_w;
                }

                if (vertex_flags[v2_index] < NDC) {
                    one_over_w = 1 / Wo[v2_index];
                    Xo[v2_index] *= one_over_w;
                    Yo[v2_index] *= one_over_w;
                    Zo[v2_index] *= one_over_w;
                }

                if (vertex_flags[v3_index] < NDC) {
                    one_over_w = 1 / Wo[v3_index];
                    Xo[v3_index] *= one_over_w;
                    Yo[v3_index] *= one_over_w;
                    Zo[v3_index] *= one_over_w;
                }

                // Back-face cull:
                // Compute the determinant (area of the paralelogram formed by the 3 vertices)
                // If the area is zero, the triangle also has a zero surface so can not be drawn.
                // If the area is negative, the parallelogram (triangle) is facing backwards.
                x1 = Xo[v1_index];
                y1 = Yo[v1_index];

                x2 = Xo[v2_index];
                y2 = Yo[v2_index];

                x3 = Xo[v3_index];
                y3 = Yo[v3_index];

                face_area = (
                    (x3 - x2) * (y1 - y2)
                ) - (
                    (y3 - y2) * (x1 - x2)
                );
                if (face_area > 0) {
                    has_near = true;
                    has_inside = true;
                    face_flags[face_index] = INSIDE;
                    face_areas[face_index] = face_area;

                    if (second_vertex_inside !== -1) {
                        face_flags[face_index] += INEXTRA;

                        if (vertex_flags[first_vertex_outside] < NDCE) {
                            // perspective devide:
                            one_over_w = 1 / We[first_vertex_outside];
                            Xe[first_vertex_outside] *= one_over_w;
                            Ye[first_vertex_outside] *= one_over_w;
                            Ze[first_vertex_outside] *= one_over_w;
                        }

                        x1 = Xo[first_vertex_inside];
                        y1 = Yo[first_vertex_inside];

                        x2 = Xe[first_vertex_outside];
                        y2 = Ye[first_vertex_outside];

                        x3 = Xo[second_vertex_inside];
                        y3 = Yo[second_vertex_inside];

                        extra_face_areas[face_index] = (
                            (x3 - x2) * (y1 - y2)
                        ) - (
                            (y3 - y2) * (x1 - x2)
                        );
                    }

                    if (Xn) {
                        if (vertex_flags[first_vertex_outside] < NDC) {
                            normal_x = t_1*Xn[first_vertex_outside] + one_minus_t_1*Xn[first_vertex_inside];
                            normal_y = t_1*Yn[first_vertex_outside] + one_minus_t_1*Yn[first_vertex_inside];
                            normal_y = t_1*Zn[first_vertex_outside] + one_minus_t_1*Zn[first_vertex_inside];
                            normal_length_rcp = 1 / Math.hypot(normal_x, normal_y, normal_z);
                            Xno[first_vertex_outside] = normal_x * normal_length_rcp;
                            Yno[first_vertex_outside] = normal_y * normal_length_rcp;
                            Zno[first_vertex_outside] = normal_z * normal_length_rcp;
                        }

                        if (second_vertex_inside === -1) {
                            if (vertex_flags[second_vertex_outside] < NDC) {
                                normal_x = t_2 * Xn[second_vertex_outside] + one_minus_t_2 * Xn[first_vertex_inside];
                                normal_y = t_2 * Yn[second_vertex_outside] + one_minus_t_2 * Yn[first_vertex_inside];
                                normal_y = t_2 * Zn[second_vertex_outside] + one_minus_t_2 * Zn[first_vertex_inside];
                                normal_length_rcp = 1 / Math.hypot(normal_x, normal_y, normal_z);
                                Xno[second_vertex_outside] = normal_x * normal_length_rcp;
                                Yno[second_vertex_outside] = normal_y * normal_length_rcp;
                                Zno[second_vertex_outside] = normal_z * normal_length_rcp;
                            }
                        } else {
                            if (face_flags[second_vertex_inside] < NDCE) {
                                normal_x = t_1*Xn[first_vertex_outside] + one_minus_t_1*Xn[second_vertex_inside];
                                normal_y = t_1*Yn[first_vertex_outside] + one_minus_t_1*Yn[second_vertex_inside];
                                normal_y = t_1*Zn[first_vertex_outside] + one_minus_t_1*Zn[second_vertex_inside];
                                normal_length_rcp = 1 / Math.hypot(normal_x, normal_y, normal_z);
                                Xne[first_vertex_outside] = normal_x * normal_length_rcp;
                                Yne[first_vertex_outside] = normal_y * normal_length_rcp;
                                Zne[first_vertex_outside] = normal_z * normal_length_rcp;
                            }
                        }
                    }

                    if (Uo) {
                        uv_index_from = (
                            first_vertex_outside === v3_index ?
                                first_vertex_outside + face_count + face_count :
                                first_vertex_outside === v2_index ?
                                    first_vertex_outside + face_count :
                                    first_vertex_outside
                        );
                        uv_index_to = (
                            first_vertex_inside === v3_index ?
                                first_vertex_inside + face_count + face_count :
                                first_vertex_inside === v2_index ?
                                    first_vertex_inside + face_count :
                                    first_vertex_inside
                        );
                        Uo[uv_index_from] = t_1*U[uv_index_from] + one_minus_t_1*U[uv_index_to];
                        Vo[uv_index_from] = t_1*V[uv_index_from] + one_minus_t_1*V[uv_index_to];

                        if (second_vertex_inside === -1) {
                            uv_index_from = (
                                second_vertex_outside === v3_index ?
                                    second_vertex_outside + face_count + face_count :
                                    second_vertex_outside === v2_index ?
                                        second_vertex_outside + face_count :
                                        second_vertex_outside
                            );
                            Uo[uv_index_from] = t_2 * U[uv_index_from] + one_minus_t_2 * U[uv_index_to];
                            Vo[uv_index_from] = t_2 * V[uv_index_from] + one_minus_t_2 * V[uv_index_to];
                        } else {
                            uv_index_from = (
                                second_vertex_inside === v3_index ?
                                    second_vertex_inside + face_count + face_count :
                                    second_vertex_inside === v2_index ?
                                        second_vertex_inside + face_count :
                                        second_vertex_inside
                            );

                            Ue[uv_index_from] = t_1*U[uv_index_from] + one_minus_t_1*U[uv_index_to];
                            Ve[uv_index_from] = t_1*V[uv_index_from] + one_minus_t_1*V[uv_index_to];
                        }
                    }

                    if (vertex_flags[v1_index] < NDC)
                        vertex_flags[v1_index] += NDC;
                    if (vertex_flags[v2_index] < NDC)
                        vertex_flags[v2_index] += NDC;
                    if (vertex_flags[v3_index] < NDC)
                        vertex_flags[v3_index] += NDC;
                    if (second_vertex_inside !== -1 &&
                        vertex_flags[second_vertex_inside] < NDCE)
                        vertex_flags[second_vertex_inside] += NDCE;

                }
            } // else:
            // Even when no vertices are behind the near clipping-plane, the face is may
            // still be visible in the view frustum somehow:
            // It either intersects the frustum in direction(s) other than the near clipping plane,
            // or it may fully surrounding the whole view frustum.
            // No geometric clipping is needed, but the face can not be culled.
            has_inside = true;
            face_flags[face_index] = INSIDE;
        } // else:
        // No vertices are outside the frustum (the face is fully within it).
        has_inside = true;
        face_flags[face_index] = INSIDE;
    }

    return (
        has_near ? CLIP :
        has_inside ? INSIDE : CULL
    );
};