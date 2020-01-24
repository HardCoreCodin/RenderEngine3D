import Buffer from "../../memory/buffers.js";
import {Int32Allocator1D, RENDER_TARGET_ALLOCATOR} from "../../memory/allocators.js";
import {ISize} from "../../_interfaces/render.js";


export default class RenderTarget extends Buffer<Uint32Array>
{
    constructor(protected readonly _size: ISize) {super()}
    protected _getAllocator(): Int32Allocator1D {return RENDER_TARGET_ALLOCATOR}

    get width(): number {return this._size.width}
    get height(): number {return this._size.height}

    putPixel(
        x: number,
        y: number,

        r: number,
        g: number,
        b: number,
        a: number
    ) {
        this.arrays[0][y * this._size.width + x] =
            ((a * 255) << 24) |    // alpha
            ((b * 255) << 16) |    // blue
            ((g * 255) <<  8) |    // green
            ( r * 255);            // red
    }
}