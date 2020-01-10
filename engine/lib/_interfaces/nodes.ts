import {IMatrix4x4} from "./matrix.js";
import {ITransform} from "./transform.js";
import {IGeometry, IMesh} from "./geometry.js";
import {ICamera, IMaterial} from "./render.js";

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
    refreshWorldMatrix(recurse: boolean, include_static: boolean): void;
}

export interface IScene {
    readonly node_count: number;
    readonly geometry_count: number;
    readonly material_count: number;

    readonly nodes: Generator<INode3D>;
    readonly geometries: Generator<IGeometry>;
    readonly materials: Generator<IMaterial>;

    hasGeometry(geometry: IGeometry): boolean;
    addGeometry(mesh: IMesh): IGeometry;
    addGeometry(geometry: IGeometry): IGeometry;
    addGeometry(mesh_or_geometry: IGeometry | IMesh): IGeometry;
    removeGeometry(geometry: IGeometry): void;

    hasMaterial(material: IMaterial): boolean;
    addMaterial(material: IMaterial): void;
    removeMaterial(material: IMaterial): void;

    hasNode(node: INode3D): boolean;
    addNode(node: INode3D): void;
    removeNode(node: INode3D): void;

    addCamera(camera: ICamera): ICamera;
    removeCamera(camera: ICamera): void;
}

