import {Buffer} from "../memory/buffers.js";
import {Int32Allocator1D, RENDER_TARGET_ALLOCATOR} from "../memory/allocators.js";
import {IRectangle} from "../_interfaces/render.js";


export default class RenderTarget extends Buffer<Uint32Array>
{
    constructor(public size: IRectangle) {super()}
    protected _getAllocator(): Int32Allocator1D {return RENDER_TARGET_ALLOCATOR}
    private pixels: Uint32Array;

    get length() {return this.size.width * this.size.height * 4}

    reset(image?: ImageData) {
        if (image)
            this.pixels = new Uint32Array(image.data.buffer);
        else {
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