import Camera from "./camera.js";
import {Parent} from "./_base.js";
import {ImplicitGeometries, MeshGeometries} from "./geometry.js";
import {IMaterial, IMaterialConstructor} from "../_interfaces/render.js";


export default class Scene<
    Context extends RenderingContext = RenderingContext,
    MaterialType extends IMaterial<Context> = IMaterial<Context>>
    extends Parent
{
    readonly mesh_geometries: MeshGeometries;
    readonly implicit_geometries: ImplicitGeometries;

    readonly cameras = new Set<Camera>();
    readonly materials = new Set<IMaterial<Context>>();

    readonly default_material: MaterialType;

    constructor(
        public context: Context,
        DefaultMaterialClass: IMaterialConstructor<Context, MaterialType>
    ) {
        super();
        this.implicit_geometries = new ImplicitGeometries(this);
        this.mesh_geometries = new MeshGeometries(this);
        this.default_material = new DefaultMaterialClass(this);
    }

    addCamera(): Camera {
        return new Camera(this)
    }
}