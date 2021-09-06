const shadePixelCoords = (input, out_color) => {
    out_color.a = 1;
    out_color.r = input.pixel_coords.x / input.image_size.width;
    out_color.g = input.pixel_coords.y / input.image_size.height;
    out_color.b = 0;
};
export default shadePixelCoords;
export const shadePixelDepth = (input, out_color) => {
    out_color.setAllTo(input.pixel_depth);
    out_color.a = 1;
};
export const shadePixelBarycentric = (input, out_color) => {
    out_color.r = input.perspective_corrected_barycentric_coords.A;
    out_color.g = input.perspective_corrected_barycentric_coords.B;
    out_color.b = input.perspective_corrected_barycentric_coords.C;
    out_color.a = 1;
};
export const shadePixelUV = (input, out_color) => {
    out_color.r = input.uv[0];
    out_color.g = input.uv[1];
    out_color.b = 0;
    out_color.a = 1;
};
export const shadePixelNormal = (input, out_color) => {
    out_color.r = input.normal[0] * 0.5 + 0.5;
    out_color.g = input.normal[1] * 0.5 + 0.5;
    out_color.b = input.normal[2] * 0.5 + 0.5;
    out_color.a = 1;
};
// const fmod = (a: number, b: number): number => Number((a - (Math.floor(a / b) * b)).toPrecision(8));
export const shadePixelCheckerboard = (input, out_color) => {
    let s = input.uv[0] * 4;
    let t = input.uv[1] * 4;
    s -= Math.floor(s);
    t -= Math.floor(t);
    out_color.array.fill((s > 0.5 ? 1 : 0) ^ (t < 0.5 ? 1 : 0));
    out_color.a = 1;
};
//# sourceMappingURL=pixel.js.map