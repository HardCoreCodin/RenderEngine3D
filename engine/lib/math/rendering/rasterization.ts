import {Float2, Float3, Float4, T3} from "../../../types.js";

// Culling flags:
// ======================
export const NEAR  = 0b0000_0001;
export const FAR   = 0b0000_0010;
export const BELOW = 0b0000_0100;
export const ABOVE = 0b0000_1000;
export const RIGHT = 0b0001_0000;
export const LEFT  = 0b0010_0000;
export const OUT   = 0b0011_1111;
export const NDC   = 0b0100_0000;

// Clipping flags:
// ===============
export const CULL    = 0b0000_0000;
export const CLIP    = 0b0000_0001;
export const INSIDE  = 0b0000_0010;
export const INEXTRA = 0b0000_0100;

export const INTERPOLATE_1_SRC_VERTEX_NUM = 0b0000_0011;
export const INTERPOLATE_1_TRG_VERTEX_NUM = 0b0000_1100;
export const INTERPOLATE_2_SRC_VERTEX_NUM = 0b0011_0000;
export const INTERPOLATE_2_TRG_VERTEX_NUM = 0b1100_0000;

let directions,
    shared_directions,

    face_count,
    face_area,
    face_index,

    x1, y1, z1, w1,
    x2, y2, z2, w2,
    x3, y3, z3, w3,
    x4,

    d1_x, d1_y, d1_z,
    d2_x, d2_y, d2_z,

    one_over_ws, w, x, y, z, i,
    one_minus_t_1, t_1,
    one_minus_t_2, t_2,

    v1_flags,
    v2_flags,
    v3_flags,

    first_vertex_inside,
    first_vertex_inside_z,
    first_vertex_inside_num,

    first_vertex_outside,
    first_vertex_outside_z,
    first_vertex_outside_num,

    second_vertex_inside,
    second_vertex_inside_z,
    second_vertex_inside_num,

    second_vertex_outside,
    second_vertex_outside_z,
    second_vertex_outside_num,

    new_face_offset,
    num_components,
    flags,

    weight_1,
    weight_2,

    out_index,
    src_index_1,
    src_index_2,
    trg_index_1,
    trg_index_2,
    out_index_1,
    out_index_2,

    v1_index,
    v2_index,
    v3_index: number;

let has_inside,
    has_near,
    has_front_facing,
    clipped: boolean;

export const checkVertices = (
    [X, Y, Z, W]: Float4,
    vertex_flags: Uint8Array
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

    directions = OUT;
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
            vertex_flags[i] = NDC;
        }
    }

    if (!has_inside && shared_directions)
        // All vertices are completely outside, and all share at least one out-region.
        // The entire mesh is completly outside the frustum and does not intersect it in any way.
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

export const checkFaces = <FaceVerticesArrayType extends Uint8Array|Uint16Array|Uint32Array = Uint32Array>(
    [indices_v1, indices_v2, indices_v3]: T3<FaceVerticesArrayType>,
    vertex_flags: Uint8Array,
    face_flags: Uint8Array,
    check_for_clipping: boolean = false,
    cull_back_faces: boolean = false,
    X?: Float32Array,
    Y?: Float32Array,
    Z?: Float32Array,
    projected_origin_x?:number,
    projected_origin_y?:number,
    projected_origin_z?:number

): number => {
    // Check face intersections against the frustum:
    face_flags.fill(CULL);

    let nx, ny, nz, dot: number;

    has_inside = has_near = false;
    for (face_index = 0; face_index < indices_v1.length; face_index++) {
        // Fetch the index and out-direction flags of each of the face's vertices:
        v1_index = indices_v1[face_index];
        v2_index = indices_v2[face_index];
        v3_index = indices_v3[face_index];
        v1_flags = vertex_flags[v1_index] & OUT;
        v2_flags = vertex_flags[v2_index] & OUT;
        v3_flags = vertex_flags[v3_index] & OUT;

        if (v1_flags | v2_flags | v3_flags) {
            // One or more vertices are outside - check edges for intersections:
            if (v1_flags & v2_flags & v3_flags) {
                // All vertices share one or more out-direction(s).
                // The face is fully outside the frustum, and does not intersect it.
                face_flags[face_index] = CULL;
                continue;
                // Note: This includes the cases where "all" 3 vertices cross the near clipping plane.
                // Below there are checks for when "any" of the vertices cross it (1 or 2, but not 3).
            } // else:
            // One or more vertices are outside, and no out-direction is shared across them.
            // The face is visible in the view frustum in some way.

            if (cull_back_faces) {
                // Check face orientation "early" (before the perspective divide)
                // Note: This assumes that X, Y and Z arrays were provided, and that their values
                // are the x y and z values of the positions of the vertices in "view" space(!)
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

                // Compute a direction vector from the face to the origin (in projected/clip space):
                d1_x = projected_origin_x - x1;
                d1_y = projected_origin_y - y1;
                d1_z = projected_origin_z - z1;

                // Compute the dot product between that direction vector and the normal:
                dot = (d1_x * nx) +
                      (d1_y * ny) +
                      (d1_z * nz);

                if (dot > 0) {
                    // if the angle is than 90 degrees the face is facing the camera
                    has_inside = true;
                    face_flags[face_index] = INSIDE;
                } else {
                    // if the angle is 90 the face is at grazing angle to the camera.
                    // if the angle is greater then 90 degreesm the face faces away from the camera.
                    face_flags[face_index] = CULL;
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
                    face_flags[face_index] = CLIP;
                } else {
                    // Even if no vertices are behind the view frustum the face is still visible.
                    // It either intersects the frustum in direction(s) other than the near clipping plane,
                    // or it may fully surrounding the whole view frustum.
                    // No geometric clipping is needed, but the face can not be culled.
                    face_flags[face_index] = INSIDE;
                }
            } else {
                // No clip checking is asked for, there is nothing more that can be done here.
                // Back-face culling happens at NDC space, after clipping.
                face_flags[face_index] = INSIDE;
            }
        } else {
            // No vertices are outside the frustum (the face is fully within it).
            face_flags[face_index] = INSIDE;
            has_inside = true;
        }
    }

    return has_near ? CLIP :
        has_inside ? INSIDE : CULL;
};

