import {CLIP, INEXTRA, INSIDE, NEAR} from "../../../../../constants.js";

export const clipFaces = <FaceVerticesArrayType extends Uint8Array|Uint16Array|Uint32Array = Uint32Array>(
    X: Float32Array,
    Y: Float32Array,
    Z: Float32Array,
    W: Float32Array,

    indices_v1: FaceVerticesArrayType,
    indices_v2: FaceVerticesArrayType,
    indices_v3: FaceVerticesArrayType,

    src_trg_indices: FaceVerticesArrayType,
    src_trg_numbers: Uint8Array,
    interpolations: Float32Array,

    vertex_flags: Uint8Array,
    face_flags: Uint8Array,
    face_count: number,

    near_clipping_plane_distance: number,

    Xo: Float32Array,
    Yo: Float32Array,
    Zo: Float32Array,
    Wo: Float32Array,
): number => {
    // Break each face that needs to be clipped into smaller output triangle(s).
    let clipped = false;
    const new_face_offset =  3 *face_count;  // 3 * face_count + 0 : out vertex 1 of new faces;

    let v1_index, v1_flags, f_2,
        v2_index, v2_flags, f_3,
        v3_index, v3_flags, f_4,

        in1_index, in1_num, in1z,
        in2_index, in2_num, in2z,
        out1_index, out1_num, out1z,
        out2_index, out2_num, out2z,

        t, one_minus_t,
        unshared_vertex_index,
        encoded_vertex_nums: number;

    for (let f = 0; f < face_count; f++) {
        if (face_flags[f] & CLIP) {
            // Clipping is done only against the near clipping plane, so there are only 2 possible cases:
            // 1: One vertex is inside the frustum and the other two are outside beyond the near clipping plane.
            // 2: Two vertices are inside the frustum and the third is outside beyond the near clipping plane.
            v1_index = indices_v1[f];
            v2_index = indices_v2[f];
            v3_index = indices_v3[f];
            v1_flags = vertex_flags[v1_index];
            v2_flags = vertex_flags[v2_index];
            v3_flags = vertex_flags[v3_index];

            // Figure out which case applies to this current face, and which vertices are in/out:
            in2_index = -1;
            if (v1_flags & NEAR) {
                out1_index = v1_index;
                out1_num = 1;
                if (v2_flags & NEAR) {
                    out2_index = v2_index;
                    out2_num = 2;
                    in1_index = v3_index;
                    in1_num = 3;
                } else {
                    in1_index = v2_index;
                    in1_num = 2;
                    if (v3_flags & NEAR) {
                        out2_index = v3_index;
                        out2_num = 3;
                    } else {
                        in2_index = v3_index;
                        in2_num = 3;
                    }
                }
            } else {
                in1_index = v1_index;
                in1_num = 1;
                if (v2_flags & NEAR) {
                    out1_index = v2_index;
                    out1_num = 2;
                    if (v3_flags & NEAR) {
                        out2_index = v3_index;
                        out2_num = 3;
                    } else {
                        in2_index = v3_index;
                        in2_num = 3;
                    }
                } else {
                    in2_index = v2_index;
                    in2_num = 2;
                    out1_index = v3_index;
                    out1_num = 3;
                }
            }

            in2z = Z[in2_index];  out1z = Z[out1_index];
            in1z = Z[in1_index];  out2z = Z[out2_index];

            // Compute initial index offsets for buffers containing multiple values per-face:
            f_2 = f + f;      // 2 * face_index * 0 (first of 2)
            f_3 = f_2 + f;    // 3 * face_index * 0 (first of 3)
            f_4 = f_2 + f_2;  // 4 * face_index + 0 (first of 4)

            // In both cases the first vertex that is outside just need to be moved to the near clipping plane:
            src_trg_indices[f_4    ] = out1_index;  // 4 * face_index + 0 : interpolation source 1 (first of 4)
            src_trg_indices[f_4 + 1] = in1_index;   // 4 * face_index + 1 : interpolation target 1 (second of 4)

            // Encode the face vertex numbers of this transformation:
            encoded_vertex_nums = out1_num + in1_num<<2;

            // Compute and store the (relative)amount by which the FIRST outside
            // vertex would need to be moved 'inwards' towards the FIRST inside vertex:
            t = interpolations[f_2] = out1z / (out1z - in1z);
            one_minus_t = 1 - t;
            // Note:
            // Clip space is set up such that a depth of 0 is where the near clipping plane is.
            // So 'out1z' would be (negative)distance of the vertex from the near clipping plane,
            // representing the 'amount' by which the 'outside' vertex would needs to be 'pushed' forward
            // to land it on the near clipping plane. The denominator here is the 'full' depth-distance
            // between the 2 vertices - the sum of distances of the 2 vertices from to the clipping plane.
            // The ratio of the former from the latter is thus the (positive)interpolation amount 't' (0->1).
            // Since 'out1z' would be negative here, 'in1z' is negated as well to get the full (negative)sum.
            // Since both the numerator and the denominator here would be negative, the result is positive.
            // The interpolation value 't' is with respect to the 'outside' vertex, and so would be multiplied
            // by any attribute-value of the 'outside' vertex. The complement of that (1 - t) would be multiplied
            // by any attribute-value of the 'inside' vertex, and the sum would be the interpolated value.
            // *The same logic applies for the second interpolation in either of it's 2 cases below.

            // Compute the index of the "unshared" position-value(s) of the 'clipped' vertex of this face:
            unshared_vertex_index = f_3 + out1_num;

            // Compute the new clip-space coordinates of the clipped-vertex:
            Xo[unshared_vertex_index] = t*X[out1_index] + one_minus_t*X[in1_index];
            Yo[unshared_vertex_index] = t*Y[out1_index] + one_minus_t*Y[in1_index];
            Zo[unshared_vertex_index] = 0;
            Wo[unshared_vertex_index] = near_clipping_plane_distance;
            // Note:
            // The 'Z' coordinate of this new vertex position in clip-space is set to '0' since it has
            // now been moved onto the clipping plane itself. Similarly, the 'W' coordinate is set to
            // what the "original" Z-depth value this vertex "would have had", had it beeen on the
            // near clipping plane in view-space in the first place.
            // *The same logic applies for the second interpolation in either of it's 2 cases below.

            // Encode the face vertex numbers of this transformation:
            src_trg_numbers[f] = encoded_vertex_nums + out2_num<<4 + in1_num<<6;

            if (in2_index === -1) {
                // One vertex is inside the frustum, and the other two are oustide beyond the near clipping plane.
                // The triangle just needs to get smaller by moving the 2 outside-vertices back to the near clipping plane.
                src_trg_indices[f_4 + 2] = out2_index;  // 4 * face_index + 2 : interpolation source 2 (third of 4)
                src_trg_indices[f_4 + 3] = in1_index;   // 4 * face_index + 3 : interpolation target 2 (forth of 4)

                // Encode the face vertex numbers of this transformation:
                src_trg_numbers[f] = encoded_vertex_nums + out2_num<<4 + in1_num<<6;

                // Compute and store the (relative)amount by which the SECOND outside
                // vertex needs to be moved inwards towards the FIRST inside vertex:
                t = interpolations[f_2 + 1] = out2z / (out2z - in1z);
                one_minus_t = 1 - t;

                // Compute the index of the "unshared" position-value(s) of the 'clipped' vertex of this face:
                unshared_vertex_index = f_3 + out2_num;

                // Compute the new clip-space coordinates of the clipped-vertex:
                Xo[unshared_vertex_index] = t*X[out2_index] + one_minus_t*X[in1_index];
                Yo[unshared_vertex_index] = t*Y[out2_index] + one_minus_t*Y[in1_index];
                Zo[unshared_vertex_index] = 0;
                Wo[unshared_vertex_index] = near_clipping_plane_distance;
            } else {
                // Two vertices are inside the frustum, and the third one is behind the near clipping plane.
                // Clipping forms a quad which needs to be split into 2 triangles.
                // The first one is formed from the original one, by moving the vertex that is behind the
                // clipping plane right up-to the near clipping plane itself (exactly as in the first case).
                // The second triangle is a new triangle that needs to be created, from the 2 vertices that
                // are inside, plus a new vertex that would need to be interpolated by moving the same vertex
                // that is outside up-to the near clipping plane but towards the other vertex that is inside.
                src_trg_indices[f_4 + 2] = out1_index;  // 4 * face_index + 2 : interpolation source 2 (third of 4)
                src_trg_indices[f_4 + 3] = in2_index;   // 4 * face_index + 3 : interpolation target 2 (forth of 4)

                // Encode the face vertex numbers of this transformation:
                src_trg_numbers[f] = encoded_vertex_nums + out1_num<<4 + in2_num<<6;

                // Compute and store the (relative)amount by which the FIRST outside vertex
                // needs to be moved inwards towards the SECOND inside vertex:
                t = interpolations[f_2 + 1] = out1z / (out1z - in2z);
                one_minus_t = 1 - t;

                // Compute the index of the "unshared" position-value(s) of the 'clipped' vertex of this face:
                unshared_vertex_index = f_3 + out1_num + new_face_offset;
                // Note: Since this vertex belongs to an 'extra' new face, the index is offset to that index-space

                // Compute the new clip-space coordinates of the clipped-vertex:
                Xo[unshared_vertex_index] = t*X[out1_index] + one_minus_t*X[in2_index];
                Yo[unshared_vertex_index] = t*Y[out1_index] + one_minus_t*Y[in2_index];
                Zo[unshared_vertex_index] = 0;
                Wo[unshared_vertex_index] = near_clipping_plane_distance;

                // Flag this face as needing an extra face to represent itself after clipping:
                face_flags[f] |= INEXTRA;
            }

            clipped = true;
        }
    }

    return clipped ? CLIP : INSIDE;
};

