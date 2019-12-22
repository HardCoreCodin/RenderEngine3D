
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