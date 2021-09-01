import {Float2, Float3, Float4} from "../../../../../types.js";
import {CULL, INSIDE, NDC} from "../../../../../constants.js";

let i, flags, one_over_ws, one_over_w: number;

export const perspectiveDivideAllVertexPositions = (
    arrays: Float32Array[]
): void => {
    for (const array of arrays) {
        // Store reciprocals for use in rasterization:
        array[3] = one_over_w = 1.0 / array[3];
        array[0] *= one_over_w;
        array[1] *= one_over_w;
        array[2] *= one_over_w;
    }
};

export const perspectiveDivideVertexPositions = (
    arrays: Float32Array[],
    vertex_flags: Uint8Array
): void => {
    let one_over_w: number;
    let i = 0;
    for (const array of arrays) if (vertex_flags[i++] & NDC) {
        // Store reciprocals for use in rasterization:
        array[3] = one_over_w = 1.0 / array[3];
        array[0] *= one_over_w;
        array[1] *= one_over_w;
        array[2] *= one_over_w;

        // The perspective divide should finalize normalizing the depth values
        // into the 0 -> 1 space, by dividing clip-space 'z' by clip-space 'w'
        // (coordinates that came out of the multiplication by the projection matrix)
        // screen_z = clip_z / clip_w = Z[i] / W[i]
        // However: The rasterizer is going to then need to convert this value
        // into a spectum of values that are all divided by 'clip_w'
        // in order to linearly interpolate it there (from vertex values to a pixel value).
        // So in practice it is going to need:
        // linearly_interpolatable_z = screen_z / clip_w
        //                           = (clip_z / clip_w) / clip_w
        //                           = clip_z * clip_w^-1 * clip_w^-1
        //                           = clip_z * clip_w^-2
        //                           = clip_z * clip_w^-2
        // Z[i] = (Z[i] / W[i]) / W[i];
        // W[i] = one_over_ws;
    }
};

const perspectiveCorrectVertexAttribute = (
    vectors: Float32Array[],
    outs: Float32Array[],
    ONE_OVER_WS: Float32Array,
    vertex_flags: Uint8Array,
): void => {
    let j, i = 0;
    for (const out of outs) if (vertex_flags[i] & NDC) {
        one_over_ws = ONE_OVER_WS[i];
        j = 0;
        for (const component of vectors[i])
            out[j++] = component * one_over_ws;
    }
};

const max = Math.max;
const min = Math.min;
// const sorted_triangle_vertex_indicies = new Uint32Array(4);
// const sorted_triangle_vertex_x_coords = new Float32Array(4);
// const sorted_triangle_vertex_y_coords = new Float32Array(4);

