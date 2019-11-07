import Object3D from "./object.js";
import {Allocators} from "../allocators.js";
import Transform, {trans} from "./transform.js";
import Mesh from "../primitives/mesh.js";

export default class MeshRenderer extends Object3D {
    constructor(
        public readonly mesh: Mesh,
        public readonly transform: Transform
    ) {
        super(transform);
    }
}

export const rend = (mesh: Mesh, allocators: Allocators) : MeshRenderer => new MeshRenderer(mesh, trans(
    allocators.mat4x4,
    allocators.mat3x3
));