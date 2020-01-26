import {drawPixel} from "../../../../../utils.js";

const drawDiagonalLine2D = (
    pixels: Uint32Array,

    screen_width: number,
    screen_height: number,

    r: number,
    g: number,
    b: number,
    a: number
) => {
    // Diagonal line (45 degrees angle)
    dz = depth / run;

    if (run > 0) {
        x_end++;
        d = 1;
        dci = screen_width + 1;
    } else {
        x_end--;
        d = -1;
        dci = -screen_width - 1;
    }

    while (x !== x_end) {
        drawPixel(pixels, ci, r, g, b, a);

        x += d;
        y += d;
        z += dz;
        ci += dci;
    }
};

const drawShallowLine2D = (
    pixels: Uint32Array,

    screen_width: number,
    screen_height: number,

    r: number,
    g: number,
    b: number,
    a: number
) => {
    // Shallow slope line:
    // X increases more often than Y so use X as primary and Y as secondary:
    start = p = x;
    end = x_end;
    dz = depth / run;

    if (run > 0) {
        end++;
        dp = 1;
        dci = 4;
    } else {
        end--;
        dp = -1;
        dci = -4;
    }
    dsci = rise > 0 ? screen_width : -screen_width;

    dpe = dy + dy;  // dy/dx * dx * 2
    dse = dx + dx;  // 1.0   * dx * 2
    threshold = dx; // 0.5   * dx * 2

    e = 0;

    while (start !== end) {
        drawPixel(pixels, ci, r, g, b, a);

        ci += dci;
        p += dp;
        e += dpe;
        if (e > threshold) {
            e -= dse;
            ci += dsci;
        }
    }
};

const drawSteepLine2D = (
    pixels: Uint32Array,

    screen_width: number,
    screen_height: number,

    r: number,
    g: number,
    b: number,
    a: number
) => {
    // Steep slope line:
    // Y increases more often than X so use Y as primary and X as secondary:
    start = p = y;
    end = y_end;

    if (rise > 0) {
        end++;
        dp = 1;
        dci = screen_width;
    } else {
        end--;
        dp = -1;
        dci = -screen_width;
    }
    dsci = run> 0 ? 1 : -1;

    dpe = dx + dx;  // dx/dy * dy * 2
    dse = dy + dy;  // 1.0   * dy * 2
    threshold = dy; // 0.5   * dy * 2

    e = 0;

    while (start !== end) {
        drawPixel(pixels, ci, r, g, b, a);

        ci += dci;
        p += dp;
        e += dpe;
        if (e > threshold) {
            e -= dse;
            ci += dsci;
        }
    }
};

const drawVerticalLine2D = (
    pixels: Uint32Array,

    screen_width: number,
    screen_height: number,

    r: number,
    g: number,
    b: number,
    a: number
) => {
    // Vertical line
    start = current = y;
    end = y_end;

    if (rise > 0) {
        end++;
        inc = 1;
        dci = screen_width;
    } else {
        end--;
        inc = -1;
        dci = -screen_width;
    }

    while (start !== end) {
        drawPixel(pixels, ci, r, g, b, a);
        ci += dci;
        current += inc;
    }
};

const drawHorizontalLine2D = (
    pixels: Uint32Array,

    screen_width: number,
    screen_height: number,

    r: number,
    g: number,
    b: number,
    a: number
) => {
    // Horizontal line
    start = current = x;
    end = x_end;

    if (run > 0) {
        end++;
        dci = inc = 1;
    } else {
        end--;
        dci = inc = -1;
    }

    while (start !== end) {
        drawPixel(pixels, ci, r, g, b, a);
        ci += dci;
        current += inc;
    }
};

export const drawLine2D = (
    pixels: Uint32Array,

    screen_width: number,
    screen_height: number,

    x1: number, y1: number,
    x2: number, y2: number,

    r: number,
    g: number,
    b: number,
    a: number
): void => {
    // Optimized Bresenham's algorithm.

    // Floor all coordinates to integers:
    x = ~~x1; x_end = ~~x2;
    y = ~~y1; y_end = ~~y2;

    // Set initial values for color indices
    ci = x + y*screen_width;

    run = x_end - x;
    rise = y_end - y;

    dx = run > 0 ? run : -run;
    dy = rise > 0 ? rise : -rise;

    if (dx === dy) {
        // Either a diagonal line or a point
        if (run)
            drawDiagonalLine2D(pixels, screen_width, screen_height, r, g, b, a);
        else
            drawPixel(pixels, ci, r, g , b, a);
    } else if (run && rise) {
        // Either a shallow or steep line
        if (dx > dy)
            drawShallowLine2D(pixels, screen_width, screen_height, r, g, b, a);
        else
            drawSteepLine2D(pixels, screen_width, screen_height, r, g, b, a);
    } else {
        // Either a horizontal or a vertical line
        if (rise)
            drawVerticalLine2D(pixels, screen_width, screen_height, r, g, b, a);
        else
            drawHorizontalLine2D(pixels, screen_width, screen_height, r, g, b, a);
    }
};

