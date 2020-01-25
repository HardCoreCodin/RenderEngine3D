import {Parent} from "./_base.js";
import {MeshGeometries} from "./geometry.js";
import {IScene} from "../_interfaces/nodes.js";
import {CameraConstructor, ICamera, IMaterial, MaterialConstructor} from "../_interfaces/render.js";


export default class Scene<
    Context extends RenderingContext,
    CameraType extends ICamera = ICamera,
    MaterialType extends IMaterial<Context> = IMaterial<Context>>
    extends Parent
    implements IScene<Context, MaterialType>
{
    readonly mesh_geometries: MeshGeometries;
    readonly cameras = new Set<ICamera>();
    readonly materials = new Set<IMaterial<Context>>();

    readonly default_material: MaterialType;

    constructor(
        public context: Context,
        readonly Camera: CameraConstructor,
        readonly Material: MaterialConstructor<Context, MaterialType>
    ) {
        super();
        this.mesh_geometries = new MeshGeometries(this);
        this.default_material = this.addMaterial() as MaterialType;
    }

    addCamera(
        CameraClass: CameraConstructor = this.Camera
    ): ICamera {
        return new CameraClass(this)
    }

    addMaterial(
        MaterialClass: MaterialConstructor<Context, IMaterial<Context>> = this.Material
    ): IMaterial<Context> {
        return new MaterialClass(this);
    }
}