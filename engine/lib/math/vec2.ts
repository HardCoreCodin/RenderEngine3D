const sqrt = Math.sqrt;
const PRECISION_DIGITS = 3;
let t_x,
    t_y,
    t_n: number;

export const set_the_components_of_a_2D_vector = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    x: number,
    y: number,
): void => {
    Xa[a] = x;
    Ya[a] = y;
};

export const set_all_components_of_a_2D_vector_to_a_number = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    value: number
): void => {
    Xa[a] = Ya[a] = value;
};

export const set_a_2D_vector_from_another_2D_vector = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array
): void => {
    Xa[a] = Xo[o];
    Ya[a] = Yo[o];
};

export const check_if_two_2D_vectrs_are_equal = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array
) : boolean =>
    Xa[a].toFixed(PRECISION_DIGITS) ===
    Xb[b].toFixed(PRECISION_DIGITS) &&

    Ya[a].toFixed(PRECISION_DIGITS) ===
    Yb[b].toFixed(PRECISION_DIGITS);

export const negate_a_2D_direction_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array
): void => {
    Xo[o] = -Xa[a];
    Yo[o] = -Ya[a];
};

export const negate_a_2D_direction_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array
): void => {
    Xa[a] = -Xa[a];
    Ya[a] = -Ya[a];
};

export const compute_the_length_of_a_2D_direction = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array
) : number => sqrt(
    Xa[a] ** 2 +
      Ya[a] ** 2
);

export const compute_the_distance_from_a_2D_position_to_another_2D_position = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,
) : number => sqrt(
    (Xb[b] - Xa[a]) ** 2 +
      (Yb[b] - Ya[a]) ** 2
);

export const square_the_length_of_a_2D_direction = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array
) : number => Xa[a] ** 2 + Ya[a] ** 2;

export const square_the_distance_from_a_2D_positions_to_another_2D_position = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array
) : number => (
    (Xb[b] - Xa[a]) ** 2 +
    (Yb[b] - Ya[a]) ** 2
);

export const linearly_interpolate_from_a_2D_vectors_to_another_2D_vector_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,

    t: number,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array,
) : void => {
    Xo[o] = (1-t)*Xa[a] + t*(Xb[b]);
    Yo[o] = (1-t)*Ya[a] + t*(Yb[b]);
};

export const add_a_2D_vector_to_another_2D_vector_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array,
) : void => {
    Xo[o] = Xa[a] + Xb[b];
    Yo[o] = Ya[a] + Yb[b];
};

export const add_a_2D_vector_to_another_2D_vector_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array
) : void => {
    Xa[a] += Xb[b];
    Ya[a] += Yb[b];
};

export const add_a_number_to_a_2D_vector_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array
) : void => {
    Xo[o] = Xa[a] + b;
    Yo[o] = Ya[a] + b;
};

export const add_a_number_to_a_2D_vector_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number
) : void => {
    Xa[a] += b;
    Ya[a] += b;
};

export const subtract_a_2D_vector_from_another_2D_vector_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array
) : void => {
    Xo[o] = Xa[a] - Xb[b];
    Yo[o] = Ya[a] - Yb[b];
};

export const subtract_a_2D_vector_from_another_2D_vector_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array
) : void => {
    Xa[a] -= Xb[b];
    Ya[a] -= Yb[b];
};

export const subtract_a_number_from_a_2D_vector_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array
) : void => {
    Xo[o] = Xa[a] - b;
    Yo[o] = Ya[a] - b;
};

export const subtract_a_number_from_a_2D_vector_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number
) : void => {
    Xa[a] -= b;
    Ya[a] -= b;
};

export const multiply_a_2D_vector_by_another_2D_vector_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array
) : void => {
    Xo[o] = Xa[a] * Xb[b];
    Yo[o] = Ya[a] * Yb[b];
};

export const multiply_a_2D_vector_by_another_2D_vector_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array
) : void => {
    Xa[a] *= Xb[b];
    Ya[a] *= Yb[b];
};

