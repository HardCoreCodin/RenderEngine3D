import Camera from "./camera.js";
import { Parent } from "./_base.js";
import { MeshGeometries } from "./geometry.js";
import Spheres from "../geometry/implicit/spheres.js";
export default class Scene extends Parent {
    constructor(context, DefaultMaterialClass) {
        super();
        this.context = context;
        this.spheres = new Spheres();
        this.cameras = new Set();
        this.materials = new Set();
        this.mesh_geometries = new MeshGeometries(this);
        this.default_material = new DefaultMaterialClass(this);
    }
    addCamera() {
        return new Camera(this);
    }
}
//# sourceMappingURL=scene.js.map