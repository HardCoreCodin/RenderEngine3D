import {IMatrix4x4} from "./matrix.js";
import {ITransform} from "./transform.js";
import {CameraConstructor, ICamera, IMaterial, IMeshGeometries, MaterialConstructor} from "./render.js";

export interface IParent {
    readonly child_count: number;
    children: Generator<INode3D>;

    hasChild(child: INode3D): boolean;
    addChild(child: INode3D): typeof child;
    removeChild(child: INode3D): void;
}

export interface INode3D extends IParent {
    readonly scene: IScene;
    readonly model_to_world: IMatrix4x4;
    readonly is_root: boolean;
    is_static: boolean;
    parent: INode3D|IScene;
    transform: ITransform;

    unparent(): void;
    postWorldMatrixRefresh(): void;
    refreshWorldMatrix(recurse?: boolean, include_static?: boolean): void;
}

export interface IScene<
    Context extends RenderingContext = RenderingContext,
    MaterialType extends IMaterial<Context> = IMaterial<Context>>
    extends IParent
{
    context: Context,

    readonly default_material: MaterialType;
    // readonly Material: MaterialConstructor<Context, MaterialType>;
    // readonly Camera: CameraConstructor;

    readonly cameras: Set<ICamera>;
    readonly materials: Set<IMaterial<Context>>;
    readonly mesh_geometries: IMeshGeometries;

    addCamera(CameraClass?: CameraConstructor): ICamera;
    addMaterial(MaterialClass?: MaterialConstructor<Context, IMaterial<Context>>): IMaterial<Context>;
}