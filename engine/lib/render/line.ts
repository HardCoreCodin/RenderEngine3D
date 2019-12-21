export const drawLine = (
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

    let start, end, current, inc,
        ci, dci,
        zi, dzi,
        x, x_end,
        y, y_end,
        d, dz, z: number;
    const screen_width_times_4 = screen_width + screen_width + screen_width + screen_width;

    // Floor all coordinates to integers:
    x = ~~x1; x_end = ~~x2;
    y = ~~y1; y_end = ~~y2;

    // Set initial values for depth, and for indices of depth and color
    z = z1;
    zi = x + y*screen_width;
    ci = x+x+x+x + y*screen_width_times_4;

    const run = x_end - x;
    const rise = y_end - y;
    const depth = z2 - z1;

    const dx = run > 0 ? run : -run;
    const dy = rise > 0 ? rise : -rise;

    if (dx === dy) {
        // Either a point or a diagonal line

        if (run) {
            // Diagonal line (45 degrees angle)
            dz = depth / run;

            if (run > 0) {
                x_end++;
                d = 1;
                dzi = screen_width + 1;
                dci = screen_width_times_4 + 4;
            } else {
                x_end--;
                d = -1;
                dzi = -screen_width - 1;
                dci = -screen_width_times_4 - 4;
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
                dszi = screen_width;
                dsci = screen_width_times_4;
            } else {
                dszi = -screen_width;
                dsci = -screen_width_times_4;
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
                dzi = screen_width;
                dci = screen_width_times_4;
            } else {
                end--;
                dp = -1;
                dzi = -screen_width;
                dci = -screen_width_times_4;
            }

            if (run> 0 ) {
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
                dzi = screen_width_times_4;
                dci = screen_width;
            } else {
                end--;
                inc = -1;
                dzi = -screen_width_times_4;
                dci = -screen_width;
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