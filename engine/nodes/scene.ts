import Camera from "./camera.js";
import {Parent} from "./base.js";
import {MeshGeometries} from "./geometry.js";
import {IMaterial, IMaterialConstructor} from "../core/interfaces/render.js";
import Spheres from "../geometry/implicit/spheres.js";


export default class Scene<
    Context extends RenderingContext = RenderingContext,
    MaterialType extends IMaterial<Context> = IMaterial<Context>>
    extends Parent
{
    readonly mesh_geometries: MeshGeometries;
    readonly spheres = new Spheres();
    readonly cameras = new Set<Camera>();
    readonly materials = new Set<IMaterial<Context>>();
    readonly default_material: MaterialType;

    constructor(
        public context: Context,
        DefaultMaterialClass: IMaterialConstructor<Context, MaterialType>
    ) {
        super();
        this.mesh_geometries = new MeshGeometries(this);
        this.default_material = new DefaultMaterialClass(this);
    }

    addCamera(): Camera {
        return new Camera(this)
    }
}