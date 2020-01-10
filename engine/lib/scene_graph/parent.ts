import {INode3D, IParent} from "../_interfaces/nodes.js";

export default abstract class Parent
    implements IParent
{
    protected _children: Set<INode3D> = new Set<INode3D>();

    get child_count(): number {return this._children.size}
    get children(): Generator<INode3D> {return this._iterChildren()}

    hasChild(child: INode3D): boolean {return this._children.has(child)}
    protected *_iterChildren(): Generator<INode3D> {
        for (const child of this._children)
            yield child;
    }

    addChild(child: INode3D): typeof child {
        if (!this._children.has(child))
            this._children.add(child);

        return child;
    }

    removeChild(child: INode3D): void {
        if (this._children.has(child))
            this._children.delete(child);
    }
}