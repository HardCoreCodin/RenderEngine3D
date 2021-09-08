import {ABOVE, BELOW, CLIP, CULL, FAR, INSIDE, LEFT, NDC, NEAR, OUT, RIGHT} from "../../../../core/constants.js";

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

    let vertex_position: Float32Array;
    for (let vertex_index = 0; vertex_index < vertex_count; vertex_index++) {
        vertex_position = arrays[vertex_index];
        x = vertex_position[0];
        y = vertex_position[1];
        z = vertex_position[2];
        w = vertex_position[3];

        if (z < 0) {
            has_near = true;
            vertex_flags[vertex_index] = NEAR;
            continue;
        } else directions = z > w ? FAR : 0;

        if (     x >  w) directions |= RIGHT;
        else if (x < -w) directions |= LEFT;

        if (     y >  w) directions |= ABOVE;
        else if (y < -w) directions |= BELOW;

        if (directions) {
            // This vertex is outside of the view frustum.
            vertex_flags[vertex_index] = directions;
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
            vertex_flags[vertex_index] = NDC;
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
    vertex_positions: Float32Array[],
    face_vertices_arrays: FaceVerticesArrayType[],
    face_flags: Uint8Array,
    vertex_flags: Uint8Array,

    check_for_clipping: boolean = false,
    cull_back_faces: boolean = false,
    pz?: number
): number => {
    // Check face intersections against the frustum:
    face_flags.fill(INSIDE);

    let has_inside, has_near: boolean;
    has_inside = has_near = false;

    let v1_index, v1_flags, x1, y1, z1, d1_x, d1_y, d1_z,
        v2_index, v2_flags, x2, y2, z2, d2_x, d2_y, d2_z,
        v3_index, v3_flags, x3, y3, z3, nx, ny, nz, dot: number;
    let v1, v2, v3: Float32Array;
    let f = 0;
    for (const indices of face_vertices_arrays) {
        // Fetch the index and out-direction flags of each of the face's vertices:
        v1_index = indices[0];
        v2_index = indices[1];
        v3_index = indices[2];
        v1_flags = vertex_flags[v1_index] & OUT;
        v2_flags = vertex_flags[v2_index] & OUT;
        v3_flags = vertex_flags[v3_index] & OUT;

        if ((v1_flags | v2_flags) | v3_flags) {
            // One or more vertices are outside - check edges for intersections:
            if ((v1_flags & v2_flags) & v3_flags) {
                // All vertices share one or more out-direction(s).
                // The face is fully outside the frustum, and does not intersect it.
                face_flags[f] = CULL;
                f++;
                continue;
                // Note: This includes the cases where "all" 3 vertices cross the near clipping plane.
                // Below there are checks for when "any" of the vertices cross it (1 or 2, but not 3).
            }

            // One or more vertices are outside, and no out-direction is shared across them.
            // The face is visible in the view frustum in some way.
            vertex_flags[v1_index] |= NDC;
            vertex_flags[v2_index] |= NDC;
            vertex_flags[v3_index] |= NDC;

            if (check_for_clipping) {
                // Check if any vertex crosses the near clipping plane:
                if (v1_flags & NEAR ||
                    v2_flags & NEAR ||
                    v3_flags & NEAR) {
                    // There is at least one vertex behind the near clipping plane.
                    // The face needs to be clipped:
                    has_near = true;
                    face_flags[f] = CLIP;
                }
                // Even if no vertices are behind the view frustum the face is still visible.
                // It either intersects the frustum in direction(s) other than the near clipping plane,
                // or it may fully surround the whole view frustum.
                // No geometric clipping is needed, but the face can not be culled.
            }
            // No clip checking is asked for, there is nothing more that can be done here.
            // Back-face culling happens at NDC space, after clipping.
        }
        // No vertices are outside the frustum (the face is fully within it).

        if (cull_back_faces) {
            // Check face orientation "early" (before the perspective divide)
            // Note:
            // This assumes that vertex positions were provided in 'clip' or 'view' space(!).
            // Also, that projected_origin_x/y/z were provided - these are the coordinates of the origin
            // which has the projection matrix alone applied to them.
            v1 = vertex_positions[v1_index];
            v2 = vertex_positions[v2_index];
            v3 = vertex_positions[v3_index];

            x1 = v1[0]; x2 = v2[0]; x3 = v3[0];
            y1 = v1[1]; y2 = v2[1]; y3 = v3[1];
            z1 = v1[2]; z2 = v2[2]; z3 = v3[2];

            // Compute 2 direction vectors forming a plane for the face:
            d1_x = x2 - x1; d2_x = x3 - x1;
            d1_y = y2 - y1; d2_y = y3 - y1;
            d1_z = z2 - z1; d2_z = z3 - z1;

            // Compute a normal vector of the face from these 2 direction vectors:
            nx = (d1_z * d2_y) - (d1_y * d2_z);
            ny = (d1_x * d2_z) - (d1_z * d2_x);
            nz = (d1_y * d2_x) - (d1_x * d2_y);

            // Dot the vector from the face to the origin with the normal:
            dot = nz*(pz - z1) - ny*y1 - nx*x1;
            if (dot > 0) {
                // if the angle is greater than 90 degrees the face is facing the camera
                has_inside = true;
            } else {
                // if the angle is 90 the face is at grazing angle to the camera.
                // if the angle is greater then 90 degrees the face faces away from the camera.
                face_flags[f] = CULL;
                // console.log(f, geo_index);
                f++;
                continue;
            }
        }

        // The face didn't get culled, so it should be visible:
        has_inside = true;

        f++;
    }

    return has_near ? CLIP :
        has_inside ? INSIDE : CULL;
};
