import {INode3D, IParent} from "../_interfaces/nodes.js";
import Node3D from "./node.js";

export abstract class Parent
    implements IParent {
    public children: INode3D[];

    refreshWorldMatrix(recurse: boolean = true, include_static: boolean = false): void {
        if (this instanceof Node3D && (include_static || !this.is_static)) {
            if (this.parent instanceof Node3D)
                this.transform.matrix.times(this.parent.world_matrix, this.world_matrix);
            else
                this.world_matrix.setFrom(this.transform.matrix);

            this.postWorldMatrixRefresh();
        }

        if (recurse && this.children.length)
            for (const child of this.children)
                child.refreshWorldMatrix(true, include_static);
    }

    postWorldMatrixRefresh(): void {}
}