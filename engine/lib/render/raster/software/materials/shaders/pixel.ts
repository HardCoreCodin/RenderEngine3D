import {Color4D} from "../../../../../accessors/color.js";
import {I2D} from "../../../../../_interfaces/vectors.js";
import {ISize} from "../../../../../_interfaces/render.js";

interface IPerspectiveCorrectedBarycentricCoords {
    A: number,
    B: number,
    C: number
}

export interface IPixelShaderInputs {
    pixel_depth: number,
    pixel_coords: I2D,
    image_size: ISize,
    perspective_corrected_barycentric_coords: IPerspectiveCorrectedBarycentricCoords
}

export type IPixelShader<PixelShaderInputsType extends IPixelShaderInputs = IPixelShaderInputs> = (
    input: PixelShaderInputsType,
    out_color: Color4D
) => void;

const shadePixelCoords: IPixelShader = (
    input: IPixelShaderInputs,
    out_color: Color4D
): void => {
    out_color.a = 1;
    out_color.r = input.pixel_coords.x / input.image_size.width;
    out_color.g = input.pixel_coords.y / input.image_size.height;
    out_color.b = 0;
};
export default shadePixelCoords;

export const shadePixelDepth: IPixelShader = (
    input: IPixelShaderInputs,
    out_color: Color4D
): void => {
    out_color.setAllTo(input.pixel_depth);
    out_color.a = 1;
};

export const shadePixelBarycentric: IPixelShader = (
    input: IPixelShaderInputs,
    out_color: Color4D
): void => {
    out_color.r = input.perspective_corrected_barycentric_coords.A;
    out_color.g = input.perspective_corrected_barycentric_coords.B;
    out_color.b = input.perspective_corrected_barycentric_coords.C;
    out_color.a = 1;
};

// export const shadeThing: IPixelShader = (
//     input: IPixelShaderInputs,
//     out_color: Color4D
// ): void => {
//     float s = w0 * st0[0] + w1 * st1[0] + w2 * st2[0];
//     float t = w0 * st0[1] + w1 * st1[1] + w2 * st2[1];
//     #ifdef PERSP_CORRECT
//     float z = 1 / (w0 * v0[2] + w1 * v1[2] + w2 * v2[2]);
//     // if we use perspective correct interpolation we need to
//     // multiply the result of this interpolation by z, the depth
//     // of the point on the 3D triangle that the pixel overlaps.
//     s *= z, t *= z;
//     #endif
//     const int M = 10;
//     // checkerboard pattern
//     float p = (fmod(s * M, 1.0) > 0.5) ^ (fmod(t * M, 1.0) < 0.5);
//     framebuffer[j * w + i][0] = (unsigned char)(p * 255);
//     framebuffer[j * w + i][1] = (unsigned char)(p * 255);
//     framebuffer[j * w + i][2] = (unsigned char)(p * 255);
// };