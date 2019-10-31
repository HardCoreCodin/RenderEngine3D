import { Positions3D, Positions4D } from "./position.js";
import { Directions4D } from "./direction.js";
import { Colors3D } from "./color.js";
export default class Vertices {
    constructor(count, positions = new Positions4D(count), normals = new Directions4D(count), colors = new Colors3D(count), uvs = new Positions3D(count)) {
        this.count = count;
        this.positions = positions;
        this.normals = normals;
        this.colors = colors;
        this.uvs = uvs;
    }
    at(index, current = new Vertex()) {
        current.position.buffer = this.positions.buffer.sub_arrays[index];
        current.normal.buffer = this.normals.buffer.sub_arrays[index];
        current.color.buffer = this.colors.buffer.sub_arrays[index];
        current.uvs.buffer = this.uvs.buffer.sub_arrays[index];
        return current;
    }
}
//# sourceMappingURL=vertex.js.map