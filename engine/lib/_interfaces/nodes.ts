import {IMatrix4x4} from "./matrix.js";
import {ITransform} from "./transform.js";
import {ICamera, IMaterial, IMeshGeometries} from "./render.js";

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
    parent: IParent;
    transform: ITransform;

    unparent(): void;
    postWorldMatrixRefresh(): void;
    refreshWorldMatrix(recurse?: boolean, include_static?: boolean): void;
}

export interface IScene
    extends IParent
{
    readonly cameras: Set<ICamera>;
    readonly materials: Set<IMaterial>;
    readonly mesh_geometries: IMeshGeometries;

    addCamera(): ICamera;
    addMaterial(...args: any[]): IMaterial;
}

