import {DIM} from "../../constants.js";
import {Buffer} from "../memory/buffers.js";
import {RENDER_TARGET_ALLOCATOR} from "../memory/allocators.js";
import {IRectangle} from "../_interfaces/render.js";


export default class RenderTarget
    extends Buffer<Uint32Array, DIM._1D>
{
    dim = DIM._1D as DIM._1D;

    readonly allocator = RENDER_TARGET_ALLOCATOR;
    private pixels: Uint32Array;

    constructor(
        public size: IRectangle,
        pixels?: Uint32Array
    ) {
        super();
        this.reset(pixels);
    }

    get length() {
        return this.size.width * this.size.height * 4;
    }

    reset(pixels?: Uint32Array) {
        if (pixels) {
            this.pixels = pixels;
        } else {
            this.init(this.length);
            this.pixels = this.arrays[0];
        }
    }

    putPixel(
        x: number,
        y: number,

        r: number,
        g: number,
        b: number,
        a: number
    ) {
        this.pixels[y * this.size.width + x] =
            ((a * 255) << 24) |    // alpha
            ((b * 255) << 16) |    // blue
            ((g * 255) <<  8) |    // green
            ( r * 255);            // red
    }
}