import Camera from "./camera.js";
import { Parent } from "./base.js";
import { MeshGeometries } from "./geometry.js";
import Spheres from "../geometry/implicit/spheres.js";
import PointLight, { DirectionalLight } from "./light.js";
import { Color3D } from "../accessors/color.js";
import { Texture } from "../buffers/textures.js";
export default class Scene extends Parent {
    constructor(context, MaterialClass) {
        super();
        this.context = context;
        this.MaterialClass = MaterialClass;
        this.spheres = new Spheres();
        this.ambient_color = new Color3D();
        this.lights = new Set();
        this.cameras = new Set();
        this.materials = new Set();
        this.textures = [];
        this.mesh_geometries = new MeshGeometries(this);
        this.default_material = new MaterialClass(this);
    }
    addMaterial() {
        return new this.MaterialClass(this);
    }
    addCamera() {
        return new Camera(this);
    }
    addPointLight(color = new Color3D(), intensity = 1.0) {
        return new PointLight(this, color, intensity);
    }
    addDirectionalLight(color = new Color3D(), intensity = 1.0) {
        return new DirectionalLight(this, color, intensity);
    }
    addTexture(image, load = true, wrap = false, mipmap = true, filter = true, width = image.width, height = image.height) {
        const texture = new Texture(image, this.context, wrap, mipmap, filter, width, height);
        this.textures.push(load ? texture.load(wrap, mipmap) : texture);
        return texture;
    }
}
//# sourceMappingURL=scene.js.map