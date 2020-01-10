import Scene from "./scene.js";
import Parent from "./parent.js";
import Transform from "./transform.js";
import {Matrix4x4} from "../accessors/matrix.js";
import {INode3D, IParent} from "../_interfaces/nodes.js";

export default class Node3D extends Parent implements INode3D
{
    readonly transform = new Transform();
    readonly model_to_world = new Matrix4x4();

    protected _is_static = false;
    protected _parent: IParent;

    constructor(
        readonly scene: Scene,
    ) {
        super();
        scene.addNode(this);
        this._parent = scene;
    }

    delete(): void {
        this.scene.removeNode(this);
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

        this._parent.removeChild(this);
        this._parent = parent;
        parent.addChild(this);
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

        if (recurse && this.child_count)
            for (const child of this.children)
                child.refreshWorldMatrix(true, include_static);
    }

    postWorldMatrixRefresh(): void {
    }
}