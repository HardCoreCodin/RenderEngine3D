import Camera from "./camera.js";
import { Parent } from "./base.js";
import { MeshGeometries } from "./geometry.js";
import Spheres from "../geometry/implicit/spheres.js";
import PointLight, { DirectionalLight } from "./light.js";
import { Color3D } from "../accessors/color.js";
import { Positions3D } from "../buffers/vectors.js";
export default class Scene extends Parent {
    constructor(context, DefaultMaterialClass) {
        super();
        this.context = context;
        this.spheres = new Spheres();
        this.lights = new Set();
        this.cameras = new Set();
        this.materials = new Set();
        this.object_space_light_positions = new Positions3D().init(10);
        this.mesh_geometries = new MeshGeometries(this);
        this.default_material = new DefaultMaterialClass(this);
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
}
//# sourceMappingURL=scene.js.map