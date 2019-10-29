export const zip = (a: any[], b: any[]) : [any, any][] => {
    const result = Array(a.length);
    for (const [i, v] of a.entries())
        result[i] = [v, b[i]];
    return result;
};