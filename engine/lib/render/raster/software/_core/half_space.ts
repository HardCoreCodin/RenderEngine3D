import {CULL, INSIDE, NDC} from "../../../../../constants.js";
import {IPixelShader, IPixelShaderInputs} from "../materials/shaders/pixel.js";
import {I2D} from "../../../../_interfaces/vectors.js";
import {ISize} from "../../../../_interfaces/render.js";
import {Color4D} from "../../../../accessors/color.js";
import {drawPixel} from "../../../../../utils.js";

const projectVertex = (vertex: Float32Array, half_width: number, half_height: number) => {
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

    // Store reciprocals for use in rasterization:
    const one_over_w = 1.0 / vertex[3];
    vertex[3] = one_over_w;
    vertex[0] *= one_over_w;
    vertex[1] *= one_over_w;
    vertex[2] *= one_over_w;

    // Scale the normalized screen to the pixel size:
    // (from normalized size of -1->1 horizontally and vertically having a width and height of 2)

    vertex[0] *= half_width;
    vertex[1] *= -half_height;
    // Note: HTML5 Canvas element has a coordinate system that goes top-to-bottom vertically.

    // Move the screen up and to the right appropriately,
    // such that it goes 0->width horizontally and 0->height vertically:
    vertex[0] += half_width;
    vertex[1] += half_height;
};

export const projectAllVertexPositions = (
    arrays: Float32Array[],
    vertex_count: number,
    half_width: number,
    half_height: number
): void => {
    for (let i = 0; i < vertex_count; i++)
        projectVertex(arrays[i], half_width, half_height);
};

export const projectSomeVertexPositions = (
    arrays: Float32Array[],
    vertex_count: number,
    vertex_flags: Uint8Array,
    half_width: number,
    half_height: number
): void => {
    for (let i = 0; i < vertex_count; i++)
        if (vertex_flags[i] & NDC)
            projectVertex(arrays[i], half_width, half_height);
};

export const projectFaceVertexPositions = (
    arrays: Float32Array[],
    face_count: number,

    face_flags: Uint8Array,
    face_flags_count: number,
    half_width: number,
    half_height: number
): void => {
    let vertex_index = 0;
    for (let face_index = 0; face_index < face_count; face_index++)
        if (face_index >= face_flags_count || face_flags[face_index]) {
            projectVertex(arrays[vertex_index++], half_width, half_height);
            projectVertex(arrays[vertex_index++], half_width, half_height);
            projectVertex(arrays[vertex_index++], half_width, half_height);
        } else
            vertex_index += 3;
};

