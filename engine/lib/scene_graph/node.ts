import Scene from "./scene.js";
import Transform from "./transform.js";
import {INode3D, IParent} from "../_interfaces/nodes.js";
import {Matrix4x4} from "../accessors/matrix.js";

export default class Node3D
    implements INode3D
{
    readonly transform = new Transform();
    readonly model_to_world = new Matrix4x4();

    protected _is_static = false;
    protected _parent: IParent;
    readonly children: INode3D[];

    constructor(
        public readonly scene: Scene,
    ) {
        scene._addNode(this);
        this._parent = scene;
    }

    delete(): void {
        this.scene._removeNode(this);
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

    refreshWorldMatrix(recurse: boolean = true, include_static: boolean = false): void {
        if (this instanceof Node3D && (include_static || !this.is_static)) {
            if (this.parent instanceof Node3D)
                this.transform.matrix.mul(this.parent.model_to_world, this.model_to_world);
            else
                this.model_to_world.setFrom(this.transform.matrix);

            this.postWorldMatrixRefresh();
        }

        if (recurse && this.children.length)
            for (const child of this.children)
                child.refreshWorldMatrix(true, include_static);
    }

    postWorldMatrixRefresh(): void {}
}