const cullBackFaces = (
    X: Float32Array,
    Y: Float32Array,
    face_flags: Uint8Array,
    face_areas: Float32Array
): number => {
    // Back face culling (in screen-space):
    // There are 2 pieces of information that are required to determine if a triangle ABC is facing front or back:
    // 1. The sign of the area of 2D the parallelogram
    // 2. The winding order of the vertices (CW vs. CCW)
    //
    // The 3D coordinate system here is "left handed" (as in DirectX).
    // The "winding order" of the triangle's 3D vertices thus goes "clock-wise" (CW).
    // However, rendering is done here into a coordinate system that goes
    // left-to-right horizontally but top-to-bottom vertically(!).
    // Because of that the screen-transform has to apply a vertical-flip (mirror),
    // thus "reversing" the winding order in screen-space making it "counter clock wise" (CCW).
    // The signed area of the parallelogram thus follows the right-hand rule of the cross-product.
    // It could thus be computed from edge AB to edge AC as follows:
    //
    //   signed_area = (ABx * ACy) - (ABy * ACx)
    //
    // Where:
    //   AB = B - A
    //   AC = C - A
    // And (in screen space):
    //   A = V1 = [x1, y1]
    //   B = V2 = [x2, y2]
    //   C = V3 = [x3, y3]
    // Such that:
    //   AB = B - A = V2 - V1 = [x2, y2] - [x1, y1]
    //   AC = C - A = V3 - V1 = [x3, y3] - [x1, y1]
    // Thus:
    //   ABx = Bx - Ax = V2x - V1x = x2 - x1
    //   ABy = By - Ay = V2y - V1y = y2 - y1
    // And:
    //   ACx = Cx - Ax = V3x - V1x = x3 - x1
    //   ACy = Cy - Ay = V3y - V1y = y3 - y1
    // Thus:
    //   signed_area = ((x2 - x1) * (y3 - y1)) - ((y2 - y1) * (x3 - x1))
    //
    has_front_facing = false;

    for ([i, flags] of face_flags.entries()) if (flags) {
        // Compute the area of the parallelogram formed by the 3 vertices.
        x1 = X[i]; y1 = Y[i];
        x2 = X[i]; y2 = Y[i];
        x3 = X[i]; y3 = Y[i];

        face_area = ((x2 - x1) * (y3 - y1)) - ((y2 - y1) * (x3 - x1));

        if (face_area > 0) {
            // if the area is positive, the parallelogram (and thus the face) is facing forward.
            has_front_facing = true;
            face_areas[i] = face_area;
        } else
            // if the area is negative, the parallelogram (and thus the face) is facing backwards.
            // if the area is zero, the face also has a zero surface so can not be drawn.
            face_flags[i] = CULL;
    }

    return has_front_facing ? INSIDE : CULL;
};

export const clipFaces = <FaceVerticesArrayType extends Uint8Array|Uint16Array|Uint32Array = Uint32Array>(
    [X, Y, Z, W]: Float4,
    [indices_v1, indices_v2, indices_v3]: T3<FaceVerticesArrayType>,
    vertex_indices: FaceVerticesArrayType,
    vertex_numbers: Uint8Array,
    vertex_weights: Float32Array,
    vertex_flags: Uint8Array,
    face_flags: Uint8Array,
): number => {
    // Break each face that needs to be clipped into smaller output triangle(s).
    clipped = false;
    face_count = indices_v1.length;
    for (face_index = 0; face_index < face_count; face_index++) {
        if (face_flags[face_index] & CLIP) {
            // Clipping is done only against the near clipping plane, so ther are only 2 possible cases:
            // 1: One vertex is inside the frustum and the other two are outside beyond the near clipping plane.
            // 2: Two vertices are inside the frustum and the third is outside beyond the near clipping plane.
            v1_index = indices_v1[face_index];
            v2_index = indices_v2[face_index];
            v3_index = indices_v3[face_index];
            v1_flags = vertex_flags[v1_index];
            v2_flags = vertex_flags[v2_index];
            v3_flags = vertex_flags[v3_index];

            // Figure out which case applies to this current face, and which vertices are in/out:
            second_vertex_inside = -1;
            if (v1_flags & NEAR) {
                first_vertex_outside = v1_index;
                first_vertex_outside_num = 1;
                if (v2_flags & NEAR) {
                    second_vertex_outside = v2_index;
                    second_vertex_outside_num = 2;
                    first_vertex_inside = v3_index;
                    first_vertex_inside_num = 3;
                } else {
                    first_vertex_inside = v2_index;
                    first_vertex_inside_num = 2;
                    if (v3_flags & NEAR) {
                        second_vertex_outside = v3_index;
                        second_vertex_outside_num = 3;
                    } else {
                        second_vertex_inside = v3_index;
                        second_vertex_inside_num = 3;
                    }
                }
            } else {
                first_vertex_inside = v1_index;
                first_vertex_inside_num = 1;
                if (v2_flags & NEAR) {
                    first_vertex_outside = v2_index;
                    first_vertex_outside_num = 2;
                    if (v3_flags & NEAR) {
                        second_vertex_outside = v3_index;
                        second_vertex_outside_num = 3;
                    } else {
                        second_vertex_inside = v3_index;
                        second_vertex_inside_num = 3;
                    }
                } else {
                    second_vertex_inside = v2_index;
                    second_vertex_inside_num = 2;
                    first_vertex_outside = v3_index;
                    first_vertex_outside_num = 3;
                }
            }
            first_vertex_inside_z = Z[first_vertex_inside];
            first_vertex_outside_z = Z[first_vertex_outside];

            weight_1 = face_index + face_index;   // 2 * face_index + 0 : interpolation weight 1 (first of 2)
            weight_2 = weight_1 + 1;              // 2 * face_index + 1 : interpolation weight 2 (second of 2)
            src_index_1 = weight_1 + weight_1;    // 4 * face_index + 0 : interpolation source 1 (first of 4)
            trg_index_1 = src_index_1 + 1;        // 4 * face_index + 1 : interpolation target 1 (second of 4)
            src_index_2 = trg_index_1 + 1;        // 4 * face_index + 2 : interpolation source 2 (third of 4)
            trg_index_2 = src_index_2 + 1;        // 4 * face_index + 3 : interpolation target 2 (forth of 4)


            // In both cases the first vertex that is outside just need to be moved to the nea clipping plane:
            vertex_indices[src_index_1] = first_vertex_outside;
            vertex_indices[trg_index_1] = first_vertex_inside;
            vertex_numbers[face_index] = first_vertex_outside_num + first_vertex_inside_num<<2;
            vertex_weights[weight_1] = first_vertex_inside_z / (first_vertex_inside_z - first_vertex_outside_z);

            if (second_vertex_inside === -1) {
                // One vertex is inside the frustum, and the other two are oustide beyond the near clipping plane.
                // The triangle just needs to get smaller by moving the 2 ouside-vertices back to the near clipping plane.
                vertex_indices[src_index_2] = second_vertex_outside;
                vertex_indices[trg_index_2] = first_vertex_inside;
                vertex_numbers[face_index] |= second_vertex_outside_num<<4 + first_vertex_inside<<6;
                vertex_weights[weight_2] = first_vertex_inside_z / (first_vertex_inside_z - second_vertex_outside_z);
            } else {
                // Two vertices are inside the frustum, and the third one is behind the near clipping plane.
                // Clipping forms a quad which needs to be split into 2 triangles.
                // The first one is formed from the original one, by moving the vertex that is behind the
                // clipping plane right up-to the near clipping plane itself (exactly as in the first case).
                // The second triangle is a new triangle that needs to be created, from the 2 vertices that
                // are inside, plus a new vertex that would need to be interpolated by moving the same vertex
                // that is outside up-to the near clipping plane but towards the other vertex that is inside.
                vertex_indices[src_index_2] = first_vertex_outside;
                vertex_indices[trg_index_2] = second_vertex_inside;
                vertex_numbers[face_index] |= first_vertex_outside_num<<4 + second_vertex_inside_num<<6;
                vertex_weights[weight_2] = second_vertex_inside_z / (second_vertex_inside_z - first_vertex_outside_z);
                face_flags[face_index] |= INEXTRA;
            }

            clipped = true;
        }
    }

    return clipped ? CLIP : INSIDE;
};

