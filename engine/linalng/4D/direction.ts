import Matrix4x4 from "./matrix.js";
import Position4D from "./position.js";
import {add, sub, minus, plus, mul, times, div, over, dot, cross, vecMatMul} from "./arithmatic/vector.js";
import {Buffer, VectorBufferLength} from "./arithmatic/constants.js";

export default class Direction4D  {
    public buffer: Buffer;

    constructor(buffer?: Buffer) {
        if (buffer instanceof Buffer) {
            if (buffer.length === VectorBufferLength)
                this.buffer = buffer;
            else
                throw `Invalid buffer length ${buffer.length}`;
        } else if (buffer === undefined || buffer === null)
            this.buffer = new Buffer(VectorBufferLength);
        else
            throw `Invalid buffer ${buffer}`;
    }

    set x(x) {this.buffer[0] = x}
    set y(y) {this.buffer[1] = y}
    set z(z) {this.buffer[2] = z}
    set w(w) {this.buffer[3] = w}

    get x() : number {return this.buffer[0]}
    get y() : number {return this.buffer[1]}
    get z() : number {return this.buffer[2]}
    get w() : number {return this.buffer[3]}

    get length() : number {
        return Math.sqrt(dot(this.buffer, this.buffer));
    }

    get norm() : Direction4D {
        return new Direction4D(over(this.buffer, this.length));
    }

    normalize() : Direction4D {
        this.div(this.length);
        return this;
    }

    dot(dir: Direction4D | Position4D) : number {
        return dot(this.buffer, dir.buffer);
    }

    cross(
        dir: Direction4D,
        new_direction: Direction4D = new Direction4D()
    ) : Direction4D {
        cross(this.buffer, dir.buffer, new_direction.buffer);
        return new_direction;
    }

    copy(
        new_direction: Direction4D = new Direction4D()
    ) : Direction4D {
        new_direction.setTo(Buffer.from(this.buffer));
        return new_direction;
    }

    add(position: Direction4D | Position4D) : Direction4D {
        add(this.buffer, position.buffer);
        return this;
    }

    sub(position: Direction4D) : Direction4D {
        sub(this.buffer, position.buffer);
        return this;
    }

    mul(scalar_or_matrix: number | Matrix4x4) : Direction4D {
        scalar_or_matrix instanceof Matrix4x4 ?
            vecMatMul(this.buffer, scalar_or_matrix.buffer, this.buffer) :
            mul(this.buffer, scalar_or_matrix);

        return this;
    }

    div(scalar: number) : Direction4D {
        div(this.buffer, scalar);
        return this;
    }

    plus(position_or_direction: Position4D) : Position4D;
    plus(position_or_direction: Direction4D) : Direction4D;
    plus(position_or_direction: Direction4D | Position4D) : Direction4D | Position4D {
        return position_or_direction instanceof Direction4D ?
            new Direction4D(plus(this.buffer, position_or_direction.buffer)) :
            new Position4D(plus(this.buffer, position_or_direction.buffer));
    }

    minus(position_or_direction: Position4D) : Position4D;
    minus(position_or_direction: Direction4D) : Direction4D;
    minus(position_or_direction: Direction4D | Position4D) : Direction4D | Position4D {
        return position_or_direction instanceof Direction4D ?
            new Direction4D(minus(this.buffer, position_or_direction.buffer)):
            new Position4D(minus(this.buffer, position_or_direction.buffer));
    }

    over(scalar: number, new_direction: Direction4D = new Direction4D()) : Direction4D {
        over(this.buffer, scalar, new_direction.buffer);
        return new_direction;
    }

    times(scalar_or_matrix: number | Matrix4x4, new_direction: Direction4D = new Direction4D()) : Direction4D {
        scalar_or_matrix instanceof Matrix4x4 ?
            vecMatMul(this.buffer, scalar_or_matrix.buffer, new_direction.buffer) :
            times(this.buffer, scalar_or_matrix, new_direction.buffer);

        return new_direction;
    }

