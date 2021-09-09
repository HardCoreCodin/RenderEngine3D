import { Color3D } from "../../../../../accessors/color.js";
import { Direction3D } from "../../../../../accessors/direction.js";
// const fmod = (a: number, b: number): number => Number((a - (Math.floor(a / b) * b)).toPrecision(8));
export const getCheckerBoardPixelValueByUV = (u, v, half_step_count) => {
    let s = u * half_step_count;
    let t = v * half_step_count;
    s -= Math.floor(s);
    t -= Math.floor(t);
    return (s > 0.5 ? 1 : 0) ^ (t < 0.5 ? 1 : 0);
};
const shadePixelCoords = (pixel, image_size, camera_position, lights) => {
    pixel.color.a = 1;
    pixel.color.r = pixel.coords.x / image_size.width;
    pixel.color.g = pixel.coords.y / image_size.height;
    pixel.color.b = 0;
};
export default shadePixelCoords;
export const shadePixelDepth = (pixel, image_size, camera_position, lights) => {
    pixel.color.setAllTo(pixel.depth);
    pixel.color.a = 1;
};
export const shadePixelBarycentric = (pixel, image_size, camera_position, lights) => {
    pixel.color.r = pixel.perspective_corrected_barycentric_coords.A;
    pixel.color.g = pixel.perspective_corrected_barycentric_coords.B;
    pixel.color.b = pixel.perspective_corrected_barycentric_coords.C;
    pixel.color.a = 1;
};
export const shadePixelUV = (pixel, image_size, camera_position, lights) => {
    pixel.color.r = pixel.uv.u;
    pixel.color.g = pixel.uv.v;
    pixel.color.b = 0;
    pixel.color.a = 1;
};
export const shadePixelPosition = (pixel, image_size, camera_position, lights) => {
    // pixel.color.r = (pixel.position.x + 2) * 0.25;
    // pixel.color.g = (pixel.position.y + 2) * 0.25;
    // pixel.color.b = (pixel.position.z + 2) * 0.25;
    pixel.color.r = pixel.position.x;
    pixel.color.g = pixel.position.y;
    pixel.color.b = pixel.position.z;
    pixel.color.a = 1;
};
export const shadePixelNormal = (pixel, image_size, camera_position, lights) => {
    pixel.color.r = pixel.normal.x * 0.5 + 0.5;
    pixel.color.g = pixel.normal.y * 0.5 + 0.5;
    pixel.color.b = pixel.normal.z * 0.5 + 0.5;
    pixel.color.a = 1;
};
export const shadePixelCheckerboard = (pixel, image_size, camera_position, lights) => {
    pixel.color.array.fill(getCheckerBoardPixelValueByUV(pixel.uv.u, pixel.uv.v, 4));
    pixel.color.a = 1;
};
const direction_to_light = new Direction3D();
// const color = new Color3D();
export const shadePixelLambert = (pixel, image_size, camera_position, lights) => {
    pixel.color.array.fill(0);
    pixel.color.a = 1;
    let squared_distance, NdotL;
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
    if (pixel.color.r > 1)
        pixel.color.r = 1;
    if (pixel.color.g > 1)
        pixel.color.g = 1;
    if (pixel.color.b > 1)
        pixel.color.b = 1;
};
export const shadePixelLambertCheckerboard = (pixel, image_size, camera_position, lights) => {
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
export const shadePixelPhong = (pixel, image_size, camera_position, lights) => {
    pixel.color.array.fill(0);
    pixel.color.a = 1;
    let squared_distance, NdotL;
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
    if (pixel.color.r > 1)
        pixel.color.r = 1;
    if (pixel.color.g > 1)
        pixel.color.g = 1;
    if (pixel.color.b > 1)
        pixel.color.b = 1;
};
export const shadePixelPhongCheckerboard = (pixel, image_size, camera_position, lights) => {
    shadePixelPhong(pixel, image_size, camera_position, lights);
    if (!getCheckerBoardPixelValueByUV(pixel.uv.u, pixel.uv.v, 4)) {
        pixel.color.r *= 0.5;
        pixel.color.g *= 0.5;
        pixel.color.b *= 0.5;
    }
};
//# sourceMappingURL=pixel.js.map