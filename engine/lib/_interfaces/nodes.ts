import {IMatrix4x4} from "./matrix.js";

export interface IParent
{
    children: INode3D[];
}

export interface IScene
    extends IParent
{
}

export interface INode3D
    extends IParent
{
    parent: IParent;
    model_to_world: IMatrix4x4;
    is_static: boolean;

    refreshWorldMatrix(recurse?: boolean, include_static?: boolean): void;
}