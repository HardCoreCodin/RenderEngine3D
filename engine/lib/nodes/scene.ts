import {Parent} from "./_base.js";
import {MeshGeometries} from "./geometry.js";
import {IScene} from "../_interfaces/nodes.js";
import {CameraConstructor, ICamera, IMaterial, MaterialConstructor} from "../_interfaces/render.js";


export default abstract class BaseScene<
    Context extends RenderingContext,
    CameraType extends ICamera = ICamera,
    MaterialType extends IMaterial<Context> = IMaterial<Context>>
    extends Parent
    implements IScene<Context, CameraType, MaterialType>
{
    protected abstract _getDefaultCameraClass(): CameraConstructor<CameraType>;
    protected abstract _getDefaultMaterialClass(): MaterialConstructor<Context, MaterialType>;

    readonly mesh_geometries: MeshGeometries;
    readonly cameras = new Set<ICamera>();
    readonly materials = new Set<IMaterial<Context>>();

    readonly default_material: MaterialType;
    readonly DefaultMaterialClass: MaterialConstructor<Context, MaterialType>;
    readonly DefaultCameraClass: CameraConstructor<CameraType>;

    constructor(public context: Context) {
        super();
        this.mesh_geometries = new MeshGeometries(this);
        this.DefaultCameraClass = this._getDefaultCameraClass();
        this.DefaultMaterialClass = this._getDefaultMaterialClass();
        this.default_material = this.addMaterial() as MaterialType;
    }

    addCamera(
        CameraClass: CameraConstructor<ICamera> = this.DefaultCameraClass
    ): ICamera {
        return new CameraClass(this)
    }

    addMaterial(
        MaterialClass: MaterialConstructor<Context, IMaterial<Context>> = this.DefaultMaterialClass
    ): IMaterial<Context> {
        return new MaterialClass(this);
    }
}