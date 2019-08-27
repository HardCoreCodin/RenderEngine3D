import {vec3d} from "./vec.js";
import rgb from "./color.js";

type trianglePoints = [vec3d, vec3d, vec3d]

export class triangle {
    p: trianglePoints;
    col: rgb;

    constructor(p: trianglePoints, col: rgb = new rgb()) {
        this.p = p;
        this.col = col;
    }
}

export class Mesh {
    constructor(
        public tris: triangle[] = []
    ) {}

    static fromObj(obj: string) {
        const obj_mesh = new Mesh();
        obj_mesh.loadObj(obj);
        return obj_mesh;
    };

    loadObj(obj: string){
        let parts: string[];
        const vertices: vec3d[] = [];

        for (const line of obj.split('\n')) {
            if (line[0] === 'v') {
                parts = line.split(' ');
                vertices.push(
                    new vec3d(
                        parseFloat(parts[1]),
                        parseFloat(parts[2]),
                        parseFloat(parts[3])
                    )
                );
            }

            if (line[0] === 'f') {
                parts = line.split(' ');
                this.tris.push(
                    new triangle(
                        [
                            vertices[parseInt(parts[1]) - 1],
                            vertices[parseInt(parts[2]) - 1],
                            vertices[parseInt(parts[3]) - 1]
                        ]
                    )
                );
            }
        }
    }
}