const array_length = 4**8;
let i, now: number;
const num_iterations: number = 100;
/*

cd C:\Program Files (x86)\Google\Chrome\Application && chrome.exe --no-sandbox --js-flags="--trace-opt --trace-deopt" --user-data-dir=C:\chromeDebugProfile

const num_calls = array_length - 4;

let lexical_a, lexical_i: number;

const lexical = (num_iterations: number = 100000): void => {
    lexical_a = num_iterations;
    for (lexical_i = 0; lexical_i < num_iterations; lexical_i++) {
        lexical_a = lexical_a - 1;
    }
};

const internal = (num_iterations: number = 100000): void => {
    let internal_a = num_iterations;
    for (let internal_i = 0; internal_i < num_iterations; internal_i++) {
        internal_a = internal_a - 1;
    }
};


now = performance.now();
for (i = 0; i < num_calls; i++) lexical();
console.log(`lexical : ${performance.now() - now}`);

now = performance.now();
for (i = 0; i < num_calls; i++) internal();
console.log(`internal: ${performance.now() - now}`);
*/


// const add_object = (
//     a: {id: number, array: [Float32Array, Float32Array, Float32Array, Float32Array]},
//     b: {id: number, array: [Float32Array, Float32Array, Float32Array, Float32Array]},
//     o: {id: number, array: [Float32Array, Float32Array, Float32Array, Float32Array]}
// ): void => {
//     o.array[o.id][0] = b.array[b.id][0] + b.array[b.id][0];
//     o.array[o.id][1] = b.array[b.id][1] + b.array[b.id][1];
//     o.array[o.id][2] = b.array[b.id][2] + b.array[b.id][2];
//     o.array[o.id][3] = b.array[b.id][3] + b.array[b.id][3];
// };

const add_array_of_arrays = (
    a_id: number, a_arrays: Float32Array[],
    b_id: number, b_arrays: Float32Array[],
    o_id: number, o_arrays: Float32Array[]
): void => {
    o_arrays[0][o_id] = a_arrays[0][a_id] + b_arrays[0][b_id];
    o_arrays[1][o_id] = a_arrays[1][a_id] + b_arrays[1][b_id];
    o_arrays[2][o_id] = a_arrays[2][a_id] + b_arrays[2][b_id];
    o_arrays[3][o_id] = a_arrays[3][a_id] + b_arrays[3][b_id];
};

const add_arrays = (
    a_id: number, a_X: Float32Array, a_Y: Float32Array, a_Z: Float32Array, a_W: Float32Array,
    b_id: number, b_X: Float32Array, b_Y: Float32Array, b_Z: Float32Array, b_W: Float32Array,
    o_id: number, o_X: Float32Array, o_Y: Float32Array, o_Z: Float32Array, o_W: Float32Array,
): void => {
    o_X[o_id] = a_X[b_id] + b_X[b_id];
    o_Y[o_id] = b_Y[b_id] + b_Y[b_id];
    o_Z[o_id] = b_Z[b_id] + b_Z[b_id];
    o_W[o_id] = a_W[b_id] + b_W[b_id];
};

const add_AoS_arrays = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array
): void => {
    o[0] = a[0] + b[0];
    o[1] = a[1] + b[1];
    o[2] = a[2] + b[2];
    o[3] = a[3] + b[3];
};

// const vec4_addition_passed_as_objects = (
//     a: {id: number, array: [Float32Array, Float32Array, Float32Array, Float32Array]},
//     b: {id: number, array: [Float32Array, Float32Array, Float32Array, Float32Array]},
//     o: {id: number, array: [Float32Array, Float32Array, Float32Array, Float32Array]},
//     num_iterations: number = 10000
// ): void => {
//     for (let i = 0; i < num_iterations; i++)
//         add_object(a, b, o);
// };

const vec4_addition_passed_as_array_of_arrays = (
    a_id: number, a_arrays: Float32Array[],
    b_id: number, b_arrays: Float32Array[],
    o_id: number, o_arrays: Float32Array[]
): void => {
    for (let n = 0; n < num_iterations; n++)
        add_array_of_arrays(
            a_id, a_arrays,
            b_id, b_arrays,
            o_id, o_arrays
        );
};