const scanFaces = (
    [X, Y, Z, W]: Float4,
    face_flags: Uint8Array,

    pixel_depths: Float32Array,
    pixel_face_ids: Uint32Array,
    pixel_object_ids: Uint32Array,
    pixel_one_over_ws: Float32Array,
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

    let v1_index, v1_flags,
        v2_index, v2_flags,
        v3_index, v3_flags,

        ws, BAz, BCz,

        BAy, ACy,
        ABx, CAx,
        ABPk, CAPk,
        ABC,
        one_over_ABC,

        v1_one_over_w,
        v2_one_over_w,
        v3_one_over_w,

        dx1, dy1, s1,
        dx2, dy2, s2,
        dx3, dy3, s3,

        min_x, max_x, x,
        min_y, max_y, y,

        tx, mx, bx,
        ty, my, by,

        b2,
        b1, b1_k, b1_dx, b1_dy,
        b3, b3_k, b3_dx, b3_dy,

        Ax, Bx, Cx,
        Ay, By, Cy,
        Az, Bz, Cz,

        pixel_depth,
        z1, z2, z3, z_behind_pixel,

        pixel_index: number;

    let exclude_edge_1,
        exclude_edge_2,
        exclude_edge_3,
        has_visible_pixels,
        has_visible_faces: boolean;
    has_visible_faces = false;

    for (let f = 0; f < face_flags.length; f++) {
        flags = face_flags[f];
        if (flags) {
            v1_index = f + f + f;
            v2_index = v1_index + 1;
            v3_index = v1_index + 2;

            Ax = X[v1_index];
            Bx = X[v2_index];
            Cx = X[v3_index];

            // Cull face against the right edge of the viewport:
            min_x = min(Ax, Bx, Cx);
            if (min_x >= screen_width)
                continue;

            // Cull face against the left edge of the viewport:
            max_x = max(Ax, Bx, Cx);
            if (max_x < 0)
                continue;

            Ay = Y[v1_index];
            By = Y[v2_index];
            Cy = Y[v3_index];

            // Cull face against the bottom edge of the viewport:
            min_y = min(Ay, By, Cy);
            if (min_y >= screen_height)
                continue;

            // Cull face against the top edge of the viewport:
            max_y = max(Ay, By, Cy);
            if (max_y < 0)
                continue;

            // Clip the bounds of the triangle to the viewport:
            min_x = max(min_x, 0);
            min_y = max(min_y, 0);
            max_x = min(max_x, screen_width - 1);
            max_y = min(max_y, screen_height - 1);

            // Compute area components:
            BAy = Ay - By;
            ABx = Bx - Ax;

            ACy = Cy - Ay;
            CAx = Ax - Cx;

            ABC = ABx*ACy - BAy*CAx;

            // Cull faces facing backwards:
            if (ABC <= 0)
                continue;

            // Compute edge exclusions:
            // Origin: Top-left
            // Rules: Top/Left
            // Winding: CCW
            exclude_edge_1 = BAy > 0 || ABx > 0;
            exclude_edge_2 = By > Cy || Cx > Bx;
            exclude_edge_3 = ACy > 0 || CAx > 0;

            ABPk = Ax*By - Ay*Bx;
            CAPk = Cx*Ay - Cy*Ax;

            // Compute weight constants:
            one_over_ABC = 1.0 / ABC;

            b1_dx = BAy * one_over_ABC;
            b1_dy = ABx * one_over_ABC;
            b1_k = ABPk * one_over_ABC;

            b3_dx = ACy * one_over_ABC;
            b3_dy = CAx * one_over_ABC;
            b3_k = CAPk * one_over_ABC;

            // Fetch 'ws reciprocals' for perspective corrected interpolation:
            v1_one_over_w = W[v1_index];
            v2_one_over_w = W[v2_index];
            v3_one_over_w = W[v3_index];

            // Pre-compute barycentric weight constants for depth and one-over-ws:
            z1 = Z[v1_index];
            z2 = Z[v2_index];
            z3 = Z[v3_index];

            // Floor bounds coordinates down to their integral component:
            min_x <<= 0;
            min_y <<= 0;
            max_x <<= 0;
            max_y <<= 0;

            // Set first pixel index (now that min_x/min_y are integers):
            pixel_index = screen_width * min_y + min_x;

            // Offset bounds coordinate to their pixel centers:
            min_x += 0.5;
            min_y += 0.5;
            max_x += 0.5;
            max_y += 0.5;

            // Compute initial areal coordinates for the first pixel center:
            b1 = b1_dx*min_x + b1_dy*min_y + b1_k;
            b3 = b3_dx*min_x + b3_dy*min_y + b3_k;
            b2 = 1 - b1 - b3;

            has_visible_pixels = false;

            // Scan the bounds:
            for (y = min_y; y <= max_y; y++) {
                for (x = min_x; x <= max_x; x++) {
                    // If the pixel is outside of the triangle, skip it:
                    if (b1 < 0 || (b1 === 0 && exclude_edge_1) ||
                        b2 < 0 || (b2 === 0 && exclude_edge_2) ||
                        b3 < 0 || (b3 === 0 && exclude_edge_3)
                    ) {
                        b1 += b1_dx;
                        b3 += b3_dx;
                        b2 = 1 - b1 - b3;
                        pixel_index++;

                        continue;
                    }

                    // Cull and text pixel based on it's depth:
                    pixel_depth = z1*b1 + z2*b2 + z3*b3;
                    if (pixel_depth < 0 ||
                        pixel_depth > 1 ||
                        pixel_depth > pixel_depths[pixel_index])
                        continue;

                    pixel_depths[pixel_index] = pixel_depth;

                    // Compute and store 'z_behind_pixel' for (re)used in interpolation:
                    pixel_one_over_ws[pixel_index] = z_behind_pixel = 1 / (
                        // Linearly interpolated 1/w using the barycentric coordinates
                        b1 * v1_one_over_w +
                        b2 * v2_one_over_w +
                        b3 * v3_one_over_w
                    );
                    // Compute and store perspective correct barycentric coordinates:
                    pixel_v1_weights[pixel_index] = b1 * z_behind_pixel;
                    pixel_v2_weights[pixel_index] = b2 * z_behind_pixel;
                    pixel_v3_weights[pixel_index] = b3 * z_behind_pixel;

                    // Store pixel metadata:
                    pixel_face_ids[pixel_index] = f;
                    pixel_object_ids[pixel_index] = object_id;
                    pixel_material_ids[pixel_index] = material_id;

                    has_visible_pixels = true;

                    b1 += b1_dx;
                    b3 += b3_dx;
                    b2 = 1 - b1 - b3;
                    pixel_index++;
                }

                b1 += b1_dy;
                b3 += b3_dy;
                pixel_index += screen_width;
            }

            if (has_visible_pixels)
                has_visible_faces = true;
        }
    }

    return has_visible_faces ? INSIDE : CULL;
};