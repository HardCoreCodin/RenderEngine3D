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