const vec4_addition_passed_as_arrays = (
    a_id: number, aX: Float32Array, aY: Float32Array, aZ: Float32Array, aW: Float32Array,
    b_id: number, bX: Float32Array, bY: Float32Array, bZ: Float32Array, bW: Float32Array,
    o_id: number, oX: Float32Array, oY: Float32Array, oZ: Float32Array, oW: Float32Array
): void => {
    for (let n = 0; n < num_iterations; n++)
        add_arrays(
            a_id, aX, aY, aZ, aW,
            b_id, bX, bY, bZ, bW,
            o_id, oX, oY, oZ, oW
        );
};

const vec4_addition_passed_as_AoS_arrays = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array
): void => {
    for (let n = 0; n < num_iterations; n++)
        add_AoS_arrays(a, b, o);
};

const a_buffer = new Float32Array(array_length);
const b_buffer = new Float32Array(array_length);
const o_buffer = new Float32Array(array_length);

for (i = 0; i < array_length; i++) {
    a_buffer[i] = Math.random();
    b_buffer[i] = Math.random();
}

const arrays_count = array_length / 4;

const a_x = a_buffer.subarray(0, arrays_count);
const b_x = b_buffer.subarray(0, arrays_count);
const o_x = o_buffer.subarray(0, arrays_count);

const a_y = a_buffer.subarray(arrays_count, arrays_count+arrays_count);
const b_y = b_buffer.subarray(arrays_count, arrays_count+arrays_count);
const o_y = o_buffer.subarray(arrays_count, arrays_count+arrays_count);

const a_z = a_buffer.subarray(arrays_count+arrays_count, arrays_count+arrays_count+arrays_count);
const b_z = b_buffer.subarray(arrays_count+arrays_count, arrays_count+arrays_count+arrays_count);
const o_z = o_buffer.subarray(arrays_count+arrays_count, arrays_count+arrays_count+arrays_count);

const a_w = a_buffer.subarray(arrays_count+arrays_count+arrays_count, arrays_count+arrays_count+arrays_count+arrays_count);
const b_w = b_buffer.subarray(arrays_count+arrays_count+arrays_count, arrays_count+arrays_count+arrays_count+arrays_count);
const o_w = o_buffer.subarray(arrays_count+arrays_count+arrays_count, arrays_count+arrays_count+arrays_count+arrays_count);

const a_arrays = [a_x, a_y, a_z, a_w];
const b_arrays = [b_x, b_y, b_z, b_w];
const o_arrays = [o_x, o_y, o_z, o_w];


const as = Array(arrays_count);
const bs = Array(arrays_count);
const os = Array(arrays_count);

let start = 0;
let end = 4;
for (i = 0; i < arrays_count; i++) {
    as[i] = a_buffer.subarray(start, end);
    bs[i] = b_buffer.subarray(start, end);
    os[i] = o_buffer.subarray(start, end);
    start = end;
    end += 4;
}

/*const as_arrays = Array(arrays_count);
const bs_arrays = Array(arrays_count);
const os_arrays = Array(arrays_count);

const a_xs = Array(arrays_count);
const b_xs = Array(arrays_count);
const o_xs = Array(arrays_count);

const a_ys = Array(arrays_count);
const b_ys = Array(arrays_count);
const o_ys = Array(arrays_count);

const a_zs = Array(arrays_count);
const b_zs = Array(arrays_count);
const o_zs = Array(arrays_count);

const a_ws = Array(arrays_count);
const b_ws = Array(arrays_count);
const o_ws = Array(arrays_count);

let start = 0;
let end = 4;
for (i = 0; i < arrays_count; i++) {
    a_xs[i] = a_buffer.subarray(start, end);
    b_xs[i] = b_buffer.subarray(start, end);
    o_xs[i] = o_buffer.subarray(start, end);
    start = end;
    end += 4;
    a_ys[i] = a_buffer.subarray(start, end);
    b_ys[i] = b_buffer.subarray(start, end);
    o_ys[i] = o_buffer.subarray(start, end);
    start = end;
    end += 4;
    a_zs[i] = a_buffer.subarray(start, end);
    b_zs[i] = b_buffer.subarray(start, end);
    o_zs[i] = o_buffer.subarray(start, end);
    start = end;
    end += 4;
    a_ws[i] = a_buffer.subarray(start, end);
    b_ws[i] = b_buffer.subarray(start, end);
    o_ws[i] = o_buffer.subarray(start, end);
    start = end;
    end += 4;

    as_arrays[i] = [a_xs[i], a_ys[i], a_zs[i], a_ws[i]];
    bs_arrays[i] = [b_xs[i], b_ys[i], b_zs[i], b_ws[i]];
    os_arrays[i] = [o_xs[i], o_ys[i], o_zs[i], o_ws[i]];
}*/

