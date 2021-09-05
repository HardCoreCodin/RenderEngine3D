import {CLIP, INEXTRA, INSIDE, NEAR} from "../../../../../constants.js";

export const clipFaces = <FaceVerticesArrayType extends Uint8Array|Uint16Array|Uint32Array = Uint32Array>(
    vertices: Float32Array[], // float4[]
    face_vertex_indices: FaceVerticesArrayType[], // uint3[]

    src_trg_indices: FaceVerticesArrayType[], //unit4[]
    src_trg_numbers: Uint8Array,
    interpolation_t_values: Float32Array[], //float2[]

    vertex_flags: Uint8Array,
    face_flags: Uint8Array,

    near_clipping_plane_distance: number,

    clipped_faces_vertex_positions: Float32Array[]
): number => {
    // Break each face that needs to be clipped into smaller output triangle(s).
    let new_face_offset = face_vertex_indices.length * 3;
    let src_trg_ids: FaceVerticesArrayType;
    let clipped, in1, in2, out1, out2, t_values: Float32Array;
    let v1_index, v1_flags,
        v2_index, v2_flags,
        v3_index, v3_flags,

        in1_index, in1_num, in1z,
        in2_index, in2_num, in2z,
        out1_index, out1_num, out1z,
        out2_index, out2_num, out2z,

        t, one_minus_t, clipped_face_v1_index,
        encoded_vertex_nums: number;

    const face_count = face_vertex_indices.length;
    let faces_added = clipped_face_v1_index = 0;
    let f = 0;
    for (const current_face_vertex_indices of face_vertex_indices) {
        v1_index = current_face_vertex_indices[0];
        v2_index = current_face_vertex_indices[1];
        v3_index = current_face_vertex_indices[2];
        clipped_faces_vertex_positions[clipped_face_v1_index+0].set(vertices[v1_index]);
        clipped_faces_vertex_positions[clipped_face_v1_index+1].set(vertices[v2_index]);
        clipped_faces_vertex_positions[clipped_face_v1_index+2].set(vertices[v3_index]);

        if (face_flags[f] & CLIP) {
            // Clipping is done only against the near clipping plane, so there are only 2 possible cases:
            // 1: One vertex is inside the frustum and the other two are outside beyond the near clipping plane.
            // 2: Two vertices are inside the frustum and the third is outside beyond the near clipping plane.
            v1_flags = vertex_flags[v1_index];
            v2_flags = vertex_flags[v2_index];
            v3_flags = vertex_flags[v3_index];

            t_values = interpolation_t_values[f];
            src_trg_ids = src_trg_indices[f];

            // Figure out which case applies to this current face, and which vertices are in/out:
            in2_num   = out2_num = 0;
            in2_index = out2_index = -1;
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
            in1  = vertices[in1_index];  in1z  = in1[2];
            out1 = vertices[out1_index]; out1z = out1[2];

            // In both cases the first vertex that is outside just need to be moved to the near clipping plane:
            src_trg_ids[0] = out1_index;  // interpolation source 1 (first of 4)
            src_trg_ids[1] = in1_index;   // interpolation target 1 (second of 4)

            // Encode the face vertex numbers of this transformation:
            encoded_vertex_nums = out1_num + in1_num<<2;

            // Compute and store the (relative)amount by which the FIRST outside
            // vertex would need to be moved 'inwards' towards the FIRST inside vertex:
            t = t_values[0] = out1z / (out1z - in1z);
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
            clipped = clipped_faces_vertex_positions[clipped_face_v1_index + (out1_num - 1)];

            // Compute the new clip-space coordinates of the clipped-vertex:
            clipped[0] = one_minus_t*out1[0] + t*in1[0];
            clipped[1] = one_minus_t*out1[1] + t*in1[1];
            clipped[2] = 0;
            clipped[3] = near_clipping_plane_distance;
            // Note:
            // The 'Z' coordinate of this new vertex position in clip-space is set to '0' since it has
            // now been moved onto the clipping plane itself. Similarly, the 'W' coordinate is set to
            // what the "original" Z-depth value this vertex "would have had", had it been on the
            // near clipping plane in view-space in the first place.
            // *The same logic applies for the second interpolation in either of it's 2 cases below.

            if (out2_num) {
                // One vertex is inside the frustum, and the other two are outside beyond the near clipping plane.
                // The triangle just needs to get smaller by moving the 2 outside-vertices back to the near clipping plane.
                src_trg_ids[2] = out2_index;  // interpolation source 2 (third of 4)
                src_trg_ids[3] = in1_index;   // interpolation target 2 (forth of 4)

                // Encode the face vertex numbers of this transformation:
                src_trg_numbers[f] = encoded_vertex_nums + out2_num<<4 + in1_num<<6;

                // Compute and store the (relative)amount by which the SECOND outside
                // vertex needs to be moved inwards towards the FIRST inside vertex:
                out2 = vertices[out2_index];
                out2z = out2[2];
                t = t_values[1] = out2z / (out2z - in1z);
                one_minus_t = 1 - t;

                // Compute the index of the "unshared" position-value(s) of the 'clipped' vertex of this face:
                clipped = clipped_faces_vertex_positions[clipped_face_v1_index + (out2_num - 1)];

                // Compute the new clip-space coordinates of the clipped-vertex:
                clipped[0] = one_minus_t*out2[0] + t*in1[0];
                clipped[1] = one_minus_t*out2[1] + t*in1[1];
                clipped[2] = 0;
                clipped[3] = near_clipping_plane_distance;
            } else {
                // Two vertices are inside the frustum, and the third one is behind the near clipping plane.
                // Clipping forms a quad which needs to be split into 2 triangles.
                // The first one is formed from the original one, by moving the vertex that is behind the
                // clipping plane right up-to the near clipping plane itself (exactly as in the first case).
                // The second triangle is a new triangle that needs to be created, from the 2 vertices that
                // are inside, plus a new vertex that would need to be interpolated by moving the same vertex
                // that is outside up-to the near clipping plane but towards the other vertex that is inside.
                src_trg_ids[2] = out1_index;  // interpolation source 2 (third of 4)
                src_trg_ids[3] = in2_index;   // interpolation target 2 (forth of 4)

                // Encode the face vertex numbers of this transformation:
                src_trg_numbers[f] = encoded_vertex_nums + out1_num<<4 + in2_num<<6;

                // Compute and store the (relative)amount by which the FIRST outside vertex
                // needs to be moved inwards towards the SECOND inside vertex:
                in2 = vertices[in2_index];
                in2z = in2[2];
                t = t_values[1] = out1z / (out1z - in2z);
                one_minus_t = 1 - t;

                // Since this vertex belongs to an 'extra' new face, the index is offset to that index-space
                clipped_faces_vertex_positions[new_face_offset].set(vertices[in2_index]);
                clipped_faces_vertex_positions[new_face_offset+1].set(clipped);
                clipped = clipped_faces_vertex_positions[new_face_offset+2];

                // Compute the new clip-space coordinates of the clipped-vertex:
                clipped[0] = one_minus_t*out1[0] + t*in2[0];
                clipped[1] = one_minus_t*out1[1] + t*in2[1];
                clipped[2] = 0;
                clipped[3] = near_clipping_plane_distance;

                // Flag this face as needing an extra face to represent itself after clipping:
                face_flags[f] |= INEXTRA;
                face_flags[face_count + faces_added] = INSIDE;
                faces_added++;
                new_face_offset += 3;
            }
        }

        f++;
        clipped_face_v1_index += 3;
    }

    return faces_added;
};

