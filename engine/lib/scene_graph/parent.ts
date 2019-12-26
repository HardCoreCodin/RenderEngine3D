import {INode3D, IParent} from "../_interfaces/nodes.js";

export abstract class Parent
    implements IParent
{
    public children: INode3D[];
}