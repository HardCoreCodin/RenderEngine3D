import Position, {pos4} from "../linalng/position.js";
import Direction from "../linalng/direction.js";
import Transform from "./transform.js";
import {tri, Triangle} from "./triangle.js";

export type Meshes = Mesh[];

export class Mesh {
    public transform = new Transform();

    constructor(
        public triangles: Triangle[] = [],
        public positions : Position[] = [],
        public normals : Direction[] = []
    ) {}

    static from(obj: string) {
        return new Mesh().load(obj)
    }

    load(obj: string) : Mesh {
        let parts: string[];
        const positions: Position[] = [];

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