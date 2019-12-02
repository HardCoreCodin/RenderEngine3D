const memcpy = (from_array, to_array, amount, from_offset = 0, to_offset = 0) => new Uint8Array(to_array.buffer, to_offset, amount).set(new Uint8Array(from_array.buffer, from_offset, amount));
export function* zip(a, b, c) {
    const a_iterator = a[Symbol.iterator]();
    const b_iterator = b[Symbol.iterator]();
    const c_iterator = c[Symbol.iterator]();
    let result;
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
        }
        else {
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
//# sourceMappingURL=utils.js.map