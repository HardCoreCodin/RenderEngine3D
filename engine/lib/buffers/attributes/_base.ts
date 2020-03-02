import {Vector} from "../../accessors/accessor.js";
import {VectorConstructor} from "../../_interfaces/vectors.js";
import {ITriangle} from "../../_interfaces/attributes.js";
import {Indices} from "../../../types";


export class Triangle<VectorType extends Vector> implements ITriangle<VectorType> {
    readonly a: VectorType;
    readonly b: VectorType;
    readonly c: VectorType;

    constructor(
        protected readonly Vector: VectorConstructor<VectorType>,
        array: Float32Array
    ) {
        this.a = new this.Vector(array);
        this.b = new this.Vector(array);
        this.c = new this.Vector(array);
    }
}

export function* iterSharedTriangles<VectorType extends Vector,
    TriangleType extends Triangle<VectorType>>
(
    triangle: TriangleType,
    arrays: Float32Array[],
    indices: Indices[]
): Generator<TriangleType> {
    for (const vertex_ids of indices) {
        triangle.a.array = arrays[vertex_ids[0]];
        triangle.b.array = arrays[vertex_ids[1]];
        triangle.c.array = arrays[vertex_ids[2]];
        yield triangle;
    }
}

export function* iterUnsharedTriangles<VectorType extends Vector,
    TriangleType extends Triangle<VectorType>>
(
    triangle: TriangleType,
    arrays: Float32Array[],
    indices: Indices[]
): Generator<TriangleType> {
    let offset = 0;
    for (const index of indices) {
        triangle.a.array = arrays[offset++];
        triangle.b.array = arrays[offset++];
        triangle.c.array = arrays[offset++];

        yield triangle;
    }
}