const perspectiveCorrectVertexAttribute = (
    vectors: Float32Array[],
    outs: Float32Array[],
    ONE_OVER_WS: Float32Array,
    vertex_flags: Uint8Array,
): void => {
    let j, i = 0;
    let one_over_ws: number;
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

const pixel_color = new Color4D();

export const shadeFace2 = <Inputs extends IPixelShaderInputs, Shader extends IPixelShader<Inputs>>(
    shader: Shader,
    inputs: Inputs,

    depths: Float32Array,
    pixels: Uint32Array,

    v1: Float32Array,
    v2: Float32Array,
    v3: Float32Array,

    // barycentrics: Float32Array
): void => {
    let perspective_corrected_b1, b1, pixel_index,
        perspective_corrected_b2, b2, z_behind_pixel,
        perspective_corrected_b3, b3, z: number;

    const W = inputs.image_size.width;
    const H = inputs.image_size.height;

    const Ax = v1[0]; const Bx = v2[0]; const Cx = v3[0];
    const Ay = v1[1]; const By = v2[1]; const Cy = v3[1];
    const w1 = v1[3]; const w2 = v2[3]; const w3 = v3[3];

    // Clip the bounds of the triangle to the viewport:
    let min_x = min(Ax, Bx, Cx); if (min_x >= W) return; // Cull face against the right edge of the viewport:
    let max_x = max(Ax, Bx, Cx); if (max_x < 0)  return; // Cull face against the left edge of the viewport:
    let min_y = min(Ay, By, Cy); if (min_y >= H) return; // Cull face against the bottom edge of the viewport:
    let max_y = max(Ay, By, Cy); if (max_y < 0)  return; // Cull face against the top edge of the viewport:
    min_x = max(min_x, 0); max_x = min(max_x, W);
    min_y = max(min_y, 0); max_y = min(max_y, H);

    // Compute area components:
    const ABx = Bx - Ax; const CAx = Ax - Cx;
    const BAy = Ay - By; const ACy = Cy - Ay;
    const ABC = ABx*ACy - BAy*CAx;
    if (ABC <= 0) return; // Cull faces facing backwards:
    const one_over_ABC = 1.0 / ABC;

    // Compute weight constants:
    const b2_dx = ACy * one_over_ABC;  const b3_dx = BAy * one_over_ABC;  const ABPk = Ax*By - Ay*Bx;
    const b2_dy = CAx * one_over_ABC;  const b3_dy = ABx * one_over_ABC;  const CAPk = Cx*Ay - Cy*Ax;
    const b2_k = CAPk * one_over_ABC;  const b3_k = ABPk * one_over_ABC;

    // Compute edge exclusions (Origin: Top-left, Rules: Top/Left, Winding: CCW):
    const exclude_edge_1: boolean = BAy > 0 || ABx > 0;
    const exclude_edge_2: boolean = By > Cy || Cx > Bx;
    const exclude_edge_3: boolean = ACy > 0 || CAx > 0;

    // Floor bounds coordinates down to their integral component:
    min_x <<= 0;
    min_y <<= 0;
    max_x <<= 0;
    max_y <<= 0;

    // Set first pixel index (now that min_x/min_y are integers):
    let index_start = W * min_y + min_x;

    // Compute initial areal coordinates for the first pixel center:
    let b2_start = b2_dx*(min_x+0.5) + b2_dy*(min_y+0.5) + b2_k;
    let b3_start = b3_dx*(min_x+0.5) + b3_dy*(min_y+0.5) + b3_k;

    const z1 = v1[2];
    const z2 = v2[2];
    const z3 = v3[2];
    b2 = b2_start;
    b3 = b3_start;
    // Scan the bounds:
    for (inputs.pixel_coords.y = min_y; inputs.pixel_coords.y < max_y; inputs.pixel_coords.y++) {

        pixel_index = index_start;

        for (inputs.pixel_coords.x = min_x; inputs.pixel_coords.x < max_x; inputs.pixel_coords.x++) {
            b1 = 1 - b3 - b2;

            // If the pixel is outside of the triangle, skip it:
            if (!(b1 < 0 || (b1 === 0 && exclude_edge_1) ||
                  b2 < 0 || (b2 === 0 && exclude_edge_2) ||
                  b3 < 0 || (b3 === 0 && exclude_edge_3))) {

                // Linearly interpolate `1/z` using the barycentric coordinates, then (pre)reciprocate it to get `z`:
                z = 1.0 / (b1*w1 + b2*w2 + b3*w3);

                // float s = w0 * st0[0] + w1 * st1[0] + w2 * st2[0];
                // float t = w0 * st0[1] + w1 * st1[1] + w2 * st2[1];
                // #ifdef PERSP_CORRECT
                // float z = 1 / (w0 * v0[2] + w1 * v1[2] + w2 * v2[2]);
                // // if we use perspective correct interpolation we need to
                // // multiply the result of this interpolation by z, the depth
                // // of the point on the 3D triangle that the pixel overlaps.
                // s *= z, t *= z;
                // #endif
                // const int M = 10;
                // // checkerboard pattern
                // float p = (fmod(s * M, 1.0) > 0.5) ^ (fmod(t * M, 1.0) < 0.5);
                // framebuffer[j * w + i][0] = (unsigned char)(p * 255);
                // framebuffer[j * w + i][1] = (unsigned char)(p * 255);
                // framebuffer[j * w + i][2] = (unsigned char)(p * 255);

                perspective_corrected_b1 = b1 * w1 * z;
                perspective_corrected_b2 = b2 * w2 * z;
                perspective_corrected_b3 = b3 * w3 * z;

                // Linearly interpolated Z's "1/W-variants" using the barycentric coordinates
                inputs.pixel_depth = (
                    b1 * z1 +
                    b2 * z2 +
                    b3 * z3
                );
                // inputs.pixel_depth = z;
                // Cull and test pixel based on it's depth:
                // shader_inputs.pixel_depth = z1*b1 + z2*b2 + z3*b3;

                // if (inputs.pixel_depth < 0 || inputs.pixel_depth > depths[pixel_index])
                //     continue;


                depths[pixel_index] = inputs.pixel_depth;

                // // Compute and store perspective correct barycentric coordinates:
                // barycentrics[0] = b1 * z_behind_pixel;
                // barycentrics[1] = b2 * z_behind_pixel;
                // barycentrics[2] = b3 * z_behind_pixel;

                shader(inputs, pixel_color);
                // drawPixel(pixels, pixel_index, pixel_color.r, pixel_color.g, pixel_color.b, pixel_color.a);
                drawPixel(pixels, pixel_index, perspective_corrected_b1, perspective_corrected_b2, perspective_corrected_b3, pixel_color.a);
                // drawPixel(pixels, pixel_index, b1, b2, b3, pixel_color.a);
            }
            b2 += b2_dx;
            b3 += b3_dx;
            pixel_index++;

            if (b2_dx < 0 && b2 < 0 ||
                b3_dx < 0 && b3 < 0)
                break;
        }

        b2 += b2_dy;
        b3 += b3_dy;
        index_start += W;

        if (b2_dy < 0 && b2_start < 0 ||
            b3_dy < 0 && b3_start < 0)
            break;
    }
};

export const shadeFace = <Inputs extends IPixelShaderInputs, Shader extends IPixelShader<Inputs>>(
    shader: Shader,
    inputs: Inputs,

    depths: Float32Array,
    pixels: Uint32Array,

    v1: Float32Array,
    v2: Float32Array,
    v3: Float32Array,
): void => {
    let pixel_depth, z: number;

    const screen_width  = inputs.image_size.width;
    const screen_height = inputs.image_size.height;

    const Ax = v1[0];
    const Bx = v2[0];
    const Cx = v3[0];

    // Cull face against the right edge of the viewport:
    let min_x = min(Ax, Bx, Cx);
    if (min_x >= screen_width)
        return;

    // Cull face against the left edge of the viewport:
    let max_x = max(Ax, Bx, Cx);
    if (max_x < 0)
        return;

    const Ay = v1[1];
    const By = v2[1];
    const Cy = v3[1];

    // Cull face against the bottom edge of the viewport:
    let min_y = min(Ay, By, Cy);
    if (min_y >= screen_height)
        return;

    // Cull face against the top edge of the viewport:
    let max_y = max(Ay, By, Cy);
    if (max_y < 0)
        return;

    // Clip the bounds of the triangle to the viewport:
    min_x = max(min_x, 0);
    min_y = max(min_y, 0);
    max_x = min(max_x, screen_width - 1);
    max_y = min(max_y, screen_height - 1);

    // Compute area components:
    const ABy = By - Ay;
    const ABx = Bx - Ax;

    const ACy = Cy - Ay;
    const ACx = Cx - Ax;

    const ABC = ACx*ABy - ACy*ABx; // (Cx - Ax)(By - Ay) - (Cy - Ay)(Bx - Ax)

    // Cull faces facing backwards:
    if (ABC <= 0)
        return;

    // Floor bounds coordinates down to their integral component:
    min_x <<= 0;
    min_y <<= 0;
    max_x <<= 0;
    max_y <<= 0;

    // Set first pixel index (now that min_x/min_y are integers):
    let pixel_index = screen_width * min_y + min_x;
    let pixel_start = pixel_index;

    //Fetch 'ws reciprocals' for perspective corrected interpolation:
    const w1 = v1[3];
    const w2 = v2[3];
    const w3 = v3[3];

    // Pre-compute barycentric weight constants for depth and one-over-ws:
    const z1 = v1[2];
    const z2 = v2[2];
    const z3 = v3[2];

    // Compute edge exclusions:
    // Drawing: Top-down
    // Origin: Top-left
    // Shadow rules: Top/Left
    // Winding: CW (Flipped vertically due to top-down drawing!)
    const exclude_edge_1 = ABy > 0;
    const exclude_edge_2 = By > Cy;
    const exclude_edge_3 = ACy < 0;

    // Compute weight constants:
    const one_over_ABC = 1.0 / ABC;

    const Cdx = ABy * one_over_ABC;
    const Bdx = -ACy * one_over_ABC;

    const Cdy = -ABx * one_over_ABC;
    const Bdy = ACx * one_over_ABC;

    // Compute initial areal coordinates for the first pixel center:
    let C_start = Cdx*(min_x + 0.5) + Cdy*(min_y + 0.5) + (Ay*Bx - Ax*By) * one_over_ABC;
    let B_start = Bdx*(min_x + 0.5) + Bdy*(min_y + 0.5) + (Cy*Ax - Cx*Ay) * one_over_ABC;
    let A, B, C;

    // Scan the bounds:
    for (let y = min_y; y <= max_y; y++, C_start += Cdy, B_start += Bdy, pixel_start += screen_width) {
        pixel_index = pixel_start;
        B = B_start;
        C = C_start;

        for (let x = min_x; x <= max_x; x++, B += Bdx, C += Cdx, pixel_index++) {
            A = 1 - B - C;

            // If the pixel is outside of the triangle, skip it:
            if (A < 0 || (A === 0 && exclude_edge_1) ||
                B < 0 || (B === 0 && exclude_edge_2) ||
                C < 0 || (C === 0 && exclude_edge_3))
                continue;

            // Cull and text pixel based on it's depth:
            pixel_depth = z1*A + z2*B + z3*C;
            if (pixel_depth < 0 ||
                pixel_depth > 1 ||
                pixel_depth > depths[pixel_index])
                continue;

            z = 1.0 / (A*w1 + B*w2 + C*w3);
            inputs.perspective_corrected_barycentric_coords.A = A * w1 * z;
            inputs.perspective_corrected_barycentric_coords.B = B * w2 * z;
            inputs.perspective_corrected_barycentric_coords.C = C * w3 * z;
            inputs.pixel_coords.x = x;
            inputs.pixel_coords.y = y;
            inputs.pixel_depth = depths[pixel_index] = pixel_depth;

            shader(inputs, pixel_color);
            drawPixel(pixels, pixel_index, pixel_color.r, pixel_color.g, pixel_color.b, pixel_color.a);
        }
    }
};