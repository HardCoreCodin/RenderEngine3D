import Matrix from "../linalng/matrix.js";
import Direction from "../linalng/direction.js";
import Position, {pos4} from "../linalng/position.js";
import {Color} from "./color.js";
import {Buffer} from "../linalng/arithmatic/types.js";

const triangleLine1 = new Direction();
const triangleLine2 = new Direction();
const triangleNormal = new Direction();

export class Triangle {
    private readonly _normal = new Direction();

    constructor(
        public p0: Position = new Position(),
        public p1: Position = new Position(),
        public p2: Position = new Position(),
        public color?: Color
    ) {}

    get normal(): Direction {
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
        this.toNDC();

        return new_triangle;
    }

    transformTo(matrix: Matrix): Triangle {
        this.p0.mul(matrix);
        this.p1.mul(matrix);
        this.p2.mul(matrix);

        return this;
    }

    transformedBy(matrix: Matrix, new_triangle: Triangle = new Triangle()): Triangle {
        new_triangle.setTo(this);
        new_triangle.transformTo(matrix);

        return new_triangle;
    }

    setTo(p0: Position | Triangle, p1?: Position, p2?: Position, color?: Color) {
        if (p0 instanceof Triangle) {
            this.p0.setTo(p0.p0);
            this.p1.setTo(p0.p1);
            this.p2.setTo(p0.p2);
        } else if (p0 instanceof Position) {
            this.p0.setTo(p0);
            if (p1 instanceof Position) this.p1.setTo(p1);
            if (p2 instanceof Position) this.p2.setTo(p2);
            if (color !== undefined) this.color = color;
        }
    }

    toString() : string {
        return `<[${this.p0.x}, ${this.p0.y}, ${this.p0.z}, ${this.p0.w}], [${this.p1.x}, ${this.p1.y}, ${this.p1.z}, ${this.p1.w}], [${this.p2.x}, ${this.p2.y}, ${this.p2.z}, ${this.p2.w}]>`;
    }
}

export const tri = (
    p0?: Buffer | Position | Direction,
    p1?: Buffer | Position | Direction,
    p2?: Buffer | Position | Direction,
    color?: Color,
): Triangle => new Triangle(
    pos4(p0),
    pos4(p1),
    pos4(p2),
    color
);