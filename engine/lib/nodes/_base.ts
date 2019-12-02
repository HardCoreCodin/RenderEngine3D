import Transform from "./transform.js";
import {INode3D, IParent} from "../_interfaces/nodes.js";
import {Scene} from "./scene.js";
import {Matrix4x4} from "../accessors/matrix.js";

export abstract class Parent
    implements IParent
{
    public children: INode3D[];

    refreshWorldMatrix(recurse: boolean = true, include_static: boolean = false): void {
        if (this instanceof Node3D && (include_static || !this.is_static)) {
            if (this.parent instanceof Node3D)
                this.transform.matrix.times(this.parent.world_matrix, this.world_matrix);
            else
                this.world_matrix.setFrom(this.transform.matrix);
        }

        if (recurse && this.children.length)
            for (const child of this.children)
                child.refreshWorldMatrix(true, include_static);
    }
}

export default class Node3D
    extends Parent
    implements INode3D
{
    public readonly transform = new Transform();
    public readonly world_matrix = new Matrix4x4();

    protected _is_static = false;
    protected _parent: IParent;

    constructor(
        public readonly scene: Scene,
    ) {
        super();

        scene._add(this);
        this._parent = scene;
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

    get parent(): IParent {
        return this._parent;
    }

    set parent(parent: IParent) {
        if (!(parent instanceof Node3D || parent instanceof Scene)) throw `Invalid parent ${parent}!`;
        if (Object.is(parent, this)) throw `Can not parent ${this} to itself!`;
        if (Object.is(parent, this._parent)) return;

        this._parent.children.splice(this._parent.children.indexOf(this), 1);
        this._parent = parent;
        parent.children.push(this);
    }

    unparent(): void {
        this._parent = this.scene;
    }
}