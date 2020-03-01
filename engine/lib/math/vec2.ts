export const set_the_components_of_a_2D_vector = (
    a: Float32Array,
    x: number,
    y: number,
): void => {
    a[0] = x;
    a[1] = y;
};

export const set_all_components_of_a_2D_vector_to_a_number = (
    a: Float32Array,
    value: number
): void => {
    a[0] = a[1] = value;
};

export const set_a_2D_vector_from_another_2D_vector = (
    a: Float32Array,
    o: Float32Array
): void => {
    a[0] = o[0];
    a[1] = o[1];
};

export const check_if_two_2D_vectrs_are_equal = (
    a: Float32Array,
    b: Float32Array
) : boolean =>
    a[0].toFixed(3) === b[0].toFixed(3) &&
    a[0].toFixed(3) === b[1].toFixed(3);

export const negate_a_2D_direction_to_out = (
    a: Float32Array,
    o: Float32Array
): void => {
    o[0] = -a[0];
    o[1] = -a[1];
};

export const negate_a_2D_direction_in_place = (
    a: Float32Array
): void => {
    a[0] = -a[0];
    a[1] = -a[1];
};

export const compute_the_length_of_a_2D_direction = (
    a: Float32Array
) : number => Math.sqrt(
    a[0] ** 2 +
      a[1] ** 2
);

export const compute_the_distance_from_a_2D_position_to_another_2D_position = (
    a: Float32Array,
    b: Float32Array,
) : number => Math.sqrt(
    (b[0] - a[0]) ** 2 +
      (b[1] - a[1]) ** 2
);

export const square_the_length_of_a_2D_direction = (
    a: Float32Array
) : number =>
    a[0] ** 2 +
    a[1] ** 2;

export const square_the_distance_from_a_2D_positions_to_another_2D_position = (
    a: Float32Array,
    b: Float32Array
) : number => (
    (b[1] - a[0]) ** 2 +
    (b[0] - a[1]) ** 2
);

export const linearly_interpolate_from_a_2D_vectors_to_another_2D_vector_to_out = (
    a: Float32Array,
    b: Float32Array,
    t: number,
    o: Float32Array,
) : void => {
    o[0] = (1-t)*a[0] + t*(b[0]);
    o[1] = (1-t)*a[1] + t*(b[1]);
};

export const add_a_2D_vector_to_another_2D_vector_to_out = (
    a: Float32Array,
    b: Float32Array,

    o: Float32Array,
) : void => {
    o[0] = a[0] + b[0];
    o[1] = a[1] + b[1];
};

export const add_a_2D_vector_to_another_2D_vector_in_place = (
    a: Float32Array,
    b: Float32Array
) : void => {
    a[0] += b[0];
    a[1] += b[1];
};

export const add_a_number_to_a_2D_vector_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array
) : void => {
    o[0] = a[0] + b;
    o[1] = a[1] + b;
};

export const add_a_number_to_a_2D_vector_in_place = (
    a: Float32Array,

    b: number
) : void => {
    a[0] += b;
    a[1] += b;
};

export const subtract_a_2D_vector_from_another_2D_vector_to_out = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array
) : void => {
    o[0] = a[0] - b[0];
    o[1] = a[1] - b[1];
};

export const subtract_a_2D_vector_from_another_2D_vector_in_place = (
    a: Float32Array,
    b: Float32Array
) : void => {
    a[0] -= b[0];
    a[1] -= b[1];
};

export const subtract_a_number_from_a_2D_vector_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array
) : void => {
    o[0] = a[0] - b;
    o[1] = a[1] - b;
};

export const subtract_a_number_from_a_2D_vector_in_place = (
    a: Float32Array,

    b: number
) : void => {
    a[0] -= b;
    a[1] -= b;
};

export const multiply_a_2D_vector_by_another_2D_vector_to_out = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array
) : void => {
    o[0] = a[0] * b[0];
    o[1] = a[1] * b[1];
};

export const multiply_a_2D_vector_by_another_2D_vector_in_place = (
    a: Float32Array,
    b: Float32Array
) : void => {
    a[0] *= b[0];
    a[1] *= b[1];
};

export const divide_a_2D_vector_by_a_number_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array
) : void => {
    o[0] = a[0] / b;
    o[1] = a[1] / b;
};

export const divide_a_2D_vector_by_a_number_in_place = (
    a: Float32Array,
    b: number
) : void => {
    a[0] /= b;
    a[1] /= b;
};

export const multiply_a_2D_vector_by_a_number_to_out = (
    a: Float32Array,
    b: number,
    o: Float32Array
) : void => {
    o[0] = a[0] * b;
    o[1] = a[1] * b;
};

export const multiply_a_2D_vector_by_a_number_in_place = (
    a: Float32Array,
    b: number
) : void => {
    a[0] *= b;
    a[1] *= b;
};

