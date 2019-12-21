import {Float4, T3} from "../../../types.js";
import {CLIP, INEXTRA, INSIDE, NEAR} from "../../../constants.js";


export const clipFaces = <FaceVerticesArrayType extends Uint8Array|Uint16Array|Uint32Array = Uint32Array>(
    [X, Y, Z, W]: Float4,
    [
        indices_v1,
        indices_v2,
        indices_v3
    ]: T3<FaceVerticesArrayType>,

    vertex_indices: FaceVerticesArrayType,
    vertex_numbers: Uint8Array,
    vertex_weights: Float32Array,
    vertex_flags: Uint8Array,

    face_flags: Uint8Array
): number => {
    // Break each face that needs to be clipped into smaller output triangle(s).
    let clipped = false;
    const face_count = indices_v1.length;

    let v1_index, v1_flags,
        v2_index, v2_flags,
        v3_index, v3_flags,

        in1, in1_num, in1z,
        in2, in2_num, in2z,
        out1, out1_num, out1z,
        out2, out2_num,

        w1, src1, trg1,
        w2, src2, trg2,

        encoded_vertex_nums: number;

    for (let f = 0; f < face_count; f++) {
        if (face_flags[f] & CLIP) {
            // Clipping is done only against the near clipping plane, so ther are only 2 possible cases:
            // 1: One vertex is inside the frustum and the other two are outside beyond the near clipping plane.
            // 2: Two vertices are inside the frustum and the third is outside beyond the near clipping plane.
            v1_index = indices_v1[f];
            v2_index = indices_v2[f];
            v3_index = indices_v3[f];
            v1_flags = vertex_flags[v1_index];
            v2_flags = vertex_flags[v2_index];
            v3_flags = vertex_flags[v3_index];

            // Figure out which case applies to this current face, and which vertices are in/out:
            in2 = -1;
            if (v1_flags & NEAR) {
                out1 = v1_index;
                out1_num = 1;
                if (v2_flags & NEAR) {
                    out2 = v2_index;
                    out2_num = 2;
                    in1 = v3_index;
                    in1_num = 3;
                } else {
                    in1 = v2_index;
                    in1_num = 2;
                    if (v3_flags & NEAR) {
                        out2 = v3_index;
                        out2_num = 3;
                    } else {
                        in2 = v3_index;
                        in2_num = 3;
                    }
                }
            } else {
                in1 = v1_index;
                in1_num = 1;
                if (v2_flags & NEAR) {
                    out1 = v2_index;
                    out1_num = 2;
                    if (v3_flags & NEAR) {
                        out2 = v3_index;
                        out2_num = 3;
                    } else {
                        in2 = v3_index;
                        in2_num = 3;
                    }
                } else {
                    in2 = v2_index;
                    in2_num = 2;
                    out1 = v3_index;
                    out1_num = 3;
                }
            }

            in1z = Z[in1];
            out1z = Z[out1];

            w1 = f + f;       // 2 * face_index + 0 : interpolation weight 1 (first of 2)
            w2 = w1 + 1;      // 2 * face_index + 1 : interpolation weight 2 (second of 2)
            src1 = w1 + w1;   // 4 * face_index + 0 : interpolation source 1 (first of 4)
            trg1 = src1 + 1;  // 4 * face_index + 1 : interpolation target 1 (second of 4)
            src2 = trg1 + 1;  // 4 * face_index + 2 : interpolation source 2 (third of 4)
            trg2 = src2 + 1;  // 4 * face_index + 3 : interpolation target 2 (forth of 4)


            // In both cases the first vertex that is outside just need to be moved to the near clipping plane:
            vertex_indices[src1] = out1;
            vertex_indices[trg1] = in1;

            // Encode the face vertex numbers of this transformation:
            encoded_vertex_nums = out1_num + in1_num<<2;

            // Compute and store the (relative)amount by which the FIRST outside
            // vertex needs to be moved inwards towards the FIRST inside vertex:
            vertex_weights[w1] = in1z / (in1z - out1z);

            if (in2 === -1) {
                // One vertex is inside the frustum, and the other two are oustide beyond the near clipping plane.
                // The triangle just needs to get smaller by moving the 2 outside-vertices back to the near clipping plane.
                vertex_indices[src2] = out2;
                vertex_indices[trg2] = in1;

                // Encode the face vertex numbers of this transformation:
                vertex_numbers[f] = encoded_vertex_nums + out2_num<<4 + in1_num<<6;

                // Compute and store the (relative)amount by which the SECOND outside
                // vertex needs to be moved inwards towards the FIRST inside vertex:
                vertex_weights[w2] = in1z / (in1z - Z[out2]);
            } else {
                // Two vertices are inside the frustum, and the third one is behind the near clipping plane.
                // Clipping forms a quad which needs to be split into 2 triangles.
                // The first one is formed from the original one, by moving the vertex that is behind the
                // clipping plane right up-to the near clipping plane itself (exactly as in the first case).
                // The second triangle is a new triangle that needs to be created, from the 2 vertices that
                // are inside, plus a new vertex that would need to be interpolated by moving the same vertex
                // that is outside up-to the near clipping plane but towards the other vertex that is inside.
                vertex_indices[src2] = out1;
                vertex_indices[trg2] = in2;

                // Encode the face vertex numbers of this transformation:
                vertex_numbers[f] = encoded_vertex_nums + out1_num<<4 + in2_num<<6;

                // Compute and store the (relative)amount by which the FIRST outside vertex
                // needs to be moved inwards towards the SECOND inside vertex:
                in2z = Z[in2];
                vertex_weights[w2] = in2z / (in2z - out1z);

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

const clipSharedAttribute = <FaceVerticesArrayType extends Uint8Array|Uint16Array|Uint32Array = Uint32Array>(
    vertex_attribute: Float32Array[],
    vertex_numbers: Uint8Array,
    vertex_weights: Float32Array,
    vertex_indices: FaceVerticesArrayType,

    faces: Float32Array[],
    face_flags: Uint8Array
): void => {
    const face_count = face_flags.length;
    const new_face_offset = face_count + face_count + face_count;  // 3 * face_count + 0 : out vertex 1 of new faces;
    const num_components = faces.length;

    let t1, one_minus_t1, out1, src1, trg1, f_2,
        t2, one_minus_t2, out2, src2, trg2, f_4,
        flags, c: number;

    for (let f = 0; f < face_count; f++) {
        flags = face_flags[f];
        if (flags & CLIP) {
            // Compute initial index offsets for buffers containing multiple values per-face:
            f_2 = f + f;      // 2 * face_index * 0 (first of 2)
            f_4 = f_2 + f_2;  // 4 * face_index + 0 (first of 4)

            // Fetch vertex indices for both sources and targets:
            src1 = vertex_indices[f_4    ]; // 4 * face_index + 0 : interpolation source 1 (first of 4)
            trg1 = vertex_indices[f_4 + 1]; // 4 * face_index + 1 : interpolation target 1 (second of 4)
            src2 = vertex_indices[f_4 + 2]; // 4 * face_index + 2 : interpolation source 2 (third of 4)
            trg2 = vertex_indices[f_4 + 3]; // 4 * face_index + 3 : interpolation target 2 (forth of 4)

            out1 = f_2 + (vertex_numbers[f] & SCR1);
            out2 = f_2 + (vertex_numbers[f] & SRC2) >> 4;

            // For the second output vertex, if the clipping test had previously determined
            // that an extra face is needed, then the output index for that vertex need to shifter further.
            if (flags & INEXTRA) out2 += new_face_offset;

            // Extract interpolation values and compute their complements:
            t1 = vertex_weights[f_2    ];  one_minus_t1 = 1 - t1;
            t2 = vertex_weights[f_2 + 1];  one_minus_t2 = 1 - t2;

            for (c = 0; c < num_components; c++) {
                faces[c][out1] = t1*vertex_attribute[c][src1] + one_minus_t1*vertex_attribute[c][trg1];
                faces[c][out2] = t2*vertex_attribute[c][src2] + one_minus_t2*vertex_attribute[c][trg2];
            }
        }
    }
};

const clipUnsharedAttribute = (
    vertex_attribute: Float32Array[],
    vertex_numbers: Uint8Array,
    vertex_weights: Float32Array,

    faces: Float32Array[],
    face_flags: Uint8Array,
): void => {
    const face_count = face_flags.length;
    const new_face_offset = face_count + face_count + face_count; // 3 * face_count + 0 : out vertex 1 of new faces;
    const num_components = faces.length;

    let t1, one_minus_t1, out1, src1, trg1, f_2,
        t2, one_minus_t2, out2, src2, trg2, f_4,
        flags, vn, c: number;

    for (let f = 0; f < face_count; f++) {
        flags = face_flags[f];
        if (flags & CLIP) {
            // Compute initial index offsets for buffers containing multiple values per-face:
            f_2 = f + f;      // 2 * face_index * 0 (first of 2)
            f_4 = f_2 + f_2;  // 4 * face_index + 0 (first of 4)

            // Decode the face vertex numbers of the transformations:
            vn = vertex_numbers[f];
            src1 = f_4 + (vn & SCR1);
            trg1 = f_4 + (vn & TRG1) >> 2;
            src2 = f_4 + (vn & SRC2) >> 4;
            trg2 = f_4 + (vn & TRG2) >> 6;

            out1 = f_4 + src1;
            out2 = f_4 + src2;

            // For the second output vertex, if the clipping test had previously determined
            // that an extra face is needed, then the output index for that vertex need to shifter further.
            if (flags & INEXTRA) out2 += new_face_offset;

            // Extract interpolation values and compute their complements:
            t1 = vertex_weights[f_2    ];  one_minus_t1 = 1 - t1;
            t2 = vertex_weights[f_2 + 1];  one_minus_t2 = 1 - t2;

            for (c = 0; c < num_components; c++) {
                faces[c][out1] = t1*vertex_attribute[c][src1] + one_minus_t1*vertex_attribute[c][trg1];
                faces[c][out2] = t2*vertex_attribute[c][src2] + one_minus_t2*vertex_attribute[c][trg2];
            }
        }
    }
};