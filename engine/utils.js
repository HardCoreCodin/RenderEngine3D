export const zip = (a, b) => {
    const result = Array(a.length);
    for (const [i, v] of a.entries())
        result[i] = [v, b[i]];
    return result;
};
export function* iterTypedArray(array, size = array.length, offset = 0) {
    for (let i = 0; i < size; i++)
        yield array[i + offset];
}
const memcpy = (from_array, to_array, amount, from_offset = 0, to_offset = 0) => new Uint8Array(to_array.buffer, to_offset, amount).set(new Uint8Array(from_array.buffer, from_offset, amount));
//# sourceMappingURL=utils.js.map