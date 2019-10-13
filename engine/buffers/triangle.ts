import {IndexArrayBuffer} from "./index.js";
import {Positions3D, Positions4D} from "./position.js";
import {Directions4D} from "./direction.js";
import {Colors4D} from "./color.js";
import Vertices from "./vertex.js";
import {Triangle} from "../primitives/triangle.js";

export default class Triangles {
    constructor(
        public readonly count: number,
        public readonly vertices: Vertices,
        public readonly positions: Positions4D = new Positions4D(count),
        public readonly normals: Directions4D = new Directions4D(count),
        public readonly colors: Colors4D = new Colors4D(count),
        public readonly uvs: Positions3D = new Positions3D(count),

        public readonly indices: IndexArrayBuffer = new IndexArrayBuffer(count, 3),
    ) {}

    at(index: number, current: Triangle = new Triangle()) : Triangle {
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