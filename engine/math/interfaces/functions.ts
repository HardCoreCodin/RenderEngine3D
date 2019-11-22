export interface IBaseFunctions {
    get(a: number, i: number): number;
    set(a: number, i: number, value: number): void;

    set_to(a: number, ...values: number[]): void;
    set_all_to(a: number, value: number): void;
    set_from(a: number, o: number): void;

    equals(a: number, b: number): boolean;
}

export interface IArithmaticFunctions extends IBaseFunctions {
    add(a: number, b: number, o: number): void;
    add_in_place(a: number, b: number): void;

    subtract(a: number, b: number, o: number): void;
    subtract_in_place(a: number, b: number): void;

    divide(a: number, o: number, n: number): void;
    divide_in_place(a: number, n: number): void;

    scale(a: number, o: number, n: number): void;
    scale_in_place(a: number, n: number): void;

    invert(a: number, b: number): void;
    invert_in_place(a: number): void
}

export interface IMultiplyFunctions extends IArithmaticFunctions {
    multiply(a: number, b: number, o: number): void;
    multiply_in_place(a: number, b: number): void;
}

export interface IInterpolateFunctions extends IArithmaticFunctions {
    lerp(a: number, b: number, o: number, t: number): void;
}

export interface IVectorFunctions extends IMultiplyFunctions, IInterpolateFunctions {}

export interface IPositionFunctions extends IVectorFunctions {
    distance(a: number, o: number);
    distance_squared(a: number, o: number);
}

export interface IDirectionFunctions extends IVectorFunctions {
    length(a: number): number;
    length_squared(a: number): number;

    normalize(a: number, o: number): void;
    normalize_in_place(a: number): void;

    dot(a: number, b: number): number;
}

export interface ICrossFunctions extends IDirectionFunctions {
    cross(a: number, b: number, o: number): void;
    cross_in_place(a: number, b: number): void;
}

export interface IMatrixFunctions extends IMultiplyFunctions {
    is_identity(a: number): boolean;
    set_to_identity(a: number): void;

    transpose(a: number, o: number): void;
    transpose_in_place(a: number): void;
}

export interface IMatrixRotationFunctions extends IMatrixFunctions {
    set_rotation_around_x(a: number, cos: number, sin: number): void;
    set_rotation_around_y(a: number, cos: number, sin: number): void;
    set_rotation_around_z(a: number, cos: number, sin: number): void;
}