const clipSharedAttribute = <FaceVerticesArrayType extends Uint8Array|Uint16Array|Uint32Array = Uint32Array>(
    vertex_attribute: Float32Array[],
    faces: Float32Array[],
    face_flags: Uint8Array,
    vertex_numbers: Uint8Array,
    vertex_weights: Float32Array,
    vertex_indices: FaceVerticesArrayType,
): void => {
    face_count = face_flags.length;
    new_face_offset = face_count + face_count + face_count; // 3 * face_count + 0 : out vertex 1 of new faces;
    num_components = faces.length;

    for (face_index = 0; face_index < face_count; face_index++) {
        flags = face_flags[face_index];
        if (flags & CLIP) {
            weight_1 = face_index + face_index;   // 2 * face_index + 0 : interpolation weight 1 (first of 2)
            weight_2 = weight_1 + 1;              // 2 * face_index + 1 : interpolation weight 2 (second of 2)
            out_index = weight_1 + face_index;    // 3 * face_index * 0 : out triangle vertex  1 (first of 3)
            src_index_1 = out_index + face_index; // 4 * face_index + 0 : interpolation source 1 (first of 4)
            trg_index_1 = src_index_1 + 1;        // 4 * face_index + 1 : interpolation target 1 (second of 4)
            src_index_2 = trg_index_1 + 1;        // 4 * face_index + 2 : interpolation source 2 (third of 4)
            trg_index_2 = src_index_2 + 1;        // 4 * face_index + 3 : interpolation target 2 (forth of 4)
            src_index_1 = vertex_indices[src_index_1];
            trg_index_1 = vertex_indices[trg_index_1];
            src_index_2 = vertex_indices[src_index_2];
            trg_index_2 = vertex_indices[trg_index_2];

            out_index_1 = vertex_numbers[face_index] & INTERPOLATE_1_SRC_VERTEX_NUM;
            out_index_2 = vertex_numbers[face_index] & INTERPOLATE_2_SRC_VERTEX_NUM;
            out_index_2 >>= 4;
            out_index_1 += out_index;
            out_index_2 += flags & INEXTRA ? out_index + new_face_offset : out_index;

            t_1 = vertex_weights[weight_1];
            t_2 = vertex_weights[weight_2];
            one_minus_t_1 = 1 - t_1;
            one_minus_t_2 = 1 - t_2;

            for (i = 0; i < num_components; i++) {
                faces[i][out_index_1] = t_1*vertex_attribute[i][src_index_1] + one_minus_t_1*vertex_attribute[i][trg_index_1];
                faces[i][out_index_2] = t_2*vertex_attribute[i][src_index_2] + one_minus_t_2*vertex_attribute[i][trg_index_2];
            }
        }
    }
};

const clipUnsharedAttribute = (
    vertex_attribute: Float32Array[],
    faces: Float32Array[],
    face_flags: Uint8Array,
    vertex_numbers: Uint8Array,
    vertex_weights: Float32Array
): void => {
    face_count = face_flags.length;
    new_face_offset = face_count + face_count + face_count; // 3 * face_count + 0 : out vertex 1 of new faces;
    num_components = faces.length;

    for (face_index = 0; face_index < face_count; face_index++) {
        flags = face_flags[face_index];
        if (flags & CLIP) {
            weight_1 = face_index + face_index;   // 2 * face_index + 0 : interpolation weight 1 (first of 2)
            weight_2 = weight_1 + 1;              // 2 * face_index + 1 : interpolation weight 2 (second of 2)
            out_index = weight_1 + face_index;    // 3 * face_index * 0 : out triangle vertex  1 (first of 3)
            src_index_1 = vertex_numbers[face_index] & INTERPOLATE_1_SRC_VERTEX_NUM;
            trg_index_1 = vertex_numbers[face_index] & INTERPOLATE_1_TRG_VERTEX_NUM;
            src_index_2 = vertex_numbers[face_index] & INTERPOLATE_2_SRC_VERTEX_NUM;
            trg_index_2 = vertex_numbers[face_index] & INTERPOLATE_2_TRG_VERTEX_NUM;
            trg_index_1 >>= 2;
            src_index_2 >>= 4;
            trg_index_2 >>= 6;
            src_index_1 += out_index;
            trg_index_1 += out_index;
            src_index_2 += out_index;
            trg_index_2 += out_index;

            out_index_1 = out_index + src_index_1;
            out_index_2 = out_index + flags & INEXTRA ? src_index_2 + new_face_offset : src_index_2;

            t_1 = vertex_weights[weight_1];
            t_2 = vertex_weights[weight_2];
            one_minus_t_1 = 1 - t_1;
            one_minus_t_2 = 1 - t_2;

            for (i = 0; i < num_components; i++) {
                faces[i][out_index_1] = t_1*vertex_attribute[i][src_index_1] + one_minus_t_1*vertex_attribute[i][trg_index_1];
                faces[i][out_index_2] = t_2*vertex_attribute[i][src_index_2] + one_minus_t_2*vertex_attribute[i][trg_index_2];
            }
        }
    }
};

const perspectiveDivideVertexPositions = (
    [X, Y, Z, W]: Float4,
    vertex_flags: Uint8Array
): void => {
    for ([i, flags] of vertex_flags.entries()) if (flags & NDC) {
        w = W[i];
        one_over_ws = 1 / w;

        X[i] *= one_over_ws;
        Y[i] *= one_over_ws;
        Z[i] *= one_over_ws;
        W[i] = one_over_ws;
    }
};

const perspectiveCorrectVertexAttribute2D = (
    [Xa, Ya]: Float2,
    [Xo, Yo]: Float2,
    ONE_OVER_WS: Float32Array,
    vertex_flags: Uint8Array,
): void => {
    for ([i, flags] of vertex_flags.entries()) if (flags & NDC) {
        one_over_ws = ONE_OVER_WS[i];
        Xo[i] = Xa[i] * one_over_ws;
        Yo[i] = Ya[i] * one_over_ws;
    }
};

const perspectiveCorrectVertexAttribute3D = (
    [Xa, Ya, Za]: Float3,
    [Xo, Yo, Zo]: Float3,
    ONE_OVER_WS: Float32Array,
    vertex_flags: Uint8Array,
): void => {
    for ([i, flags] of vertex_flags.entries()) if (flags & NDC) {
        one_over_ws = ONE_OVER_WS[i];
        Xo[i] = Xa[i] * one_over_ws;
        Yo[i] = Ya[i] * one_over_ws;
        Zo[i] = Za[i] * one_over_ws;
    }
};

const max = Math.max;
const min = Math.min;
// const sorted_triangle_vertex_indicies = new Uint32Array(4);
// const sorted_triangle_vertex_x_coords = new Float32Array(4);
// const sorted_triangle_vertex_y_coords = new Float32Array(4);

