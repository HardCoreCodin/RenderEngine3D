import {TypedArray} from "./types.js";
import {IS_BIG_ENDIAN, PIE, TWO_PIE} from "./constants.js";

export const non_zero = _ => _ !== 0;

export const approach = (src: number, trg: number, diff: number): number => {
    let out: number;

    out = src + diff; if (trg > out) return out;
    out = src - diff; if (trg < out) return out;

    return trg;
};

export const clamped = (value: number): number => {
    const mn = value < 1.0 ? value : 1.0;
    return mn > 0.0 ? mn : 0.0;
};
export const toneMap = (LinearColor: number): number => {
        // x = max(0, LinearColor-0.004)
        // GammaColor = (x*(6.2*x + 0.5))/(x*(6.2*x+1.7) + 0.06)
        // GammaColor = (x*x*6.2 + x*0.5)/(x*x*6.2 + x*1.7 + 0.06)

        let x: number = LinearColor - 0.004;
        if (x < 0.0) x = 0.0;
        let x2_times_sholder_strength: number = x * x * 6.2;
        return (x2_times_sholder_strength + x*0.5)/(x2_times_sholder_strength + x*1.7 + 0.06);
};

const memcpy = (
    from_array: TypedArray,
    to_array: TypedArray,

    amount?: number,

    from_offset: number = 0,
    to_offset: number = 0
): void =>
    new Uint8Array(to_array.buffer, to_offset, amount).set(
    new Uint8Array(from_array.buffer, from_offset, amount)
);

let modded: number;
export const wrapAngle = (theta: number): number => {
    modded = theta % TWO_PIE;
    return modded > PIE ?
        modded - TWO_PIE :
        modded < -PIE ?
            modded + TWO_PIE :
            modded;
};

export function* zip<A, B, C>(
    a: Iterable<A>,
    b: Iterable<B>,
    c?: Iterable<C>
): Generator<[A, B, C, number] | [A, B, number]> {
    const a_iterator = a[Symbol.iterator]();
    const b_iterator = b[Symbol.iterator]();
    let c_iterator = c ? c[Symbol.iterator]() : null;

    let result: [A, B, number] | [A, B, C, number];
    if (c)
        result = [null, null, null, 0];
    else
        result = [null, null, 0];

    let i = 0;
    while (true) {
        let a_result = a_iterator.next();
        let b_result = b_iterator.next();

        if (c) {
            let c_result = c_iterator.next();
            if (a_result.done || b_result.done || c_result.done)
                return;

            result[0] = a_result.value;
            result[1] = b_result.value;
            result[2] = c_result.value;
            result[3] = i;
        } else {
            if (a_result.done || b_result.done)
                return;

            result[0] = a_result.value;
            result[1] = b_result.value;
            result[2] = i;
        }

        yield result;

        i++;
    }
}

export const hash = s => s.split('').reduce((a,b) => (((a << 5) - a) + b.charCodeAt(0))|0, 0)

export const drawPixel = IS_BIG_ENDIAN ? (
    pixels: Uint32Array,
    index: number,

    r: number,
    g: number,
    b: number,
    a: number
): void => {
    pixels[index] = (
        // red
        (r * 255) << 24
    ) | (
        // green
        (g * 255) << 16
    ) | (
        // blue
        (b * 255) << 8
    ) | (
        // alpha
        (a * 255)
    );
} : (
    pixels: Uint32Array,
    index: number,
    r: number,
    g: number,
    b: number,
    a: number
): void => {
    pixels[index] = (
        // alpha
        (a * 255) << 24
    ) | (
        // blue
        (b * 255) << 16
    ) | (
        // green
        (g * 255) << 8
    ) | (
        // red
        (r * 255)
    );
};