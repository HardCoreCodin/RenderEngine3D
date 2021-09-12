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
const shadePixelCoords = (pixel, surface, scene) => {
    pixel.color.a = 1;
    pixel.color.r = pixel.coords.x / pixel.image_size.width;
    pixel.color.g = pixel.coords.y / pixel.image_size.height;
    pixel.color.b = 0;
};
export const shadePixelDepth = (pixel, surface, scene) => {
    const depth = pixel.depth / 10;
    pixel.color.setAllTo(depth > 1 ? 1 : depth);
    pixel.color.a = 1;
};
export default shadePixelDepth;
export const shadePixelBarycentric = (pixel, surface, scene) => {
    pixel.color.r = pixel.perspective_corrected_barycentric_coords.A;
    pixel.color.g = pixel.perspective_corrected_barycentric_coords.B;
    pixel.color.b = pixel.perspective_corrected_barycentric_coords.C;
    pixel.color.a = 1;
};
export const shadePixelUV = (pixel, surface, scene) => {
    pixel.color.r = surface.uv.u;
    pixel.color.g = surface.uv.v;
    pixel.color.b = 0;
    pixel.color.a = 1;
};
export const shadePixelPosition = (pixel, surface, scene) => {
    pixel.color.r = (surface.position.x + 2) * 0.5;
    pixel.color.g = (surface.position.y + 2) * 0.5;
    pixel.color.b = (surface.position.z + 2) * 0.5;
    // pixel.color.r = surface.position.x;
    // pixel.color.g = surface.position.y;
    // pixel.color.b = surface.position.z;
    pixel.color.a = 1;
};
export const shadePixelNormal = (pixel, surface, scene) => {
    pixel.color.r = surface.normal.x * 0.5 + 0.5;
    pixel.color.g = surface.normal.y * 0.5 + 0.5;
    pixel.color.b = surface.normal.z * 0.5 + 0.5;
    pixel.color.a = 1;
};
export const shadePixelCheckerboard = (pixel, surface, scene) => {
    pixel.color.array.fill(getCheckerBoardPixelValueByUV(surface.uv.u, surface.uv.v, 4));
    pixel.color.a = 1;
};
const direction_to_light = new Direction3D();
// const color = new Color3D();
export const shadePixelLambert = (pixel, surface, scene) => {
    pixel.color.array.fill(0);
    pixel.color.a = 1;
    let squared_distance, NdotL;
    for (const light of scene.lights) {
        surface.position.to(light.position, direction_to_light);
        squared_distance = direction_to_light.length_squared;
        direction_to_light.imul(1.0 / Math.sqrt(squared_distance));
        NdotL = surface.normal.dot(direction_to_light);
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
export const shadePixelLambertCheckerboard = (pixel, surface, scene) => {
    shadePixelLambert(pixel, surface, scene);
    if (!getCheckerBoardPixelValueByUV(surface.uv.u, surface.uv.v, 4)) {
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
export const shadePixelPhong = (pixel, surface, scene) => {
    pixel.color.array.fill(0);
    pixel.color.a = 1;
    let squared_distance, NdotL;
    scene.camera_position.to(surface.position, view_direction).inormalize();
    view_direction.reflect(surface.normal, reflected_direction);
    for (const light of scene.lights) {
        surface.position.to(light.position, direction_to_light);
        squared_distance = direction_to_light.length_squared;
        direction_to_light.imul(1.0 / Math.sqrt(squared_distance));
        NdotL = surface.normal.dot(direction_to_light);
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
export const shadePixelPhongCheckerboard = (pixel, surface, scene) => {
    shadePixelPhong(pixel, surface, scene);
    if (!getCheckerBoardPixelValueByUV(surface.uv.u, surface.uv.v, 4)) {
        pixel.color.r *= 0.5;
        pixel.color.g *= 0.5;
        pixel.color.b *= 0.5;
    }
};
//# sourceMappingURL=pixel.js.map