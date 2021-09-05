import {Color4D} from "../../../../../accessors/color.js";
import {I2D} from "../../../../../_interfaces/vectors.js";
import {ISize} from "../../../../../_interfaces/render.js";

export interface IPixelShaderInputs {
    pixel_coords: I2D,
    image_size: ISize,
    pixel_depth: number
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