const scanFaces = (
    [X, Y, Z, W]: Float4,
    face_areas: Float32Array,
    face_flags: Uint8Array,

    pixel_depths: Float32Array,
    pixel_face_ids: Uint32Array,
    pixel_object_ids: Uint32Array,
    pixel_material_ids: Uint32Array,
    [
        pixel_v1_weights,
        pixel_v2_weights,
        pixel_v3_weights
    ]: Float4,

    screen_width: number,
    screen_height: number,

    object_id: number,
    material_id: number
): number => {


    let a1, b1, c1,
        a3, b3, c3,

        ws, w1z, w3z,
        one_over_full_area,
        areaABPa,
        areaABPb,
        areaABPc,
        areaCAPa,
        areaCAPb,
        areaCAPc,
        one_over_ws_v1,
        one_over_ws_v2,
        one_over_ws_v3,
        w1_one_over_ws,
        w3_one_over_ws,

        dx1, dy1, s1,
        dx2, dy2, s2,
        dx3, dy3, s3,

        min_x, max_x,
        min_y, max_y,

        tx, mx, bx,
        ty, my, by,

        pixel_index: number;

    let has_left_vertex,
        has_visible_pixels,
        has_visible_faces: boolean;
    has_visible_faces = false;

    for (v1_index = 0; face_index < face_flags.length; face_index += 3) {
        flags = face_flags[face_index];
        if (flags) {
            v2_index = v1_index + 1;
            v3_index = v2_index + 1;

            x1 = X[v1_index];  y1 = Y[v1_index];  z1 = Z[v1_index];
            x2 = X[v2_index];  y2 = Y[v2_index];  z2 = Z[v2_index];
            x3 = X[v3_index];  y3 = Y[v3_index];  z3 = Z[v3_index];


            min_x = min(x1, x2, x3);
            if (min_x > screen_width)
                continue;

            max_x = max(x1, x2, x3);
            if (max_x < 0)
                continue;

            min_y = min(y1, y2, y3);
            if (min_y > screen_height)
                continue;

            max_y = max(y1, y2, y3);
            if (max_y < 0)
                continue;

            // For proper "perspective corrected" interpolation,
            // the reciprocal of Ws and Z needs to be fetched:
            one_over_ws_v1 = W[v1_index];
            one_over_ws_v2 = W[v2_index];
            one_over_ws_v3 = W[v3_index];

            // Pre-compute barycentric coordinate constants:
            // All of them need to be divided by the "full" area of the 'triangle' (parallelogram):
            one_over_full_area = 1 / face_areas[face_index];

            areaABPa = y1 - y2;
            areaABPb = x2 - x1;

            areaCAPa = y3 - y1;
            areaCAPb = x1 - x3;

            one_over_full_area = 1.0 / (
                areaABPb * areaCAPa -
                areaABPa * areaCAPb
            );

            areaABPa *= one_over_full_area;
            areaABPb *= one_over_full_area;
            areaCAPa *= one_over_full_area;
            areaCAPb *= one_over_full_area;

            areaABPc = one_over_full_area * (
                x1 * y2 -
                y1 * x2
            );
            areaCAPc = one_over_full_area * (
                x3 * y1 -
                y3 * x1
            );


            // Pre-compute barycentric weight constants for depth and one-over-ws:
            w1z = z1 - z2;
            w3z = z3 - z2;
            w1_one_over_ws = one_over_ws_v1 - one_over_ws_v2;
            w3_one_over_ws = one_over_ws_v3 - one_over_ws_v2;

            // Clip the triangle's screen-space pixel-bounds to the actual screen bounds:
            min_x = max(min_x, 0);
            min_y = max(min_y, 0);
            max_x = min(max_x, screen_width);
            max_y = min(max_y, screen_height);


            // Then the initial weights can be computed, using the first x and y values that would be used:
            pixel_index = screen_width * min_y + min_x;
            w1 = a1*min_x + b1*min_y + c1;
            w3 = a3*min_x + b3*min_y + c3;

            has_visible_pixels = false;

            // Scan the bounds:
            for (y = min_y; y <= max_y; y++) {
                for (x = min_x; x <= max_x; x++) {
                    if (w1 >= 0 && w3 >= 0 || (1 - w1 - w3) >= 0) {
                        // Interpolate a "1 / ws" value for this pixel,
                        // using the NON-perspective-corrected barycentric coordinates:
                        ws = 1 / (
                            one_over_ws_v2 +
                            w1_one_over_ws * w1 +
                            w3_one_over_ws * w3
                        );

                        // Perspective-correct the baryentric coordinates themselves:
                        w1 *= ws;
                        w3 *= ws;

                        // Interpolate z (using the constants for the first 2 barycentric coordinates pre-computed above):
                        z = z2 + w1*w1z + w2*w3z;

                        // Z cull + test:
                        if (z >= 0 && z <= 1 && z < pixel_depths[pixel_index]) {
                            pixel_depths[pixel_index] = z;
                            pixel_v1_weights[pixel_index] = w1;
                            pixel_v2_weights[pixel_index] = w2;
                            pixel_v3_weights[pixel_index] = w3;

                            pixel_face_ids[pixel_index] = face_index;
                            pixel_object_ids[pixel_index] = object_id;
                            pixel_material_ids[pixel_index] = material_id

                            has_visible_pixels = true;
                        }
                    }
                    w1 += areaABPa;
                    w3 += areaCAPa;
                    pixel_index++;
                }
                w1 += areaABPb;
                w3 += areaCAPb;
                pixel_index += screen_width;
            }

            if (has_visible_pixels)
                has_visible_faces = true;
        }
    }

    return has_visible_faces ? INSIDE : CULL;
};


//
// has_left_vertex = false;
// if (y1 < y2) {
//     if (y3 < y1) {
//         has_left_vertex = true;
//         tx = x3;  mx = x1;  bx = x2;
//         ty = y3;  my = y1;  by = y2;
//     } else {
//         tx = x1;
//         ty = y1;
//
//         if (y2 < y3) {
//             has_left_vertex = true;
//             mx = x2;  bx = x3;
//             my = y2;  by = y3;
//         } else {
//             mx = x3;  bx = x2;
//             my = y3;  by = y2;
//         }
//     }
// } else {
//     if (y3 < y2) {
//         tx = x3;  mx = x2;  bx = x1;
//         ty = y3;  my = y2;  by = y1;
//     } else {
//         tx = x2;
//         ty = y2;
//
//         if (y1 < y3) {
//             mx = x1;  bx = x3;
//             my = y1;  by = y3;
//         } else {
//             has_left_vertex = true;
//             mx = x3;  bx = x1;
//             my = y3;  by = y1;
//         }
//     }
// }
//
// dx1 = bx - tx;  dy1 = by - ty;  s1 = dx1 / dy1;
// dx2 = mx - tx;  dy2 = my - ty;  s2 = dx2 / dy2;
// dx3 = bx - mx;  dy3 = by - my;  s3 = dx3 / dy3;
//
// if (has_left_vertex) {
//     leftEdge = 1;
//     rightEdge = 0;
//
//     if (dx1 < 0) {
//         // Update Common/Uncommon Left and Right Indices
//         ucL=1; cL=0;
//         ucR=0; cR=1;
//         if(dx3 > 0) {
//             // Update Value for left edge
//             eUpdate=1;
//         } else {
//             // No Update Needed
//             eUpdate=0
//         }
//     } else {
//         // Update Common/Uncommon Right Indices
//         cR=0; ucR=1;
//         if (dx2 < 0) {
//             // Update Common/Uncommon Left Indices
//             ucL=1; cL=0;
//             // Update Value for left edge
//             eUpdate=1;
//         } else {
//             // Update Common/Uncommon Left Indices
//             ucL=0; cL=1;
//             //No Update Needed
//             eUpdate=0;
//         }
//     }
// } else {
//     // Update left and right active edges
//     leftEdge=0;
//     rightEdge=1;
//     if (dx1 < 0) {
//         //Update Common/Uncommon Left Indices
//         ucL=1 / cL=0
//         if (dx2 > 0) {
//             // Update Common/Uncommon Right Indices
//             ucR=1; cR=0;
//             // Update Value for right edge
//             eUpdate=1;
//         } else {
//             // Update Common/Uncommon Right Indices
//             ucR=0; cR=1;
//             //No Update Needed
//             eUpdate=0;
//         }
//     } else {
//         // Update Common/Uncommon Right Indices
//         ucR=0; cR=1;
//         // No Update Needed
//         eUpdate=0;
//     }
// }
//
// // Split triangle from top to middle and set starting and ending y values
// yStart = Math.ceil(ty);
// yEnd = Math.floor(my)
// // Set initial x value to top vertex
// xLeft = xRight = tx;
// // Step By one if needed since this algorithm relies on
// // traversing edge pairs so the edges number in the main
// // loop must be even
// if

