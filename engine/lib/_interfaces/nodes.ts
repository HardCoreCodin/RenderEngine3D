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

    delete(): void;
    unparent(): void;
    postWorldMatrixRefresh(): void;
    refreshWorldMatrix(recurse?: boolean, include_static?: boolean): void;
}

export interface IScene {
    readonly node_count: number;
    readonly camera_count: number;
    readonly material_count: number;

    readonly nodes: Generator<INode3D>;
    readonly cameras: Generator<ICamera>;
    readonly materials: Generator<IMaterial>;
    readonly mesh_geometries: IMeshGeometries;

    hasMaterial(material: IMaterial): boolean;
    addMaterial(material: IMaterial): typeof material;
    removeMaterial(material: IMaterial): typeof material;

    hasNode(node: INode3D): boolean;
    addNode(node: INode3D): typeof node;
    removeNode(node: INode3D): typeof node;

    hasCamera(camera: ICamera): boolean;
    addCamera(camera: ICamera): typeof camera;
    removeCamera(camera: ICamera): typeof camera;
}

