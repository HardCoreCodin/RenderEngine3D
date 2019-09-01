import Matrix4x4 from "../linalng/4D/matrix.js";
import Direction4D from "../linalng/4D/direction.js";
import Position4D, {pos4} from "../linalng/4D/position.js";
import {Color} from "./color.js";
import {Buffer} from "../linalng/4D/arithmatic/constants.js";

const triangleLine1 = new Direction4D();
const triangleLine2 = new Direction4D();
const triangleNormal = new Direction4D();

export class Triangle {
    constructor(
        public p0: Position4D = new Position4D(),
        public p1: Position4D = new Position4D(),
        public p2: Position4D = new Position4D(),
        public color?: Color
    ) {}

    get normal(): Direction4D {
        // Get lines either side of triangle
        this.p0.to(this.p1, triangleLine1);
        this.p0.to(this.p2, triangleLine2);

        // Take cross product of lines to get normal to triangle surface
        return triangleLine1.cross(triangleLine2, triangleNormal).normalize();
    }

    toNDC() : void {
        this.p0.div(this.p0.w);
        this.p1.div(this.p1.w);
        this.p2.div(this.p2.w);
    }

    asNDC(new_triangle = new Triangle()) : Triangle {
        new_triangle.setTo(this);
        new_triangle.toNDC();

        return new_triangle;
    }

    transformTo(matrix: Matrix4x4): Triangle {
        this.p0.mul(matrix);
        this.p1.mul(matrix);
        this.p2.mul(matrix);

        return this;
    }

    transformedBy(matrix: Matrix4x4, new_triangle: Triangle = new Triangle()): Triangle {
        new_triangle.setTo(this);
        new_triangle.transformTo(matrix);

        return new_triangle;
    }

    setTo(p0: Position4D | Triangle, p1?: Position4D, p2?: Position4D, color?: Color) {
        if (p0 instanceof Triangle) {
            this.p0.setTo(p0.p0);
            this.p1.setTo(p0.p1);
            this.p2.setTo(p0.p2);
        } else if (p0 instanceof Position4D) {
            this.p0.setTo(p0);

            if (p1 instanceof Position4D)
                this.p1.setTo(p1);

            if (p2 instanceof Position4D)
                this.p2.setTo(p2);
        }

        if (color !== undefined)
            this.color = color;
    }

    toString() : string {
        return `<[${this.p0.x}, ${this.p0.y}, ${this.p0.z}, ${this.p0.w}], [${this.p1.x}, ${this.p1.y}, ${this.p1.z}, ${this.p1.w}], [${this.p2.x}, ${this.p2.y}, ${this.p2.z}, ${this.p2.w}]>`;
    }
}

export const tri = (
    p0?: Buffer | Position4D | Direction4D,
    p1?: Buffer | Position4D | Direction4D,
    p2?: Buffer | Position4D | Direction4D,
    color?: Color,
): Triangle => new Triangle(
    pos4(p0),
    pos4(p1),
    pos4(p2),
    color
);