export class Triangle {
    constructor(Vector, array) {
        this.Vector = Vector;
        this.a = new this.Vector(array);
        this.b = new this.Vector(array);
        this.c = new this.Vector(array);
    }
}
export function* iterSharedTriangles(triangle, arrays, indices) {
    for (const vertex_ids of indices) {
        triangle.a.array = arrays[vertex_ids[0]];
        triangle.b.array = arrays[vertex_ids[1]];
        triangle.c.array = arrays[vertex_ids[2]];
        yield triangle;
    }
}
export function* iterUnsharedTriangles(triangle, arrays, indices) {
    let offset = 0;
    for (const index of indices) {
        triangle.a.array = arrays[offset++];
        triangle.b.array = arrays[offset++];
        triangle.c.array = arrays[offset++];
        yield triangle;
    }
}
//# sourceMappingURL=_base.js.map