//
//
// a1 = y1 - y2; a3 = y3 - y1;
// b1 = x2 - x1; b3 = x1 - x3;
//
// one_over_area = 1.0 / (b1*a3 - a1*b3);
//
// a1 *= one_over_area; a3 *= one_over_area;
// b1 *= one_over_area; b3 *= one_over_area;
// c1 = one_over_area * (x1*y2 - y1*x2);
// c3 = one_over_area * (x3*y1 - y3*x1);


// a1 = one_over_area * (y1 - y2);
// a2 = one_over_area * (y2 - y3);


// b1 = one_over_area * (x2 - x1);
// b2 = one_over_area * (x3 - x2);

// c1 = one_over_area * (x1 * y2 - y1 * x2);
// c2 = one_over_area * (x2 * y3 - y2 * x3);

// a1 = y1 - y2;
// a2 = y2 - y3;
// a3 = y3 - y1;

// b1 = x2 - x1;
// b2 = x3 - x2;
// b3 = x1 - x3;

// c1 = x1*y2 - y1*x2;
// c2 = x2*y3 - y2*x3;
// c3 = x3*y1 - y3*x1;

// a1 *= one_over_area;  b1 *= one_over_area;  c1 *= one_over_area;
// a2 *= one_over_area;  b2 *= one_over_area;  c2 *= one_over_area;
// a3 *= one_over_area;  b3 *= one_over_area;  c3 *= one_over_area;


