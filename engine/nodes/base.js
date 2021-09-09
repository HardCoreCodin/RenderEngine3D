import Transform from "./transform.js";
import Matrix4x4 from "../accessors/matrix4x4.js";
export class Parent {
    constructor() {
        this._children = new Set();
    }
    get child_count() {
        return this._children.size;
    }
    get children() {
        return this._iterChildren();
    }
    hasChild(child) {
        return this._children.has(child);
    }
    *_iterChildren() {
        for (const child of this._children)
            yield child;
    }
    addChild(child) {
        if (!this._children.has(child))
            this._children.add(child);
        return child;
    }
    removeChild(child) {
        if (this._children.has(child))
            this._children.delete(child);
    }
}
export default class Node3D extends Parent {
    constructor(scene) {
        super();
        this.scene = scene;
        this.transform = new Transform();
        this.model_to_world = new Matrix4x4();
        this.world_to_model = new Matrix4x4();
        this._is_static = false;
        this._parent = scene;
        scene.addChild(this);
    }
    get is_root() {
        return Object.is(this._parent, this.scene);
    }
    get is_static() {
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
    get parent() {
        return this._parent;
    }
    set parent(parent) {
        if (Object.is(parent, this))
            throw `Can not parent ${this} to itself!`;
        if (Object.is(parent, this._parent))
            return;
        this._parent.removeChild(this);
        this._parent = parent;
        parent.addChild(this);
    }
    unparent() {
        this._parent = this.scene;
    }
    refreshWorldMatrix(recurse = true, include_static = false) {
        if (include_static || !this.is_static) {
            if (this._parent instanceof Node3D)
                this.transform.matrix.mul(this._parent.model_to_world, this.model_to_world);
            else
                this.model_to_world.setFrom(this.transform.matrix);
            this.model_to_world.invert(this.world_to_model);
            this.postWorldMatrixRefresh();
        }
        if (recurse && this.child_count)
            for (const child of this.children)
                child.refreshWorldMatrix(true, include_static);
    }
    postWorldMatrixRefresh() {
    }
}
//# sourceMappingURL=base.js.map