export const SRC1 = 0b0000_0011;
export const TRG1 = 0b0000_1100;
export const SRC2 = 0b0011_0000;
export const TRG2 = 0b1100_0000;

export const clipSharedAttribute = <FaceVerticesArrayType extends Uint8Array|Uint16Array|Uint32Array = Uint32Array>(
    vertex_attribute: Float32Array[],
    src_trg_indices: FaceVerticesArrayType[], //unit4[]
    src_trg_numbers: Uint8Array,
    interpolation_t_values: Float32Array[], //float2[]
    face_flags: Uint8Array,
    clipped_faces_vertex_attributes: Float32Array[]
): void => {
    let new_face_offset = face_flags.length * 3;
    const num_components = clipped_faces_vertex_attributes[0].length;

    let clipped_1, src1, trg1,
        clipped_2, src2, trg2, t_values: Float32Array;
    let src_trg_ids: FaceVerticesArrayType;
    let t1, one_minus_t1, clipped_v1_index, src1_num,
        t2, one_minus_t2, clipped_v2_index, src2_num,
        c, clipped_face_v1_index: number;

    let f = clipped_face_v1_index = 0;
    for (const flags of face_flags) {
        if (flags & CLIP) {
            // Extract interpolation values and compute their complements:
            t_values = interpolation_t_values[f];
            t1 = t_values[0];  one_minus_t1 = 1 - t1;
            t2 = t_values[1];  one_minus_t2 = 1 - t2;

            // Fetch vertex indices for both sources and targets:
            src_trg_ids = src_trg_indices[f];
            src1 = vertex_attribute[src_trg_ids[0]]; // The source vertex in the first interpolation
            trg1 = vertex_attribute[src_trg_ids[1]]; // The target vertex in the first interpolation
            src2 = vertex_attribute[src_trg_ids[2]]; // The source vertex in the second interpolation
            trg2 = vertex_attribute[src_trg_ids[3]]; // The target vertex in the second interpolation

            src1_num = (src_trg_numbers[f] & SRC1)     ; src1_num--;
            src2_num = (src_trg_numbers[f] & SRC2) >> 4; src2_num--;

            // For the second output vertex, if the clipping test had previously determined
            // that an extra face is needed, then the output index for that vertex need to shifter further.
            clipped_v1_index = src1_num + clipped_face_v1_index;
            clipped_v2_index = src2_num + ((flags & INEXTRA) ? new_face_offset : clipped_face_v1_index);
            clipped_1 = clipped_faces_vertex_attributes[clipped_v1_index];
            clipped_2 = clipped_faces_vertex_attributes[clipped_v2_index];

            for (c = 0; c < num_components; c++) {
                clipped_1[c] = t1*src1[c] + one_minus_t1*trg1[c];
                clipped_2[c] = t2*src2[c] + one_minus_t2*trg2[c];
            }
        }

        f++;
        clipped_face_v1_index += 3;
    }
};

