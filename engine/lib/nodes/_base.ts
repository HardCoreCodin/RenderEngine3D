import Transform from "./transform.js";
import Matrix4x4 from "../accessors/matrix4x4.js";
import {INode3D, IParent, IScene} from "../_interfaces/nodes.js";


export class Parent
    implements IParent
{
    protected _children: Set<INode3D> = new Set<INode3D>();

    get child_count(): number {
        return this._children.size
    }

    get children(): Generator<INode3D> {
        return this._iterChildren()
    }

    hasChild(child: INode3D): boolean {
        return this._children.has(child)
    }

    protected* _iterChildren(): Generator<INode3D> {
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

export default class Node3D extends Parent implements INode3D {
    readonly transform = new Transform();
    readonly model_to_world = new Matrix4x4();

    protected _is_static = false;
    protected _parent: INode3D | IScene;

    constructor(
        readonly scene: IScene,
    ) {
        super();
        this._parent = scene;
        scene.addChild(this);
    }

    get is_root(): boolean {
        return Object.is(this._parent, this.scene);
    }

    get is_static(): boolean {
        return this._is_static;
    }

    set is_static(is_static) {
        if (is_static === this._is_static)
            return;

        this._is_static = is_static;
        if (is_static) {
            if (this._parent instanceof Node3D)
                this._parent.is_static = true;

            this.refreshWorldMatrix(false, true);
        }
    }

    get parent(): INode3D | IScene {
        return this._parent;
    }

    set parent(parent: INode3D | IScene) {
        if (Object.is(parent, this)) throw `Can not parent ${this} to itself!`;
        if (Object.is(parent, this._parent)) return;

        this._parent.removeChild(this);
        this._parent = parent;
        parent.addChild(this);
    }

    unparent(): void {
        this._parent = this.scene;
    }

    refreshWorldMatrix(recurse: boolean = true, include_static: boolean = false): void {
        if (include_static || !this.is_static) {
            if (this._parent instanceof Node3D)
                this.transform.matrix.mul(this._parent.model_to_world, this.model_to_world);
            else
                this.model_to_world.setFrom(this.transform.matrix);

            this.postWorldMatrixRefresh();
        }

        if (recurse && this.child_count)
            for (const child of this.children)
                child.refreshWorldMatrix(true, include_static);
    }

    postWorldMatrixRefresh(): void {
    }
}