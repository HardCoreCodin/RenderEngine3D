export class Color {
    constructor(
        public r: number = 0,
        public g: number = 0,
        public b: number = 0
    ) {}

    setGreyscale(color: number) {
        this.r = this.g = this.b = color;
    }

    toString = () => `rgb(${
        this.r * 255
    }, ${
        this.g * 255
    }, ${
        this.b * 255
    })`;
}
//
// export class rgba extends rgb {
//     constructor(
//         r: number = 0,
//         g: number = 0,
//         b: number = 0,
//         public a: number = 1
//     ) {
//         super(r, g, b);
//     }
//
//     toString = () => `rgba(${
//         this.r * 255
//     }, ${
//         this.g * 255
//     }, ${
//         this.b * 255
//     }, ${
//         this.a * 255
//     })`;
// }

// export type Color = rgb | rgba;
export const col = (
    r: number = 0,
    g: number = 0,
    b: number = 0
) : Color => new Color(r, g, b);