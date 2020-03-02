export const check_if_two_4D_vectros_are_equal = (
    a: Float32Array,
    b: Float32Array
) : boolean =>
    a[0].toFixed(3) === b[0].toFixed(3) &&
    a[1].toFixed(3) === b[1].toFixed(3) &&
    a[2].toFixed(3) === b[2].toFixed(3) &&
    a[3].toFixed(3) === b[3].toFixed(3);

export const negate_a_4D_direction_to_out = (
    a: Float32Array,
    o: Float32Array
): void => {
    o[0] = -a[0];
    o[1] = -a[1];
    o[2] = -a[2];
    o[3] = -a[3];
};

export const negate_a_4D_direction_in_place = (
    a: Float32Array
): void => {
    a[0] = -a[0];
    a[1] = -a[1];
    a[2] = -a[2];
    a[3] = -a[3];
};

export const compute_the_length_of_a_4D_direction = (
    a: Float32Array
) : number => Math.sqrt((
    a[0] ** 2 +
    a[1] ** 2 +
    a[2] ** 2 +
    a[3] ** 2
));

export const compute_the_distance_from_a_4D_position_to_another_4D_position = (
    a: Float32Array,

    b: Float32Array
) : number => Math.sqrt((
    (b[0] - a[0]) ** 2 +
    (b[1] - a[1]) ** 2 +
    (b[2] - a[2]) ** 2 +
    (b[3] - a[3]) ** 2
));

export const square_the_length_of_a_4D_direction = (
    a: Float32Array
) : number =>
    a[0] ** 2 +
    a[1] ** 2 +
    a[2] ** 2 +
    a[3] ** 2;

export const square_the_distance_from_a_4D_positions_to_another_4D_position = (
    a: Float32Array,
    b: Float32Array
) : number => (
    (b[0] - a[0]) ** 2 +
    (b[1] - a[1]) ** 2 +
    (b[2] - a[2]) ** 2 +
    (b[3] - a[3]) ** 2
);

export const linearly_interpolate_from_a_4D_vector_to_another_4D_vector_to_out = (
    a: Float32Array,
    b: Float32Array,
    t: number,
    o: Float32Array,
) : void => {
    o[0] = (1-t)*a[0] + t*(b[0]);
    o[1] = (1-t)*a[1] + t*(b[1]);
    o[2] = (1-t)*a[2] + t*(b[2]);
    o[3] = (1-t)*a[3] + t*(b[3]);
};

export const add_a_4D_vector_to_another_4D_vector_to_out = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array
) : void => {
    o[0] = a[0] + b[0];
    o[1] = a[1] + b[1];
    o[2] = a[2] + b[2];
    o[3] = a[3] + b[3];
};

export const add_a_4D_vector_to_another_4D_vector_in_place = (
    a: Float32Array,
    b: Float32Array
) : void => {
    a[0] += b[0];
    a[1] += b[1];
    a[2] += b[2];
    a[3] += b[3];
};

export const add_a_number_to_a_4D_vector_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array
) : void => {
    o[0] = a[0] + b;
    o[1] = a[1] + b;
    o[2] = a[2] + b;
    o[3] = a[3] + b;
};

export const add_a_number_to_a_4D_vector_in_place = (
    a: Float32Array,
    b: number
) : void => {
    a[0] += b;
    a[1] += b;
    a[2] += b;
    a[3] += b;
};

export const subtract_a_4D_vector_from_another_4D_vector_to_out = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array
) : void => {
    o[0] = a[0] - b[0];
    o[1] = a[1] - b[1];
    o[2] = a[2] - b[2];
    o[3] = a[3] - b[3];
};

export const subtract_a_4D_vector_from_another_4D_vector_in_place = (
    a: Float32Array,
    b: Float32Array
) : void => {
    a[0] -= b[0];
    a[1] -= b[1];
    a[2] -= b[2];
    a[3] -= b[3];
};

export const subtract_a_number_from_a_4D_vector_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array
) : void => {
    o[0] = a[0] - b;
    o[1] = a[1] - b;
    o[2] = a[2] - b;
    o[3] = a[3] - b;
};

export const subtract_a_number_from_a_4D_vector_in_place = (
    a: Float32Array,
    b: number
) : void => {
    a[0] -= b;
    a[1] -= b;
    a[2] -= b;
    a[3] -= b;
};

export const multiply_a_4D_vector_by_another_4D_vector_to_out = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array
) : void => {
    o[0] = a[0] * b[0];
    o[1] = a[1] * b[1];
    o[2] = a[2] * b[2];
    o[3] = a[3] * b[3];
};

