import BaseMaterial from "../../../base/material.js";
import shadePixelDepth from "./shaders/pixel.js";
import shadeMesh from "./shaders/mesh.js";
import { Color3D } from "../../../../accessors/color.js";
export default class SoftwareRasterMaterial extends BaseMaterial {
    constructor(scene, pixel_shader = shadePixelDepth, mesh_shader = shadeMesh, params = {
        shininess: 1,
        specular_color: new Color3D().setAllTo(1),
        diffuse_color: new Color3D().setAllTo(1),
        textures: [],
        has: {
            diffuse: false,
            specular: false
        },
        uses: {
            Blinn: false,
            Phong: false
        }
    }) {
        super(scene);
        this.scene = scene;
        this.pixel_shader = pixel_shader;
        this.mesh_shader = mesh_shader;
        this.params = params;
    }
}
//# sourceMappingURL=base.js.map