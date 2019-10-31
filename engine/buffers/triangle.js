import { IndexArrayBuffer } from "./index.js";
import { Positions3D, Positions4D } from "./position.js";
import { Directions4D } from "./direction.js";
import { Colors4D } from "./color.js";
import { Triangle } from "../primitives/triangle.js";
export default class Triangles {
    constructor(count, vertices, positions = new Positions4D(count), normals = new Directions4D(count), colors = new Colors4D(count), uvs = new Positions3D(count), indices = new IndexArrayBuffer(count, 3)) {
        this.count = count;
        this.vertices = vertices;
        this.positions = positions;
        this.normals = normals;
        this.colors = colors;
        this.uvs = uvs;
        this.indices = indices;
    }
    at(index, current = new Triangle()) {
        this.vertices.at(this.indices.sub_arrays[index][0], current.v0);
        this.vertices.at(this.indices.sub_arrays[index][1], current.v1);
        this.vertices.at(this.indices.sub_arrays[index][2], current.v2);
        this.positions.at(index, current.position);
        this.normals.at(index, current.normal);
        this.colors.at(index, current.color);
        this.uvs.at(index, current.uvs);
        return current;
    }
}
//# sourceMappingURL=triangle.js.map