export const multiply_a_4D_vector_by_another_4D_vector_in_place = (
    a: Float32Array,
    b: Float32Array
) : void => {
    a[0] *= b[0];
    a[1] *= b[1];
    a[2] *= b[2];
    a[3] *= b[3];
};

export const divide_a_4D_vector_by_a_number_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array
) : void => {
    o[0] = a[0] / b;
    o[1] = a[1] / b;
    o[2] = a[2] / b;
    o[3] = a[3] / b;
};

export const divide_a_4D_vector_by_a_number_in_place = (
    a: Float32Array,
    b: number
) : void => {
    a[0] /= b;
    a[1] /= b;
    a[2] /= b;
    a[3] /= b;
};

export const multiply_a_4D_vector_by_a_number_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array
) : void => {
    o[0] = a[0] * b;
    o[1] = a[1] * b;
    o[2] = a[2] * b;
    o[3] = a[3] * b;
};

export const multiply_a_4D_vector_by_a_number_in_place = (
    a: Float32Array,
    b: number
) : void => {
    a[0] *= b;
    a[1] *= b;
    a[2] *= b;
    a[3] *= b;
};

export const normalize_a_4D_direction_to_out = (
    a: Float32Array,
    o: Float32Array
) : void => {
    let n = a[0]**2 + a[1]**2 + a[2]**2 + a[3]**2;
    if (n === 1) {
        o[0] = a[0];
        o[1] = a[1];
        o[2] = a[2];
        o[3] = a[3];
    } else {
        n = 1 / Math.sqrt(n);

        o[0] = a[0] * n;
        o[1] = a[1] * n;
        o[2] = a[2] * n;
        o[3] = a[3] * n;
    }
};

export const normalize_a_4D_direction_in_place = (
    a: Float32Array
) : void => {
    let n = a[0]**2 + a[1]**2 + a[2]**2 + a[3]**2;
    if (n === 1)
        return;

    n = 1 / Math.sqrt(n);

    a[0] *= n;
    a[1] *= n;
    a[2] *= n;
    a[3] *= n;
};

export const normalize_all_4D_directions_in_place = (
    a: Float32Array,
    start: number = 0,
    end: number = a.length
) : void => {
    let j = start + 1;
    let k = start + 2;
    let l = start + 3;
    const sqrt = Math.sqrt;
    let n: number;
    for (let i = start; i < end; i+=4) {
        n = a[i]**2 + a[j]**2 + a[k]**2 + a[l]**2;
        if (n === 1)
            continue;

        n = 1 / sqrt(n);

        a[i] *= n;
        a[j] *= n;
        a[k] *= n;
        a[l] *= n;
        
        j += 4;
        k += 4;
        l += 4;
    }
};

export const normalize_some_4D_directions_in_place = (
    a: Float32Array,
    include: Uint8Array[],
    start: number = 0,
    end: number = a.length
) : void => {
    let id = start;
    let j = start + 1;
    let k = start + 2;
    let l = start + 3;
    let n: number;
    const sqrt = Math.sqrt;
    for (let i = start; i < end; i+=4) if (include[id]) {
        n = a[i]**2 + a[j]**2 + a[k]**2 + a[l]**2;
        if (n === 1)
            continue;

        n = 1 / sqrt(n);

        a[i] *= n;
        a[j] *= n;
        a[k] *= n;
        a[l] *= n;
        id++;
        j += 4;
        k += 4;
        l += 4;
    }
};

export const dot_a_4D_direction_with_another_4D_direction = (
    a: Float32Array,
    b: Float32Array
) : number =>
    a[0] * b[0] +
    a[1] * b[1] +
    a[2] * b[2] +
    a[3] * b[3];

export const reflect_a_4D_vector_around_a_4D_direction_to_out = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array
): void => {
    const n = (
        a[0] * b[0] +
        a[1] * b[1] +
        a[2] * b[2] +
        a[3] * b[3]
    );

    o[0] = b[0] * n - a[0];
    o[1] = b[1] * n - a[1];
    o[2] = b[2] * n - a[2];
    o[3] = b[3] * n - a[3];
};

export const reflect_a_4D_vector_around_a_4D_direction_in_place = (
    a: Float32Array,
    b: Float32Array
): void => {
    const n = (
        a[0] * b[0] +
        a[1] * b[1] +
        a[2] * b[2] +
        a[3] * b[3]
    ) * 2;

    a[0] = b[0] * n - a[0];
    a[1] = b[1] * n - a[1];
    a[2] = b[2] * n - a[2];
    a[3] = b[3] * n - a[3];
};