export const drawLine3D = (
    pixels: Float32Array,
    depths: Float32Array,

    screen_width: number,
    screen_height: number,

    x1: number, y1: number, z1: number,
    x2: number, y2: number, z2: number,
    r: number, g: number, b: number
): void => {
    // Optimized Bresenham's algorithm.
    // Interpolates pixel depths and uses the depth buffer to draw in 3D.

    // Floor all coordinates to integers:
    x = ~~x1; x_end = ~~x2;
    y = ~~y1; y_end = ~~y2;

    // Set initial values for depth, and for indices of depth and color
    z = z1;
    zi = ci = x + y*screen_width;

    run = x_end - x;
    rise = y_end - y;
    depth = z2 - z1;

    dx = run > 0 ? run : -run;
    dy = rise > 0 ? rise : -rise;

    if (dx === dy) {
        // Either a point or a diagonal line

        if (run) {
            // Diagonal line (45 degrees angle)
            dz = depth / run;

            if (run > 0) {
                x_end++;
                d = 1;
                dci = dzi = screen_width + 1;
            } else {
                x_end--;
                d = -1;
                dci = dzi = -screen_width - 1;
            }

            while (x !== x_end) {
                if (z > depths[zi]) {
                    depths[zi] = z;
                    pixels[ci] = r;
                    pixels[ci+1] = g;
                    pixels[ci+2] = b;
                }

                x += d;
                y += d;
                z += dz;
                zi += dzi;
                ci += dci;
            }
        }
        else {
            // A point
            if (z > depths[zi]) {
                depths[zi] = z;

                pixels[ci] = r;
                pixels[ci+1] = g;
                pixels[ci+2] = b;
            }
        }
    }
    else if (run & rise) {
        let p, dp, // The primary value being incremented (X for shallow slopes, Y for steep ones).
            dsci, // The color-index increment for secondary value (Y for shallow slopes, X for steep ones).
            dszi, // The z-index increment for the secondary value (Y for shallow slopes, X for steep ones).
            e, dpe, dse,   // The error being tracked and it's primary and secondary increment values.
            threshold: number; // What the error is compared agains at each iteration of the loop,

        if (dx > dy) {
            // Shallow slope line:
            // X increases more often than Y so use X as primary and Y as secondary:
            start = p = x;
            end = x_end;
            dz = depth / run;

            if (run > 0) {
                end++;
                dp = dzi = 1;
                dci = 4;
            } else {
                end--;
                dp = dzi = -1;
                dci = -4;
            }

            if (rise > 0 ) {
                dszi = dsci = screen_width;
            } else {
                dszi = dsci = -screen_width;
            }

            dpe = dy + dy;  // dy/dx * dx * 2
            dse = dx + dx;  // 1.0   * dx * 2
            threshold = dx; // 0.5   * dx * 2
        } else {
            // Steep slope line:
            // Y increases more often than X so use Y as primary and X as secondary:
            start = p = y;
            end = y_end;
            dz = depth / rise;

            if (rise > 0) {
                end++;
                dp = 1;
                dzi = dci = screen_width;
            } else {
                end--;
                dp = -1;
                dzi = dci = -screen_width;
            }

            if (run> 0) {
                dszi = 1;
                dsci = 4;
            } else {
                dszi = -1;
                dsci = 4;
            }

            dpe = dx + dx;  // dx/dy * dy * 2
            dse = dy + dy;  // 1.0   * dy * 2
            threshold = dy; // 0.5   * dy * 2
        }

        e = 0;

        while (start !== end) {
            if (z > depths[zi]) {
                depths[zi] = z;
                pixels[ci] = r;
                pixels[ci+1] = g;
                pixels[ci+2] = b;
            }

            z += dz;
            zi += dzi;
            ci += dci;
            p += dp;
            e += dpe;
            if (e > threshold) {
                e -= dse;
                zi += dszi;
                ci += dsci;
            }
        }
    }
    else {
        // Horizontal/vertical line

        if (rise) {
            // Vertical line
            dz = depth / rise;

            start = current = y;
            end = y_end;

            if (rise > 0) {
                end++;
                inc = 1;
                dzi = dci = screen_width;
            } else {
                end--;
                inc = -1;
                dzi = dci = -screen_width;
            }
        }
        else {
            // Horizontal line
            dz = depth / run;

            start = current = x;
            end = x_end;

            if (run > 0) {
                end++;
                dzi = inc = 1;
                dci = 4;
            } else {
                end--;
                dzi = inc = -1;
                dci = -4;
            }
        }

        while (start !== end) {
            if (z > depths[zi]) {
                depths[zi] = z;
                pixels[ci] = r;
                pixels[ci+1] = g;
                pixels[ci+2] = b;
            }

            z += dz;
            zi += dzi;
            ci += dci;
            current += inc;
        }
    }
};


let start,
    end,
    current,
    inc,

    ci, dci,
    zi, dzi,
    x, x_end,
    y, y_end,
    d, dz, z,

    dx,
    dy,

    run,
    rise,
    depth: number;

let p, dp, // The primary value being incremented (X for shallow slopes, Y for steep ones).
    dsci, // The color-index increment for secondary value (Y for shallow slopes, X for steep ones).
    e, dpe, dse,   // The error being tracked and it's primary and secondary increment values.
    threshold: number; // What the error is compared agains at each iteration of the loop,