export const SCR1 = 0b0000_0011;
export const TRG1 = 0b0000_1100;
export const SRC2 = 0b0011_0000;
export const TRG2 = 0b1100_0000;

export const clipSharedAttribute = <FaceVerticesArrayType extends Uint8Array|Uint16Array|Uint32Array = Uint32Array>(
    vertex_attribute: Float32Array[],
    src_trg_indices: FaceVerticesArrayType,
    src_trg_numbers: Uint8Array,
    interpolations: Float32Array,
    face_flags: Uint8Array,
    face_count: number,
    out: Float32Array[]
): void => {
    const new_face_offset = face_count + face_count + face_count;  // 3 * face_count + 0 : out vertex 1 of new faces;
    const num_components = out.length;

    let f_2, t1, one_minus_t1, out1, src1, trg1,
        f_4, t2, one_minus_t2, out2, src2, trg2,
        f_3, flags, c: number;

    for (let f = 0; f < face_count; f++) {
        flags = face_flags[f];
        if (flags & CLIP) {
            // Compute initial index offsets for buffers containing multiple values per-face:
            f_2 = f + f;      // 2 * face_index * 0 (first of 2)
            f_3 = f_2 + f;    // 3 * face_index * 0 (first of 3)
            f_4 = f_2 + f_2;  // 4 * face_index + 0 (first of 4)

            // Fetch vertex indices for both sources and targets:
            src1 = src_trg_indices[f_4    ]; // 4 * face_index + 0 : interpolation source 1 (first of 4)
            trg1 = src_trg_indices[f_4 + 1]; // 4 * face_index + 1 : interpolation target 1 (second of 4)
            src2 = src_trg_indices[f_4 + 2]; // 4 * face_index + 2 : interpolation source 2 (third of 4)
            trg2 = src_trg_indices[f_4 + 3]; // 4 * face_index + 3 : interpolation target 2 (forth of 4)

            out1 = f_3 + (src_trg_numbers[f] & SCR1);
            out2 = f_3 + (src_trg_numbers[f] & SRC2) >> 4;

            // For the second output vertex, if the clipping test had previously determined
            // that an extra face is needed, then the output index for that vertex need to shifter further.
            if (flags & INEXTRA) out2 += new_face_offset;

            // Extract interpolation values and compute their complements:
            t1 = interpolations[f_2    ];  one_minus_t1 = 1 - t1;
            t2 = interpolations[f_2 + 1];  one_minus_t2 = 1 - t2;

            for (c = 0; c < num_components; c++) {
                out[c][out1] = t1*vertex_attribute[c][src1] + one_minus_t1*vertex_attribute[c][trg1];
                out[c][out2] = t2*vertex_attribute[c][src2] + one_minus_t2*vertex_attribute[c][trg2];
            }
        }
    }
};

