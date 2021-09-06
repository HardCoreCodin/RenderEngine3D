import {CLIP, INEXTRA, INSIDE, NEAR} from "../../../../../constants.js";

export type IAttributeBuffers = [Float32Array[], Uint32Array[], Float32Array[], boolean];

export const clipFaces = <FaceVerticesArrayType extends Uint8Array|Uint16Array|Uint32Array = Uint32Array>(
    vertices: Float32Array[], // float4[]
    face_vertex_indices: FaceVerticesArrayType[], // uint3[]
    vertex_flags: Uint8Array,
    face_flags: Uint8Array,
    near_clipping_plane_distance: number,
    clipped_faces_vertex_positions: Float32Array[],
    attributes?: IAttributeBuffers[]
): number => {
    // Break each face that needs to be clipped into smaller output triangle(s).
    let new_face_offset = face_vertex_indices.length * 3;
    let clipped, in1, in2, out1, out2, attr_in, attr_out, attr_clipped: Float32Array;
    let v1_index, v1_flags,
        v2_index, v2_flags,
        v3_index, v3_flags,

        in1_index, in1_num, in1z,
        in2_index, in2_num, in2z,
        out1_index, out1_num, out1z,
        out2_index, out2_num, out2z,

        first_new_vertex_x,
        first_new_vertex_y,
        second_new_vertex_x,
        second_new_vertex_y,

        t, one_minus_t, clipped_face_v1_index, clipped_index, component_count, one_over_length, new_vertex_index, old_vertex_index: number;

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

        if (attributes) {
            for (const [attrs, attr_indices, clipped_attrs] of attributes) {
                clipped_attrs[clipped_face_v1_index+0].set(attrs[attr_indices[f][0]]);
                clipped_attrs[clipped_face_v1_index+1].set(attrs[attr_indices[f][1]]);
                clipped_attrs[clipped_face_v1_index+2].set(attrs[attr_indices[f][2]]);
            }
        }

        if (face_flags[f] & CLIP) {
            // Clipping is done only against the near clipping plane, so there are only 2 possible cases:
            // 1: One vertex is inside the frustum and the other two are outside beyond the near clipping plane.
            // 2: Two vertices are inside the frustum and the third is outside beyond the near clipping plane.
            v1_flags = vertex_flags[v1_index];
            v2_flags = vertex_flags[v2_index];
            v3_flags = vertex_flags[v3_index];

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

            // Compute and store the (relative)amount by which the FIRST outside
            // vertex would need to be moved 'inwards' towards the FIRST inside vertex:
            t = out1z / (out1z - in1z);
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
            clipped_index = clipped_face_v1_index + out1_num - 1;
            clipped = clipped_faces_vertex_positions[clipped_index];

            // Compute the new clip-space coordinates of the clipped-vertex:
            clipped[0] = first_new_vertex_x = one_minus_t*out1[0] + t*in1[0];
            clipped[1] = first_new_vertex_y = one_minus_t*out1[1] + t*in1[1];
            clipped[2] = 0;
            clipped[3] = near_clipping_plane_distance;
            // Note:
            // The 'Z' coordinate of this new vertex position in clip-space is set to '0' since it has
            // now been moved onto the clipping plane itself. Similarly, the 'W' coordinate is set to
            // what the "original" Z-depth value this vertex "would have had", had it been on the
            // near clipping plane in view-space in the first place.
            // *The same logic applies for the second interpolation in either of it's 2 cases below.

            if (attributes) {
                for (const [attrs, attr_indices, clipped_attrs, normalize] of attributes) {
                    attr_in = attrs[attr_indices[f][in1_num - 1]];
                    attr_out =attrs[attr_indices[f][out1_num - 1]];
                    attr_clipped = clipped_attrs[clipped_index];
                    component_count = attrs[0].length;
                    for (let component = 0; component < component_count; component++)
                        attr_clipped[component] = one_minus_t*attr_out[component] + t*attr_in[component];
                    if (normalize) {
                        one_over_length = 1.0 / Math.sqrt(attr_clipped[0] * attr_clipped[0] + attr_clipped[1] * attr_clipped[1] + attr_clipped[2] * attr_clipped[2]);
                        attr_clipped[0] *= one_over_length;
                        attr_clipped[1] *= one_over_length;
                        attr_clipped[2] *= one_over_length;
                    }
                }
            }

            if (out2_num) {
                // One vertex is inside the frustum, and the other two are outside beyond the near clipping plane.
                // The triangle just needs to get smaller by moving the 2 outside-vertices back to the near clipping plane.

                // Compute and store the (relative)amount by which the SECOND outside
                // vertex needs to be moved inwards towards the FIRST inside vertex:
                out2 = vertices[out2_index];
                out2z = out2[2];
                t = out2z / (out2z - in1z);
                one_minus_t = 1 - t;

                // Compute the index of the "unshared" position-value(s) of the 'clipped' vertex of this face:
                clipped_index = clipped_face_v1_index + out2_num - 1;
                clipped = clipped_faces_vertex_positions[clipped_index];

                // Compute the new clip-space coordinates of the clipped-vertex:
                clipped[0] = one_minus_t*out2[0] + t*in1[0];
                clipped[1] = one_minus_t*out2[1] + t*in1[1];
                clipped[2] = 0;
                clipped[3] = near_clipping_plane_distance;

                if (attributes) {
                    for (const [attrs, attr_indices, clipped_attrs, normalize] of attributes) {
                        attr_in = attrs[attr_indices[f][in1_num - 1]];
                        attr_out =attrs[attr_indices[f][out2_num - 1]];
                        attr_clipped = clipped_attrs[clipped_index];
                        component_count = attrs[0].length;
                        for (let component = 0; component < component_count; component++)
                            attr_clipped[component] = one_minus_t*attr_out[component] + t*attr_in[component];
                        if (normalize) {
                            one_over_length = 1.0 / Math.sqrt(attr_clipped[0] * attr_clipped[0] + attr_clipped[1] * attr_clipped[1] + attr_clipped[2] * attr_clipped[2]);
                            attr_clipped[0] *= one_over_length;
                            attr_clipped[1] *= one_over_length;
                            attr_clipped[2] *= one_over_length;
                        }
                    }
                }
            } else {
                // Two vertices are inside the frustum, and the third one is behind the near clipping plane.
                // Clipping forms a quad which needs to be split into 2 triangles.
                // The first one is formed from the original one, by moving the vertex that is behind the
                // clipping plane right up-to the near clipping plane itself (exactly as in the first case).
                // The second triangle is a new triangle that needs to be created, from the 2 vertices that
                // are inside, plus a new vertex that would need to be interpolated by moving the same vertex
                // that is outside up-to the near clipping plane but towards the other vertex that is inside.

                // Compute and store the (relative)amount by which the FIRST outside vertex
                // needs to be moved inwards towards the SECOND inside vertex:
                in2 = vertices[in2_index];
                in2z = in2[2];
                t = out1z / (out1z - in2z);
                one_minus_t = 1 - t;

                second_new_vertex_x = one_minus_t*out1[0] + t*in2[0];
                second_new_vertex_y = one_minus_t*out1[1] + t*in2[1];

                // Determine orientation:
                if ((in2[0] - first_new_vertex_x)*(second_new_vertex_y - first_new_vertex_y) >
                    (in2[1] - first_new_vertex_y)*(second_new_vertex_x - first_new_vertex_x)) {
                    old_vertex_index = 1;
                    new_vertex_index = 2;
                } else {
                    old_vertex_index = 2;
                    new_vertex_index = 1;
                }

                // Since this vertex belongs to an 'extra' new face, the index is offset to that index-space
                clipped_index = new_face_offset + new_vertex_index;
                clipped_faces_vertex_positions[new_face_offset].set(clipped);
                clipped = clipped_faces_vertex_positions[clipped_index];
                clipped_faces_vertex_positions[new_face_offset + old_vertex_index].set(in2);

                // Compute the new clip-space coordinates of the clipped-vertex:
                clipped[0] = second_new_vertex_x;
                clipped[1] = second_new_vertex_y;
                clipped[2] = 0;
                clipped[3] = near_clipping_plane_distance;

                if (attributes) {
                    for (const [attrs, attr_indices, clipped_attrs, normalize] of attributes) {
                        attr_in = attrs[attr_indices[f][in2_num - 1]];
                        attr_out =attrs[attr_indices[f][out1_num - 1]];
                        attr_clipped = clipped_attrs[clipped_index];
                        component_count = attrs[0].length;
                        for (let component = 0; component < component_count; component++)
                            attr_clipped[component] = one_minus_t*attr_out[component] + t*attr_in[component];
                        if (normalize) {
                            one_over_length = 1.0 / Math.sqrt(attr_clipped[0] * attr_clipped[0] + attr_clipped[1] * attr_clipped[1] + attr_clipped[2] * attr_clipped[2]);
                            attr_clipped[0] *= one_over_length;
                            attr_clipped[1] *= one_over_length;
                            attr_clipped[2] *= one_over_length;
                        }

                        clipped_attrs[new_face_offset].set(clipped_attrs[clipped_face_v1_index + out1_num - 1]);
                        clipped_attrs[new_face_offset + old_vertex_index].set(attr_in);
                    }
                }

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