//
// const a: {id: number, array: [Float32Array, Float32Array, Float32Array, Float32Array]} = {id: 1, array: a_arrays};
// const b: {id: number, array: [Float32Array, Float32Array, Float32Array, Float32Array]} = {id: 2, array: b_arrays};
// const o: {id: number, array: [Float32Array, Float32Array, Float32Array, Float32Array]} = {id: 3, array: o_arrays};

//
// now = performance.now();
// for (i = 0; i < num_calls; i++) vec4_addition_passed_as_objects(a, b, o);
// console.log(`vec4_addition_passed_as_objects: ${performance.now() - now}`);
//

    now = performance.now();
    for (i = 0; i < arrays_count; i++) vec4_addition_passed_as_array_of_arrays(
        i, a_arrays,
        i, b_arrays,
        i, o_arrays
    );
    console.log(`vec4_addition_passed_as_array_of_arrays: ${performance.now() - now}`);


    now = performance.now();
    for (i = 0; i < arrays_count; i++) vec4_addition_passed_as_arrays(
        i, a_x, a_y, a_z, a_w,
        i, b_x, b_y, b_z, b_w,
        i, o_x, o_y, o_z, o_w,
    );
    console.log(`vec4_addition_passed_as_arrays: ${performance.now() - now}`);


    now = performance.now();
    for (i = 0; i < arrays_count; i++) vec4_addition_passed_as_AoS_arrays(
        as[i],
        bs[i],
        os[i]
    );
    console.log(`vec4_addition_passed_as_AoS_arrays: ${performance.now() - now}`);

//
// now = performance.now();
// for (i = 0; i < num_calls; i++) vec4_addition_passed_as_objects(a, b, o);
// console.log(`vec4_addition_passed_as_objects: ${performance.now() - now}`);
//

    now = performance.now();
    for (i = 0; i < arrays_count; i++) vec4_addition_passed_as_array_of_arrays(
        i, a_arrays,
        i, b_arrays,
        i, o_arrays
    );
    console.log(`vec4_addition_passed_as_array_of_arrays: ${performance.now() - now}`);


    now = performance.now();
    for (i = 0; i < arrays_count; i++) vec4_addition_passed_as_arrays(
        i, a_x, a_y, a_z, a_w,
        i, b_x, b_y, b_z, b_w,
        i, o_x, o_y, o_z, o_w,
    );
    console.log(`vec4_addition_passed_as_arrays: ${performance.now() - now}`);


    now = performance.now();
    for (i = 0; i < arrays_count; i++) vec4_addition_passed_as_AoS_arrays(
        as[i],
        bs[i],
        os[i]
    );
    console.log(`vec4_addition_passed_as_AoS_arrays: ${performance.now() - now}`);

//
// now = performance.now();
// for (i = 0; i < num_calls; i++) vec4_addition_passed_as_objects(a, b, o);
// console.log(`vec4_addition_passed_as_objects: ${performance.now() - now}`);
//
    now = performance.now();
    for (i = 0; i < arrays_count; i++) vec4_addition_passed_as_array_of_arrays(
        i, a_arrays,
        i, b_arrays,
        i, o_arrays
    );
    console.log(`vec4_addition_passed_as_array_of_arrays: ${performance.now() - now}`);


    now = performance.now();
    for (i = 0; i < arrays_count; i++) vec4_addition_passed_as_arrays(
        i, a_x, a_y, a_z, a_w,
        i, b_x, b_y, b_z, b_w,
        i, o_x, o_y, o_z, o_w,
    );
    console.log(`vec4_addition_passed_as_arrays: ${performance.now() - now}`);


    now = performance.now();
    for (i = 0; i < arrays_count; i++) vec4_addition_passed_as_AoS_arrays(
        as[i],
        bs[i],
        os[i]
    );
    console.log(`vec4_addition_passed_as_AoS_arrays: ${performance.now() - now}`);

//
// now = performance.now();
// for (i = 0; i < num_calls; i++) vec4_addition_passed_as_objects(a, b, o);
// console.log(`vec4_addition_passed_as_objects: ${performance.now() - now}`);
//