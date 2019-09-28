// type V = pos3d | dir3d;
//
// class vec3d<V> {
//     constructor(public buffer = new Float32Array(4)){}
//     // get cls() : typeof pos3d | typeof dir3d {
//     //     return <typeof pos3d | typeof dir3d> this.constructor
//     // }
//
//     set x(x) {this.buffer[0] = x}
//     set y(y) {this.buffer[1] = y}
//     set z(z) {this.buffer[2] = z}
//     set w(w) {this.buffer[3] = w}
//
//     get x() {return this.buffer[0]}
//     get y() {return this.buffer[1]}
//     get z() {return this.buffer[2]}
//     get w() {return this.buffer[3]}
//
//     get length() : number {
//         return Math.sqrt(dot(this.buffer, this.buffer));
//     }
//
//     copy() : V {
//         return this.constructor.from(Float32Array.from(this.buffer));
//     }
//
//     add(v: vec3d) : vec3d {
//         add(this.buffer, v.buffer);
//         return this;
//     }
//
//     plus(v: vec3d) : vec3d {
//         return this.cls.from(plus(this.buffer, v.buffer));
//     }
//
//     sub(v: vec3d) : vec3d {
//         sub(this.buffer, v.buffer);
//         return this;
//     }
//
//     minus(v: vec3d) : vec3d {
//         return this.cls.from(minus(this.buffer, v.buffer))
//     }
//
//     div(n: number) : vec3d {
//         div(this.buffer, n);
//         return this;
//     }
//
//     over(n: number) : vec3d {
//         return this.cls.from(over(this.buffer, n));
//     }
//
//     mul(n: number | mat4x4) : vec3d {
//         if (n instanceof mat4x4)
//             matMul(this.buffer, n.buffer, this.buffer);
//         else
//             mul(this.buffer, n);
//
//         return this;
//     }
//
//     times(n: number | mat4x4) : vec3d {
//         return this.cls.from(
//         n instanceof mat4x4 ?
//             matMul(this.buffer, n.buffer) :
//             times(this.buffer, n)
//         )
//     }
//
//     setTo(
//         x  : number | vec3d | Float32Array | NumberArray,
//         y? : number,
//         z? : number,
//         w? : number
//     ) : vec3d {
//         if (x instanceof vec3d)
//             this.buffer.set(x.buffer);
//         else if (x instanceof Float32Array || Array.isArray(x))
//             this.buffer.set(x);
//         else if (Number.isFinite(x))
//             this.buffer[0] = x;
//         else
//             throw `Invalid argument ${x}`;
//
//         if (Number.isFinite(y)) this.buffer[1] = y;
//         if (Number.isFinite(z)) this.buffer[2] = z;
//         if (Number.isFinite(w)) this.buffer[3] = w;
//
//         return this;
//     }
// }