// Note: In this library raster space coordinates are assumed to go
// from the top-left to the bottom right, and so
// "higher" Y values here actully mean "lower" on the screen.
// This mirroring over Y also reverses the winding order from CW to CCW(!)
// This has already been accounted for before in back-face culling,
// so the areas that were already computed for the triangle's parallelograms
// are in this raster-space (CCW winding order).
//
// // Sort vertices top to bottom (on the screen: meaning lowest Y values to highest ones):
// sorted_triangle_vertex_x_coords[3] = x3;
// sorted_triangle_vertex_y_coords[3] = y3;
// sorted_triangle_vertex_indicies[3] = v3_index;
// if (y1 > y2)  {
//     // Swap 1 and 2
//     sorted_triangle_vertex_x_coords[1] = x2;
//     sorted_triangle_vertex_y_coords[1] = y2;
//     sorted_triangle_vertex_indicies[1] = v2_index;
//
//     sorted_triangle_vertex_x_coords[2] = x1;
//     sorted_triangle_vertex_y_coords[2] = y1;
//     sorted_triangle_vertex_indicies[2] = v1_index;
// } else {
//     sorted_triangle_vertex_x_coords[1] = x1;
//     sorted_triangle_vertex_y_coords[1] = y1;
//     sorted_triangle_vertex_indicies[1] = v1_index;
//
//     sorted_triangle_vertex_x_coords[2] = x2;
//     sorted_triangle_vertex_y_coords[2] = y2;
//     sorted_triangle_vertex_indicies[2] = v2_index;
// }
//
// if (sorted_triangle_vertex_y_coords[2] > sorted_triangle_vertex_y_coords[3]) {
//     // Swap 2 and 3
//     sorted_triangle_vertex_x_coords[0] = sorted_triangle_vertex_x_coords[2];
//     sorted_triangle_vertex_x_coords[2] = sorted_triangle_vertex_x_coords[3];
//     sorted_triangle_vertex_x_coords[3] = sorted_triangle_vertex_x_coords[0];
//
//     sorted_triangle_vertex_y_coords[0] = sorted_triangle_vertex_y_coords[2];
//     sorted_triangle_vertex_y_coords[2] = sorted_triangle_vertex_y_coords[3];
//     sorted_triangle_vertex_y_coords[3] = sorted_triangle_vertex_y_coords[0];
//
//     sorted_triangle_vertex_indicies[0] = sorted_triangle_vertex_indicies[2];
//     sorted_triangle_vertex_indicies[2] = sorted_triangle_vertex_indicies[3];
//     sorted_triangle_vertex_indicies[3] = sorted_triangle_vertex_indicies[0];
// }
//
// if (sorted_triangle_vertex_y_coords[1] > sorted_triangle_vertex_y_coords[2])  {
//     // Swap 1 and 2 (again)
//     sorted_triangle_vertex_x_coords[0] = sorted_triangle_vertex_x_coords[2];
//     sorted_triangle_vertex_x_coords[2] = sorted_triangle_vertex_x_coords[1];
//     sorted_triangle_vertex_x_coords[1] = sorted_triangle_vertex_x_coords[0];
//
//     sorted_triangle_vertex_y_coords[0] = sorted_triangle_vertex_y_coords[2];
//     sorted_triangle_vertex_y_coords[2] = sorted_triangle_vertex_y_coords[1];
//     sorted_triangle_vertex_y_coords[1] = sorted_triangle_vertex_y_coords[0];
//
//     sorted_triangle_vertex_indicies[0] = sorted_triangle_vertex_indicies[2];
//     sorted_triangle_vertex_indicies[2] = sorted_triangle_vertex_indicies[1];
//     sorted_triangle_vertex_indicies[1] = sorted_triangle_vertex_indicies[0];
// }
//
// if (sorted_triangle_vertex_y_coords[1] === sorted_triangle_vertex_y_coords[2]) {
//     // CCW winding order
//
// }
// // Flat top triangle:
// // ==================
// // y3 must then be to be the top one
// ty = y1;
// by = y3;
// h = Yt - Yb;
//
// Xb = x3;
// Yb = y3;
// Zb = z3;
//
// // Sort vertices left to right
// if (x1 < x2) {
//     Xl = x1;  Xr = x2;
//     Zl = z1;  Zr = z2;
// } else {
//     Xl = x2;  Xr = x1;
//     Zl = z2;  Zr = z1;
//     [i1, i2] = [i2, i1];
// }
//
// l_edge__x_per_y = (Xb - Xl) / h;
// r_edge__x_per_y = (Xb - Xr) / h;
// //
// // Where:
// //   AB = B - A
// //   AC = C - A
// // And (in screen space):
// //   A = V1 = [x1, y1]
// //   B = V2 = [x2, y2]
// //   C = V3 = [x3, y3]
// // Such that:
// //   AB = B - A = V2 - V1 = [x2, y2] - [x1, y1]
// //   AC = C - A = V3 - V1 = [x3, y3] - [x1, y1]
// // Thus:
// //   ABx = Bx - Ax = V2x - V1x = x2 - x1
// //   ABy = By - Ay = V2y - V1y = y2 - y1
// // And:
// //   ACx = Cx - Ax = V3x - V1x = x3 - x1
// //   ACy = Cy - Ay = V3y - V1y = y3 - y1
// // Thus:
// //   signed_area = ((x2 - x1) * (y3 - y1)) - ((y2 - y1) * (x3 - x1))
//
// //   area(ABC) = ((x2 - x1) * (y3 - y1)) - ((y2 - y1) * (x3 - x1))
// //   area(ABP) = ((x2 - x1) * (yp - y1)) - ((y2 - y1) * (xp - x1))
// //   area(BCP) = ((x2 - x1) * (yp - y1)) - ((y2 - y1) * (xp - x1))
// //   area(ABP) = ((x2 - x1) * (yp - y1)) - ((y2 - y1) * (xp - x1))
//
// // TODO: Optimize...
//
// i1 = v1_index;
// i2 = v2_index;
// i3 = v3_index;
//
// // Sort vertices top to bottom:
// // Note: Raster space coordinates start with zero at the top-left and go down,
// // so higher Y values mean lower on the screen.
// if (y1 > y2)  {
//     [i1, i2] = [i2, i1];
//     [x1, x2] = [x2, x1];
//     [y1, y2] = [y2, y1];
//     [z1, z2] = [z2, z1];
// }
// if (y2 > y3) {
//     [i2, i3] = [i3, i2];
//     [x2, x3] = [x3, x2];
//     [y2, y3] = [y3, y2];
//     [z2, z3] = [z3, z2];
// }
// if (y1 > y2)  {
//     [i1, i2] = [i2, i1];
//     [x1, x2] = [x2, x1];
//     [y1, y2] = [y2, y1];
//     [z1, z2] = [z2, z1];
// }
//
// if (y1 === y2) {
//     // Flat top triangle:
//     // ==================
//     // CW winding order means that y3 has to be below
//     Yt = y1;
//     Yb = y3;
//     h = Yt - Yb;
//
//     Xb = x3;
//     Yb = y3;
//     Zb = z3;
//
//     // Sort vertices left to right
//     if (x1 < x2) {
//         Xl = x1;  Xr = x2;
//         Zl = z1;  Zr = z2;
//     } else {
//         Xl = x2;  Xr = x1;
//         Zl = z2;  Zr = z1;
//         [i1, i2] = [i2, i1];
//     }
//
//     l_edge__x_per_y = (Xb - Xl) / h;
//     r_edge__x_per_y = (Xb - Xr) / h;
//
//     //
// // Using pixel centers for x and y, the constant coefficients can be used to
// // compute the area of the triangle connecting the pixel-center to the 2 top vertices.
// // The ratio of this area over the full area of the full triangle (Using Xb and Yb),
// // gives the amount that that the bottom vertex "contributes" to that pixel.
// //
// // The same formulation can be applied with same pixel position,
// // against the other 2 triangles, by "rotating" this setup:
// // To get the triangle to the left of the pixel instead of above it,
// // substitute:
// // Xb => Xr
// // Yb => Yr
// // and:
// // Yl => Yb
// // Xl => Xb
// // Xr => Xl
// // Yr => Yl
// //
// // Giving:
// // x = Xr
// // y = Yr
// // w2a = Yb - Yl
// // w2b = Xl - Xb
// // w2c = Xb*Yl - Yb*Xl
// //
// // The same can be applied again for the third sub-triangle:
// // Xb => Xl
// // Yb => Yl
// // and:
// // Yl => Yr
// // Xl => Xr
// // Xr => Xb
// // Yr => Yb
// //
// // Giving:
// // x = Xl
// // y = Yl
// // w3a = Yr - Yb
// // w3b = Xb - Xr
// // w3c = Xr*Yb - Yr*Xb
// //
// // To summarize, given the constant coefficients (for parallelogram areas):
// //
// // w1a = Yl - Yr
// // w2a = Yb - Yl
// // w3a = Yr - Yb
// //
// // w1b = Xr - Xl
// // w2b = Xl - Xb
// // w3b = Xb - Xr
// //
// // w1c = Xl*Yr - Yl*Xr
// // w2c = Xb*Yl - Yb*Xl
// // w3c = Xr*Yb - Yr*Xb
// //
// // And the full area (parallelogram):
// // area = (Yl - Yr)*Xb + (Xr - Xl)*Yb + (XlYr - YlXr)
// //
// // The barycentric coordinates of a given pixel with cartesian coordinates (x, y) is:
// // w1 = w1a*x + w1b*y + w1c
// // w2 = w2a*x + w2b*y + w2c
// // w3 = w3a*x + w3b*y + w3c
//
//     // Barycentric coordinates:
//     // ========================
//     //
//     // w1a = Yl - Yr
//     // w2a = Yb - Yl
//     // w3a = Yr - Yb
//     //
//     // w1b = Xr - Xl
//     // w2b = Xl - Xb
//     // w3b = Xb - Xr
//     //
//     // w1c = Xl*Yr - Yl*Xr
//     // w2c = Xb*Yl - Yb*Xl
//     // w3c = Xr*Yb - Yr*Xb
//     //
//     // For a flat-top triangle Yl is Yr which is Yt, so:
//     //
//     // w1a = Yt - Yt // = 0
//     // w2a = Yb - Yt
//     // w3a = Yt - Yb // = -(Yb - Yt) = -w2a
//     //
//     // w1b = Xr - Xl
//     // w2b = Xl - Xb
//     // w3b = Xb - Xr
//     //
//     // w1c = Xl*Yt - Xr*Yt = Yt*(Xl - Xr)
//     // w2c = Xb*Yt - Yb*Xl
//     // w3c = Xr*Yb - Xb*Yt
//     //
//     // Which optimizes to:
//     //
//     a1 = 0;
//     a2 = Yb - Yt;
//     a3 = -a2;
//
//     b1 = Xr - Xl;
//     b2 = Xl - Xb;
//     b3 = Xb - Xr;
//
//     c1 = Yt*(Xl - Xr);
//     c2 = Xb*Yt;
//     c3 = Xr*Yb - c2;
//     c2 -= Yb*Xl;
//
//     // Start at pixel centers (using bottom-right rasterization rule):
//     left_x = Xl + 0.5;
//     right_x = Xr + 0.5;
//     tx = xYt + 0.5;
//     bx = xYb + 0.5;
//
//     // bottom-right rasterization rule (floor)
//     tx = x~~top;
//     bx = x~~bottom;
//     pixel = top * screen_width;
//     for (y = top; y < bottom; y++) {
//         left  = ~~left_x;
//         right = ~~right_x;
//
//         for (x = left; x < right; x++) {
//             // The barycentric coordinates of a given pixel with cartesian coordinates (x, y) is:
//             // w1 = w1a*x + w1b*y + w1c
//             // w2 = w2a*x + w2b*y + w2c
//             // w3 = w3a*x + w3b*y + w3c
//             //
//             pixel_v1_weights[pixel] =
//                 pixel_depths[pixel] = ;
//             pixel++;
//         }
//
//         left_x += l_edge__x_per_y;
//         right_x += r_edge__x_per_y;
//
//         pixel += screen_width;
//     }
//
// } else if (y2 === y3) { // CW winding order means that y3 has to be above
//     flat_bx = xtrue;
//     bottom_y_fb = y3;
//
//     top_x_fb = x1;
//     top_y_fb = y1;
//     top_z_fb = z1;
//
//     // Sort vertices left to right
//     if (x2 < x3) {
//         bottm_left_x_fb = x2; bottm_right_x_fb = x3;
//         bottm_left_z_fb = z2; bottm_right_z_fb = z3;
//     } else {
//         bottm_left_x_fb = x3; bottm_right_x_fb = x2;
//         bottm_left_z_fb = z3; bottm_right_z_fb = z2;
//         [i2, i3] = [i3, i2];
//     }
// } else {
//     //  Split the triangle to flat-top and flat-bottom ones:
//     flat_tx = xflat_bx = xtrue;
//
//     // top triangle is flat-bottom:
//     bottom_y_fb = y1;
//     top_x_fb = x1;
//     top_y_fb = y1;
//     top_z_fb = z1;
//     height_fb = top_y_fb - bottom_y_fb;
//
//     // bottom triangle is flat-top:
//     top_y_ft = y2;
//     bottom_x_ft = x3;
//     bottom_y_ft = y3;
//     bottom_z_ft = z3;
//     height_ft = top_y_ft - bottom_y_ft;
//
//     // Compute a new vertex position to cut off the triangle into 2 triangles:
//     t = height_fb / (top_y_fb - bottom_y_ft);
//     one_minus_t = 1 - t;
//     x4 = x1*one_minus_t + x3*t;
//     z4 = z1*one_minus_t + z3*t;
//
//     // Check where the original triangle's middle vertex is horizontally:
//     if (x1 < x2) {
//         // The original triangle's middle vertex is on the right:
//         bottm_right_x_fb = top_right_x_ft = x2;
//         bottm_right_z_fb = top_right_z_ft = z2;
//
//         // The computed cut-off vertex is on the left:
//         bottm_left_x_fb = top_left_x_ft = x4;
//         bottm_left_z_fb = top_left_z_ft = z4;
//     } else {
//         // The original triangle's middle vertex is on the left:
//         bottm_left_x_fb = top_left_x_ft = x2;
//         bottm_left_z_fb = top_left_z_ft = z2;
//
//         // The computed cut-off vertex is on the right:
//         bottm_right_x_fb = top_right_x_ft = x4;
//         bottm_right_z_fb = top_right_z_ft = z4;
//     }
// }
//
// // Starting from the top,
//
//
// if (flat_top) {
//     l_edge__x_per_y = (bottom_x_ft - top_left_x_ft) / height_ft;
//     r_edge__x_per_y = (bottom_x_ft - top_right_x_ft) / height_ft;
//
//     //
//
//     const w1a = Yl - Yr
//     const w2a = Yb - Yl
//     const w3a = Yr - Yb
//
//     const w1b = Xr - Xl
//     const w2b = Xl - Xb
//     const w3b = Xb - Xr
//
//     const w1c = Xl*Yr - Yl*Xr
//     const w2c = Xb*Yl - Yb*Xl
//     const w3c = Xr*Yb - Yr*Xb
//
//     // Start at pixel centers (using bottom-right rasterization rule):
//     left_x = top_left_x_ft + 0.5;
//     right_x = top_right_x_ft + 0.5;
//     tx = xtop_y_ft + 0.5;
//     bx = xbottom_y_ft + 0.5;
//
//     // bottom-right rasterization rule (floor)
//     tx = x~~top;
//     bx = x~~bottom;
//     pixel = top * screen_width;
//     for (y = top; y < bottom; y++) {
//         left  = ~~left_x;
//         right = ~~right_x;
//
//
//         for (x = left; x < right; x++) {
//             pixel_depths[pixel] = ;
//             pixel++;
//         }
//
//         left_x += l_edge__x_per_y;
//         right_x += r_edge__x_per_y;
//
//         pixel += screen_width;
//     }
// }
//
//
// //
// //     // Check vertical edges (triangle is flat on the left or the right):
// //     if (x1 === x2) {
// //         if (y1 > y2) {
// //             // Going down, then left
// //             flat_right = true;
// //             top_right = 1;
// //             bottom_right = 2;
// //             lx = x3;
// //         }
// //         else {
// //             // Going up, then right
// //             flat_lx = xtrue;
// //             bottom_lx = x1;
// //             top_lx = x2;
// //             right = 3;
// //         }
// //     }
// //     else if (x2 === x3) {
// //         if (y2 > y3) {
// //             // Going right, then down
// //             flat_right = true;
// //             lx = x1;
// //             top_right = 2;
// //             bottom_right = 3;
// //         }
// //         else {
// //             // Going left, then up
// //             flat_lx = xtrue;
// //             right = 1;
// //             bottom_lx = x2;
// //             top_lx = x3;
// //         }
// //     }
// //     else if (x1 === x3) {
// //         if (y1 > y3) {
// //             // Going right, then down
// //             flat_lx = xtrue;
// //             top_lx = x1;
// //             right = 2;
// //             bottom_lx = x3;
// //         }
// //         else {
// //             // Going left, then up
// //             flat_right = true;
// //             bottom_right = 1;
// //             lx = x2;
// //             top_right = 3;
// //         }
// //     }
// //
// //     if (flat_left) {
// //         switch (top_left) {
// //             case 1: {
// //                 tx = xy1;
// //                 if (bottom_left === 2) {
// //                     bx = xy2;
// //                     mx = xy3;
// //                 } else {
// //                     bx = xy3;
// //                     mx = xy2;
// //                 }
// //
// //                 break;
// //             }
// //             case 2: {
// //                 tx = xy2;
// //                 if (bottom_left === 1) {
// //                     bx = xy1;
// //                     mx = xy3;
// //                 } else {
// //                     bx = xy3;
// //                     mx = xy1;
// //                 }
// //
// //                 break;
// //             }
// //             case 3: {
// //                 tx = xy3;
// //                 if (bottom_left === 2) {
// //                     bx = xy2;
// //                     mx = xy1;
// //                 } else {
// //                     bx = xy1;
// //                     mx = xy2;
// //                 }
// //             }
// //         }
// //
// //         const top_edge_slope = middle
// //     }
// //
// //
// //     // Check horizontal edges (triangle is flat on the top or the bottom):
// //     if (y1 === y2) {
// //         if (x1 < x2) {
// //             // Going right, then down
// //             flat_tx = xtrue;
// //             top_lx = x1;
// //             top_right = 2;
// //             bx = x3;
// //         }
// //         else {
// //             // Going left, then up
// //             flat_bx = xtrue;
// //             bottom_right = 1;
// //             bottom_lx = x2;
// //             tx = x3;
// //         }
// //     }
// //     else if (y2 === y3) {
// //         if (x2 < x3) {
// //             // Going up, then right
// //             flat_tx = xtrue;
// //             top_lx = x1;
// //             top_right = 2;
// //             bx = x3;
// //         } else {
// //             // Going left, then up
// //             flat_bx = xtrue;
// //             bottom_right = 1;
// //             bottom_lx = x2;
// //             tx = x3;
// //         }
// //     }
// //     else if (y1 === y3) {
// //         if (x1 < x3) {
// //             // Going up, then down
// //             flat_bx = xtrue;
// //             bottom_lx = x1;
// //             tx = x2;
// //             bottom_right = 3;
// //         } else {
// //             // Going down, then up
// //             flat_tx = xtrue;
// //             top_right = 1;
// //             bx = x2;
// //             top_lx = x3;
// //         }
// //     }
// //     // No horizontal edge found:
// //     else if (y1 > y2) {
// //         if (y1 > y3) {
// //             tx = x1;
// //
// //         }
// //     }
// //     else if (y2 ) {
// //
// //     }
// // }
//
// if (x2 === x3) {
//     // Vertical edge:
//     // Going up/down?
//     // Second vertex left/right (flat-left/flat-right triangle??
//
//     mx = x1;
// }
//
//
// if (y1 === y2) { flat_tx = xtrue;
//     // Horizontal:
//     // Going right
//     // Y: 1 & 2 > 3
//     top_1 = 1; top_2 = 2;
//     bx = x3; } else if (
//
//     y3 === y2) { flat_bx = xtrue;
//     // Y: 1 > 2 & 3
//     tx = x1;
//     bottom_1 = 2; bottom_2 = 3; } else if (
//
//     y2 >  y1) {
//     // Y: 2 > 1 > 3
//     tx = x2;
//     mx = x1;
//     bx = x3; } else if (
//
//     y2 < y3) {
//     // Y: 1 > 3 > 2
//     bx = x2;
//     tx = x3; } else {
//
//     // Y: 1 > 2 > 3
//     tx = x1;
//     bx = x3;
// }
//
// } else { flat_lx = xtrue;
//     // Going left, then up:
//
//
// }
// } else
// if (y1 === y3) { flat_bx = xtrue;
//     // X: 1 < 3
//     tx = x2;
//     bx = x1;
//
//     if (x2 === x3) { flat_right = true;
//         // X: 1 < 2 & 3
//         lx = x1; right = 3;} else if (
//
//         x1 === x2) { flat_lx = xtrue;
//         // X: 1 & 2 < 3
//         lx = x2; right = 3; } else if (
//
//         x1 < x2) {
//         // X: 1 < 3 < 2
//         lx = x1; right = 2; } else {
//
//         // X: 2 < 1 < 3
//         lx = x2; right = 3;
//     }
// } else
// if (x1 === x2) {
//     if (y1 > y2) { flat_right = true;
//         // Y: 1 & 2 > 3
//         lx = x3; right = 1;
//
//         if (y3 === y1) { flat_tx = xtrue;
//             // Y: 1 & 3 > 2
//             tx = x3;
//             bx = x2; } else if (
//
//             y3 > y1) {
//             // Y: 3 > 1 > 2
//             tx = x3;
//             bx = x2; } else if (
//
//             y2 > y3) {
//             // Y: 1 > 2 > y3
//             tx = x1;
//             bx = x3; } else {
//
//             // Y: 1 > 3 > 2
//             tx = x1;
//             bx = x2;
//         }
//     }
//     else { flat_lx = xtrue;
//         // X: 1 & 2 < 3
//         lx = x1; right = 3;
//
//         if (y3 === y1) { flat_bx = xtrue;
//             // Y: 2 > 3 & 1
//             tx = x2;
//             bx = x1; } else if (
//
//             y2 === y3) { flat_tx = xtrue;
//             // Y: 2 & 3 > 1
//             tx = x2;
//             bx = x1; } else if (
//
//             y3 > y2) {
//             // Y: 3 > 2 > 1
//             tx = x3;
//             bx = x1; } else if (
//
//             y3 < y1) {
//             // Y: 2 > 1 > 3
//             bx = x3;
//             tx = x2; } else {
//
//             // Y: 2 > 3 > 1
//             tx = x2;
//             bx = x1;
//         }
//     }
// } else
// if (y1 === y2) {
//     if (x2 < x1) { flat_bx = xtrue;
//         // left then up
//         tx = x3;
//         bx = x1;
//
//         if (
//             x1 === x3) {flat_right = true;
//             // X: 2 < 1 & 3
//             lx = x2; right = 1;} else if (
//
//             x2 === x3) {flat_lx = xtrue;
//             // X: 3 & 2 < 1
//             lx = x2; right = 1;} else if (
//
//             x2 < x3) {
//             // X: 2 < 1 < 3
//             lx = x2; right = 3;} else if (
//
//             x3 < x2) {
//             // X: 3 < 2 < 1
//             lx = x3; right = 1;} else
//
//         // X: 2 < 3 < 1
//             lx = x2; right = 1;
//
//     } else { flat_tx = xtrue;
//         // right then down
//         // 1 < 2
//         tx = x1;
//         bx = x3;
//         if (
//             x3 === x1) {flat_lx = xtrue;
//             // X: 3 & 1 < 2
//             lx = x1; right = 2;} else if (
//
//             x3 === x2) { flat_right = true;
//             // X: 1 < 2 & 3
//             lx = x1; right = 2;} else if (
//
//             x2 < x3) {
//             // X: 1 < 2 < 3
//             lx = x1; right = 3;} else if (
//
//             x3 < x1) {
//             // X: 3 < 2 < 1
//             lx = x3; right = 2;} else {
//
//             // X: 2 < 3 < 1
//             lx = x2; right = 1;
//         }
//     }
// } else
// if (x2 === x3) {
//     if (y2 > y3) { flat_lx = xtrue;
//         lx = x3; right = 1;
//     } else {
//         flat_right = true;
//         right = x3;
//         lx = xx1;
//     }
// }
// The cross product can be taken using 2 vectors that start from the first vertex v1.
// Going clock-wise:
// The first vector 'a' would go from the first vertex [x1, y1, z1] to the second vertex [x2, y2, z2].
// The second vector 'b' would go from the first vertex [x1, y1, z1] to the third vertex [x3, y3, z3].
//
// So, 'a' would be:
// ax = x2 - x1
// ay = y2 - y1
// az = z2 - z1
//
// And 'b' would be:
// bx = x3 - x1
// by = y3 - y1
// bz = z3 - z1
//
// area = ax * by  -  ay * bx
//
//
// That signed parallelofram-area is computed as the length of the cross-product
// of 2 vectors of any of the 2 edges of the triangle.
//
// In a left handed coordinate system the winding order of the triangle's vertices goes "clock-wize".
// The cross product can be taken using 2 vectors that start from the first vertex v1.
// Going clock-wise:
// The first vector 'a' would go from the first vertex [x1, y1, z1] to the second vertex [x2, y2, z2].
// The second vector 'b' would go from the first vertex [x1, y1, z1] to the third vertex [x3, y3, z3].
//
// So, 'a' would be:
// ax = x2 - x1
// ay = y2 - y1
// az = z2 - z1
//
// And 'b' would be:
// bx = x3 - x1
// by = y3 - y1
// bz = z3 - z1
//
// And the cross product would be 'n = a x b':
// nx = ay*bz - az*by;
// ny = az*bx - ax*bz;
// nz = ax*by - ay*bx;
//
// The length of the resulting vector is the signed area of the parallelogram formed by vectors 'a' and 'b'.
// It can be computed using the pythagorean theorem:
// length = sqrt( nx^2 + ny^2 + nz^2)
//
// Giving:
// area = length = sqrt (
//     ( ay * bz  -  az * by ) ^ 2 +
//     ( az * bx  -  ax * bz ) ^ 2 *
//     ( ax * by  -  ay * bx ) ^ 2
// )
//
// However: That would be the area of the parallelogram in 3D space, while the
// area that would be relevant here would have to be the 2D projection of that parallelogram (in screen space).
// The coordinates given here would be in screen already, so getting the 2D projection involves
// projecting the triangle orthographically by setting all 'z' coordinates to '0' - giving:
// area = sqrt (
//     ( ay * 0  -  0 * by ) ^ 2 +
//     ( 0 * bx  -  ax * 0 ) ^ 2 *
//     ( ax * by  -  ay * bx ) ^ 2
// )
//
// Which cancels down to:
// area = sqrt (
//     ( ax * by  -  ay * bx ) ^ 2
// )
//
// And then further cancels the squaring down to: