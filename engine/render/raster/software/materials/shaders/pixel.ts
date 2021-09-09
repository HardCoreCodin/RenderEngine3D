import {Color3D, Color4D} from "../../../../../accessors/color.js";
import {I2D} from "../../../../../core/interfaces/vectors.js";
import {ISize} from "../../../../../core/interfaces/render.js";
import {UV2D} from "../../../../../accessors/uv.js";
import {Direction3D} from "../../../../../accessors/direction.js";
import {Position3D} from "../../../../../accessors/position.js";
import PointLight from "../../../../../nodes/light.js";

interface IPerspectiveCorrectedBarycentricCoords {
    A: number,
    B: number,
    C: number
}

export interface IPixel {
    depth: number,
    coords: I2D,
    perspective_corrected_barycentric_coords: IPerspectiveCorrectedBarycentricCoords,
    position: Position3D,
    normal: Direction3D,
    uv: UV2D,
    color: Color4D
}

export type IPixelShader<Pixel extends IPixel = IPixel> = (
    pixel: Pixel,
    image_size: ISize,
    camera_position: Position3D,
    lights: Set<PointLight>
) => void;


// const fmod = (a: number, b: number): number => Number((a - (Math.floor(a / b) * b)).toPrecision(8));

export const getCheckerBoardPixelValueByUV = (u: number, v: number, half_step_count: number): number => {
    let s = u * half_step_count;
    let t = v * half_step_count;
    s -= Math.floor(s);
    t -= Math.floor(t);
    return (s > 0.5 ? 1 : 0) ^ (t < 0.5 ? 1 : 0);
};

const shadePixelCoords: IPixelShader = <Pixel extends IPixel = IPixel>(
    pixel: Pixel,
    image_size: ISize,
    camera_position: Position3D,
    lights: Set<PointLight>
): void => {
    pixel.color.a = 1;
    pixel.color.r = pixel.coords.x / image_size.width;
    pixel.color.g = pixel.coords.y / image_size.height;
    pixel.color.b = 0;
};
export default shadePixelCoords;

export const shadePixelDepth: IPixelShader = <Pixel extends IPixel = IPixel>(
    pixel: Pixel,
    image_size: ISize,
    camera_position: Position3D,
    lights: Set<PointLight>
): void => {
    pixel.color.setAllTo(pixel.depth);
    pixel.color.a = 1;
};

export const shadePixelBarycentric: IPixelShader = <Pixel extends IPixel = IPixel>(
    pixel: Pixel,
    image_size: ISize,
    camera_position: Position3D,
    lights: Set<PointLight>
): void => {
    pixel.color.r = pixel.perspective_corrected_barycentric_coords.A;
    pixel.color.g = pixel.perspective_corrected_barycentric_coords.B;
    pixel.color.b = pixel.perspective_corrected_barycentric_coords.C;
    pixel.color.a = 1;
};

export const shadePixelUV: IPixelShader = <Pixel extends IPixel = IPixel>(
    pixel: Pixel,
    image_size: ISize,
    camera_position: Position3D,
    lights: Set<PointLight>
): void => {
    pixel.color.r = pixel.uv.u;
    pixel.color.g = pixel.uv.v;
    pixel.color.b = 0;
    pixel.color.a = 1;
};

export const shadePixelPosition: IPixelShader = <Pixel extends IPixel = IPixel>(
    pixel: Pixel,
    image_size: ISize,
    camera_position: Position3D,
    lights: Set<PointLight>
): void => {
    // pixel.color.r = (pixel.position.x + 2) * 0.25;
    // pixel.color.g = (pixel.position.y + 2) * 0.25;
    // pixel.color.b = (pixel.position.z + 2) * 0.25;
    pixel.color.r = pixel.position.x;
    pixel.color.g = pixel.position.y;
    pixel.color.b = pixel.position.z;
    pixel.color.a = 1;
};

export const shadePixelNormal: IPixelShader = <Pixel extends IPixel = IPixel>(
    pixel: Pixel,
    image_size: ISize,
    camera_position: Position3D,
    lights: Set<PointLight>
): void => {
    pixel.color.r = pixel.normal.x * 0.5 + 0.5;
    pixel.color.g = pixel.normal.y * 0.5 + 0.5;
    pixel.color.b = pixel.normal.z * 0.5 + 0.5;
    pixel.color.a = 1;
};

