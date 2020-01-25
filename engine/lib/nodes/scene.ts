import Camera from "./camera.js";
import {Parent} from "./_base.js";
import {MeshGeometries} from "./geometry.js";
import {IScene} from "../_interfaces/nodes.js";
import {IMaterial, IMaterialConstructor} from "../_interfaces/render.js";


export default class Scene<
    Context extends RenderingContext,
    MaterialType extends IMaterial<Context> = IMaterial<Context>>
    extends Parent
    implements IScene<Context, MaterialType>
{
    readonly mesh_geometries: MeshGeometries;
    readonly cameras = new Set<Camera>();
    readonly materials = new Set<IMaterial<Context>>();

    readonly default_material: MaterialType;

    constructor(
        public context: Context,
        protected readonly Material: IMaterialConstructor<Context, MaterialType>
    ) {
        super();
        this.mesh_geometries = new MeshGeometries(this);
        this.default_material = this.addMaterial() as MaterialType;
    }

    addCamera(): Camera {
        return new Camera(this)
    }

    addMaterial(
        MaterialClass: IMaterialConstructor<Context, IMaterial<Context>> = this.Material
    ): IMaterial<Context> {
        return new MaterialClass(this);
    }
}