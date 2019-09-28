import {Mesh} from "./mesh.js";
import {pos4} from "../linalng/4D/position.js";
import {tri} from "./triangle.js";

const triangle_positions = [
    // SOUTH
    [[0, 0, 0], [0, 1, 0], [1, 1, 0]],
    [[0, 0, 0], [1, 1, 0], [1, 0, 0]],
    
    // EAST                                                      
    [[1, 0, 0], [1, 1, 0], [1, 1, 1]],
    [[1, 0, 0], [1, 1, 1], [1, 0, 1]],
    
    // NORTH                                                     
    [[1, 0, 1], [1, 1, 1], [0, 1, 1]],
    [[1, 0, 1], [0, 1, 1], [0, 0, 1]],
    
    // WEST                                                      
    [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 1], [0, 1, 0], [0, 0, 0]],
    
    // TOP                                                       
    [[0, 1, 0], [0, 1, 1], [1, 1, 1]],
    [[0, 1, 0], [1, 1, 1], [1, 1, 0]],
    
    // BOTTOM                                                    
    [[1, 0, 1], [0, 0, 1], [0, 0, 0]],
    [[1, 0, 1], [0, 0, 0], [1, 0, 0]],
];

export default class Cube extends Mesh {
    constructor() {
        super();

        for (const tri_pos of triangle_positions) {
            this.triangles.push(
                tri(
                    pos4(...tri_pos[0]),
                    pos4(...tri_pos[1]),
                    pos4(...tri_pos[2])
                )
            );

            this.positions.push(this.triangles[this.triangles.length - 1].p0);
            this.positions.push(this.triangles[this.triangles.length - 1].p1);
            this.positions.push(this.triangles[this.triangles.length - 1].p2);
        }
    }
}
    