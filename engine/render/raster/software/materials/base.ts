import BaseMaterial from "../../../base/material.js";
import Rasterizer from "../pipeline.js";
import Scene from "../../../../nodes/scene.js";
import shadePixelDepth, {IPixelShader} from "./shaders/pixel.js";
import shadeMesh, {IMeshShader} from "./shaders/mesh.js";
import {Color3D} from "../../../../accessors/color.js";
import {Texture} from "../../../../buffers/textures.js";

export interface IMaterialParams {
    shininess: number,
    specular_color: Color3D,
    diffuse_color: Color3D,
    textures: Texture[]
}

export default class SoftwareRasterMaterial extends BaseMaterial<CanvasRenderingContext2D, Rasterizer>
{
    constructor(
        readonly scene: Scene<CanvasRenderingContext2D>,
        public pixel_shader: IPixelShader = shadePixelDepth,
        public mesh_shader: IMeshShader = shadeMesh,
        readonly params: IMaterialParams = {
            shininess: 1,
            specular_color: new Color3D().setAllTo(1),
            diffuse_color: new Color3D().setAllTo(1),
            textures: []
        }
    ) {
        super(scene);
    }
}