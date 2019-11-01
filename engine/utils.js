export const zip = (a, b) => {
    const result = Array(a.length);
    for (const [i, v] of a.entries())
        result[i] = [v, b[i]];
    return result;
};
//# sourceMappingURL=utils.js.map