export const divide_a_2D_vector_by_a_number_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array
) : void => {
    Xo[o] = Xa[a] / b;
    Yo[o] = Ya[a] / b;
};

export const divide_a_2D_vector_by_a_number_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number
) : void => {
    Xa[a] /= b;
    Ya[a] /= b;
};

export const multiply_a_2D_vector_by_a_number_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array
) : void => {
    Xo[o] = Xa[a] * b;
    Yo[o] = Ya[a] * b;
};

export const multiply_a_2D_vector_by_a_number_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number
) : void => {
    Xa[a] *= b;
    Ya[a] *= b;
};

export const normalize_a_2D_direction_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array
) : void => {
    t_n = Xa[a]**2 + Ya[a]**2;
    if (t_n === 1)
        return;

    t_n = 1 / sqrt(t_n);

    Xo[o] = Xa[a] * t_n;
    Yo[o] = Ya[a] * t_n;
};

export const normalize_a_2D_direction_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array
) : void => {
    t_n = Xa[a]**2 + Ya[a]**2;
    if (t_n === 1)
        return;

    t_n = 1 / sqrt(t_n);

    Xa[a] *= t_n;
    Ya[a] *= t_n;
};

export const normalize_all_2D_directions_in_place = (
    X: Float32Array,
    Y: Float32Array
) : void => {
    for (let i = 0; i < X.length; i++) {
        t_n = X[i]**2 + Y[i]**2;
        if (t_n === 1)
            continue;

        t_n = 1 / sqrt(t_n);

        X[i] *= t_n;
        Y[i] *= t_n;
    }
};

export const normalize_some_2D_directions_in_place = (
    X: Float32Array,
    Y: Float32Array,

    include: Uint8Array
) : void => {
    for (let i = 0; i < X.length; i++) if (include[i]) {
        t_n = X[i]**2 + Y[i]**2;
        if (t_n === 1)
            continue;

        t_n = 1 / sqrt(t_n);

        X[i] *= t_n;
        Y[i] *= t_n;
    }
};

export const dot_a_2D_direction_with_another_2D_direction = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array
) : number =>
    Xa[a] * Xb[b] +
    Ya[a] * Yb[b];

export const reflect_a_2D_vector_around_a_2D_direction_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array
): void => {
    t_n = Xa[a] * Xb[b] + Ya[a] * Yb[b];
    t_n += t_n;

    Xo[o] = Xb[b] * t_n - Xa[a];
    Yo[o] = Yb[b] * t_n - Ya[a];
};

export const reflect_a_2D_vector_around_a_2D_direction_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    b: number,
    Xb: Float32Array,
    Yb: Float32Array
): void => {
    t_n = Xa[a] * Xb[b] + Ya[a] * Yb[b];
    t_n += t_n;

    Xa[a] = Xb[b] * t_n - Xa[a];
    Ya[a] = Yb[b] * t_n - Ya[a];
};

export const multiply_a_2D_vector_by_a_2x2_matrix_to_out = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    m: number,
    M11: Float32Array, M12: Float32Array,
    M21: Float32Array, M22: Float32Array,

    o: number,
    Xo: Float32Array,
    Yo: Float32Array
): void => {
    Xo[o] = Xa[a]*M11[m] + Ya[a]*M21[m];
    Yo[o] = Xa[a]*M12[m] + Ya[a]*M22[m];
};

export const multiply_a_2D_vector_by_a_2x2_matrix_in_place = (
    a: number,
    Xa: Float32Array,
    Ya: Float32Array,

    m: number,
    M11: Float32Array, M12: Float32Array,
    M21: Float32Array, M22: Float32Array
): void => {
    t_x = Xa[a];
    t_y = Ya[a];

    Xa[a] = t_x*M11[m] + t_y*M21[m];
    Ya[a] = t_x*M12[m] + t_y*M22[m];
};