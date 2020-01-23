import Parent from "./parent.js";
import Camera from "../render/camera.js";
import {RasterMaterial, RayTraceMaterial} from "../render/materials.js";
import {MeshGeometries} from "../render/geometry.js";
import {IScene} from "../_interfaces/nodes.js";
import {CameraConstructor, ICamera, IMaterial, IRenderPipeline, MaterialConstructor} from "../_interfaces/render.js";
import {Rasterizer} from "../render/pipelines.js";
import {RayTracer} from "../render/raytracer.js";


export abstract class BaseScene<
    Context extends RenderingContext,
    CameraType extends ICamera,
    RenderPipelineType extends IRenderPipeline<Context, CameraType>,
    MaterialType extends IMaterial<Context, RenderPipelineType>>
    extends Parent
    implements IScene<Context, CameraType, RenderPipelineType, MaterialType>
{
    protected abstract _getDefaultCameraClass(): CameraConstructor<CameraType>;
    protected abstract _getDefaultMaterialClass(): MaterialConstructor<Context, RenderPipelineType, MaterialType>;

    readonly mesh_geometries: MeshGeometries;
    readonly cameras = new Set<CameraType>();
    readonly materials = new Set<MaterialType>();

    readonly default_material: MaterialType;
    readonly DefaultMaterialClass: MaterialConstructor<Context, RenderPipelineType, MaterialType>;
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
        MaterialClass: MaterialConstructor<Context, RenderPipelineType, MaterialType> = this.DefaultMaterialClass
    ): MaterialType {
        return new MaterialClass(this);
    }
}

export class RasterScene extends BaseScene<CanvasRenderingContext2D, Camera, Rasterizer, RasterMaterial> {
    protected _getDefaultCameraClass(): CameraConstructor<Camera> {return Camera};
    protected _getDefaultMaterialClass(): MaterialConstructor<CanvasRenderingContext2D, Rasterizer, RasterMaterial> {return RasterMaterial};
}

export class RayTraceScene extends BaseScene<CanvasRenderingContext2D, Camera, RayTracer, RayTraceMaterial> {
    protected _getDefaultCameraClass(): CameraConstructor<Camera> {return Camera};
    protected _getDefaultMaterialClass(): MaterialConstructor<CanvasRenderingContext2D, RayTracer, RayTraceMaterial> {return RayTraceMaterial};
}