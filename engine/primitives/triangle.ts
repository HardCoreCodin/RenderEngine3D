import Matrix4x4 from "../linalng/4D/matrix.js";
import Direction4D from "../linalng/4D/direction.js";
import Position4D, {pos4} from "../linalng/4D/position.js";
import {Color} from "./color.js";
import {Buffer} from "../linalng/4D/arithmatic/constants.js";
import Position3D, {pos3} from "../linalng/3D/position.js";

const triangleLine1 = new Direction4D();
const triangleLine2 = new Direction4D();
const triangleNormal = new Direction4D();

export class Triangle {
    constructor(
        public p0: Position4D = new Position4D(),
        public p1: Position4D = new Position4D(),
        public p2: Position4D = new Position4D(),

        public t0: Position3D = new Position3D(),
        public t1: Position3D = new Position3D(),
        public t2: Position3D = new Position3D(),

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

        this.t0.div(this.p0.w);
        this.t1.div(this.p1.w);
        this.t2.div(this.p2.w);
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

    clipAgainstPlane(
        plane_p: Position4D,
        plane_n: Direction4D,
        out_tri1 : Triangle,
        out_tri2 : Triangle,
    ) : number {
        plane_n.normalize();

        // Return signed shortest distance from point to plane, plane normal must be normalised
        function dist(p: Position4D) {
            // let n = p.asDirection().norm;
            return (
                plane_n.x * p.x +
                plane_n.y * p.y +
                plane_n.z * p.z -
                plane_n.dot(plane_p)
            );
        }

        // Create two temporary storage arrays to classify points either side of plane
        // If distance sign is positive, point lies on "inside" of plane
        let inside_points = Array(3);
        let nInsidePointCount = 0;

        let outside_points = Array(3);
        let nOutsidePointCount = 0;

        let inside_tex = Array(3);
        let nInsideTexCount = 0;

        let outside_tex = Array(3);
        let nOutsideTexCount = 0;

        // Get signed distance of each point in triangle to plane
        let d0 = dist(this.p0);
        let d1 = dist(this.p1);
        let d2 = dist(this.p2);

        if (d0 >= 0) {
            inside_points[nInsidePointCount++] = this.p0;
            inside_tex[nInsideTexCount++] = this.t0;
        } else {
            outside_points[nOutsidePointCount++] = this.p0;
            outside_tex[nOutsideTexCount++] = this.t0;
        }

        if (d1 >= 0) {
            inside_points[nInsidePointCount++] = this.p1;
            inside_tex[nInsideTexCount++] = this.t1;
        } else {
            outside_points[nOutsidePointCount++] = this.p1;
            outside_tex[nOutsideTexCount++] = this.t1;
        }

        if (d2 >= 0) {
            inside_points[nInsidePointCount++] = this.p2;
            inside_tex[nInsideTexCount++] = this.t2;
        } else {
            outside_points[nOutsidePointCount++] = this.p2;
            outside_tex[nOutsideTexCount++] = this.t2;
        }

        // Now classify triangle points, and break the input triangle into
        // smaller output triangles if required.
        // There are four possible outcomes...
        if (nInsidePointCount === 0) {
            // All points lie on the outside of plane, so clip whole triangle
            // It ceases to exist

            return 0; // No returned triangles are valid
        }


        if (nInsidePointCount === 3) {
            // All points lie on the inside of plane, so do nothing
            // and allow the triangle to simply pass through
            out_tri1.setTo(this);

            return 1; // Just the one returned original triangle is valid
        }

        if (nInsidePointCount == 1 &&
            nOutsidePointCount == 2) {
            // Triangle should be clipped. As two points lie outside
            // the plane, the triangle simply becomes a smaller triangle

            // Copy appearance info to new triangle
            out_tri1.color = this.color;

            // The inside point is valid, so keep that...
            out_tri1.p0.setTo(inside_points[0]);
            out_tri1.t0.setTo(inside_tex[0]);

            // but the two new points are at the locations where the
            // original sides of the triangle (lines) intersect with the plane
            let t = plane_p.intersectPlane(plane_n, inside_points[0], outside_points[0], out_tri1.p1);
            out_tri1.t1.x = t * (outside_tex[0].x - inside_tex[0].x) + inside_tex[0].x;
            out_tri1.t1.y = t * (outside_tex[0].y - inside_tex[0].y) + inside_tex[0].y;
            out_tri1.t1.z = t * (outside_tex[0].z - inside_tex[0].z) + inside_tex[0].z;

            t = plane_p.intersectPlane(plane_n, inside_points[0], outside_points[1], out_tri1.p2);
            out_tri1.t2.x = t * (outside_tex[1].x - inside_tex[0].x) + inside_tex[0].x;
            out_tri1.t2.y = t * (outside_tex[1].y - inside_tex[0].y) + inside_tex[0].y;
            out_tri1.t2.z = t * (outside_tex[1].z - inside_tex[0].z) + inside_tex[0].z;

            return 1; // Return the newly formed single triangle
        }

        if (nInsidePointCount == 2 &&
            nOutsidePointCount == 1) {
            // Triangle should be clipped. As two points lie inside the plane,
            // the clipped triangle becomes a "quad". Fortunately, we can
            // represent a quad with two new triangles

            // Copy appearance info to new triangles
            out_tri1.color =  this.color;
            out_tri2.color =  this.color;

            // The first triangle consists of the two inside points and a new
            // point determined by the location where one side of the triangle
            // intersects with the plane
            out_tri1.p0.setTo(inside_points[0]);
            out_tri1.p1.setTo(inside_points[1]);
            out_tri1.t0.setTo(inside_tex[0]);
            out_tri1.t1.setTo(inside_tex[1]);

            let t = plane_p.intersectPlane(plane_n, inside_points[0], outside_points[0], out_tri1.p2);
            out_tri1.t2.x = t * (outside_tex[0].x - inside_tex[0].z) + inside_tex[0].x;
            out_tri1.t2.y = t * (outside_tex[0].y - inside_tex[0].y) + inside_tex[0].y;
            out_tri1.t2.z = t * (outside_tex[0].z - inside_tex[0].z) + inside_tex[0].z;

            // The second triangle is composed of one of he inside points, a
            // new point determined by the intersection of the other side of the
            // triangle and the plane, and the newly created point above
            out_tri2.p0.setTo(inside_points[1]);
            out_tri2.t0.setTo(inside_tex[1]);
            out_tri2.p1.setTo(out_tri1.p2);
            out_tri2.t1.setTo(out_tri1.t2);

            t = plane_p.intersectPlane(plane_n, inside_points[1], outside_points[0], out_tri2.p2);
            out_tri2.t2.x = t * (outside_tex[0].x - inside_tex[1].x) + inside_tex[1].x;
            out_tri2.t2.y = t * (outside_tex[0].y - inside_tex[1].y) + inside_tex[1].y;
            out_tri2.t2.z = t * (outside_tex[0].z - inside_tex[1].z) + inside_tex[1].z;
            return 2; // Return two newly formed triangles which form a quad
        }
    }

    setTo(
        p0: Position4D | Triangle,
        p1?: Position4D,
        p2?: Position4D,

        t0?: Position3D,
        t1?: Position3D,
        t2?: Position3D,

        color?: Color
    ) {
        if (p0 instanceof Triangle) {
            this.p0.setTo(p0.p0);
            this.p1.setTo(p0.p1);
            this.p2.setTo(p0.p2);
            this.t0.setTo(p0.t0);
            this.t1.setTo(p0.t1);
            this.t2.setTo(p0.t2);
        } else if (p0 instanceof Position4D) {
            this.p0.setTo(p0);

            if (p1 instanceof Position4D)
                this.p1.setTo(p1);

            if (p2 instanceof Position4D)
                this.p2.setTo(p2);

            if (t0 instanceof Position4D)
                this.t1.setTo(t0);

            if (t1 instanceof Position4D)
                this.t1.setTo(t1);

            if (t2 instanceof Position4D)
                this.t2.setTo(t2);
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
    pos3(),
    pos3(),
    pos3(),
    color
);