    intersectPlane(
        plane_p: Direction4D,
        plane_n: Direction4D,
        lineStart: Position4D,
        lineEnd: Position4D
    ) : Direction4D {
        const plane_d = plane_n.normalize().dot(plane_p);
        const ad = plane_n.dot(lineStart);
        const bd = plane_n.dot(lineEnd);
        const t = (plane_d - ad) / (bd - ad);
        return lineStart.to(lineEnd).mul(t).add(lineStart);
    }
//
// int Triangle_ClipAgainstPlane(vec3d plane_p, vec3d plane_n, triangle &in_tri, triangle &out_tri1, triangle &out_tri2)
// {
//     // Make sure plane normal is indeed normal
//     plane_n = Vector_Normalise(plane_n);
//
//     // Return signed shortest distance from point to plane, plane normal must be normalised
//     auto dist = [&](vec3d &p)
//     {
//         vec3d n = Vector_Normalise(p);
//         return (plane_n.x * p.x + plane_n.y * p.y + plane_n.z * p.z - Vector_DotProduct(plane_n, plane_p));
//     };
//
//     // Create two temporary storage arrays to classify points either side of plane
//     // If distance sign is positive, point lies on "inside" of plane
//     vec3d* inside_points[3];  int nInsidePointCount = 0;
//     vec3d* outside_points[3]; int nOutsidePointCount = 0;
//
//     // Get signed distance of each point in triangle to plane
//     float d0 = dist(in_tri.p[0]);
//     float d1 = dist(in_tri.p[1]);
//     float d2 = dist(in_tri.p[2]);
//
//     if (d0 >= 0) { inside_points[nInsidePointCount++] = &in_tri.p[0]; }
//     else { outside_points[nOutsidePointCount++] = &in_tri.p[0]; }
//     if (d1 >= 0) { inside_points[nInsidePointCount++] = &in_tri.p[1]; }
//     else { outside_points[nOutsidePointCount++] = &in_tri.p[1]; }
//     if (d2 >= 0) { inside_points[nInsidePointCount++] = &in_tri.p[2]; }
//     else { outside_points[nOutsidePointCount++] = &in_tri.p[2]; }
//
//     // Now classify triangle points, and break the input triangle into
//     // smaller output triangles if required. There are four possible
//     // outcomes...
//
//     if (nInsidePointCount == 0)
//     {
//         // All points lie on the outside of plane, so clip whole triangle
//         // It ceases to exist
//
//         return 0; // No returned triangles are valid
//     }
//
//     if (nInsidePointCount == 3)
//     {
//         // All points lie on the inside of plane, so do nothing
//         // and allow the triangle to simply pass through
//         out_tri1 = in_tri;
//
//         return 1; // Just the one returned original triangle is valid
//     }
//
//     if (nInsidePointCount == 1 && nOutsidePointCount == 2)
//     {
//         // Triangle should be clipped. As two points lie outside
//         // the plane, the triangle simply becomes a smaller triangle
//
//         // Copy appearance info to new triangle
//         out_tri1.col =  in_tri.col;
//         out_tri1.sym = in_tri.sym;
//
//         // The inside point is valid, so keep that...
//         out_tri1.p[0] = *inside_points[0];
//
//         // but the two new points are at the locations where the
//         // original sides of the triangle (lines) intersect with the plane
//         out_tri1.p[1] = Vector_IntersectPlane(plane_p, plane_n, *inside_points[0], *outside_points[0]);
//         out_tri1.p[2] = Vector_IntersectPlane(plane_p, plane_n, *inside_points[0], *outside_points[1]);
//
//         return 1; // Return the newly formed single triangle
//     }
//
//     if (nInsidePointCount == 2 && nOutsidePointCount == 1)
//     {
//         // Triangle should be clipped. As two points lie inside the plane,
//         // the clipped triangle becomes a "quad". Fortunately, we can
//         // represent a quad with two new triangles
//
//         // Copy appearance info to new triangles
//         out_tri1.col =  in_tri.col;
//         out_tri1.sym = in_tri.sym;
//
//         out_tri2.col =  in_tri.col;
//         out_tri2.sym = in_tri.sym;
//
//         // The first triangle consists of the two inside points and a new
//         // point determined by the location where one side of the triangle
//         // intersects with the plane
//         out_tri1.p[0] = *inside_points[0];
//         out_tri1.p[1] = *inside_points[1];
//         out_tri1.p[2] = Vector_IntersectPlane(plane_p, plane_n, *inside_points[0], *outside_points[0]);
//
//         // The second triangle is composed of one of he inside points, a
//         // new point determined by the intersection of the other side of the
//         // triangle and the plane, and the newly created point above
//         out_tri2.p[0] = *inside_points[1];
//         out_tri2.p[1] = out_tri1.p[2];
//         out_tri2.p[2] = Vector_IntersectPlane(plane_p, plane_n, *inside_points[1], *outside_points[0]);
//
//         return 2; // Return two newly formed triangles which form a quad
//     }
// }

    setTo(
        x: Number | Buffer | Position4D | Direction4D,
        y?: Number,
        z?: Number,
        w?: Number,
    ) : Direction4D {
        if (x instanceof Direction4D ||
            x instanceof Position4D) {

            this.buffer.set(x.buffer);

            return this;
        }

        if (x instanceof Buffer &&
            x.length === VectorBufferLength) {

            this.buffer.set(x);

            return this;
        }

        if (typeof x === 'number') {
            this.buffer[0] = x;

            if (typeof y === 'number') this.buffer[1] = y;
            if (typeof z === 'number') this.buffer[2] = z;
            if (typeof w === 'number') this.buffer[3] = w;

            return this;
        }

        throw `Invalid arguments ${x}, ${y}, ${z}, ${w}`
    }
    //
    // toPosition(new_position: Position4D = new Position4D()) : Position4D {
    //     new_position.setTo(Buffer.from(this.buffer));
    //     return new_position;
    // }
    //
    // asPosition(new_position: Position4D = new Position4D()) : Position4D {
    //     new_position.buffer = this.buffer;
    //     return new_position;
    // }
}

export const dir4 = (
    x?: Number | Buffer | Position4D | Direction4D,
    y: Number = 0,
    z: Number = 0,
    w: Number = 0,
) : Direction4D => x === undefined ?
    new Direction4D() :
    new Direction4D().setTo(x, y, z, w);