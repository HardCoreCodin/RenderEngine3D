import {Color3D, Pixel} from "../../../../../accessors/color.js";
import {I2D} from "../../../../../core/interfaces/vectors.js";
import {UV2D} from "../../../../../accessors/uv.js";
import {Direction3D} from "../../../../../accessors/direction.js";
import {Position3D} from "../../../../../accessors/position.js";
import {IMaterialParams} from "../base.js";
import PointLight from "../../../../../nodes/light.js";
import {clamped} from "../../../../../core/utils.js";

export interface IShaded {
    viewing_origin: Position3D,
    viewing_direction: Direction3D,
    light_direction: Direction3D,
    reflected_direction: Direction3D,
    position: Position3D,
    normal: Direction3D,
    half_vector: Direction3D,
    ambient_color: Color3D,
    combined_color: Color3D,
    temp_color: Color3D;
    UV: UV2D,
    dUV: UV2D,
    coords: I2D,
    material: IMaterialParams,
    perspective_corrected_barycentric_coords: Float32Array,
    pixel: Pixel,
    lights: Set<PointLight>
}

export type IPixelShader<Shaded extends IShaded = IShaded> = (shaded: Shaded) => void;

// const fmod = (a: number, b: number): number => Number((a - (Math.floor(a / b) * b)).toPrecision(8));

const sqrt = Math.sqrt;
const pow = Math.pow;

export const getCheckerBoardPixelValueByUV = (UV: UV2D, half_step_count: number): number => {
    let s = UV.u * half_step_count;
    let t = UV.v * half_step_count;
    s -= Math.floor(s);
    t -= Math.floor(t);
    return (s > 0.5 ? 1 : 0) ^ (t < 0.5 ? 1 : 0);
};

export const shadePixelDepth: IPixelShader = <Shaded extends IShaded = IShaded>(shaded: Shaded): void => {
    shaded.pixel.color.setAllTo(shaded.pixel.depth > 10 ? 1 : shaded.pixel.depth * 0.1);
};
export default shadePixelDepth;

export const shadePixelBarycentric: IPixelShader = <Shaded extends IShaded = IShaded>(shaded: Shaded): void => {
    shaded.pixel.color.array.set(shaded.perspective_corrected_barycentric_coords);
};

export const shadePixelUV: IPixelShader = <Shaded extends IShaded = IShaded>(shaded: Shaded): void => {
    shaded.pixel.r = shaded.UV.u;
    shaded.pixel.g = shaded.UV.v;
};

export const shadePixelPosition: IPixelShader = <Shaded extends IShaded = IShaded>(shaded: Shaded): void => {
    shaded.pixel.r = (shaded.position.x + 2) * 0.5;
    shaded.pixel.g = (shaded.position.y + 2) * 0.5;
    shaded.pixel.b = (shaded.position.z + 2) * 0.5;
};

export const shadePixelNormal: IPixelShader = <Shaded extends IShaded = IShaded>(shaded: Shaded): void => {
    shaded.pixel.r = shaded.normal.x * 0.5 + 0.5;
    shaded.pixel.g = shaded.normal.y * 0.5 + 0.5;
    shaded.pixel.b = shaded.normal.z * 0.5 + 0.5;
};

export const shadePixelClassic: IPixelShader = <Shaded extends IShaded = IShaded>(shaded: Shaded): void => {
    const R = shaded.reflected_direction;
    const L = shaded.light_direction;
    const V = shaded.viewing_direction;
    const O = shaded.viewing_origin;
    const H = shaded.half_vector;
    const N = shaded.normal;
    const P = shaded.position;
    const tmp = shaded.temp_color;
    const comb = shaded.combined_color;
    const material = shaded.material;

    let dot, exp, squared_distance: number;
    const color = shaded.pixel.color.setFrom(shaded.ambient_color);
    if (material.has.specular) {
        O.to(P, V).inormalize();
        if (material.uses.Phong) V.reflect(N, R);
    }
    for (const light of shaded.lights) {
        P.to(light.position, L);
        squared_distance = L.length_squared;
        L.imul(1.0 / sqrt(squared_distance));
        dot = N.dot(L);
        if (dot > 0) {
            if (material.has.diffuse)
                material.diffuse_color.mul(clamped(dot), comb);
            else
                comb.setAllTo(0);

            if (material.has.specular) {
                if (material.uses.Blinn) {
                    dot = N.dot(L.sub(V, H).inormalize());
                    exp = material.shininess * 16.0;
                } else if (material.uses.Phong) {
                    dot = R.dot(L);
                    exp = material.shininess * 4.0;
                }
                comb.iadd(material.specular_color.mul(pow(clamped(dot), exp), tmp));
            }
            comb.imul(light.color.mul(light.intensity / squared_distance, tmp));
            color.iadd(comb);
        }
    }
    color.toneMap();
};

export const shadePixelClassicCheckerboard: IPixelShader = <Shaded extends IShaded = IShaded>(shaded: Shaded): void => {
    shadePixelClassic(shaded);

    if (!getCheckerBoardPixelValueByUV(shaded.UV, 4)) {
        shaded.pixel.r *= 0.5;
        shaded.pixel.g *= 0.5;
        shaded.pixel.b *= 0.5;
    }
};