export const shadePixelCheckerboard: IPixelShader = <Pixel extends IPixel = IPixel>(
    pixel: Pixel,
    image_size: ISize,
    camera_position: Position3D,
    lights: Set<PointLight>
): void => {
    pixel.color.array.fill(getCheckerBoardPixelValueByUV(pixel.uv.u, pixel.uv.v, 4));
    pixel.color.a = 1;
};

const direction_to_light = new Direction3D();
// const color = new Color3D();

export const shadePixelLambert: IPixelShader = <Pixel extends IPixel = IPixel>(
    pixel: Pixel,
    image_size: ISize,
    camera_position: Position3D,
    lights: Set<PointLight>
): void => {
    pixel.color.array.fill(0);
    pixel.color.a = 1;
    let squared_distance, NdotL: number;

    for (const light of lights) {
        pixel.position.to(light.position, direction_to_light);
        squared_distance = direction_to_light.length_squared;
        direction_to_light.imul(1.0 / Math.sqrt(squared_distance));
        NdotL = pixel.normal.dot(direction_to_light);
        if (NdotL > 0) {
            light.color.mul(0.85 * NdotL * light.intensity / squared_distance, radiance);
            pixel.color.r += radiance.r;
            pixel.color.g += radiance.g;
            pixel.color.b += radiance.b;
        }
    }
    if (pixel.color.r > 1) pixel.color.r = 1;
    if (pixel.color.g > 1) pixel.color.g = 1;
    if (pixel.color.b > 1) pixel.color.b = 1;
};

export const shadePixelLambertCheckerboard: IPixelShader = <Pixel extends IPixel = IPixel>(
    pixel: Pixel,
    image_size: ISize,
    camera_position: Position3D,
    lights: Set<PointLight>
): void => {
    shadePixelLambert(pixel, image_size, camera_position, lights);

    if (!getCheckerBoardPixelValueByUV(pixel.uv.u, pixel.uv.v, 4)) {
        pixel.color.r *= 0.5;
        pixel.color.g *= 0.5;
        pixel.color.b *= 0.5;
    }
};

const reflected_direction = new Direction3D();
const view_direction = new Direction3D();
const radiance = new Color3D();
const diffuse_radiance = new Color3D();
const light_radiance = new Color3D();

export const shadePixelPhong: IPixelShader = <Pixel extends IPixel = IPixel>(
    pixel: Pixel,
    image_size: ISize,
    camera_position: Position3D,
    lights: Set<PointLight>
): void => {
    pixel.color.array.fill(0);
    pixel.color.a = 1;
    let squared_distance, NdotL: number;
    camera_position.to(pixel.position, view_direction).inormalize();
    view_direction.reflect(pixel.normal, reflected_direction);

    for (const light of lights) {
        pixel.position.to(light.position, direction_to_light);
        squared_distance = direction_to_light.length_squared;
        direction_to_light.imul(1.0 / Math.sqrt(squared_distance));
        NdotL = pixel.normal.dot(direction_to_light);
        if (NdotL > 0) {
            // diffuse_radiance.setAllTo(0.85 * NdotL);
            light.color.mul(light.intensity / squared_distance, light_radiance);

            radiance.setAllTo(0.7 * Math.pow(reflected_direction.dot(direction_to_light), 4) + 0.85 * NdotL);
            radiance.imul(light_radiance);

            pixel.color.r += radiance.r;
            pixel.color.g += radiance.g;
            pixel.color.b += radiance.b;
        }
    }
    if (pixel.color.r > 1) pixel.color.r = 1;
    if (pixel.color.g > 1) pixel.color.g = 1;
    if (pixel.color.b > 1) pixel.color.b = 1;
};

export const shadePixelPhongCheckerboard: IPixelShader = <Pixel extends IPixel = IPixel>(
    pixel: Pixel,
    image_size: ISize,
    camera_position: Position3D,
    lights: Set<PointLight>
): void => {
    shadePixelPhong(pixel, image_size, camera_position, lights);

    if (!getCheckerBoardPixelValueByUV(pixel.uv.u, pixel.uv.v, 4)) {
        pixel.color.r *= 0.5;
        pixel.color.g *= 0.5;
        pixel.color.b *= 0.5;
    }
};