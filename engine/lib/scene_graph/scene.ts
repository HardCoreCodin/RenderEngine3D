import Parent from "./parent.js";
import Camera from "../render/camera.js";
import Material from "../render/materials.js";
import {MeshGeometries} from "../render/geometry.js";
import {IScene} from "../_interfaces/nodes.js";
import {CameraConstructor, ICamera, IMaterial, MaterialConstructor} from "../_interfaces/render.js";


export class BaseScene<
    Context extends RenderingContext,
    CameraType extends ICamera,
    MaterialType extends IMaterial<Context>>
    extends Parent
    implements IScene<Context, CameraType, MaterialType>
{
    readonly mesh_geometries: MeshGeometries;
    readonly cameras = new Set<CameraType>();
    readonly materials = new Set<MaterialType>();

    constructor(public context: Context) {
        super();
        this.mesh_geometries = new MeshGeometries(this);
    }

    addCamera(CameraClass: CameraConstructor<CameraType>): CameraType {
        return new CameraClass(this)
    }

    addMaterial(MaterialClass: MaterialConstructor<Context, MaterialType>): MaterialType {
        return new MaterialClass(this);
    }
}

export default class Scene extends BaseScene<CanvasRenderingContext2D, Camera, Material> {}