export const multiply_a_4D_vector_by_a_4x4_matrix_in_place = (
    a: Float32Array,
    m: Float32Array
) : void => {
    const x = a[0];
    const y = a[1];
    const z = a[2];
    const w = a[3];

    a[0] = x*m[0] + y*m[4] + z*m[8] + w*m[12];
    a[1] = x*m[1] + y*m[5] + z*m[9] + w*m[13];
    a[2] = x*m[2] + y*m[6] + z*m[10] + w*m[14];
    a[3] = x*m[3] + y*m[7] + z*m[11] + w*m[15];
};

export const multiply_a_4D_vector_by_a_4x4_matrix_to_out = (
    a: Float32Array,
    m: Float32Array,
    o: Float32Array
) : void => {
    o[0] = a[0]*m[0] + a[1]*m[4] + a[2]*m[8] + a[3]*m[12];
    o[1] = a[0]*m[1] + a[1]*m[5] + a[2]*m[9] + a[3]*m[13];
    o[2] = a[0]*m[2] + a[1]*m[6] + a[2]*m[10] + a[3]*m[14];
    o[3] = a[0]*m[3] + a[1]*m[7] + a[2]*m[11] + a[3]*m[15];
};

export const multiply_all_4D_vectors_by_a_4x4_matrix_to_out = (
    a: Float32Array,
    m: Float32Array,
    o: Float32Array,
    start: number = 0,
    end: number = a.length
) : void => {
    let j = start + 1;
    let k = start + 2;
    let l = start + 3;
    for (let i = start; i < end; i+=4) {
        o[i] = a[i]*m[0] + a[j]*m[4] + a[k]*m[8] + a[l]*m[12];
        o[j] = a[i]*m[1] + a[j]*m[5] + a[k]*m[9] + a[l]*m[13];
        o[k] = a[i]*m[2] + a[j]*m[6] + a[k]*m[10] + a[l]*m[14];
        o[l] = a[i]*m[3] + a[j]*m[7] + a[k]*m[11] + a[l]*m[15];
        
        j += 4;
        k += 4;
        l += 4;
    }
};

export const multiply_some_4D_vectors_by_a_4x4_matrix_to_out = (
    a: Float32Array,
    m: Float32Array,
    include: Uint8Array[],
    o: Float32Array,
    start: number = 0,
    end: number = a.length
) : void => {
    let id = start;
    let j = start + 1;
    let k = start + 2;
    let l = start + 3;
    for (let i = start; i < end; i+=4) if (include[id]){
        o[i] = a[i]*m[0] + a[j]*m[4] + a[k]*m[8] + a[l]*m[12];
        o[j] = a[i]*m[1] + a[j]*m[5] + a[k]*m[9] + a[l]*m[13];
        o[k] = a[i]*m[2] + a[j]*m[6] + a[k]*m[10] + a[l]*m[14];
        o[l] = a[i]*m[3] + a[j]*m[7] + a[k]*m[11] + a[l]*m[15];
        id++;
        j += 4;
        k += 4;
        l += 4;
    }
};

export const multiply_all_4D_vectors_by_a_4x4_matrix_in_place = (
    a: Float32Array,
    m: Float32Array,
    start: number = 0,
    end: number = a.length
) : void => {
    let j = start + 1;
    let k = start + 2;
    let l = start + 3;
    let x, y, z, w: number;
    for (let i = start; i < end; i+=4) {
        x = a[i];
        y = a[j];
        z = a[k];
        w = a[l];

        a[i] = x*m[0] + y*m[4] + z*m[8] + w*m[12];
        a[j] = x*m[1] + y*m[5] + z*m[9] + w*m[13];
        a[k] = x*m[2] + y*m[6] + z*m[10] + w*m[14];
        a[l] = x*m[3] + y*m[7] + z*m[11] + w*m[15];
        
        j += 4;
        k += 4;
        l += 4;
    }
};

export const multiply_some_4D_vectors_by_a_4x4_matrix_in_place = (
    a: Float32Array,
    m: Float32Array,
    include: Uint8Array[],
    start: number = 0,
    end: number = a.length
) : void => {
    let id = start;
    let j = start + 1;
    let k = start + 2;
    let l = start + 3;

    let x, y, z, w: number;
    for (let i = start; i < end; i+=4) if (include[id]) {
        x = a[i];
        y = a[j];
        z = a[k];
        w = a[l];

        a[i] = x*m[0] + y*m[4] + z*m[8] + w*m[12];
        a[j] = x*m[1] + y*m[5] + z*m[9] + w*m[13];
        a[k] = x*m[2] + y*m[6] + z*m[10] + w*m[14];
        a[l] = x*m[3] + y*m[7] + z*m[11] + w*m[15];
        id++;
        j += 4;
        k += 4;
        l += 4;
    }
};