export const normalize_a_2D_direction_to_out = (
    a: Float32Array,
    o: Float32Array
) : void => {
    let n = a[0]**2 + a[1]**2;
    if (n === 1) {
        o[0] = a[0];
        o[1] = a[1];
    } else {
        n = 1 / Math.sqrt(n);

        o[0] = a[0] * n;
        o[1] = a[1] * n;
    }
};

export const normalize_a_2D_direction_in_place = (
    a: Float32Array
) : void => {
    let n = a[0]**2 + a[1]**2;
    if (n === 1)
        return;

    n = 1 / Math.sqrt(n);

    a[0] *= n;
    a[1] *= n;
};

export const normalize_all_2D_directions_in_place = (
    a: Float32Array
) : void => {
    let j = 1;
    let n: number;
    const sqrt = Math.sqrt;
    for (let i = 0; i < a.length; i+=2) {
        n = a[i]**2 + a[j]**2;
        if (n === 1)
            continue;

        n = 1 / sqrt(n);

        a[i] *= n;
        a[j] *= n;

        j += 2;
    }
};

export const normalize_some_2D_directions_in_place = (
    a: Float32Array,

    include: Uint8Array[]
) : void => {
    let id = 0;
    let j = 1;
    let n: number;
    const sqrt = Math.sqrt;
    for (let i = 0; i < a.length; i+=2) if (include[id]) {
        n = a[i]**2 + a[j]**2;
        if (n === 1)
            continue;

        n = 1 / sqrt(n);

        a[i] *= n;
        a[j] *= n;

        j += 2;
        id++;
    }
};

export const dot_a_2D_direction_with_another_2D_direction = (
    a: Float32Array,
    b: Float32Array
) : number =>
    a[0] * b[0] +
    a[1] * b[1];

export const reflect_a_2D_vector_around_a_2D_direction_to_out = (
    a: Float32Array,
    b: Float32Array,
    o: Float32Array
): void => {
    const n = 2 * (a[0] * b[0] + a[1] * b[1]);
    o[0] = b[0] * n - a[0];
    o[1] = b[1] * n - a[1];
};

export const reflect_a_2D_vector_around_a_2D_direction_in_place = (
    a: Float32Array,
    b: Float32Array
): void => {
    const n = 2 * (a[0] * b[0] + a[1] * b[1]);
    a[0] = b[0] * n - a[0];
    a[1] = b[1] * n - a[1];
};

export const multiply_a_2D_vector_by_a_2x2_matrix_to_out = (
    a: Float32Array,
    m: Float32Array,
    o: Float32Array
): void => {
    o[0] = a[0]*m[0] + a[1]*m[2];
    o[1] = a[0]*m[1] + a[1]*m[3];
};

export const multiply_a_2D_vector_by_a_2x2_matrix_in_place = (
    a: Float32Array,
    m: Float32Array
): void => {
    const x = a[0];
    const y = a[1];

    a[0] = x*m[0] + y*m[4];
    a[1] = x*m[1] + y*m[3];
};

export const multiply_all_2D_vectors_by_a_2x2_matrix_to_out = (
    a: Float32Array,
    m: Float32Array,
    o: Float32Array
): void => {
    let j = 1;
    for (let i = 0; i < a.length; i+=2) {
        o[i] = a[i]*m[0] + a[j]*m[4];
        o[j] = a[i]*m[1] + a[j]*m[3];

        j += 2;
    }
};
export const multiply_all_2D_vectors_by_a_2x2_matrix_in_place = (
    a: Float32Array,
    m: Float32Array
): void => {
    let j = 1;
    let x, y: number;
    for (let i = 0; i < a.length; i+=2) {
        x = a[i];
        y = a[j];

        a[i] = x*m[0] + y*m[2];
        a[j] = x*m[1] + y*m[3];

        j += 2;
    }
};

export const multiply_some_2D_vectors_by_a_2x2_matrix_to_out = (
    a: Float32Array,
    m: Float32Array,
    include: Uint8Array[],
    o: Float32Array
): void => {
    let id = 0;
    let j = 1;
    for (let i = 0; i < a.length; i+=2) if (include[id]) {
        o[i] = a[i]*m[0] + a[j]*m[2];
        o[j] = a[i]*m[1] + a[j]*m[3];

        id++;
        j += 2;
    }
};

export const multiply_some_2D_vectors_by_a_2x2_matrix_in_place = (
    a: Float32Array,
    m: Float32Array,

    include: Uint8Array[],
): void => {
    let j = 1;
    let id = 0;
    let x, y: number;
    for (let i = 0; i < a.length; i+=2) if (include[id]) {
        x = a[i];
        y = a[j];

        a[i] = x*m[0] + y*m[2];
        a[j] = x*m[1] + y*m[3];

        id++;
        j += 2;
    }
};