export const clipUnsharedAttribute = <FaceVerticesArrayType extends Uint8Array|Uint16Array|Uint32Array = Uint32Array>(
    vertex_attribute: Float32Array[],
    src_trg_numbers: Uint8Array,
    interpolation_t_values: Float32Array[], //float2[]
    face_flags: Uint8Array,
    clipped_faces_vertex_attributes: Float32Array[]
): void => {
    let new_face_offset = face_flags.length * 3;
    const num_components = clipped_faces_vertex_attributes[0].length;

    let clipped_1, src1, trg1,
        clipped_2, src2, trg2, t_values: Float32Array;
    let t1, one_minus_t1, clipped_v1_index, src1_num, trg1_num,
        t2, one_minus_t2, clipped_v2_index, src2_num, trg2_num,
        c, clipped_face_v1_index, src_trg_nums: number;

    let f = clipped_face_v1_index = 0;
    for (const flags of face_flags) {
        if (flags & CLIP) {
            // Extract interpolation values and compute their complements:
            t_values = interpolation_t_values[f];
            t1 = t_values[0];  one_minus_t1 = 1 - t1;
            t2 = t_values[1];  one_minus_t2 = 1 - t2;

            // Decode the face vertex numbers of the transformations:
            src_trg_nums = src_trg_numbers[f];
            src1_num = (src_trg_nums & SRC1     ); src1_num--;
            trg1_num = (src_trg_nums & TRG1) >> 2; trg1_num--;
            src2_num = (src_trg_nums & SRC2) >> 4; src2_num--;
            trg2_num = (src_trg_nums & TRG2) >> 6; trg2_num--;

            src1 = vertex_attribute[src1_num + clipped_face_v1_index]; // The source vertex in the first interpolation
            trg1 = vertex_attribute[trg1_num + clipped_face_v1_index]; // The target vertex in the first interpolation
            src2 = vertex_attribute[src2_num + clipped_face_v1_index]; // The source vertex in the second interpolation
            trg2 = vertex_attribute[trg2_num + clipped_face_v1_index]; // The target vertex in the second interpolation

            // For the second output vertex, if the clipping test had previously determined
            // that an extra face is needed, then the output index for that vertex need to shifter further.
            clipped_v1_index = src1_num + clipped_face_v1_index;
            clipped_v2_index = src2_num + ((flags & INEXTRA) ? new_face_offset : clipped_face_v1_index);
            clipped_1 = clipped_faces_vertex_attributes[clipped_v1_index];
            clipped_2 = clipped_faces_vertex_attributes[clipped_v2_index];

            for (c = 0; c < num_components; c++) {
                clipped_1[c] = t1*src1[c] + one_minus_t1*trg1[c];
                clipped_2[c] = t2*src2[c] + one_minus_t2*trg2[c];
            }
        }

        f++;
        clipped_face_v1_index += 3;
    }
};