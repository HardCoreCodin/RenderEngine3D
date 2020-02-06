let lexical_a, lexical_i: number;

const test_lexical = (to: number) => {
    lexical_a = to;
    for (lexical_i = 0; lexical_i < to; lexical_i++) {
        lexical_a = lexical_a - 1;
    }
};

const test_internal = (to: number) => {
    let internal_a = to;
    for (let internal_i = 0; internal_i < to; internal_i++) {
        internal_a = internal_a - 1;
    }
};

const num_calls = 10000;
const num_iterations = 10000;

let i, now: number;

now = performance.now();
for (i = 0; i < num_calls; i++)
    test_lexical(num_iterations);

console.log(`lexical: ${performance.now() - now}`);


now = performance.now();
for (i = 0; i < num_calls; i++)
    test_internal(num_iterations);

console.log(`internal: ${performance.now() - now}`);

