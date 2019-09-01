import Position4D, {pos4} from "../linalng/4D/position.js";
import Direction4D from "../linalng/4D/direction.js";
import Transform from "./transform.js";
import {tri, Triangle} from "./triangle.js";

export type Meshes = Mesh[];

export class Mesh {
    public transform = new Transform();

    constructor(
        public triangles: Triangle[] = [],
        public positions : Position4D[] = [],
        public normals : Direction4D[] = []
    ) {}

    static from(obj: string) {
        return new Mesh().load(obj)
    }

    load(obj: string) : Mesh {
        let parts: string[];
        const positions: Position4D[] = [];

        for (const line of obj.split('\n')) {
            if (line[0] === 'v') {
                parts = line.split(' ');
                positions.push(
                    pos4(+parts[1],
                         +parts[2],
                         +parts[3])
                );
            }

            if (line[0] === 'f') {
                parts = line.split(' ');
                this.triangles.push(
                    tri(positions[+parts[1] - 1],
                        positions[+parts[2] - 1],
                        positions[+parts[3] - 1])
                );
            }
        }

        return this;
    }
}