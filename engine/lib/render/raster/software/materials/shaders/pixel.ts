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
    perspective_corrected_barycentric_coords: IPerspectiveCorrectedBarycentricCoords,
    normal: Float32Array,
    uv: Float32Array
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

export const shadePixelUV: IPixelShader = (
    input: IPixelShaderInputs,
    out_color: Color4D
): void => {
    out_color.r = input.uv[0];
    out_color.g = input.uv[1];
    out_color.b = 0;
    out_color.a = 1;
};

export const shadePixelNormal: IPixelShader = (
    input: IPixelShaderInputs,
    out_color: Color4D
): void => {
    out_color.r = input.normal[0] * 0.5 + 0.5;
    out_color.g = input.normal[1] * 0.5 + 0.5;
    out_color.b = input.normal[2] * 0.5 + 0.5;
    out_color.a = 1;
};

// const fmod = (a: number, b: number): number => Number((a - (Math.floor(a / b) * b)).toPrecision(8));

export const shadePixelCheckerboard: IPixelShader = (
    input: IPixelShaderInputs,
    out_color: Color4D
): void => {
    let s = input.uv[0] * 4;
    let t = input.uv[1] * 4;
    s -= Math.floor(s);
    t -= Math.floor(t);
    out_color.array.fill((s > 0.5 ? 1 : 0) ^ (t < 0.5 ? 1 : 0));
    out_color.a = 1;
};