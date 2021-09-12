import { MATRIX_4X4_ALLOCATOR } from "../core/memory/allocators.js";
import Buffer from "../core/memory/buffers.js";
import { Colors4D } from "./vectors.js";
const f = 1.0 / 255;
const TL_offset = 0;
const TR_offset = 4;
const BL_offset = 8;
const BR_offset = 12;
export class TextureMip extends Buffer {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
        this.lines = [];
        this.colors = new Colors4D();
        this.init((width + 1) * (height + 1));
        this.colors.init(width * height);
    }
    _getAllocator() { return MATRIX_4X4_ALLOCATOR; }
    load(wrap) {
        const last_y = this.height - 1;
        const last_x = this.width - 1;
        const stride = this.width + 1;
        let start = 0;
        let offset = 0;
        let pixel_offset = 0;
        let component, v_wrap_offset, u_wrap_offset, tl, tr, bl, br;
        let L, R, T, B;
        let TL, TR, BL, BR, wTL, wTR, wBL, wBR, components;
        this.lines.length = 0;
        for (let y = 0; y < this.height; y++) {
            this.lines.push(this.arrays.slice(start, start + stride));
            offset = start;
            T = y === 0;
            B = y === last_y;
            if (wrap) {
                if (T)
                    v_wrap_offset = stride * this.height;
                else if (B)
                    v_wrap_offset = 0;
            }
            for (let x = 0; x < this.width; x++, offset++, v_wrap_offset++) {
                TL = this.arrays[offset];
                TR = this.arrays[offset + 1];
                BL = this.arrays[offset + stride];
                BR = this.arrays[offset + stride + 1];
                components = this.colors.arrays[pixel_offset + x];
                L = x === 0;
                R = x === last_x;
                if (wrap) {
                    if (L)
                        u_wrap_offset = start + this.width;
                    else if (R)
                        u_wrap_offset = start;
                }
                tl = TL_offset;
                tr = TR_offset;
                bl = BL_offset;
                br = BR_offset;
                for (let i = 0; i < 4; i++, tl++, tr++, bl++, br++) {
                    component = components[i];
                    TL[br] = TR[bl] = BL[tr] = BR[tl] = component;
                    if (L)
                        TL[bl] = BL[tl] = component;
                    else if (R)
                        TR[br] = BR[tr] = component;
                    if (wrap) {
                        if (T) {
                            if (L) {
                                wBR = this.arrays[v_wrap_offset + this.width];
                                wBR[br] = component;
                            }
                            else if (R) {
                                wBL = this.arrays[v_wrap_offset];
                                wBL[bl] = component;
                            }
                            else {
                                wTL = this.arrays[v_wrap_offset];
                                wTR = this.arrays[v_wrap_offset + 1];
                                wTL[br] = wTR[bl] = component;
                            }
                        }
                        else if (B) {
                            if (L) {
                                wTR = this.arrays[v_wrap_offset + stride - 1];
                                wTR[tr] = component;
                            }
                            else if (R) {
                                wTL = this.arrays[v_wrap_offset];
                                wTL[tl] = component;
                            }
                            else {
                                wBL = this.arrays[v_wrap_offset];
                                wBR = this.arrays[v_wrap_offset + 1];
                                wBL[tr] = wBR[tl] = component;
                            }
                        }
                        if (L) {
                            wTL = this.arrays[u_wrap_offset];
                            wBL = this.arrays[u_wrap_offset + stride];
                            wTL[bl] = wBL[tl] = component;
                        }
                        else if (R) {
                            wTR = this.arrays[u_wrap_offset];
                            wBR = this.arrays[u_wrap_offset + stride];
                            wTR[br] = wBR[tr] = component;
                        }
                    }
                    else {
                        if (T) {
                            TL[tr] = TR[tl] = component;
                            if (L)
                                TL[tl] = component;
                            else if (R)
                                TR[tr] = component;
                        }
                        else if (B) {
                            BL[br] = BR[bl] = component;
                            if (L)
                                BL[bl] = component;
                            else if (R)
                                BR[br] = component;
                        }
                    }
                }
            }
            start += stride;
            pixel_offset += this.width;
        }
        this.lines.push(this.arrays.slice(this.length - stride, this.length));
        return this;
    }
    sample(UV, color, filter = true) {
        let u = UV.array[0];
        let v = UV.array[1];
        if (u > 1)
            u -= u << 0;
        if (v > 1)
            v -= v << 0;
        const offset = filter ? 0.5 : -0.5;
        const U = u * this.width + offset;
        const x = U << 0;
        const V = v * this.height + offset;
        const y = V << 0;
        if (!filter) {
            color.array.set(this.colors.arrays[this.width * y + x]);
            return;
        }
        const r = U - x;
        const l = 1 - r;
        const b = V - y;
        const t = 1 - b;
        const tl = t * l;
        const tr = t * r;
        const bl = b * l;
        const br = b * r;
        const pixel_quad = this.lines[y][x];
        const TLr = pixel_quad[0] * tl;
        const TLg = pixel_quad[1] * tl;
        const TLb = pixel_quad[2] * tl;
        const TLa = pixel_quad[3] * tl;
        const TRr = pixel_quad[4] * tr;
        const TRg = pixel_quad[5] * tr;
        const TRb = pixel_quad[6] * tr;
        const TRa = pixel_quad[7] * tr;
        const BLr = pixel_quad[8] * bl;
        const BLg = pixel_quad[9] * bl;
        const BLb = pixel_quad[10] * bl;
        const BLa = pixel_quad[11] * bl;
        const BRr = pixel_quad[12] * br;
        const BRg = pixel_quad[13] * br;
        const BRb = pixel_quad[14] * br;
        const BRa = pixel_quad[15] * br;
        color.r = TLr + TRr + BLr + BRr;
        color.g = TLg + TRg + BLg + BRg;
        color.b = TLb + TRb + BLb + BRb;
        color.a = TLa + TRa + BLa + BRa;
    }
}
export class Texture {
    constructor(image, context, wrap = false, mipmap = true, filter = true, width = image.width, height = image.height) {
        this.wrap = wrap;
        this.mipmap = mipmap;
        this.filter = filter;
        this.width = width;
        this.height = height;
        this.mips = [];
        const canvas_width = context.canvas.width;
        const canvas_height = context.canvas.height;
        context.canvas.width = width;
        context.canvas.height = height;
        context.drawImage(image, 0, 0);
        const pixel_components = context.getImageData(0, 0, width, height).data;
        const mip0 = new TextureMip(width, height);
        let color;
        let stride = width * 4;
        let offset;
        let start = 0, pixel_start = 0;
        for (let y = 0; y < height; y++) {
            offset = start;
            for (let x = 0; x < width; x++) {
                color = mip0.colors.arrays[pixel_start + x];
                for (let i = 0; i < 4; i++)
                    color[i] = pixel_components[offset++] * f;
            }
            start += stride;
            pixel_start += width;
        }
        this.mips.push(mip0);
        context.canvas.width = canvas_width;
        context.canvas.height = canvas_height;
    }
    load(wrap = this.wrap, mipmap = this.mipmap) {
        this.wrap = wrap;
        this.mips[0].load(wrap);
        this.mipmap = mipmap;
        if (mipmap) {
            let current_mip = this.mips[0];
            let next_mip;
            let mip_width = this.width;
            let mip_height = this.height;
            let color, colors_quad;
            let stride = this.width * 4;
            let offset;
            let start = 0;
            while (mip_width > 4 && mip_height > 4) {
                start = mip_width + 1;
                stride = start * 2;
                mip_width /= 2;
                mip_width <<= 0;
                mip_height /= 2;
                mip_height <<= 0;
                next_mip = new TextureMip(mip_width, mip_height);
                for (let y = 0; y < mip_height; y++) {
                    offset = start + 1;
                    for (let x = 0; x < mip_width; x++) {
                        colors_quad = current_mip.arrays[offset];
                        color = next_mip.colors.arrays[mip_width * y + x];
                        color[0] = (colors_quad[0] + colors_quad[4] + colors_quad[8] + colors_quad[12]) * 0.25;
                        color[1] = (colors_quad[1] + colors_quad[5] + colors_quad[9] + colors_quad[13]) * 0.25;
                        color[2] = (colors_quad[2] + colors_quad[6] + colors_quad[10] + colors_quad[14]) * 0.25;
                        color[3] = (colors_quad[3] + colors_quad[7] + colors_quad[11] + colors_quad[15]) * 0.25;
                        offset += 2;
                    }
                    start += stride;
                }
                this.mips.push(next_mip.load(this.wrap));
                current_mip = next_mip;
            }
        }
        return this;
    }
    sample(UV, dUV, color, filter = this.filter) {
        let mip_level = 0;
        if (this.mipmap) {
            const pixel_width = dUV.u * this.width;
            const pixel_height = dUV.v * this.height;
            let pixel_size = (pixel_width + pixel_height) * 0.5;
            const mip_count = this.mips.length;
            while (pixel_size > 1 && mip_level < (mip_count - 1)) {
                pixel_size /= 2;
                mip_level += 1;
            }
        }
        this.mips[mip_level].sample(UV, color, filter);
    }
}
//# sourceMappingURL=textures.js.map