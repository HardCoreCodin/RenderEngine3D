import Position from "./linalng/position.js";
import rgb from "./color.js";

type trianglePoints = [Position, Position, Position]

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
        const vertices: Position[] = [];

        for (const line of obj.split('\n')) {
            if (line[0] === 'v') {
                parts = line.split(' ');
                vertices.push(Position.of(+parts[1], +parts[2], +parts[3]));
            }

            if (line[0] === 'f') {
                parts = line.split(' ');
                this.tris.push(
                    new triangle(
                        [
                            vertices[+parts[1] - 1],
                            vertices[+parts[2] - 1],
                            vertices[+parts[3] - 1]
                        ]
                    )
                );
            }
        }
    }
}