export const clipUnsharedAttribute = (
    vertex_attribute: Float32Array[],
    src_trg_numbers: Uint8Array,
    interpolations: Float32Array,
    face_flags: Uint8Array,
    face_count: number,
    out: Float32Array[]
): void => {
    const new_face_offset = face_count + face_count + face_count; // 3 * face_count + 0 : out vertex 1 of new faces;
    const num_components = out.length;

    let t1, one_minus_t1, out1, src1, trg1, f_2,
        t2, one_minus_t2, out2, src2, trg2, f_3,
        flags, src_trg_nums, c: number;

    for (let f = 0; f < face_count; f++) {
        flags = face_flags[f];
        if (flags & CLIP) {
            // Compute initial index offsets for buffers containing multiple values per-face:
            f_2 = f + f;      // 2 * face_index * 0 (first of 2)
            f_3 = f_2 + f;    // 3 * face_index + 0 (first of 3)

            // Decode the face vertex numbers of the transformations:
            src_trg_nums = src_trg_numbers[f];
            src1 = f_3 + (src_trg_nums & SCR1);
            trg1 = f_3 + (src_trg_nums & TRG1) >> 2;
            src2 = f_3 + (src_trg_nums & SRC2) >> 4;
            trg2 = f_3 + (src_trg_nums & TRG2) >> 6;

            out1 = f_3 + src1;
            out2 = f_3 + src2;

            // For the second output vertex, if the clipping test had previously determined
            // that an extra face is needed, then the output index for that vertex need to shifter further.
            if (flags & INEXTRA) out2 += new_face_offset;

            // Extract interpolation values and compute their complements:
            t1 = interpolations[f_2    ];  one_minus_t1 = 1 - t1;
            t2 = interpolations[f_2 + 1];  one_minus_t2 = 1 - t2;

            for (c = 0; c < num_components; c++) {
                out[c][out1] = t1*vertex_attribute[c][src1] + one_minus_t1*vertex_attribute[c][trg1];
                out[c][out2] = t2*vertex_attribute[c][src2] + one_minus_t2*vertex_attribute[c][trg2];
            }
        }
    }
};