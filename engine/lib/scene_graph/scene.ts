import Parent from "./parent.js";
import Camera from "../render/camera.js";
import Material from "../render/materials.js";
import {MeshGeometries} from "../render/geometry.js";
import {IScene} from "../_interfaces/nodes.js";
import {CameraConstructor, ICamera, IMaterial, MaterialConstructor} from "../_interfaces/render.js";


export abstract class BaseScene<
    Context extends RenderingContext,
    CameraType extends ICamera,
    MaterialType extends IMaterial<Context>>
    extends Parent
    implements IScene<Context, CameraType, MaterialType>
{
    protected abstract _getDefaultCameraClass(): CameraConstructor<CameraType>;
    protected abstract _getDefaultMaterialClass(): MaterialConstructor<Context, MaterialType>;

    readonly mesh_geometries: MeshGeometries;
    readonly cameras = new Set<CameraType>();
    readonly materials = new Set<MaterialType>();

    readonly default_material: MaterialType;
    readonly DefaultMaterialClass: MaterialConstructor<Context, MaterialType>;
    readonly DefaultCameraClass: CameraConstructor<CameraType>;

    constructor(public context: Context) {
        super();
        this.mesh_geometries = new MeshGeometries(this);
        this.DefaultCameraClass = this._getDefaultCameraClass();
        this.DefaultMaterialClass = this._getDefaultMaterialClass();
        this.default_material = this.addMaterial();
    }

    addCamera(
        CameraClass: CameraConstructor<CameraType> = this.DefaultCameraClass
    ): CameraType {
        return new CameraClass(this)
    }

    addMaterial(
        MaterialClass: MaterialConstructor<Context, MaterialType> = this.DefaultMaterialClass
    ): MaterialType {
        return new MaterialClass(this);
    }
}

export default class Scene extends BaseScene<CanvasRenderingContext2D, Camera, Material> {
    protected _getDefaultCameraClass(): CameraConstructor<Camera> {return Camera};
    protected _getDefaultMaterialClass(): MaterialConstructor<CanvasRenderingContext2D, Material> {return Material};
}