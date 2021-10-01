import { NDC } from "../../../../core/constants.js";
import { dir3 } from "../../../../accessors/direction.js";
export const projectVertex = (vertex, half_width, half_height) => {
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
export const projectAllVertexPositions = (arrays, vertex_count, half_width, half_height) => {
    for (let i = 0; i < vertex_count; i++)
        projectVertex(arrays[i], half_width, half_height);
};
export const projectSomeVertexPositions = (arrays, vertex_count, vertex_flags, half_width, half_height) => {
    for (let i = 0; i < vertex_count; i++)
        if (vertex_flags[i] & NDC)
            projectVertex(arrays[i], half_width, half_height);
};
export const projectFaceVertexPositions = (arrays, face_count, face_flags, face_flags_count, half_width, half_height) => {
    let vertex_index = 0;
    for (let face_index = 0; face_index < face_count; face_index++)
        if (face_index >= face_flags_count || face_flags[face_index]) {
            projectVertex(arrays[vertex_index++], half_width, half_height);
            projectVertex(arrays[vertex_index++], half_width, half_height);
            projectVertex(arrays[vertex_index++], half_width, half_height);
        }
        else
            vertex_index += 3;
};
const max = Math.max;
const min = Math.min;
const sqrt = Math.sqrt;
const MinX = dir3();
const MaxX = dir3();
const CrossX = dir3();
const Edge01 = dir3();
const Edge12 = dir3();
const Edge20 = dir3();
const Edge012 = dir3();
const InvEdge012 = dir3();
// const viewing_direction = new Direction3D();
export const shadeFace = (shader, shaded, pixels, image_size, v1, v2, v3, v1_position, v2_position, v3_position, v1_normal, v2_normal, v3_normal, v1_uv, v2_uv, v3_uv, has_normals, has_uvs) => {
    let pixel_depth, z;
    const screen_width = image_size.width;
    const screen_height = image_size.height;
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
    const ABC = ACx * ABy - ACy * ABx; // (Cx - Ax)(By - Ay) - (Cy - Ay)(Bx - Ax)
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
    // const exclude_edge_1 = ABy > 0;
    // const exclude_edge_2 = By > Cy;
    // const exclude_edge_3 = ACy < 0;
    // Compute weight constants:
    const one_over_ABC = 1.0 / ABC;
    const Cdx = ABy * one_over_ABC;
    const Bdx = -ACy * one_over_ABC;
    const Cdy = -ABx * one_over_ABC;
    const Bdy = ACx * one_over_ABC;
    // Compute initial areal coordinates for the first pixel center:
    let C_start = Cdx * (min_x + 0.5) + Cdy * (min_y + 0.5) + (Ay * Bx - Ax * By) * one_over_ABC;
    let B_start = Bdx * (min_x + 0.5) + Bdy * (min_y + 0.5) + (Cy * Ax - Cx * Ay) * one_over_ABC;
    let nx, ny, nz, A, B, C, Ap, Bp, Cp, one_over_length;
    let last_U, U, U1, U2, U3;
    let last_V, V, V1, V2, V3, dU, dV;
    let last_UV_taken;
    let Aw1, Bw2, Cw3;
    // Edge01.x = Bx - Ax;
    // Edge01.y = By - Ay;
    // Edge01.z = z2 - z1;
    //
    // Edge12.x = Cx - Bx;
    // Edge12.y = Cy - By;
    // Edge12.z = z3 - z2;
    //
    // Edge20.x = Ax - Cx;
    // Edge20.y = Ay - Cy;
    // Edge20.z = z1 - z3;
    //
    // Edge012.x = Edge01.y;
    // Edge012.y = Edge12.y;
    // Edge012.z = Edge20.y;
    //
    // const bOpenEdgeX = Edge012.x < 0;
    // const bOpenEdgeY = Edge012.y < 0;
    // const bOpenEdgeZ = Edge012.z < 0;
    //
    // InvEdge012.x = Edge012.x === 0 ? Infinity : (1.0 / Edge012.x);
    // InvEdge012.y = Edge012.y === 0 ? Infinity : (1.0 / Edge012.y);
    // InvEdge012.z = Edge012.z === 0 ? Infinity : (1.0 / Edge012.z);
    //
    // let CY0, CY1, CY2;
    // Scan the bounds:
    for (let y = min_y; y <= max_y; y++, C_start += Cdy, B_start += Bdy, pixel_start += screen_width) {
        pixel_index = pixel_start;
        // CY1 = B = B_start;
        // CY2 = C = C_start;
        // CY0 = 1 - B - C;
        B = B_start;
        C = C_start;
        // CrossX.x = CY0 * InvEdge012.x;
        // CrossX.y = CY1 * InvEdge012.y;
        // CrossX.z = CY2 * InvEdge012.z;
        //
        // MinX.x = bOpenEdgeX ? CrossX.x : 0;
        // MinX.y = bOpenEdgeY ? CrossX.y : 0;
        // MinX.z = bOpenEdgeZ ? CrossX.z : 0;
        //
        // MaxX.x = bOpenEdgeX ? max_x - min_x : CrossX.x;
        // MaxX.y = bOpenEdgeY ? max_x - min_x : CrossX.y;
        // MaxX.z = bOpenEdgeZ ? max_x - min_x : CrossX.z;
        // const x0 = Math.ceil(max(MinX.x, MinX.y, MinX.z));
        // const x1 = min(MaxX.x, MaxX.y, MaxX.z);
        //
        // B += Bdx * x0;
        // C += Cdx * x0;
        last_UV_taken = false;
        for (let x = min_x; x <= max_x; x++, B += Bdx, C += Cdx, pixel_index++) {
            if (Bdx < 0 && B < 0 ||
                Cdx < 0 && C < 0)
                break;
            A = 1 - B - C;
            // If the pixel is outside of the triangle, skip it:
            if (min(A, B, C) < 0)
                continue;
            // If the pixel is on a shadow-edge, skip it:
            // if ((A === 0 && exclude_edge_1) ||
            //     (B === 0 && exclude_edge_2) ||
            //     (C === 0 && exclude_edge_3))
            //     continue;
            shaded.pixel.array = pixels.arrays[pixel_index];
            // Cull and text pixel based on it's depth:
            pixel_depth = z1 * A + z2 * B + z3 * C;
            if (pixel_depth < 0 ||
                pixel_depth > 1 ||
                pixel_depth > shaded.pixel.depth)
                continue;
            Aw1 = A * w1;
            Bw2 = B * w2;
            Cw3 = C * w3;
            z = 1.0 / (Aw1 + Bw2 + Cw3);
            shaded.perspective_corrected_barycentric_coords[0] = Ap = Aw1 * z;
            shaded.perspective_corrected_barycentric_coords[1] = Bp = Bw2 * z;
            shaded.perspective_corrected_barycentric_coords[2] = Cp = Cw3 * z;
            shaded.coords.x = x;
            shaded.coords.y = y;
            shaded.position.array[0] = v1_position[0] * Ap + v2_position[0] * Bp + v3_position[0] * Cp;
            shaded.position.array[1] = v1_position[1] * Ap + v2_position[1] * Bp + v3_position[1] * Cp;
            shaded.position.array[2] = v1_position[2] * Ap + v2_position[2] * Bp + v3_position[2] * Cp;
            if (has_normals) {
                nx = v1_normal[0] * Ap + v2_normal[0] * Bp + v3_normal[0] * Cp;
                ny = v1_normal[1] * Ap + v2_normal[1] * Bp + v3_normal[1] * Cp;
                nz = v1_normal[2] * Ap + v2_normal[2] * Bp + v3_normal[2] * Cp;
                one_over_length = 1.0 / sqrt(nx * nx + ny * ny + nz * nz);
                shaded.normal.array[0] = nx * one_over_length;
                shaded.normal.array[1] = ny * one_over_length;
                shaded.normal.array[2] = nz * one_over_length;
            }
            if (has_uvs) {
                U1 = v1_uv[0];
                V1 = v1_uv[1];
                U2 = v2_uv[0];
                V2 = v2_uv[1];
                U3 = v3_uv[0];
                V3 = v3_uv[1];
                shaded.UV.array[0] = U = U1 * Ap + U2 * Bp + U3 * Cp;
                shaded.UV.array[1] = V = V1 * Ap + V2 * Bp + V3 * Cp;
                if (last_UV_taken) {
                    dU = U - last_U;
                    dV = V - last_V;
                }
                else {
                    Bp = B + Bdx;
                    Cp = C + Cdx;
                    Ap = w1 * (1 - Bp - Cp);
                    Bp *= w2;
                    Cp *= w3;
                    z = 1.0 / (Ap + Bp + Cp);
                    Ap *= z;
                    Bp *= z;
                    Cp *= z;
                    dU = U1 * Ap + U2 * Bp + U3 * Cp - U;
                    dV = V1 * Ap + V2 * Bp + V3 * Cp - V;
                    last_UV_taken = true;
                }
                if (dU < 0)
                    dU = -dU;
                if (dV < 0)
                    dV = -dV;
                shaded.dUV.array[0] = dU;
                shaded.dUV.array[1] = dV;
                last_U = U;
                last_V = V;
            }
            shaded.pixel.array[0] = 0;
            shaded.pixel.array[1] = 0;
            shaded.pixel.array[2] = 0;
            shaded.pixel.array[4] = pixel_depth;
            shaded.pixel.color.array = shaded.pixel.rgba.array = shaded.pixel.array;
            shader(shaded);
        }
    }
};
//
// export const shadeFace2 = <Pixel extends IPixel, Shader extends IPixelShader<Pixel>>(
//     shader: Shader,
//
//     pixel: Pixel,
//     surface: ISurface,
//     scene: IPixelScene,
//
//     depths: Float32Array,
//     pixels: Uint32Array,
//
//     v1: Float32Array,
//     v2: Float32Array,
//     v3: Float32Array,
//
//     v1_position: Float32Array,
//     v2_position: Float32Array,
//     v3_position: Float32Array,
//     // start: Float32Array,
//     // right: Float32Array,
//     // down: Float32Array,
//
//     v1_normal: Float32Array,
//     v2_normal: Float32Array,
//     v3_normal: Float32Array,
//
//     v1_uv: Float32Array,
//     v2_uv: Float32Array,
//     v3_uv: Float32Array,
//
//     has_normals: boolean,
//     has_uvs: boolean
// ): void => {
//     let pixel_depth, z: number;
//
//     const screen_width  = pixel.image_size.width;
//     const screen_height = pixel.image_size.height;
//
//     const Ax = v1[0];
//     const Bx = v2[0];
//     const Cx = v3[0];
//
//     // Cull face against the right edge of the viewport:
//     let min_x = min(Ax, Bx, Cx);
//     if (min_x >= screen_width)
//         return;
//
//     // Cull face against the left edge of the viewport:
//     let max_x = max(Ax, Bx, Cx);
//     if (max_x < 0)
//         return;
//
//     const Ay = v1[1];
//     const By = v2[1];
//     const Cy = v3[1];
//
//     // Cull face against the bottom edge of the viewport:
//     let min_y = min(Ay, By, Cy);
//     if (min_y >= screen_height)
//         return;
//
//     // Cull face against the top edge of the viewport:
//     let max_y = max(Ay, By, Cy);
//     if (max_y < 0)
//         return;
//
//     // Clip the bounds of the triangle to the viewport:
//     min_x = max(min_x, 0);
//     min_y = max(min_y, 0);
//     max_x = min(max_x, screen_width - 1);
//     max_y = min(max_y, screen_height - 1);
//
//     // Compute area components:
//     const ABy = By - Ay;
//     const ABx = Bx - Ax;
//
//     const ACy = Cy - Ay;
//     const ACx = Cx - Ax;
//
//     const ABC = ACx*ABy - ACy*ABx; // (Cx - Ax)(By - Ay) - (Cy - Ay)(Bx - Ax)
//
//     // Cull faces facing backwards:
//     if (ABC <= 0)
//         return;
//
//     // Floor bounds coordinates down to their integral component:
//     min_x <<= 0;
//     min_y <<= 0;
//     max_x <<= 0;
//     max_y <<= 0;
//
//     // Set first pixel index (now that min_x/min_y are integers):
//     let pixel_index = screen_width * min_y + min_x;
//     let pixel_start = pixel_index;
//
//     //Fetch 'ws reciprocals' for perspective corrected interpolation:
//     const w1 = v1[3];
//     const w2 = v2[3];
//     const w3 = v3[3];
//
//     // Pre-compute barycentric weight constants for depth and one-over-ws:
//     const z1 = v1[2];
//     const z2 = v2[2];
//     const z3 = v3[2];
//
//     // Compute edge exclusions:
//     // Drawing: Top-down
//     // Origin: Top-left
//     // Shadow rules: Top/Left
//     // Winding: CW (Flipped vertically due to top-down drawing!)
//     // const exclude_edge_1 = ABy > 0;
//     // const exclude_edge_2 = By > Cy;
//     // const exclude_edge_3 = ACy < 0;
//
//     // Compute weight constants:
//     const one_over_ABC = 1.0 / ABC;
//
//     const Adx = (Cy - By) * one_over_ABC;
//     const Ady = (Bx - Cx) * one_over_ABC;
//
//     const Bdx = -ACy * one_over_ABC;
//     const Bdy = +ACx * one_over_ABC;
//
//     const Cdx = +ABy * one_over_ABC;
//     const Cdy = -ABx * one_over_ABC;
//
//     // Compute initial areal coordinates for the first pixel center:
//     let A_start = Adx*(min_x + 0.5) + Ady*(min_y + 0.5) + (By*Cx - Bx*Cy) * one_over_ABC;
//     let B_start = Bdx*(min_x + 0.5) + Bdy*(min_y + 0.5) + (Cy*Ax - Cx*Ay) * one_over_ABC;
//     let C_start = Cdx*(min_x + 0.5) + Cdy*(min_y + 0.5) + (Ay*Bx - Ax*By) * one_over_ABC;
//
//     let nx, ny, nz, A, B, C, Ap, Bp, Cp, one_over_length;
//
//     let last_U, U, U1, U2, U3: number;
//     let last_V, V, V1, V2, V3, dU, dV: number;
//     let last_UV_taken: boolean;
//
//     let w1A;
//     let w1A_start = w1 * A_start;
//     let w2B;
//     let w2B_start = w2 * B_start;
//     let w3C;
//     let w3C_start = w3 * C_start;
//
//     const w1Adx = w1 * Adx;
//     const w1Ady = w1 * Ady;
//
//     const w2Bdx = w2 * Bdx;
//     const w2Bdy = w2 * Bdy;
//
//     const w3Cdx = w3 * Cdx;
//     const w3Cdy = w3 * Cdy;
//
//     let z1A;
//     let z1A_start = z1 * A_start;
//     let z2B;
//     let z2B_start = z2 * B_start;
//     let z3C;
//     let z3C_start = z3 * C_start;
//
//     const z1Adx = z1 * Adx;
//     const z1Ady = z1 * Ady;
//
//     const z2Bdx = z2 * Bdx;
//     const z2Bdy = z2 * Bdy;
//
//     const z3Cdx = z3 * Cdx;
//     const z3Cdy = z3 * Cdy;
//
//     // Scan the bounds:
//     for (let y = min_y; y <= max_y; y++,
//
//         A_start += Ady,
//         B_start += Bdy,
//         C_start += Cdy,
//
//         w1A_start += w1Ady,
//         w2B_start += w2Bdy,
//         w3C_start += w3Cdy,
//
//         z1A_start += z1Ady,
//         z2B_start += z2Bdy,
//         z3C_start += z3Cdy,
//
//         pixel_start += screen_width
//     ) {
//         // if (Bdy < 0 && B_start < 0 ||
//         //     Cdy < 0 && C_start < 0)
//         //     continue;
//
//         pixel_index = pixel_start;
//
//         A = A_start;
//         B = B_start;
//         C = C_start;
//
//         w1A = w1A_start;
//         w2B = w2B_start;
//         w3C = w3C_start;
//
//         z1A = z1A_start;
//         z2B = z2B_start;
//         z3C = z3C_start;
//
//         last_UV_taken = false;
//
//         for (let x = min_x; x <= max_x; x++,
//             A += Adx,
//             B += Bdx,
//             C += Cdx,
//
//             w1A += w1Adx,
//             w2B += w2Bdx,
//             w3C += w3Cdx,
//
//             z1A += z1Adx,
//             z2B += z2Bdx,
//             z3C += z3Cdx,
//
//             pixel_index++
//         ) {
//             if (Adx < 0 && A < 0 ||
//                 Bdx < 0 && B < 0 ||
//                 Cdx < 0 && C < 0)
//                 break;
//
//             // If the pixel is outside of the triangle, skip it:
//             if (min(A, B, C) < 0)
//                 continue;
//
//             // If the pixel is on a shadow-edge, skip it:
//             // if ((A === 0 && exclude_edge_1) ||
//             //     (B === 0 && exclude_edge_2) ||
//             //     (C === 0 && exclude_edge_3))
//             //     continue;
//
//             // Cull and text pixel based on it's depth:
//             pixel_depth = z1A + z2B + z3C;
//             if (pixel_depth < 0 ||
//                 pixel_depth > 1 ||
//                 pixel_depth > depths[pixel_index])
//                 continue;
//
//             depths[pixel_index] = pixel_depth;
//
//             z = 1.0 / (w1A + w2B + w3C);
//             pixel.perspective_corrected_barycentric_coords.A = Ap = w1A * z;
//             pixel.perspective_corrected_barycentric_coords.B = Bp = w2B * z;
//             pixel.perspective_corrected_barycentric_coords.C = Cp = w3C * z;
//             pixel.coords.x = x;
//             pixel.coords.y = y;
//             pixel.depth = z;
//
//             surface.position.array[0] = v1_position[0] * Ap + v2_position[0] * Bp + v3_position[0] * Cp;
//             surface.position.array[1] = v1_position[1] * Ap + v2_position[1] * Bp + v3_position[1] * Cp;
//             surface.position.array[2] = v1_position[2] * Ap + v2_position[2] * Bp + v3_position[2] * Cp;
//
//             if (has_normals) {
//                 nx = v1_normal[0] * Ap + v2_normal[0] * Bp + v3_normal[0] * Cp;
//                 ny = v1_normal[1] * Ap + v2_normal[1] * Bp + v3_normal[1] * Cp;
//                 nz = v1_normal[2] * Ap + v2_normal[2] * Bp + v3_normal[2] * Cp;
//                 one_over_length = 1.0 / Math.sqrt(nx*nx + ny*ny + nz*nz);
//                 surface.normal.array[0] = nx * one_over_length;
//                 surface.normal.array[1] = ny * one_over_length;
//                 surface.normal.array[2] = nz * one_over_length;
//             }
//             if (has_uvs) {
//                 U1 = v1_uv[0]; V1 = v1_uv[1];
//                 U2 = v2_uv[0]; V2 = v2_uv[1];
//                 U3 = v3_uv[0]; V3 = v3_uv[1];
//
//                 surface.UV.array[0] = U = U1 * Ap + U2 * Bp + U3 * Cp;
//                 surface.UV.array[1] = V = V1 * Ap + V2 * Bp + V3 * Cp;
//
//                 if (last_UV_taken) {
//                     dU = U - last_U;
//                     dV = V - last_V;
//                 } else {
//                     Bp = B + Bdx;
//                     Cp = C + Cdx;
//                     Ap =  w1 * (1 - Bp - Cp);
//                     Bp *= w2;
//                     Cp *= w3;
//
//                     z = 1.0 / (Ap + Bp + Cp);
//                     Ap *= z;
//                     Bp *= z;
//                     Cp *= z;
//                     dU = U1 * Ap + U2 * Bp + U3 * Cp - U;
//                     dV = V1 * Ap + V2 * Bp + V3 * Cp - V;
//                     last_UV_taken = true;
//                 }
//
//                 if (dU < 0) dU = -dU;
//                 if (dV < 0) dV = -dV;
//
//                 surface.dUV.array[0] = dU;
//                 surface.dUV.array[1] = dV;
//
//                 last_U = U;
//                 last_V = V;
//             }
//
//             shader(pixel, surface, scene);
//             drawPixel(pixels, pixel_index, pixel.color.r, pixel.color.g, pixel.color.b, pixel.color.a);
//         }
//     }
// };
//# sourceMappingURL=half_space.js.map